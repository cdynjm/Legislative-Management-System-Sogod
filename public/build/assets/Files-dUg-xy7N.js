import{a as I,_ as J}from"./AppLayout.vue_vue_type_script_setup_true_lang-BfE8nPyr.js";import{d as O,r as w,q as W,a as X,o as n,c as f,b as t,u as e,m as Y,w as s,e as a,f as u,t as r,h as m,F as P,j as R,n as j,k as Z}from"./app-C73lWIX9.js";import{_ as B,a as V,b as p,c as i,d as Q,e as d}from"./TableHeader.vue_vue_type_script_setup_true_lang-LVw_KDFA.js";import{S as ee,_ as te}from"./Pagination.vue_vue_type_script_setup_true_lang-Ccvi59Ep.js";import{_ as se}from"./Skeleton.vue_vue_type_script_setup_true_lang-DidoFMtG.js";import{_ as U}from"./SkeletonCard.vue_vue_type_script_setup_true_lang-Dhl9uDqg.js";import{_ as q}from"./message-circle-Bsm2AMrn.js";import{_ as ae}from"./Input.vue_vue_type_script_setup_true_lang-Cn93XyBZ.js";import{u as le,a as oe}from"./Skeleton.vue_vue_type_script_setup_true_lang-EmlWlMHs.js";import{F as E}from"./NavFooter.vue_vue_type_script_setup_true_lang-BvOkc1ud.js";import{L as re}from"./loader-circle-CSn166ef.js";import{C as ne}from"./circle-minus-bMhtdStp.js";import{E as de}from"./eye-BblkWmQB.js";import"./AppLogoIcon.vue_vue_type_script_setup_true_lang-Ci9rZWmT.js";const ie={class:"space-y-6 p-4"},ue={class:"flex w-full items-center justify-between"},ce={key:0},fe={key:1},me={class:"text-md flex items-center font-bold"},pe={class:"flex w-full items-center gap-2 sm:w-auto"},ge={class:"space-y-6"},_e={class:"overflow-hidden rounded-md border bg-white"},xe={class:"group-hover:bg-muted/40 flex items-center gap-3 rounded-lg p-2 transition"},he={class:"flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50"},ve={class:"space-y-1"},ye={class:"text-sm font-semibold transition group-hover:text-blue-600"},be={class:"bg-muted inline-flex rounded-full px-3 py-1 text-sm"},we={class:"overflow-hidden rounded-md border bg-white"},ke={class:"space-y-4"},De={class:"flex items-center gap-3"},Pe=["src"],Se={class:"text-[13px] font-medium"},$e={class:"text-muted-foreground text-xs"},Ce={class:"font-bold"},Ne={class:"mt-2 line-clamp-3 text-[13px] leading-relaxed text-wrap text-slate-700"},Fe={class:"bg-muted/20 max-h-32 overflow-y-auto rounded-lg p-3"},Le={class:"text-xs font-medium"},Re={class:"text-muted-foreground text-[11px]"},qe={key:1,class:"text-muted-foreground flex h-16 items-center justify-start text-xs"},Te={class:"space-y-3"},Ae={class:"flex flex-col gap-2"},Ie={class:"text-muted-foreground text-[12px]"},je={class:"text-muted-foreground text-xs"},Be={class:"flex justify-center gap-2"},Ve=["href"];function z(v){const g=new Date(v),k=g.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),S=g.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!0});return`${k} | ${S}`}function T(v){return`${new Date(v).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}`}const et=O({__name:"Files",props:{id:{}},setup(v){const g=v,k=le(),S=[{title:"Files",href:"/admin/files/"+g.id}],_=w(1),$=w([]),C=w(""),D=w({currentPage:1,lastPage:1,hasMorePages:!1}),M=async()=>(await Z.post("/graphql",{query:`
    query ($id: String!, $page: Int!, $first: Int!, $search: String) {
      userfiles(id: $id, page: $page, first: $first, search: $search) {
        categoryName {
          encrypted_id
          category
        }
        authors {
          encrypted_id
          name
        }
        filesListPaginated {
          data {
            encrypted_id
            municipalStatus
            provincialStatus
            title
            firstReadingDate
            secondReadingDate
            thirdReadingDate
            ordinanceNumber
            finalTitle
            enactmentDate
            lceapprovalDate
            transmittalDate
            spslapprovalDate
            postStatus
            publishStatus
            file
            updated_at
            author {
              encrypted_id
              name
              position
              photo
            }
            coAuthors {
              official {
                encrypted_id
                name
                position
              }
            }
          }
          paginatorInfo {
            currentPage
            lastPage
            total
            perPage
            hasMorePages
          }
        }
        subCategoriesList {
          encrypted_id
          category
          parentID
          created_at
          totalFiles
        }
      }
    }
  `,variables:{id:g.id,page:_.value,first:20,search:C.value}})).data.data,{data:x,isFetching:N}=oe({queryKey:["userfetchFiles",_],queryFn:M});W(()=>{var h,l;(l=(h=x.value)==null?void 0:h.userfiles)!=null&&l.filesListPaginated&&($.value=x.value.userfiles.filesListPaginated.data,D.value=x.value.userfiles.filesListPaginated.paginatorInfo)});const y=w(!1),K=()=>{y.value||(y.value=!0,setTimeout(()=>{k.invalidateQueries({queryKey:["userfetchFiles"]}),y.value=!1},2e3))},G=()=>{_.value<D.value.lastPage&&_.value++},H=()=>{_.value>1&&_.value--};return(h,l)=>{const F=X("Badge");return n(),f(P,null,[t(e(Y),{title:"Files"}),t(J,{breadcrumbs:S},{default:s(()=>{var A;return[a("div",ie,[a("div",ue,[e(N)?(n(),f("div",ce,[t(U)])):(n(),f("div",fe,[a("h6",me,[t(e(E),{class:"mr-2 h-8 w-8 flex-shrink-0 rounded-full border p-1 text-blue-500",fill:"currentColor"}),u(" "+r((A=e(x))==null?void 0:A.userfiles.categoryName.category),1)])]))]),a("div",pe,[t(e(ae),{modelValue:C.value,"onUpdate:modelValue":l[0]||(l[0]=o=>C.value=o),placeholder:"Search...",class:"w-full text-sm sm:w-72"},null,8,["modelValue"]),t(e(q),{onClick:K,disabled:y.value,class:"flex items-center gap-1 text-sm"},{default:s(()=>[y.value?(n(),m(e(re),{key:0,class:"h-4 w-4 animate-spin"})):(n(),m(e(ee),{key:1}))]),_:1},8,["disabled"])]),a("div",ge,[a("div",_e,[t(e(B),null,{default:s(()=>[t(e(V),{class:"bg-muted/40"},{default:s(()=>[t(e(p),{class:"[&>th]:py-4"},{default:s(()=>[t(e(i),{class:"text-muted-foreground"},{default:s(()=>l[1]||(l[1]=[a("small",null,"#",-1)])),_:1}),t(e(i),{class:"text-muted-foreground"},{default:s(()=>l[2]||(l[2]=[a("small",null,"Category",-1)])),_:1}),t(e(i),{class:"text-muted-foreground"},{default:s(()=>l[3]||(l[3]=[a("small",null,"No. of Files",-1)])),_:1}),t(e(i),{class:"text-muted-foreground"},{default:s(()=>l[4]||(l[4]=[a("small",null,"Created",-1)])),_:1})]),_:1})]),_:1}),t(e(Q),{class:"[&_tr:nth-child(even)]:bg-muted/20"},{default:s(()=>{var o,b;return[e(N)?(n(),m(e(p),{key:0},{default:s(()=>[t(e(d),{colspan:"10",class:"py-10 text-center"},{default:s(()=>[t(se)]),_:1})]),_:1})):((o=e(x))==null?void 0:o.userfiles.subCategoriesList.length)===0?(n(),m(e(p),{key:1},{default:s(()=>[t(e(d),{colspan:"5",class:"text-muted-foreground py-14 text-center"},{default:s(()=>[t(e(ne),{class:"mx-auto mb-2 h-6 w-6 text-red-500"}),l[5]||(l[5]=u(" No categories found "))]),_:1})]),_:1})):(n(!0),f(P,{key:2},R((b=e(x))==null?void 0:b.userfiles.subCategoriesList,(c,L)=>(n(),m(e(p),{key:c.id,class:"hover:bg-muted/30 transition"},{default:s(()=>[t(e(d),{class:"text-muted-foreground"},{default:s(()=>[u(r(Number(L)+1),1)]),_:2},1024),t(e(d),{class:"w-[320px]"},{default:s(()=>[t(I,{href:h.route("admin.files",{id:c.encrypted_id}),prefetch:"",class:"group"},{default:s(()=>[a("div",xe,[a("div",he,[t(e(E),{class:"h-6 w-6 text-blue-500"})]),a("div",ve,[a("div",ye,r(c.category),1),l[6]||(l[6]=a("div",{class:"text-muted-foreground text-xs"},"Click to view files",-1))])])]),_:2},1032,["href"])]),_:2},1024),t(e(d),null,{default:s(()=>[a("span",be,r(c.totalFiles),1)]),_:2},1024),t(e(d),{class:"text-muted-foreground text-[12px]"},{default:s(()=>[u(r(z(c.created_at)),1)]),_:2},1024)]),_:2},1024))),128))]}),_:1})]),_:1})]),a("div",we,[t(e(B),null,{default:s(()=>[t(e(V),{class:"bg-muted/40"},{default:s(()=>[t(e(p),{class:"[&>th]:py-4"},{default:s(()=>[t(e(i),{class:"text-muted-foreground text-center"},{default:s(()=>l[7]||(l[7]=[a("small",null,"#",-1)])),_:1}),t(e(i),{class:"text-muted-foreground"},{default:s(()=>l[8]||(l[8]=[a("small",null,"File Info",-1)])),_:1}),t(e(i),{class:"text-muted-foreground"},{default:s(()=>l[9]||(l[9]=[a("small",null,"Co-Authors",-1)])),_:1}),t(e(i),{class:"text-muted-foreground"},{default:s(()=>l[10]||(l[10]=[a("small",null,"Status",-1)])),_:1}),t(e(i),{class:"text-muted-foreground"},{default:s(()=>l[11]||(l[11]=[a("small",null,"Updated",-1)])),_:1}),t(e(i),{class:"text-muted-foreground text-center"},{default:s(()=>l[12]||(l[12]=[a("small",null,"Actions",-1)])),_:1})]),_:1})]),_:1}),t(e(Q),{class:"[&_tr:nth-child(even)]:bg-muted/20"},{default:s(()=>[e(N)?(n(),m(e(p),{key:0},{default:s(()=>[t(e(d),{colspan:7},{default:s(()=>[t(U)]),_:1})]),_:1})):$.value.length===0?(n(),m(e(p),{key:1},{default:s(()=>[t(e(d),{colspan:7,class:"py-20 text-center"},{default:s(()=>l[13]||(l[13]=[u(" No data found ")])),_:1})]),_:1})):(n(!0),f(P,{key:2},R($.value,(o,b)=>(n(),m(e(p),{key:b},{default:s(()=>[t(e(d),{class:"text-muted-foreground text-center font-medium"},{default:s(()=>[u(r(Number(b)+1),1)]),_:2},1024),t(e(d),{class:"max-w-[300px]"},{default:s(()=>[a("div",ke,[a("div",De,[a("img",{draggable:"false",src:"/storage/profile/"+o.author.photo,class:"h-10 w-10 rounded-full object-cover ring-2 ring-sky-100"},null,8,Pe),a("div",null,[a("p",Se,r(o.author.name),1),a("p",$e,r(o.author.position),1)])]),t(F,{variant:"secondary",class:"w-fit text-[12px]"},{default:s(()=>[a("span",Ce,r(o.ordinanceNumber??"-"),1)]),_:2},1024),a("p",Ne,r(o.finalTitle??o.title),1)])]),_:2},1024),t(e(d),{class:"w-[220px]"},{default:s(()=>[a("div",Fe,[o.coAuthors.length?(n(!0),f(P,{key:0},R(o.coAuthors,(c,L)=>(n(),f("div",{key:L,class:"mb-3 flex gap-3 last:mb-0"},[l[14]||(l[14]=a("div",{class:"mt-1 h-2 w-2 rounded-full bg-sky-500"},null,-1)),a("div",null,[a("p",Le,r(c.official.name),1),a("p",Re,r(c.official.position),1)])]))),128)):(n(),f("div",qe,"No co-authors"))])]),_:2},1024),t(e(d),null,{default:s(()=>[a("div",Te,[a("div",Ae,[t(F,{class:j(o.municipalStatus==1?"rounded-md bg-red-100 p-1 text-[12px] text-red-600":"rounded-md bg-green-100 p-1 text-[12px] text-green-600")},{default:s(()=>[u(r(o.municipalStatus==1?"Draft":"Approved"),1)]),_:2},1032,["class"]),t(F,{class:j(o.provincialStatus==1?"rounded-md bg-red-100 p-1 text-[12px] text-red-600":o.provincialStatus==2?"rounded-md bg-green-100 p-1 text-[12px] text-green-600":"rounded-md bg-gray-100 p-1 text-[12px] text-gray-600")},{default:s(()=>[u(r(o.provincialStatus==1?"Disapproved":o.provincialStatus==2?"Approved":"Pending"),1)]),_:2},1032,["class"])]),a("div",Ie,[a("div",null," 3rd Reading: "+r(o.thirdReadingDate?T(o.thirdReadingDate):"No date"),1),a("div",null," 2nd Reading: "+r(o.secondReadingDate?T(o.secondReadingDate):"No date"),1),a("div",null," 1st Reading: "+r(o.firstReadingDate?T(o.firstReadingDate):"No date"),1)])])]),_:2},1024),t(e(d),null,{default:s(()=>[a("div",je,r(z(o.updated_at)),1)]),_:2},1024),t(e(d),null,{default:s(()=>[a("div",Be,[t(I,{href:h.route("user.view-file",{id:o.encrypted_id}),prefetch:""},{default:s(()=>[t(e(q),{size:"icon",variant:"ghost",class:"h-8 w-8"},{default:s(()=>[t(e(de),{class:"h-4 w-4"})]),_:1})]),_:2},1032,["href"]),a("a",{href:"/storage/files/"+o.file,target:"_blank"},[t(e(q),{size:"icon",variant:"ghost",class:"h-8 w-8 font-bold"},{default:s(()=>l[15]||(l[15]=[u(" PDF ")])),_:1})],8,Ve)])]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1})]),t(te,{"current-page":D.value.currentPage,"last-page":D.value.lastPage,onNext:G,onPrevious:H},null,8,["current-page","last-page"])])])]}),_:1})],64)}}});export{et as default};
