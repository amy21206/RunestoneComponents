Practice Problems - SQL
-----------------------------------------------------

Problems
==============

.. activecode:: hparsons_lg_sql_practice_A_0_wr
    :language: sql

    In the ``grades`` table:

    .. image:: https://i.ibb.co/r6qShy5/practice-grade.png
    
    Please write a SELECT statement to retrieve the ``student_id``, ``english``,
    and ``math`` of all entries whose ``test_name`` is ``midterm``.

    note: When you run the code, there will be several execution results.
    Please only refer to the unittest and the **last** execution result for debugging purposes.

    ~~~~
    DROP TABLE IF EXISTS grades;
    create table "grades" ("student_id" INTEGER, "test_name" TEXT, "english" INTEGER, "math" INTEGER);
    INSERT INTO grades (student_id,test_name,english,math) VALUES
        ('1', 'midterm', 62, 84),
        ('1', 'final', 70, 86),
        ('2', 'midterm', 50, 95),
        ('2', 'final', 80, 99),
        ('3', 'midterm', 55, 91);
    ^^^^
    ====
    assert 0,1 == 62
    assert 1,1 == 50
    assert 2,1 == 55

.. hparsons:: hparsons_lg_sql_practice_A_1_pe
    :language: sql
    :dburl: /_static/Q2.db

    In the ``grades`` table:

    .. image:: https://i.ibb.co/r6qShy5/practice-grade.png
    
    Please write a SELECT statement to retrieve the ``student_id``, ``test_name``,
    and ``english`` of all entries whose ``english`` is lower than 60 and ``math`` is higher than 90.
    ~~~~
    --blocks--
    SELECT
    student_id, test_name, english
    FROM
    grades
    WHERE
    english < 60 AND math > 90
    english < 60 & math > 90
    --unittest--
    assert 0,0 == 2
    assert 0,1 == midterm
    assert 1,0 == 3
    assert 1,1 == midterm
  
.. hparsons:: hparsons_lg_sql_practice_A_2_pb
    :language: sql
    :randomize:
    :blockanswer: 0 1 2 3 4

    In the ``grades`` table:

    .. image:: https://i.ibb.co/r6qShy5/practice-grade.png
    
    A student completed an extra assignment and got some additional points. 

    Please write an UPDATE statement to change the entry whose ``student_id`` is 1, and set their math score for ``final`` ``test_name`` to 90.
    ~~~~
    --blocks--
    UPDATE grades
    SET
    math = 90
    WHERE
    student_id = 1 AND test_name = "final"
    LET
    student_id = 1 AND test_name = final


.. activecode:: hparsons_lg_sql_practice_A_3_wr
    :language: sql

    In the ``grades`` table:

    .. image:: https://i.ibb.co/r6qShy5/practice-grade.png
    
    The instructors decided to add some points to all students as one test was too difficult.

    Please write an UPDATE statement to change all entries whose ``test_name`` is ``midterm``,
    and add 10 points to their ``english`` score.

    note: When you run the code, there will be several execution results.
    Please only refer to the unittest and the **last** execution result for debugging purposes.
    ~~~~
    DROP TABLE IF EXISTS grades;
    create table "grades" ("student_id" INTEGER, "test_name" TEXT, "english" INTEGER, "math" INTEGER);
    INSERT INTO grades (student_id,test_name,english,math) VALUES
        ('1', 'midterm', 62, 84),
        ('1', 'final', 70, 86),
        ('2', 'midterm', 50, 95),
        ('2', 'final', 80, 99),
        ('3', 'midterm', 55, 91);
    ^^^^
    -- Write your code here:

    -- The following line separates with your code and selects all data for testing. Please do not modify.
    ;
    SELECT * FROM grades 
    ====
    assert 0,2 == 72
    assert 1,2 == 70
    assert 2,2 == 60
    assert 3,2 == 80
    assert 4,2 == 65


.. hparsons:: hparsons_lg_sql_practice_A_4_pe
    :language: sql
    :randomize:

    Aside from the ``grades`` table:

    .. image:: https://i.ibb.co/r6qShy5/practice-grade.png

    We also have a ``students`` table:
    
    .. image:: https://i.ibb.co/m4KxSMC/practice-students.png
    
    Now we want to match the student name to their math grades.

    Please write a statement using SELECT and JOIN to: select the ``test_name`` and ``math``
    from the ``grades``  table and ``name`` from the ``students`` table, where the ``student_id``
    in the ``grades`` table is the same as the ``id`` in the ``students`` table.
    ~~~~
    --blocks--
    SELECT
    grades.test_name, grades.math, students.name
    FROM grades
    JOIN students
    ON students.id = grades.student_id
    ON students.id = grades.id
    --unittest--
    assert 0,2 == Alex
    assert 3,2 == Blake


.. hparsons:: hparsons_lg_sql_practice_A_5_pb
    :language: sql
    :randomize:
    :blockanswer: 0 1 2 3 4 5 6

    Aside from the ``grades`` table:

    .. image:: https://i.ibb.co/r6qShy5/practice-grade.png

    We also have a ``tests`` table:
    
    .. image:: https://i.ibb.co/KVTGNXh/practice-tests.png
    
    Now we want to add the date information to the grades to see when the students took the tests.

    Please write a statement using SELECT and JOIN to: select the ``date`` and ``name``
    from the ``tests``  table and ``student_id`` from the ``grades`` table,
    where the ``test_name`` in the ``grades`` table is the same as the ``name`` in the ``tests`` table.
    ~~~~
    --blocks--
    SELECT
    tests.date, tests.name, grades.student_id
    FROM tests
    JOIN
    grades
    ON
    grades.test_name = tests.name


.. raw:: html

    <style>
        .drag-area{
            height: auto !important;
            min-height: 42px;
        }
        .drop-area{
            height: auto !important;
            min-height: 42px;
        }
    </style>
