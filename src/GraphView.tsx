import React, { RefObject } from "react";
import { Stage, Layer, Rect, Text, Line, Circle } from "react-konva";
import Konva from "konva";
import { evaluate, compile, derivative, EvalFunction } from "mathjs";
import { ddx } from "./LazyCalc";
import { KonvaEventObject } from "konva/types/Node";

function getOffset(el: Element) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
    };
}

class ColoredRect extends React.Component {
    state = {
        color: "green",
    };
    handleClick = () => {
        this.setState({
            color: Konva.Util.getRandomColor(),
        });
    };
    render() {
        return (
            <Rect
                x={20}
                y={20}
                width={50}
                height={50}
                fill={this.state.color}
                shadowBlur={5}
                onClick={this.handleClick}
            />
        );
    }
}

interface TangentLine {
    center: [number, number]; // in graph coords not screen coords
    slope: number;
}

interface IState {
    graphExpr: EvalFunction | null;
    top: number;
    left: number;
    right: number;
    bottom: number;
    tangentLine: null | TangentLine;
    indicator: [number, number] | null;
}
interface IProps {
    width: number;
    height: number;
    graphDerivative?: boolean;
    canHover?: boolean;
    hoverEventHook?: (x: number) => void;
    unHoverEventHook?: () => void;
}

export default class GraphView extends React.Component<IProps, IState> {
    canvasRef: RefObject<Stage>;
    constructor(props: IProps) {
        super(props);
        this.state = {
            graphExpr: null,
            top: -10,
            left: -10,
            right: 10,
            bottom: 10,
            tangentLine: null,
            indicator: null,
        };

        this.canvasRef = React.createRef();
    }

    static makeGraphFunction(jsExpr: string) {
        return function (x: number) {
            return evaluate(jsExpr, { x: x });
        };
    }

    graphBoundWidth() {
        return this.state.right - this.state.left;
    }

    graphBoundHeight() {
        return this.state.bottom - this.state.top;
    }

    graphPosToCanvasPos(x: number, y: number): [number, number] {
        return [
            ((x - this.state.left) / this.graphBoundWidth()) * this.props.width,
            this.props.height -
                ((y - this.state.top) / this.graphBoundHeight()) *
                    this.props.height,
        ];
    }

    canvasPosToGraphPos(x: number, y: number): [number, number] {
        return [
            (x / this.props.width) * this.graphBoundWidth() + this.state.left,
            ((this.props.height - y) / this.props.height) *
                this.graphBoundHeight() +
                this.state.top,
        ];
    }

    f(x: number) {
        if (!this.state.graphExpr) {
            return NaN;
        }
        return this.state.graphExpr.evaluate({ x: x });
    }

    buildPointsList(pixelResolution: number): number[] {
        let resolution = this.graphBoundWidth() / this.props.width;
        resolution *= pixelResolution;

        let points: number[] = [];

        if (!this.state.graphExpr) {
            return [];
        }

        try {
            this.f(0);
            this.f(-1);
        } catch {
            return [];
        }

        for (let x = this.state.left; x < this.state.right; x += resolution) {
            let y = this.f(x);

            if (y === NaN || y === undefined || y === null) {
                continue;
            }

            points.push(...this.graphPosToCanvasPos(x, y));
        }

        return points;
    }

    setFunctionExpr(jsExpr: string) {
        console.log(jsExpr);
        let expr;
        try {
            if (this.props.graphDerivative) {
                expr = derivative(jsExpr, "x");
            } else {
                expr = compile(jsExpr);
            }
        } catch {
            expr = null;
        }
        this.setState({
            graphExpr: expr,
        });
    }

