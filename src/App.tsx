import React from "react";
import { addStyles, EditableMathField } from "react-mathquill";
import { splitLatexSubExpr, latexSubExprToJs, latexToJs } from "./LatexUtil";
import GraphView from "./GraphView";

// inserts the required css to the <head> block.
// You can skip this, if you want to do that by yourself.
addStyles();

interface IState {
    latex: string;
}

export default class App extends React.Component {
    state: IState;
    constructor(props: any) {
        super(props);

        this.state = {
            latex: "\\frac{1}{\\sqrt{2}}\\cdot 2",
        };
    }

    render() {
        return (
            <div>
                <GraphView></GraphView>
            </div>
        );
    }
}
