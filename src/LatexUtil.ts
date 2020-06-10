// some very simple latex parsing utils

export function latexToJs(latexString: string, compressed = false) {
    let i = 0;
    let subExprs = splitLatexSubExpr(latexString);

    let nextSubExpr = function() {
        return subExprs[i++];
    }

    let output = "";

    while (i < subExprs.length) {
        let subExpr = nextSubExpr();

        if (subExpr === "\\frac") {
            let numer = latexSubExprToJs(nextSubExpr());
            let denom = latexSubExprToJs(nextSubExpr());
            output += `(${numer}) / (${denom})`;
        } else {
            output += latexSubExprToJs(subExpr);
        }
    }

    if (compressed) {
        return output.replace(/ /g, "");
    }

    return output;
}

function resolveImplicitMultiplication(expr: string) {
    // converts "2(x+3)" to "3*(x+3)"

    expr = expr.replace(/\w(?=\()/g, "$&*"); // converts "2(" and "x(" to "x*("
    expr = expr.replace(/\d(?=\w)/g, "$&*"); // converts "3x" to "3*x"

    return expr;
}

export function latexSubExprToJs(latexString: string) {
    latexString = latexString
        .replace(/\\left\(/g, "(")
        .replace(/\\right\)/g, ")")
        .replace(/\\cdot/g, "*")
        .replace(/\\cos/g, "cos")
        .replace(/\\sin/g, "sin")
        .replace(/\\tan/g, "tan")
        .replace(/\\sqrt/g, "sqrt");
    
    return resolveImplicitMultiplication(latexString);
}

export function splitLatexSubExpr(latexString: string) {
    /*
        transforms "\frac{bruh}{2}" into ["\frac", "bruh", "2"]
    */
    let braceStack = 0;
    let currString = "";
    let enclosedBrace = false;

    let splitArray: string[] = [];

    let addCurrString = function () {
        if (!currString) {
            return;
        }
        splitArray.push(currString);
        currString = "";
    };

    for (let c of latexString) {
        if (c === "{") {
            if (braceStack === 0) {
                addCurrString();
            }

            braceStack++;
        } else if (c === "}") {
            braceStack--;

            if (braceStack === 0) {
                addCurrString();
            }
        } else {
            currString += c;
        }
    }

    addCurrString();

    return splitArray;
}
