(this["webpackJsonpmath-final"]=this["webpackJsonpmath-final"]||[]).push([[0],{100:function(t,e,a){"use strict";a.r(e);var n=a(1),r=a.n(n),i=a(42),o=a.n(i),s=(a(53),a(16)),h=a(17),c=a(20),l=a(19),u=a(29),p=a(43);function v(t){return t=t.replace(/\\left\(/g,"(").replace(/\\right\)/g,")").replace(/\\cdot/g,"*").replace(/\\cos/g,"cos").replace(/\\sin/g,"sin").replace(/\\tan/g,"tan").replace(/\\sqrt/g,"sqrt")}function d(t){var e,a=0,n="",r=[],i=function(){n&&(r.push(n),n="")},o=Object(p.a)(t);try{for(o.s();!(e=o.n()).done;){var s=e.value;"{"===s?(0===a&&i(),a++):"}"===s?0===--a&&i():n+=s}}catch(h){o.e(h)}finally{o.f()}return i(),r}var f=a(46),g=a(10),m=a(9),E=a(28),b=a.n(E),k=a(101);r.a.Component;var y=function(t){Object(c.a)(a,t);var e=Object(l.a)(a);function a(t){var n;return Object(s.a)(this,a),(n=e.call(this,t)).canvasRef=void 0,n.state={graphExpr:null,top:-10,left:-10,right:10,bottom:10,tangentLine:null,indicator:null},n.canvasRef=r.a.createRef(),n}return Object(h.a)(a,[{key:"graphBoundWidth",value:function(){return this.state.right-this.state.left}},{key:"graphBoundHeight",value:function(){return this.state.bottom-this.state.top}},{key:"graphPosToCanvasPos",value:function(t,e){return[(t-this.state.left)/this.graphBoundWidth()*this.props.width,this.props.height-(e-this.state.top)/this.graphBoundHeight()*this.props.height]}},{key:"canvasPosToGraphPos",value:function(t,e){return[t/this.props.width*this.graphBoundWidth()+this.state.left,(this.props.height-e)/this.props.height*this.graphBoundHeight()+this.state.top]}},{key:"f",value:function(t){return this.state.graphExpr?this.state.graphExpr.evaluate({x:t}):NaN}},{key:"buildPointsList",value:function(t){var e=this.graphBoundWidth()/this.props.width;e*=t;var a=[];if(!this.state.graphExpr)return[];try{this.f(0),this.f(-1)}catch(i){return[]}for(var n=this.state.left;n<this.state.right;n+=e){var r=this.f(n);NaN!==r&&void 0!==r&&null!==r&&a.push.apply(a,Object(g.a)(this.graphPosToCanvasPos(n,r)))}return a}},{key:"setFunctionExpr",value:function(t){var e;console.log(t);try{e=this.props.graphDerivative?Object(k.b)(t,"x"):Object(k.a)(t)}catch(a){e=null}this.setState({graphExpr:e})}},{key:"buildTangentLinePoints",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.graphBoundWidth();if(!t)return[];var a=e*t.slope,n=[t.center[0]-e,t.center[1]-a],r=[t.center[0]+e,t.center[1]+a];return[].concat(Object(g.a)(this.graphPosToCanvasPos.apply(this,n)),Object(g.a)(this.graphPosToCanvasPos.apply(this,r)))}},{key:"buildTangentInformation",value:function(){if(!this.state.tangentLine)return null;var t=this.graphPosToCanvasPos.apply(this,Object(g.a)(this.state.tangentLine.center));return r.a.createElement(r.a.Fragment,null,r.a.createElement(m.Line,{points:this.buildTangentLinePoints(this.state.tangentLine),closed:!1,stroke:"#aaaaaa",strokeWidth:1}),r.a.createElement(m.Circle,{x:t[0],y:t[1],radius:3,fill:"#ff0000"}),r.a.createElement(m.Text,{text:"slope=".concat(this.state.tangentLine.slope),x:t[0],y:t[1]-10}))}},{key:"removeTangentLine",value:function(){this.props.unHoverEventHook&&this.props.unHoverEventHook(),this.setState({tangentLine:null})}},{key:"renderIndicator",value:function(){if(!this.state.indicator)return null;var t=this.graphPosToCanvasPos.apply(this,Object(g.a)(this.state.indicator));return r.a.createElement(m.Circle,{x:t[0],y:t[1],radius:3,fill:"#ff0000"})}},{key:"render",value:function(){var t=this;return r.a.createElement(m.Stage,{width:this.props.width||640,height:this.props.height||480,ref:this.canvasRef},r.a.createElement(m.Layer,{onMouseMove:function(e){var a=e.evt.x,n=e.evt.y,r=function(t){var e=t.getBoundingClientRect();return{left:e.left+window.scrollX,top:e.top+window.scrollY}}(t.canvasRef.current.attrs.container);a-=r.left,n-=r.top;var i=t.canvasPosToGraphPos(a,n),o=Object(f.a)(i,2),s=o[0],h=o[1];if(t.props.canHover)if(t.state.graphExpr){var c=t.f(s),l=Math.abs(h-c)*t.graphBoundHeight(),u=function(t,e){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1e-4;return(t(e+a)-t(e))/a}(t.f.bind(t),s);l<40?(t.props.hoverEventHook&&t.props.hoverEventHook(s),t.setState({tangentLine:{center:[s,c],slope:u}})):t.removeTangentLine()}else t.removeTangentLine();else t.removeTangentLine()}},r.a.createElement(m.Rect,{x:0,y:0,width:this.props.width,height:this.props.height,fill:"#ffffff"}),r.a.createElement(m.Line,{points:[].concat(Object(g.a)(this.graphPosToCanvasPos(0,1e3)),Object(g.a)(this.graphPosToCanvasPos(0,-1e3))),closed:!1,stroke:"#aaaaaa",strokeWidth:1}),r.a.createElement(m.Line,{points:[].concat(Object(g.a)(this.graphPosToCanvasPos(-1e3,0)),Object(g.a)(this.graphPosToCanvasPos(1e3,0))),closed:!1,stroke:"#aaaaaa",strokeWidth:1}),r.a.createElement(m.Line,{points:this.buildPointsList(4),closed:!1,stroke:"#ac7257",strokeWidth:2}),this.buildTangentInformation(),this.renderIndicator()))}}],[{key:"makeGraphFunction",value:function(t){return function(e){return Object(k.c)(t,{x:e})}}}]),a}(r.a.Component);Object(u.addStyles)();var w=function(t){Object(c.a)(a,t);var e=Object(l.a)(a);function a(t){var n;return Object(s.a)(this,a),(n=e.call(this,t)).state=void 0,n.graphView=void 0,n.dxGraphView=void 0,n.state={latex:""},n.graphView=r.a.createRef(),n.dxGraphView=r.a.createRef(),n}return Object(h.a)(a,[{key:"hoverEventHook",value:function(t){var e,a;null===(e=this.dxGraphView.current)||void 0===e||e.setState({indicator:[t,null===(a=this.dxGraphView.current)||void 0===a?void 0:a.f(t)]})}},{key:"unHoverEventHook",value:function(){var t;null===(t=this.dxGraphView.current)||void 0===t||t.setState({indicator:null})}},{key:"render",value:function(){var t=this;return window.evaluate=k.c,r.a.createElement("div",{className:"main"},r.a.createElement("div",{className:"header"},"Visualized Derivatives"),r.a.createElement("div",{className:"body"},r.a.createElement("div",{className:"graphs"},r.a.createElement("div",null,"Graph (hover to see tangent line)",r.a.createElement(y,{width:540,height:320,ref:this.graphView,canHover:!0,hoverEventHook:this.hoverEventHook.bind(this),unHoverEventHook:this.unHoverEventHook.bind(this)})),r.a.createElement("div",null,"Derivative graph",r.a.createElement(y,{width:540,height:320,graphDerivative:!0,ref:this.dxGraphView}))),r.a.createElement("span",{className:"function-entry"},r.a.createElement("span",{className:"y-equals"},"y="),r.a.createElement("span",{className:"f-entry"},r.a.createElement(u.EditableMathField,{latex:this.state.latex,onChange:function(e){t.setState({latex:e.latex()});var a=function(t){for(var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],a=0,n=d(t),r=function(){return n[a++]},i="";a<n.length;){var o=r();if("\\frac"===o){var s=v(r()),h=v(r());i+="(".concat(s,") / (").concat(h,")")}else i+=v(o)}return e?i.replace(/ /g,""):i}(e.latex());t.graphView.current.setFunctionExpr(a),t.dxGraphView.current.setFunctionExpr(a)}})))))}}]),a}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(w,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))},49:function(t,e,a){t.exports=a(100)},53:function(t,e,a){}},[[49,1,2]]]);
//# sourceMappingURL=main.12c29fa4.chunk.js.map