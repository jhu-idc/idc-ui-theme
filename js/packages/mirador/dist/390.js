(self.webpackChunkmirador=self.webpackChunkmirador||[]).push([[390],{20389:(e,t,n)=>{"use strict";var r=n(14859),o=n(93291);t.Z=void 0;var a=o(n(2784)),i=(0,r(n(50175)).default)(a.createElement("path",{d:"M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"}),"AddCircleOutlineSharp");t.Z=i},99473:(e,t,n)=>{"use strict";var r=n(14859),o=n(93291);t.Z=void 0;var a=o(n(2784)),i=(0,r(n(50175)).default)(a.createElement("path",{d:"M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"}),"PlayCircleOutlineSharp");t.Z=i},76920:(e,t,n)=>{"use strict";var r=n(14859),o=n(93291);t.Z=void 0;var a=o(n(2784)),i=(0,r(n(50175)).default)(a.createElement("path",{d:"M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"}),"RemoveCircleOutlineSharp");t.Z=i},5390:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>ve});var r=n(18717),o=n(11196),a=n(2784),i=n(57607),c=n(74294),u=n(92958),l=n(48032),s=n(81610),f=n(72779),p=n.n(f),d=n(27556),v=n(90436),h=n(95505),w=n(36691),y=n(1172),m=n(20389),b=n(76920),C=n(72379);function O(e){return a.createElement(C.Z,e,a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},a.createElement("path",{d:"M6,15H9v3h2V13H6Zm9-6V6H13v5h5V9Z"}),a.createElement("path",{d:"M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8,8,8,0,0,1-8,8Z"})))}var g=n(79058);function E(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Z(e,t){return(Z=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function k(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=j(e);if(t){var o=j(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return _(this,n)}}function _(e,t){return!t||"object"!=typeof t&&"function"!=typeof t?P(e):t}function P(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function j(e){return(j=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var I=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Z(e,t)}(i,e);var t,n,r,o=k(i);function i(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=o.call(this,e)).handleZoomInClick=t.handleZoomInClick.bind(P(t)),t.handleZoomOutClick=t.handleZoomOutClick.bind(P(t)),t}return t=i,(n=[{key:"handleZoomInClick",value:function(){var e=this.props,t=e.windowId;(0,e.updateViewport)(t,{zoom:2*e.viewer.zoom})}},{key:"handleZoomOutClick",value:function(){var e=this.props,t=e.windowId;(0,e.updateViewport)(t,{zoom:e.viewer.zoom/2})}},{key:"render",value:function(){var e=this.props,t=e.displayDivider,n=e.showZoomControls,r=e.classes,o=e.t,i=e.zoomToWorld;return n?a.createElement("div",{className:r.zoom_controls},a.createElement(g.Z,{"aria-label":o("zoomIn"),onClick:this.handleZoomInClick},a.createElement(m.Z,null)),a.createElement(g.Z,{"aria-label":o("zoomOut"),onClick:this.handleZoomOutClick},a.createElement(b.Z,null)),a.createElement(g.Z,{"aria-label":o("zoomReset"),onClick:function(){return i(!1)}},a.createElement(O,null)),t&&a.createElement("span",{className:r.divider})):a.createElement(a.Fragment,null)}}])&&E(t.prototype,n),r&&E(t,r),i}(a.Component);I.defaultProps={displayDivider:!0,showZoomControls:!1,t:function(e){return e},updateViewport:function(){},viewer:{},windowId:""};var x={updateViewport:w.WH};const R=(0,r.qC)((0,h.Z)(),(0,u.Z)((function(e){return{divider:{borderRight:"1px solid #808080",display:"inline-block",height:"24px",margin:"12px 6px"},ListItem:{paddingBottom:0,paddingTop:0},zoom_controls:{display:"flex",flexDirection:"row",justifyContent:"center"}}})),(0,i.$j)((function(e,t){var n=t.windowId;return{showZoomControls:(0,y._M)(e),viewer:(0,s.gA)(e,{windowId:n})}}),x),(0,o.A)("ZoomControls"))(I);var N=n(81720);function z(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function S(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function B(e,t){return(B=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function T(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=D(e);if(t){var o=D(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return A(this,n)}}function A(e,t){return!t||"object"!=typeof t&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function D(e){return(D=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var V=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&B(e,t)}(i,e);var t,n,r,o=T(i);function i(){return z(this,i),o.apply(this,arguments)}return t=i,(n=[{key:"render",value:function(){var e=this.props,t=e.canvasCount,n=e.canvasIndex,r=e.canvasLabel,o=e.classes,i=e.t;return a.createElement("div",{className:p()((0,N.Z)("osd-info"),o.osdInfo)},a.createElement(v.Z,{display:"inline",variant:"caption",className:(0,N.Z)("canvas-count")},i("pagination",{current:n+1,total:t})),a.createElement(v.Z,{display:"inline",variant:"caption",className:(0,N.Z)("canvas-label")},r&&" • ".concat(r)))}}])&&S(t.prototype,n),r&&S(t,r),i}(a.Component);V.defaultProps={canvasLabel:void 0,t:function(){}};var M=n(49455),W=n(95981);const q=(0,r.qC)((0,u.Z)({osdInfo:{order:2,overflow:"hidden",paddingBottom:3,textOverflow:"ellipsis",unicodeBidi:"plaintext",whiteSpace:"nowrap",width:"100%"}}),(0,h.Z)(),(0,i.$j)((function(e,t){var n=t.windowId,r=(0,M.LU)(e,{windowId:n}),o=(0,W.Dr)(e,{windowId:n}),a=((0,M.Pm)(e,{windowId:n})||{}).id;return{canvasCount:r.length,canvasIndex:o,canvasLabel:(0,M.vt)(e,{canvasId:a,windowId:n})}}),null),(0,o.A)("ViewerInfo"))(V);var H=n(99473);function L(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function $(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function F(e,t){return(F=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function U(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=X(e);if(t){var o=X(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Q(this,n)}}function Q(e,t){return!t||"object"!=typeof t&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function X(e){return(X=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var G=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&F(e,t)}(i,e);var t,n,r,o=U(i);function i(){return L(this,i),o.apply(this,arguments)}return t=i,(n=[{key:"render",value:function(){var e=this.props,t=e.hasNextCanvas,n=e.hasPreviousCanvas,r=e.setNextCanvas,o=e.setPreviousCanvas,i=e.t,c=e.classes,u="ltr",l={},s={};switch(e.viewingDirection){case"top-to-bottom":l={transform:"rotate(270deg)"},s={transform:"rotate(90deg)"};break;case"bottom-to-top":l={transform:"rotate(90deg)"},s={transform:"rotate(270deg)"};break;case"right-to-left":u="rtl",l={},s={transform:"rotate(180deg)"};break;default:l={transform:"rotate(180deg)"},s={}}return a.createElement("div",{className:p()((0,N.Z)("osd-navigation"),c.osdNavigation),dir:u},a.createElement(g.Z,{"aria-label":i("previousCanvas"),className:(0,N.Z)("previous-canvas-button"),disabled:!n,onClick:function(){n&&o()}},a.createElement(H.Z,{style:l})),a.createElement(g.Z,{"aria-label":i("nextCanvas"),className:(0,N.Z)("next-canvas-button"),disabled:!t,onClick:function(){t&&r()}},a.createElement(H.Z,{style:s})))}}])&&$(t.prototype,n),r&&$(t,r),i}(a.Component);G.defaultProps={hasNextCanvas:!1,hasPreviousCanvas:!1,setNextCanvas:function(){},setPreviousCanvas:function(){},viewingDirection:""};const J=(0,r.qC)((0,u.Z)({osdNavigation:{order:1}}),(0,h.Z)(),(0,i.$j)((function(e,t){var n=t.windowId;return{hasNextCanvas:!!(0,M.m7)(e,{windowId:n}),hasPreviousCanvas:!!(0,M.iQ)(e,{windowId:n}),viewingDirection:(0,W.Xf)(e,{windowId:n})}}),(function(e,t){var n=t.windowId;return{setNextCanvas:function(){return e(w.NU(n))},setPreviousCanvas:function(){return e(w.Ch(n))}}})),(0,o.A)("ViewerNavigation"))(G);var K=n(95450);function Y(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function ee(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function te(e,t){return(te=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function ne(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=oe(e);if(t){var o=oe(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return re(this,n)}}function re(e,t){return!t||"object"!=typeof t&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function oe(e){return(oe=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var ae=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&te(e,t)}(i,e);var t,n,r,o=ne(i);function i(){return Y(this,i),o.apply(this,arguments)}return t=i,(n=[{key:"canvasNavControlsAreStacked",value:function(){var e=this.props.size;return e&&e.width&&e.width<=253}},{key:"render",value:function(){var e=this.props,t=e.classes,n=e.visible,r=e.windowId,o=e.zoomToWorld;return n?a.createElement(d.Z,{square:!0,className:p()(t.controls,(0,N.Z)("canvas-nav"),t.canvasNav,this.canvasNavControlsAreStacked()?(0,N.Z)("canvas-nav-stacked"):null,this.canvasNavControlsAreStacked()?t.canvasNavStacked:null),elevation:0},a.createElement(R,{displayDivider:!this.canvasNavControlsAreStacked(),windowId:r,zoomToWorld:o}),a.createElement(J,{windowId:r}),a.createElement(q,{windowId:r}),a.createElement(K.M,this.props)):a.createElement(v.Z,{variant:"srOnly",component:"div"},a.createElement(q,{windowId:r}))}}])&&ee(t.prototype,n),r&&ee(t,r),i}(a.Component);ae.defaultProps={classes:{},visible:!0};const ie=(0,r.qC)((0,i.$j)((function(e,t){var n=t.windowId;return{visible:(0,s.oq)(e).focusedWindowId===n}})),(0,u.Z)((function(e){return{canvasNav:{display:"flex",flexDirection:"row",flexWrap:"wrap",justifyContent:"center",textAlign:"center"},canvasNavStacked:{flexDirection:"column"},controls:{backgroundColor:(0,l.U1)(e.palette.background.paper,.5),bottom:0,position:"absolute",width:"100%",zIndex:50}}})),(0,c.withSize)(),(0,o.A)("WindowCanvasNavigationControls"))(ae);function ce(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function ue(e,t){return(ue=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function le(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=fe(e);if(t){var o=fe(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return se(this,n)}}function se(e,t){return!t||"object"!=typeof t&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function fe(e){return(fe=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var pe=(0,a.lazy)((function(){return n.e(501).then(n.bind(n,26501))})),de=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ue(e,t)}(i,e);var t,n,r,o=le(i);function i(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=o.call(this,e)).state={},t}return t=i,r=[{key:"getDerivedStateFromError",value:function(e){return{hasError:!0}}}],(n=[{key:"render",value:function(){var e=this.props.windowId;return this.state.hasError?a.createElement(a.Fragment,null):a.createElement(a.Suspense,{fallback:a.createElement("div",null)},a.createElement(pe,{windowId:e},a.createElement(ie,{windowId:e})))}}])&&ce(t.prototype,n),r&&ce(t,r),i}(a.Component);const ve=(0,r.qC)((0,o.A)("WindowViewer"))(de)}}]);