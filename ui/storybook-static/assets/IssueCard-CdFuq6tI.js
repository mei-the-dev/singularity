import{r as c,R as t}from"./iframe-CKG4fk_5.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),w=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(r,a,o)=>o?o.toUpperCase():a.toLowerCase()),d=e=>{const r=w(e);return r.charAt(0).toUpperCase()+r.slice(1)},p=(...e)=>e.filter((r,a,o)=>!!r&&r.trim()!==""&&o.indexOf(r)===a).join(" ").trim(),f=e=>{for(const r in e)if(r.startsWith("aria-")||r==="role"||r==="title")return!0};/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var E={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=c.forwardRef(({color:e="currentColor",size:r=24,strokeWidth:a=2,absoluteStrokeWidth:o,className:s="",children:n,iconNode:b,...i},y)=>c.createElement("svg",{ref:y,...E,width:r,height:r,stroke:e,strokeWidth:o?Number(a)*24/Number(r):a,className:p("lucide",s),...!n&&!f(i)&&{"aria-hidden":"true"},...i},[...b.map(([x,g])=>c.createElement(x,g)),...Array.isArray(n)?n:[n]]));/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=(e,r)=>{const a=c.forwardRef(({className:o,...s},n)=>c.createElement(N,{ref:n,iconNode:r,className:p(`lucide-${h(d(e))}`,`lucide-${e}`,o),...s}));return a.displayName=d(e),a};/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],k=m("clock",v);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["line",{x1:"3",x2:"9",y1:"12",y2:"12",key:"1dyftd"}],["line",{x1:"15",x2:"21",y1:"12",y2:"12",key:"oup4p8"}]],l=m("git-commit-horizontal",C);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M13 6h3a2 2 0 0 1 2 2v7",key:"1yeb86"}],["line",{x1:"6",x2:"6",y1:"9",y2:"21",key:"rroup"}]],u=m("git-pull-request",I),_=({issue:e,onClick:r})=>{const a=s=>{switch(s){case"critical":return"bg-red-500/20 text-red-300 border-red-500/30";case"high":return"bg-amber-500/20 text-amber-300 border-amber-500/30";case"medium":return"bg-yellow-500/20 text-yellow-300 border-yellow-500/30";case"low":return"bg-gray-500/20 text-gray-300 border-gray-500/30";default:return"bg-gray-500/20 text-gray-300 border-gray-500/30"}},o=s=>{switch(s){case"bug":return t.createElement(l,{className:"w-3 h-3"});case"feature":return t.createElement(u,{className:"w-3 h-3"});case"enhancement":return t.createElement(l,{className:"w-3 h-3"});default:return t.createElement(l,{className:"w-3 h-3"})}};return t.createElement("div",{role:"button",tabIndex:0,onClick:r,onKeyDown:s=>{s.key==="Enter"&&r&&r()},className:"bg-gradient-to-br from-amber-950/40 to-amber-900/20 border border-amber-800/30 rounded-lg p-3 cursor-pointer transition-all duration-300 hover:border-amber-600/50 hover:shadow-lg hover:shadow-amber-900/30 hover:-translate-y-1 group","data-testid":`issue-card-${e.id}`},t.createElement("div",{className:"flex items-start justify-between mb-2"},t.createElement("span",{className:`text-xs px-2 py-1 rounded border ${a(e.priority)}`},e.priority),t.createElement("div",{className:"flex items-center gap-1 text-xs text-amber-700"},t.createElement("span",{className:"text-xs text-amber-600"},o(e.type)),t.createElement("span",{className:"text-xs text-amber-700"},"#",e.id))),t.createElement("h4",{className:"text-sm text-amber-100 mb-3 group-hover:text-amber-50 transition-colors"},e.title),t.createElement("div",{className:"flex items-center justify-between"},t.createElement("div",{className:"flex items-center gap-2"},t.createElement("div",{className:"w-6 h-6 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-[10px] font-medium text-black shadow-md"},e.assignee),t.createElement("div",{className:"flex items-center gap-1 text-xs text-amber-700"},t.createElement(k,{className:"w-3 h-3"}),t.createElement("span",null,e.points,"pt"))),t.createElement("div",{className:"flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"},t.createElement("button",{className:"p-1 hover:bg-amber-900/30 rounded transition-colors"},t.createElement(l,{className:"w-3 h-3 text-amber-600"})),t.createElement("button",{className:"p-1 hover:bg-amber-900/30 rounded transition-colors"},t.createElement(u,{className:"w-3 h-3 text-amber-600"})))))};_.__docgenInfo={description:"",methods:[],displayName:"IssueCard",props:{issue:{required:!0,tsType:{name:"Issue"},description:""},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};export{_ as I,m as c};
