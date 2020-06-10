import React, { Ref, RefObject } from "react";
import { addStyles, EditableMathField } from "react-mathquill";
import { splitLatexSubExpr, latexSubExprToJs, latexToJs } from "./LatexUtil";
import GraphView from "./GraphView";
import { evaluate, derivative } from "mathjs";
import { ddx } from "./LazyCalc";

// inserts the required css to the <head> block.
// You can skip this, if you want to do that by yourself.
addStyles();

interface IState {
    latex: string;
}

export default class App extends React.Component {
    state: IState;
    graphView: RefObject<GraphView>;
    dxGraphView: RefObject<GraphView>;

    constructor(props: any) {
        super(props);

        this.state = {
            latex: "\\frac{1}{\\sqrt{2}}\\cdot 2",
        };

        this.graphView = React.createRef();
        this.dxGraphView = React.createRef();
    }

    render() {
        (window as any).evaluate = evaluate;
        return (
            <div>
                <GraphView
                    width={640}
                    height={480}
                    ref={this.graphView}
                ></GraphView>
                <GraphView
                    width={640}
                    height={480}
                    ref={this.dxGraphView}
                ></GraphView>
                <EditableMathField
                    latex={this.state.latex} // Initial latex value for the input field
                    onChange={(mathField) => {
                        // Called everytime the input changes
                        this.setState({ latex: mathField.latex() });

                        let expr = latexToJs(mathField.latex());
                        console.log(mathField.latex(), expr);
                        this.graphView.current!.setFunctionExpr(expr);
                        //this.dxGraphView.current!.setFunctionExpr(derivative(expr, "x").toString());
                    }}
                />
            </div>
        );
    }
}
