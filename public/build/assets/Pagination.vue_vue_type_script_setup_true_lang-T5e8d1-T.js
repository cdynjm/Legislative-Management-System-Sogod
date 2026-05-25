import{c as r,_ as n}from"./message-circle-BR5Dqk1X.js";import{d as p,o as u,c as m,b as a,u as s,w as c,e as f,t as i}from"./app-DtOJz-td.js";/**
 * @license lucide-vue-next v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=r("ArrowLeftIcon",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-vue-next v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=r("ArrowRightIcon",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-vue-next v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=r("SearchIcon",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]),k={class:"flex justify-between items-center mt-8"},w=p({__name:"Pagination",props:{currentPage:{},lastPage:{}},setup(l){const e=l;return(o,t)=>(u(),m("div",k,[a(s(n),{disabled:e.currentPage<=1,onClick:t[0]||(t[0]=d=>o.$emit("previous")),class:"cursor-pointer"},{default:c(()=>[a(s(g))]),_:1},8,["disabled"]),f("small",null,"Pages "+i(e.currentPage)+" of "+i(e.lastPage),1),a(s(n),{disabled:e.currentPage>=e.lastPage,onClick:t[1]||(t[1]=d=>o.$emit("next")),class:"cursor-pointer"},{default:c(()=>[a(s(h))]),_:1},8,["disabled"])]))}});export{_ as S,w as _};
