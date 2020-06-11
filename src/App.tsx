import React, { Ref, RefObject } from "react";
import { addStyles, EditableMathField } from "react-mathquill";
import { splitLatexSubExpr, latexSubExprToJs, latexToJs } from "./LatexUtil";
import GraphView from "./GraphView";
import { evaluate, derivative } from "mathjs";
import { ddx } from "./LazyCalc";
import { Graph } from "./Graph";

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
            latex: "",
        };

        this.graphView = React.createRef();
        this.dxGraphView = React.createRef();
    }

    hoverEventHook(x: number) {
        this.dxGraphView.current?.setState({
            indicator: [x, this.dxGraphView.current?.f(x)],
        });
    }

    unHoverEventHook() {
        this.dxGraphView.current?.setState({
            indicator: null
        });
    }

    render() {
        (window as any).evaluate = evaluate;
        return (
            <div className="main">
                <div className="header">Visualized Derivatives</div>
                <div className="body">
                    <div className="graphs">
                        <div>
                            Graph (hover to see tangent line)
                            <GraphView
                                width={540}
                                height={320}
                                ref={this.graphView}
                                canHover={true}
                                hoverEventHook={this.hoverEventHook.bind(this)}
                                unHoverEventHook={this.unHoverEventHook.bind(this)}
                            ></GraphView>
                        </div>
                        <div>
                            Derivative graph
                            <GraphView
                                width={540}
                                height={320}
                                graphDerivative={true}
                                ref={this.dxGraphView}
                            ></GraphView>
                        </div>
                    </div>
                    <span className="function-entry">
                        <span className="y-equals">y=</span>

                        <span className="f-entry">
                            <EditableMathField
                                latex={this.state.latex} // Initial latex value for the input field
                                onChange={(mathField) => {
                                    // Called everytime the input changes
                                    this.setState({ latex: mathField.latex() });

                                    let expr = latexToJs(mathField.latex());
                                    // console.log(mathField.latex(), expr);
                                    this.graphView.current!.setFunctionExpr(
                                        expr
                                    );
                                    this.dxGraphView.current!.setFunctionExpr(
                                        expr
                                    );
                                }}
                            />
                        </span>
                    </span>
                </div>
            </div>
        );
    }
}
