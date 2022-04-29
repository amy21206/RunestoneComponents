import HParsonsFeedback from "./hparsonsFeedback";
import "../../activecode/js/skulpt.min.js";
import "../../activecode/js/skulpt-stdlib.js";

export default class RegexFeedback extends HParsonsFeedback {

    createOutput() {
        // there is no output aside from unittests
        // var outDiv = document.createElement("div");
        // $(outDiv).addClass("col-md-12");
        // this.outDiv = outDiv;
        // this.output = document.createElement("pre");
        // this.output.id = this.hparsons.divid + "_stdout";
        // $(this.output).css("visibility", "hidden");
        // outDiv.appendChild(this.output);
        // this.hparsons.outerDiv.appendChild(outDiv);
    }

    renderFeedback() {
        // console.log('this.unit_result_divid')
        // console.log(this.unit_result_divid)
        // console.log('this.hparsons.unit_result_divid')
        // console.log(this.hparsons.unit_result_divid)
        // let urDivid = this.hparsons.divid + "_unit_results";
        // if (
        //     $(this.hparsons.outerDiv).find(`#${urDivid}`).length == 0 &&
        //     $(this.hparsons.outerDiv).find(`#${urDivid}_offscreen_unit_results`)
        //         .length == 0
        // ) {
        //     let urResults = document.getElementById(urDivid);
        //     this.hparsons.outerDiv.appendChild(urResults);
        // }
        // copied from activecode.js. seems not needed for now.

        // The python unit test code builds the table as it is running the tests
        // In "normal" usage this is displayed immediately.
        // However in exam mode we make a div which is offscreen
        // if (this.unit_results_divid) {
        //     if (this.unit_results_divid.indexOf("_offscreen_") > 0) {
        //         let urDivid = `${this.divid}_offscreen_unit_results`;
        //         let unitFeedback = document.getElementById(urDivid);
        //         let tmp = document.body.removeChild(unitFeedback);
        //         if ($(this.outerDiv).find(`#${urDivid}`).length > 0) {
        //             tmp = $(this.outerDiv).find(`#${urDivid}`)[0];
        //         } else {
        //             this.outerDiv.appendChild(tmp);
        //         }
        //         $(tmp).show();
        //     } else {
        //         let urDivid = this.divid + "_unit_results";
        //         if (
        //             $(this.outerDiv).find(`#${urDivid}`).length == 0 &&
        //             $(this.outerDiv).find(`#${urDivid}_offscreen_unit_results`)
        //                 .length == 0
        //         ) {
        //             let urResults = document.getElementById(urDivid);
        //             this.outerDiv.appendChild(urResults);
        //         }
        //     }
        // }
    }

    clearFeedback() {
        // $(this.outDiv).hide();
    }

