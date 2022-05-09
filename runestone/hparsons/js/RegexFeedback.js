import HParsonsFeedback from "./hparsonsFeedback";
import "../../activecode/js/skulpt.min.js";
import "../../activecode/js/skulpt-stdlib.js";

export default class RegexFeedback extends HParsonsFeedback {

    createOutput() {
    }

    renderFeedback() {
        if (this.unittestDiv && this.unittestDiv.classList.contains('hparsons-hide')) {
            this.unittestDiv.classList.remove('hparsons-hide');
        }
    }

    clearFeedback() {
        if (this.unittestDiv && !this.unittestDiv.classList.contains('hparsons-hide')) {
            this.unittestDiv.classList.add('hparsons-hide');
        }
    }

    reset() {
        this.clearFeedback();
    }

    init() {
    }

    // adapted from activecode - SQL
    async runButtonHandler() {
        // Disable the run button until the run is finished.
        this.hparsons.runButton.disabled = true;
        try {
            await this.runProg();
        } catch (e) {
            console.log(`there was an error ${e} running the code`);
        }
        this.unittestDiv = this.hparsons.containerDiv.querySelector('.unittest-results');
        this.logCurrentAnswer();
        this.renderFeedback();
        // The run is finished; re-enable the button.
        this.hparsons.runButton.disabled = false;
    }

    // adapted from activecode
    async runProg() {
        console.log("starting runProg");
        var prog = await this.buildProg(true);
        // this.saveCode = "True";
        $(this.output).text("");
        // while ($(`#${this.divid}_errinfo`).length > 0) {
        //     $(`#${this.divid}_errinfo`).remove();
        // }
        Sk.configure({});
        Sk.divid = this.hparsons.divid;
        Sk.logResults = true;
        Sk.gradeContainer = this.hparsons.divid;
        // console.log(Sk.gradeContainer)
        // if (this.graderactive && this.outerDiv.closest(".loading")) {
        //     Sk.gradeContainer = this.outerDiv.closest(".loading").id;
        // } else {
        //     Sk.gradeContainer = this.divid;
        // }
        try {
            await Sk.misceval.asyncToPromise(function () {
                return Sk.importMainWithBody("<stdin>", false, prog, true);
            });
            // this.errLastRun = false;
            // this.errinfo = "success";
        } catch (err) {
            console.log('err in skulpt')
            console.log(err.toString())
            // this.errinfo = err.toString();
            // this.addErrorMessage(err);
        } finally {
            // $(this.runButton).removeAttr("disabled");
        }
    }


    // adapted from activecode
    async buildProg() {
        // assemble code from prefix, suffix, and editor for running.
        // TODO: fix or remove text entry

        let prog = ``;
        prog += `import re\n`;
        prog += `def strict_match(regex, test_string):\n`;
        prog += `    match = re.match(regex, test_string)\n`;
        prog += `    if match == None:\n`;
        prog += `        return None\n`;
        prog += `    elif match.group(0) == test_string:\n`;
        prog += `        return test_string\n`;
        prog += `    return None\n`;
        let regex = this.hparsons.hparsonsInput.getParsonsTextArray().join('');
        regex = regex.replace(`'`, `\\'`);
        prog += `regex = '` + regex + `'\n`;
        prog += this.hparsons.pyunittest;
        return Promise.resolve(prog);
    }

    // copied from activecode-sql
    async logCurrentAnswer(sid) {
        if (this.unit_results) {
            let unitData = {
                event: "unittest",
                div_id: this.hparsons.divid,
                course: eBookConfig.course,
                act: this.unit_results,
            };
            if (typeof sid !== "undefined") {
                unitData.sid = sid;
            }
            await this.hparsons.logBookEvent(unitData);
        }
    }

}
