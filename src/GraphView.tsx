import React from "react";
import { Stage, Layer, Rect, Text, Line } from "react-konva";
import Konva from "konva";
import { evaluate, compile } from "mathjs";

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

interface IState {
    graphExpr: string | null;
    top: number;
    left: number;
    right: number;
    bottom: number;
}
interface IProps {
    width: number;
    height: number;
}

export default class GraphView extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            graphExpr: null,
            top: -10,
            left: -10,
            right: 10,
            bottom: 10,
        };
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

    buildPointsList(pixelResolution: number): number[] {
        let resolution = this.graphBoundWidth() / this.props.width;
        resolution*=pixelResolution;

        let points: number[] = [];

        if (!this.state.graphExpr) {
            return [];
        }
        let mathExpr;
        try {
            mathExpr = compile(this.state.graphExpr);
        } catch {
            return [];
        }

        try {
            mathExpr.evaluate({x: 0});
        } catch {
            return [];
        }
        

        for (let x = this.state.left; x < this.state.right; x += resolution) {
            let y = mathExpr.evaluate({x: x});

            points.push(...this.graphPosToCanvasPos(x, y));
        }

        return points;
    }

    setFunctionExpr(jsExpr: string) {
        this.setState({
            graphExpr: jsExpr
        });
    }

    render() {
        return (
            <Stage
                width={this.props.width || 640}
                height={this.props.height || 480}
            >
                <Layer>
                    <Line
                        points={this.buildPointsList(4)}
                        closed={false}
                        stroke="#000000"
                        strokeWidth={2}
                    ></Line>
                </Layer>
            </Stage>
        );
    }
}