    reset() {
        // this.clearFeedback();
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
        Sk.configure({
            output: this.outputfun.bind(this),
            // read: this.fileReader,
            // __future__: Sk.python3,
            //        python3: this.python3,
            // inputfunTakesPrompt: true,
        });
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

    outputfun(text) {
        // bnm python 3
        // var pyStr = function (x) {
        //     if (x instanceof Array) {
        //         return "[" + x.join(", ") + "]";
        //     } else {
        //         return x;
        //     }
        // };
        // var x = text;
        // if (!this.python4) {
        //     if (x.charAt(1) == "(") {
        //         x = x.slice(2, -1);
        //         x = "[" + x + "]";
        //         try {
        //             var xl = eval(x);
        //             xl = xl.map(pyStr);
        //             x = xl.join(" ");
        //         } catch (err) {}
        //     }
        // }
        // $(this.output).css("visibility", "visible");
        // text = x;
        // text = text
        //     .replace(/</g, "&lt;")
        //     .replace(/>/g, "&gt;")
        //     .replace(/\n/g, "<br/>");
        // return Promise.resolve().then(
        //     function () {
        //         setTimeout(
        //             function () {
        //                 $(this.output).append(text);
        //             }.bind(this),
        //             1
        //         );
        //     }.bind(this)
        // );
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
        // commenting these out for now
        // Not sure if we need to log run event in horizontal parsons
        // let data = {
        //     div_id: this.hparsons.divid,
        //     code: this.hparsons.hparsonsInput.getParsonsTextArray(),
        //     language: "sql",
        //     // errinfo: this.results[this.results.length - 1].status,
        //     to_save: this.hparsons.saveCode,
        //     prefix: this.hparsons.pretext,
        //     suffix: this.hparsons.suffix,
        // }; // Log the run event
        // if (typeof sid !== "undefined") {
        //     data.sid = sid;
        // }
        // await this.hparsons.logRunEvent(data);

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

    // might move to base class if used by multiple execution based feedback
    autograde(result_table) {
        var tests = this.hparsons.suffix.split(/\n/);
        this.passed = 0;
        this.failed = 0;
        // Tests should be of the form
        // assert row,col oper value for example
        // assert 4,4 == 3
        var result = "";
        tests = tests.filter(function (s) {
            return s.indexOf("assert") > -1;
        });
        for (let test of tests) {
            let wlist = test.split(/\s+/);
            wlist.shift();
            let loc = wlist.shift();
            let oper = wlist.shift();
            let expected = wlist.join(" ");
            let [row, col] = loc.split(",");
            result += this.testOneAssert(
                row,
                col,
                oper,
                expected,
                result_table
            );
            result += "\n";
        }
        let pct = (100 * this.passed) / (this.passed + this.failed);
        pct = pct.toLocaleString(undefined, { maximumFractionDigits: 2 });
        result += `You passed ${this.passed} out of ${this.passed + this.failed
            } tests for ${pct}%`;
        this.unit_results = `percent:${pct}:passed:${this.passed}:failed:${this.failed}`;
        return result;
    }

    // might move to base class if used by multiple execution based feedback
    testOneAssert(row, col, oper, expected, result_table) {
        // make sure row and col are in bounds
        let actual;
        let output = "";
        try {
            actual = result_table.values[row][col];
        } catch (e) {
            if (expected == 'NO_DATA') {
                this.passed++;
                output = `Passed: No data in row ${row}, column ${col}`;
                return output;
            } else {
                output = `Failed: Not enough data to check row ${row} or column ${col}`;
                return output;
            }
        }
        const operators = {
            "==": function (operand1, operand2) {
                return operand1 == operand2;
            },
            "!=": function (operand1, operand2) {
                return operand1 != operand2;
            },
            ">": function (operand1, operand2) {
                return operand1 > operand2;
            },
            "<": function (operand1, operand2) {
                return operand1 > operand2;
            },
        };
        let res = operators[oper](actual, expected);
        if (res) {
            output = `Pass: ${actual} ${oper} ${expected} in row ${row} column ${result_table.columns[col]}`;
            this.passed++;
        } else {
            output = `Failed ${actual} ${oper} ${expected} in row ${row} column ${result_table.columns[col]}`;
            this.failed++;
        }
        return output;
    }
}

function createTable(tableData, container, maxHeight) {
    let data = tableData.values;
    let trimRows = undefined;
    if (data.length === 0) {
        // kludge: no column headers will show up unless we do this
        data = [tableData.columns.map((e) => null)];
        trimRows = [0];
    }

    var hot = new Handsontable(container, {
        data: data,
        trimRows: trimRows,
        width: "100%",
        height: maxHeight,
        autoRowSize: true,
        autoColumnSize: { useHeaders: true },
        rowHeaders: false,
        colHeaders: tableData.columns,
        editor: false,
        maxRows: 100,
        filters: false,
        dropdownMenu: false,
        licenseKey: "non-commercial-and-evaluation",
    });

    // calculate actual height and resize
    let actualHeight = 40; // header height + small margin
    if (tableData.values.length > 0) {
        for (let i = 0; i < data.length; i++) {
            actualHeight = actualHeight + hot.getRowHeight(i);
            if (actualHeight > maxHeight) break;
        }
    }

    hot.updateSettings({ height: actualHeight });

    return hot;
}