    buildTangentLinePoints(
        tangentLine: TangentLine | null,
        l = this.graphBoundWidth()
    ) {
        if (!tangentLine) {
            return [];
        }

        let dy = l * tangentLine.slope;

        type Pos = [number, number];

        let pos1: Pos = [tangentLine.center[0] - l, tangentLine.center[1] - dy];

        let pos2: Pos = [tangentLine.center[0] + l, tangentLine.center[1] + dy];

        return [
            ...this.graphPosToCanvasPos(...pos1),
            ...this.graphPosToCanvasPos(...pos2),
        ];
    }

    buildTangentInformation() {
        if (!this.state.tangentLine) {
            return null;
        }

        let centerPos = this.graphPosToCanvasPos(
            ...this.state.tangentLine.center
        );

        return (
            <>
                <Line
                    points={this.buildTangentLinePoints(this.state.tangentLine)}
                    closed={false}
                    stroke="#aaaaaa"
                    strokeWidth={1}
                ></Line>
                <Circle
                    x={centerPos[0]}
                    y={centerPos[1]}
                    radius={3}
                    fill="#ff0000"
                ></Circle>
                <Text
                    text={`slope=${this.state.tangentLine.slope}`}
                    x={centerPos[0]}
                    y={centerPos[1]-10}
                ></Text>
            </>
        );
    }

    removeTangentLine() {
        if (this.props.unHoverEventHook) {
            this.props.unHoverEventHook();
        }
        this.setState({
            tangentLine: null,
        });
    }

    renderIndicator() {
        if (!this.state.indicator) {
            return null;
        }

        let pos = this.graphPosToCanvasPos(...this.state.indicator);
        return (
            <Circle x={pos[0]} y={pos[1]} radius={3} fill="#ff0000"></Circle>
        );
    }

    render() {
        return (
            <Stage
                width={this.props.width || 640}
                height={this.props.height || 480}
                ref={this.canvasRef}
            >
                <Layer
                    onMouseMove={(event) => {
                        let mouseX = event.evt.x;
                        let mouseY = event.evt.y;

                        let offset = getOffset(
                            (this.canvasRef.current as any).attrs.container
                        );

                        mouseX -= offset.left;
                        mouseY -= offset.top;

                        let [x, y] = this.canvasPosToGraphPos(mouseX, mouseY);

                        if (!this.props.canHover) {
                            this.removeTangentLine();
                            return;
                        }

                        if (!this.state.graphExpr) {
                            this.removeTangentLine();
                            return;
                        }

                        let fx = this.f(x);

                        let dist = Math.abs(y - fx) * this.graphBoundHeight();

                        let slope = ddx(this.f.bind(this), x);

                        if (dist < 40) {
                            if (this.props.hoverEventHook) {
                                this.props.hoverEventHook(x);
                            }
                            this.setState({
                                tangentLine: {
                                    center: [x, fx],
                                    slope: slope,
                                },
                            });
                        } else {
                            this.removeTangentLine();
                        }
                    }}
                >
                    {/* axis lines */}
                    <Rect
                        x={0}
                        y={0}
                        width={this.props.width}
                        height={this.props.height}
                        fill="#ffffff"
                    ></Rect>
                    <Line
                        points={[
                            ...this.graphPosToCanvasPos(0, 1000),
                            ...this.graphPosToCanvasPos(0, -1000),
                        ]}
                        closed={false}
                        stroke="#aaaaaa"
                        strokeWidth={1}
                    ></Line>
                    <Line
                        points={[
                            ...this.graphPosToCanvasPos(-1000, 0),
                            ...this.graphPosToCanvasPos(1000, 0),
                        ]}
                        closed={false}
                        stroke="#aaaaaa"
                        strokeWidth={1}
                    ></Line>

                    {/* graph line */}
                    <Line
                        points={this.buildPointsList(4)}
                        closed={false}
                        stroke="#ac7257"
                        strokeWidth={2}
                    ></Line>

                    {/* tangent line */}

                    {this.buildTangentInformation()}

                    {/* indicator */}

                    {this.renderIndicator()}
                </Layer>
            </Stage>
        );
    }
}
