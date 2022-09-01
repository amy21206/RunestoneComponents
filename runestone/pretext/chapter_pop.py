import datetime
import os
import sys
import xml.etree.ElementTree as ET
import pdb

from sqlalchemy import create_engine, Table, MetaData, and_
from sqlalchemy.orm.session import sessionmaker
from sqlalchemy.sql import text
from sphinx.util import logging

logger = logging.getLogger(__name__)
# logger.setLevel(logging.INFO)

QT_MAP = {
    "multiplechoice": "mchoice",
    "parsons": "parsonsprob",
}
# manifest_data_to_db(course_name, manifest_path)
# -----------------------------------------------


def manifest_data_to_db(course_name, manifest_path):
    """Read the runestone-manifest.xml file generated by PreTeXt and populate the
    chapters, subchapters, and questions table so that PreTeXt books can be used on
    Runestone.Academy.

    Arguments:
        course_name {string} -- Name of the course (should be a base course)
        manifest_path {path} -- path to runestone-manifest.xml file
    """

    try:
        if os.environ["WEB2PY_CONFIG"] == "development":
            DBURL = os.environ["DEV_DBURL"]
        elif os.environ["WEB2PY_CONFIG"] == "production":
            DBURL = os.environ["DBURL"]
        elif os.environ["WEB2PY_CONFIG"] == "test":
            DBURL = os.environ["TEST_DBURL"]
        else:
            logger.error("No WEB2PY_CONFIG found! Do not know which DB to use!")
            exit(-1)
    except KeyError:
        logger.error("PreTeXt integration requires a valid WEB2PY Environment")
        logger.error("make sure WEB2PY_CONFIG and DBURLs are set up")
        exit(-1)

    engine = create_engine(DBURL)
    Session = sessionmaker()
    engine.connect()
    Session.configure(bind=engine)
    sess = Session()
    meta = MetaData()
    chapters = Table("chapters", meta, autoload=True, autoload_with=engine)
    subchapters = Table("sub_chapters", meta, autoload=True, autoload_with=engine)
    questions = Table("questions", meta, autoload=True, autoload_with=engine)
    course_attributes = Table(
        "course_attributes", meta, autoload=True, autoload_with=engine
    )

    logger.info("Cleaning up old chapters info for {}".format(course_name))
    # Delete the chapter rows before repopulating. Subchapter rows are taken
    # care of by postgres with the ON DELETE CASCADE clause
    sess.execute(chapters.delete().where(chapters.c.course_id == course_name))

    logger.info("Populating the database with Chapter information")

    tree = ET.parse(manifest_path)
    root = tree.getroot()
    chap = 0
    for chapter in root.findall("./chapter"):
        logger.info(chapter)
        chap += 1
        logger.debug(
            chapter.tag, chapter.find("./id").text, chapter.find("./title").text
        )
        ins = chapters.insert().values(
            chapter_name=chapter.find("./title").text,
            course_id=course_name,
            chapter_label=chapter.find("./id").text,
            chapter_num=chap,
        )
        res = sess.execute(ins)
        chapid = res.inserted_primary_key[0]
        subchap = 0
        #  sub_chapter_name   | character varying(512)
        #  chapter_id         | integer
        #  sub_chapter_label  | character varying(512)
        #  skipreading        | character(1)
        #  sub_chapter_num    | integer
        for subchapter in chapter.findall("./subchapter"):
            subchap += 1
            logger.debug(subchapter.find("./id").text, subchapter.find("./title").text)
            titletext = subchapter.find("./title").text
            if not titletext:
                titletext = " ".join(
                    [
                        ET.tostring(y).decode("utf8")
                        for y in subchapter.findall("./title/*")
                    ]
                )
            ins = subchapters.insert().values(
                sub_chapter_name=titletext,
                chapter_id=chapid,
                sub_chapter_label=subchapter.find("./id").text,
                skipreading="F",
                sub_chapter_num=subchap,
            )
            sess.execute(ins)

            # Now add this chapter / subchapter to the questions table as a page entry
            name = "{}/{}".format(
                chapter.find("./title").text, subchapter.find("./title").text
            )
            res = sess.execute(
                text(
                    """select * from questions where name = :name and base_course = :course_name"""
                ),
                dict(name=name, course_name=course_name),
            ).first()
            valudict = dict(
                base_course=course_name,
                name=name,
                timestamp=datetime.datetime.now(),
                is_private="F",
                question_type="page",
                subchapter=subchapter.find("./id").text,
                chapter=chapter.find("./id").text,
                from_source="T",
            )
            if res:
                ins = (
                    questions.update()
                    .where(
                        and_(
                            questions.c.name == name,
                            questions.c.base_course == course_name,
                        )
                    )
                    .values(**valudict)
                )
            else:
                ins = questions.insert().values(**valudict)
            sess.execute(ins)

            for question in subchapter.findall("./question"):
                dbtext = " ".join(
                    [
                        ET.tostring(y).decode("utf8")
                        for y in question.findall("./htmlsrc/*")
                    ]
                )
                qlabel = " ".join([y.text for y in question.findall("./label")])
                logger.debug(f"found label= {qlabel}")
                logger.debug("looking for data-component")
                # pdb.set_trace()
                el = question.find(".//*[@data-component]")
                # Unbelievably if find finds something it evals to False!!
                if el is not None:
                    if "id" in el.attrib:
                        idchild = el.attrib["id"]
                    else:
                        idchild = "fix_me"
                else:
                    el = question.find("./div")
                    if el is None:
                        idchild = "fix_me"
                    elif "id" in el.attrib:
                        idchild = el.attrib["id"]
                    else:
                        idchild = "fix_me"
                try:
                    qtype = el.attrib["data-component"]
                    # translate qtype to question_type
                    qtype = QT_MAP.get(qtype, qtype)
                except:
                    qtype = "webwork"
                    dbtext = ET.tostring(el).decode("utf8")
                valudict = dict(
                    base_course=course_name,
                    name=idchild,
                    timestamp=datetime.datetime.now(),
                    is_private="F",
                    question_type=qtype,
                    htmlsrc=dbtext,
                    from_source="T",
                    subchapter=subchapter.find("./id").text,
                    chapter=chapter.find("./id").text,
                    qnumber=qlabel,
                )
                res = sess.execute(
                    f"""select * from questions where name='{idchild}' and base_course='{course_name}'"""
                ).first()
                if res:
                    ins = (
                        questions.update()
                        .where(
                            and_(
                                questions.c.name == idchild,
                                questions.c.base_course == course_name,
                            )
                        )
                        .values(**valudict)
                    )
                else:
                    ins = questions.insert().values(**valudict)
                sess.execute(ins)

    latex = root.find("./latex-macros")
    logger.info("Setting attributes for this base course")

    res = sess.execute(
        f"select * from courses where course_name ='{course_name}'"
    ).first()
    cid = res["id"]

    # Right now these are the only two attributes we store in the table, if this
    # changes we will need to be more careful about what we delete
    sess.execute(course_attributes.delete().where(course_attributes.c.course_id == cid))
    ins = course_attributes.insert().values(
        course_id=cid, attr="latex_macros", value=latex.text
    )
    sess.execute(ins)
    ins = course_attributes.insert().values(
        course_id=cid, attr="markup_system", value="PreTeXt"
    )
    sess.execute(ins)
    sess.commit()


if __name__ == "__main__":
    course_name = sys.argv[1]
    manifest_path = sys.argv[2]
    manifest_data_to_db(course_name, manifest_path)
