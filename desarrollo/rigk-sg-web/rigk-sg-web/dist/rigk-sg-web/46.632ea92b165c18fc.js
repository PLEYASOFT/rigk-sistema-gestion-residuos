"use strict";(self.webpackChunkrigk_sg_web=self.webpackChunkrigk_sg_web||[]).push([[46],{8195:(M,y,s)=>{s.d(y,{m:()=>f});var e=s(2340),p=s(8256),m=s(529);let f=(()=>{class a{constructor(n){this.http=n,this.url=`${e.N.API_V1_URL}/business`}verifyBusiness(n){return this.http.get(`${this.url}/verify/${n}`)}getBusiness(n){return this.http.get(`${this.url}/business/${n}`)}getAllBusiness(){return this.http.get(`${this.url}/business/`)}postBusiness(n,u,c,h,Z,T,x,A,C,I,S,E){return this.http.post(`${this.url}/business/`,{name:n,vat:u,loc_address:c,phone:h,email:Z,am_first_name:T,am_last_name:x,invoice_name:A,invoice_email:C,invoice_phone:I,code_business:S,giro:E})}deleteBusiness(n){return this.http.delete(`${this.url}/business/${n}`)}updateBusiness(n,u,c,h,Z,T,x,A,C,I,S,E,O){return this.http.put(`${this.url}/business/${n}`,{name:u,vat:c,loc_address:h,phone:Z,email:T,am_first_name:x,am_last_name:A,invoice_name:C,invoice_email:I,invoice_phone:S,code_business:E,giro:O})}}return a.\u0275fac=function(n){return new(n||a)(p.LFG(m.eN))},a.\u0275prov=p.Yz7({token:a,factory:a.\u0275fac,providedIn:"root"}),a})()},554:(M,y,s)=>{s.d(y,{h:()=>f});var e=s(2340),p=s(8256),m=s(529);let f=(()=>{class a{constructor(n){this.http=n,this.url=`${e.N.API_V1_URL}/consumer`}save(n){const u=new FormData;for(let c=0;c<n.attached.length;c++){const h=n.attached[c];u.append(`f_${h.table}_${h.residue}_${h.type}`,h.file)}return u.append("header",JSON.stringify(n.header)),u.append("detail",JSON.stringify(n.detail.data)),this.http.post(`${this.url}`,u)}getForm(n){return this.http.get(`${this.url}/${n}`)}verifyForm(n,u){return this.http.get(`${this.url}/verify/${u}/${n}`)}}return a.\u0275fac=function(n){return new(n||a)(p.LFG(m.eN))},a.\u0275prov=p.Yz7({token:a,factory:a.\u0275fac,providedIn:"root"}),a})()},371:(M,y,s)=>{s.d(y,{u:()=>f});var e=s(2340),p=s(529),m=s(8256);let f=(()=>{class a{constructor(n){this.http=n,this.url=`${e.N.API_V1_URL}/statement`}saveForm(n){return this.http.post(`${this.url}`,n)}getValueStatementByYear(n,u,c){return this.http.get(`${this.url}/${n}/year/${u}/isDraft/${c}`)}get getStatementByUser(){return this.http.get(`${this.url}/byUser`)}updateStateStatement(n,u){return this.http.put(`${this.url}/${n}/state/${u}`,{})}updateValuesStatement(n,u,c){return this.http.put(`${this.url}/${n}`,{header:c,detail:u})}verifyDraft(n,u){return this.http.get(`${this.url}/draft/${n}/year/${u}`)}downloadPDF(n,u){let c=new p.WM;return c=c.set("Accept","application/pdf"),this.http.get(`${this.url}/pdf/${n}/year/${u}`,{headers:c,responseType:"blob"})}}return a.\u0275fac=function(n){return new(n||a)(m.LFG(p.eN))},a.\u0275prov=m.Yz7({token:a,factory:a.\u0275fac,providedIn:"root"}),a})()},2227:(M,y,s)=>{s.d(y,{z:()=>f});var e=s(2340),p=s(8256),m=s(529);let f=(()=>{class a{constructor(n){this.http=n,this.url=`${e.N.API_V1_URL}/rates`}getRates(n){return this.http.get(`${this.url}/${n}`)}get getCLP(){return this.http.get(`${this.url}/clp`)}get getUF(){return this.http.get(`${this.url}/uf`)}}return a.\u0275fac=function(n){return new(n||a)(p.LFG(m.eN))},a.\u0275prov=p.Yz7({token:a,factory:a.\u0275fac,providedIn:"root"}),a})()},2730:(M,y,s)=>{s.d(y,{$:()=>N});var e=s(8256),p=s(2045);let m=(()=>{class i{constructor(){}ngOnInit(){}}return i.\u0275fac=function(t){return new(t||i)},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-footer"]],decls:5,vars:0,consts:[[1,"footer"],[1,"list-unstyled","m-0","d-md-flex","justify-content-between","align-items-center"],["href","#",1,"logo","me-3"],["src","assets/images/logo-prorep-w.png","width","100","alt","Ir al inicio"]],template:function(t,o){1&t&&(e.TgZ(0,"footer",0)(1,"ul",1)(2,"li")(3,"a",2),e._UZ(4,"img",3),e.qZA()()()())}}),i})();var f=s(6895);let a=(()=>{class i{constructor(t){this.router=t,this.isVisible=!0,this.horaIngreso=new Date,this.isVisibleBar=new e.vpe}ngOnInit(){this.userData=JSON.parse(sessionStorage.getItem("user")),this.horaIngreso=new Date(sessionStorage.getItem("horaIngreso"))}logout(){this.router.navigate(["/auth/login"],{queryParams:{logout:!0}})}toggleMenu(){this.isVisible=!this.isVisible,this.isVisibleBar.emit(this.isVisible)}toggleMenuMobile(){document.getElementById("sidebar")?.classList.toggle("active")}toggleProfileMenu(){document.getElementById("info-profile")?.classList.toggle("show")}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(p.F0))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-navbar"]],outputs:{isVisibleBar:"isVisibleBar"},decls:42,vars:8,consts:[[1,"header","py-3","px-4","border-bottom"],[1,"d-flex","flex-wrap","align-items-center","justify-content-between"],[1,"d-flex","align-items-center"],["id","sidebarCollapse","role","button",1,"btn","d-inline-block","d-lg-none","me-3","navbar-btn",3,"click"],["aria-hidden","true",1,"fa","fa-bars","fa-lg"],["href","#",1,"btn","d-none","d-lg-inline-block","me-3",3,"click"],[1,"shrink-btn"],[1,"d-lg-flex","align-items-center"],["href","#",1,"logo-h","me-3","d-block"],["src","assets/images/logo-prorep-w.png","width","200","alt","Ir al inicio",1,"img-fluid"],[1,"site-name"],[1,"menu-h-2","d-flex","text-end","align-items-center","position-relative"],[1,"profile","me-2","me-lg-4"],["id","info-profile",1,"info-profile","collapse"],[1,"info-profile__header"],["src","assets/images/foto-usuario-h.png","alt","","width","70","height","70",1,"rounded-circle"],[1,"info-profile__body"],[1,"list-profile","list-unstyled"],[1,"list-profile__title"],[1,"list-profile__text"],[1,"btn","btn-sign-out",3,"click"],["aria-hidden","true",1,"fa","fa-sign-out","fa-lg"]],template:function(t,o){1&t&&(e.TgZ(0,"header",0)(1,"div",1)(2,"div",2)(3,"button",3),e.NdJ("click",function(){return o.toggleMenuMobile()}),e._UZ(4,"i",4),e.qZA(),e.TgZ(5,"button",5),e.NdJ("click",function(){return o.toggleMenu()}),e.TgZ(6,"span",6),e._UZ(7,"i",4),e.qZA()(),e.TgZ(8,"div",7)(9,"a",8),e._UZ(10,"img",9),e.qZA(),e.TgZ(11,"span",10),e._uU(12,"Plataforma de declaraci\xf3n de EyE no domiciliarios puesto en el mercado"),e.qZA()()(),e.TgZ(13,"div",11),e._UZ(14,"div",12),e.TgZ(15,"div",13)(16,"div",14),e._UZ(17,"img",15),e.qZA(),e.TgZ(18,"div",16)(19,"ul",17)(20,"li",18),e._uU(21,"Nombre Usuario"),e.qZA(),e.TgZ(22,"li",19),e._uU(23),e.qZA()(),e.TgZ(24,"ul",17)(25,"li",18),e._uU(26,"Perfil"),e.qZA(),e.TgZ(27,"li",19),e._uU(28),e.qZA()(),e.TgZ(29,"ul",17)(30,"li",18),e._uU(31,"Instituci\xf3n"),e.qZA(),e.TgZ(32,"li",19),e._uU(33),e.qZA()(),e.TgZ(34,"ul",17)(35,"li",18),e._uU(36,"Fecha/ Hora ingreso"),e.qZA(),e.TgZ(37,"li",19),e._uU(38),e.ALo(39,"date"),e.qZA()()()(),e.TgZ(40,"button",20),e.NdJ("click",function(){return o.logout()}),e._UZ(41,"i",21),e.qZA()()()()),2&t&&(e.xp6(23),e.AsE("",o.userData.FIRST_NAME," ",o.userData.LAST_NAME,""),e.xp6(5),e.Oqu(o.userData.ROL_NAME),e.xp6(5),e.Oqu(o.userData.BUSINESS),e.xp6(5),e.Oqu(e.xi3(39,5,o.horaIngreso,"dd/MM/yyyy HH:mm:ss")))},dependencies:[f.uU]}),i})();function g(i,l,t,o,r,_,d){try{var v=i[_](d),b=v.value}catch(P){return void t(P)}v.done?l(b):Promise.resolve(b).then(o,r)}function n(i){return function(){var l=this,t=arguments;return new Promise(function(o,r){var _=i.apply(l,t);function d(b){g(_,o,r,d,v,"next",b)}function v(b){g(_,o,r,d,v,"throw",b)}d(void 0)})}}var u=s(5226),c=s.n(u),h=s(8195),Z=s(554),T=s(371);function x(i,l){if(1&i){const t=e.EpF();e.TgZ(0,"a",8),e.NdJ("click",function(){e.CHM(t);const r=e.oxw(4);return e.KtG(r.hideSidebar())}),e.TgZ(1,"span"),e._UZ(2,"i",9),e.qZA(),e.TgZ(3,"span",10),e._uU(4),e.qZA()()}if(2&i){const t=e.oxw().$implicit;e.Q6J("href",t.path,e.LSH)("title",t.title),e.xp6(2),e.Gre("fa ",t.icon," fa-fw"),e.xp6(2),e.Oqu(t.title)}}function A(i,l){if(1&i){const t=e.EpF();e.TgZ(0,"a",11),e.NdJ("click",function(){e.CHM(t);const r=e.oxw(4);return r.showDialog(),e.KtG(r.hideSidebar())}),e.TgZ(1,"span"),e._UZ(2,"i",9),e.qZA(),e.TgZ(3,"span",10),e._uU(4),e.qZA()()}if(2&i){const t=e.oxw().$implicit;e.Q6J("title",t.title),e.xp6(2),e.Gre("fa ",t.icon," fa-fw"),e.xp6(2),e.Oqu(t.title)}}function C(i,l){if(1&i&&(e.TgZ(0,"li",5),e.YNc(1,x,5,6,"a",6),e.YNc(2,A,5,5,"a",7),e.qZA()),2&i){const t=l.$implicit;e.xp6(1),e.Q6J("ngIf","Registro de declaraci\xf3n"!=t.title),e.xp6(1),e.Q6J("ngIf","Registro de declaraci\xf3n"==t.title)}}function I(i,l){if(1&i&&(e.TgZ(0,"ul",3),e.YNc(1,C,3,2,"li",4),e.qZA()),2&i){const t=e.oxw(2);e.xp6(1),e.Q6J("ngForOf",t.menuProductor)}}function S(i,l){if(1&i){const t=e.EpF();e.TgZ(0,"li",5)(1,"a",8),e.NdJ("click",function(){e.CHM(t);const r=e.oxw(3);return e.KtG(r.hideSidebar())}),e.TgZ(2,"span"),e._UZ(3,"i",9),e.qZA(),e.TgZ(4,"span",10),e._uU(5),e.qZA()()()}if(2&i){const t=l.$implicit;e.xp6(1),e.Q6J("href",t.path,e.LSH)("title",t.title),e.xp6(2),e.Gre("fa ",t.icon," fa-fw"),e.xp6(2),e.Oqu(t.title)}}function E(i,l){if(1&i&&(e.TgZ(0,"ul",3),e.YNc(1,S,6,6,"li",4),e.qZA()),2&i){const t=e.oxw(2);e.xp6(1),e.Q6J("ngForOf",t.menuAdmin)}}function O(i,l){if(1&i){const t=e.EpF();e.TgZ(0,"a",8),e.NdJ("click",function(){e.CHM(t);const r=e.oxw(4);return e.KtG(r.hideSidebar())}),e.TgZ(1,"span"),e._UZ(2,"i",9),e.qZA(),e.TgZ(3,"span",10),e._uU(4),e.qZA()()}if(2&i){const t=e.oxw().$implicit;e.Q6J("href",t.path,e.LSH)("title",t.title),e.xp6(2),e.Gre("fa ",t.icon," fa-fw"),e.xp6(2),e.Oqu(t.title)}}function D(i,l){if(1&i){const t=e.EpF();e.TgZ(0,"a",13),e.NdJ("click",function(){e.CHM(t);const r=e.oxw(4);return r.showDialog2(),e.KtG(r.hideSidebar())}),e.TgZ(1,"span"),e._UZ(2,"i",9),e.qZA(),e.TgZ(3,"span",10),e._uU(4),e.qZA()()}if(2&i){const t=e.oxw().$implicit;e.Q6J("title",t.title),e.xp6(2),e.Gre("fa ",t.icon," fa-fw"),e.xp6(2),e.Oqu(t.title)}}function $(i,l){if(1&i&&(e.TgZ(0,"li",5),e.YNc(1,O,5,6,"a",6),e.YNc(2,D,5,5,"a",12),e.qZA()),2&i){const t=l.$implicit;e.xp6(1),e.Q6J("ngIf","Registro de declaraci\xf3n"!=t.title),e.xp6(1),e.Q6J("ngIf","Registro de declaraci\xf3n"==t.title)}}function U(i,l){if(1&i&&(e.TgZ(0,"ul",3),e.YNc(1,$,3,2,"li",4),e.qZA()),2&i){const t=e.oxw(2);e.xp6(1),e.Q6J("ngForOf",t.menuConsumidor)}}function w(i,l){if(1&i&&(e.TgZ(0,"nav",1),e.YNc(1,I,2,1,"ul",2),e.YNc(2,E,2,1,"ul",2),e.YNc(3,U,2,1,"ul",2),e.qZA()),2&i){const t=e.oxw();e.xp6(1),e.Q6J("ngIf","Productor"===t.userData.ROL_NAME),e.xp6(1),e.Q6J("ngIf","Admin"===t.userData.ROL_NAME),e.xp6(1),e.Q6J("ngIf","Consumidor"===t.userData.ROL_NAME)}}let F=(()=>{class i{constructor(t,o,r,_){this.router=t,this.businessService=o,this.ss=r,this.productorService=_,this.isVisible=!0,this.menuProductor=[{title:"Inicio",path:"#/productor/home",icon:"fa-home"},{title:"Mi Perfil",path:"#/productor/profile",icon:"fa-user"},{title:"Registro de declaraci\xf3n",path:"#/productor/form",icon:"fa-file-text"},{title:"Consulta de declaraci\xf3n",path:"#/productor/statements",icon:"fa-search"}],this.menuConsumidor=[{title:"Inicio",path:"#/consumidor/home",icon:"fa-home"},{title:"Mi Perfil",path:"#/consumidor/profile",icon:"fa-user"},{title:"Registro de declaraci\xf3n",path:"#/consumidor/form",icon:"fa-file-text"},{title:"Consulta de declaraci\xf3n",path:"#/consumidor/statements",icon:"fa-search"}],this.menuAdmin=[{title:"Inicio",path:"#/mantenedor/home",icon:"fa-home"},{title:"Mi Perfil",path:"#/mantenedor/profile",icon:"fa-user"},{title:"Mantenedor Empresas",path:"#/mantenedor/business",icon:"fa-file-text"},{title:"Mantenedor Establecimientos",path:"#/mantenedor/establishment",icon:"fa-file-text"},{title:"Mantenedor Usuarios",path:"#/mantenedor/users",icon:"fa-users"}]}ngOnInit(){this.userData=JSON.parse(sessionStorage.getItem("user"))}hideSidebar(){window.innerWidth<=992&&document.getElementById("sidebar")?.classList.toggle("active")}showDialog(){var t=this;return n(function*(){var o;c().fire({title:"Ingrese Datos",html:'<input id="inp_id_business" type="text" placeholder="ID Empresa" class="form-control"><br><input id="inp_year" type="number" placeholder="A\xd1O Declaraci\xf3n" class="form-control">',showCancelButton:!0,preConfirm:(o=n(function*(){const r=document.getElementById("inp_id_business").value,_=parseInt(document.getElementById("inp_year").value),d=(new Date).getFullYear();_<d&&""!=r?_>=1e3&&_<=9999&&_<d&&""!=r?yield t.businessService.verifyBusiness(r).subscribe({next:v=>{v.status?t.productorService.verifyDraft(r,_).subscribe({next:b=>{b.status?c().fire({icon:"info",title:"\xa1Oops!",text:"Ya existe declaraci\xf3n enviada"}):t.router.navigate(["/productor/form"],{queryParams:{year:_,id_business:r}})}}):c().fire({icon:"error",title:"\xa1Oops!",text:"Usuario no pertenece a empresa"})}}):c().showValidationMessage("ID y/o A\xf1o incorrecto. Favor verificar"):c().showValidationMessage("Solo se aceptan antes del a\xf1o "+(d-1))}),function(){return o.apply(this,arguments)})}).then(o=>{})})()}showDialog2(){var t=this;return n(function*(){var o;c().fire({title:"Ingrese Datos",html:'<input id="inp_id_business" type="text" placeholder="ID Empresa" class="form-control"><br><input id="inp_year" type="number" placeholder="A\xd1O Declaraci\xf3n" class="form-control">',showCancelButton:!0,preConfirm:(o=n(function*(){const r=document.getElementById("inp_id_business").value,_=parseInt(document.getElementById("inp_year").value),d=(new Date).getFullYear();_<d&&""!=r?_>=1e3&&_<=9999&&_<d&&""!=r?yield t.businessService.verifyBusiness(r).subscribe({next:v=>{v.status?t.ss.verifyForm(r,_).subscribe({next:b=>{b.status?c().fire({icon:"error",title:"\xa1Oops!",text:"A\xf1o ya fue declarado"}):t.router.navigate(["/consumidor/form"],{queryParams:{year:_,id_business:v.data}})}}):c().fire({icon:"error",title:"\xa1Oops!",text:"Usuario no pertenece a empresa"})}}):c().showValidationMessage("ID y/o A\xf1o incorrecto. Favor verificar"):c().showValidationMessage("Solo se aceptan antes del a\xf1o "+(d-1))}),function(){return o.apply(this,arguments)})}).then(o=>{})})()}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(p.F0),e.Y36(h.m),e.Y36(Z.h),e.Y36(T.u))},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-sidebar"]],inputs:{isVisible:"isVisible"},decls:1,vars:1,consts:[["id","sidebar","class","mainmenu",4,"ngIf"],["id","sidebar",1,"mainmenu"],["class","list-unstyled",4,"ngIf"],[1,"list-unstyled"],["class","nav-item",4,"ngFor","ngForOf"],[1,"nav-item"],["routerLinkActive","active","class","nav-link","data-bs-toggle","tooltip",3,"href","title","click",4,"ngIf"],["routerLinkActive","active","class","nav-link","href","#","data-bs-toggle","tooltip",3,"title","click",4,"ngIf"],["routerLinkActive","active","data-bs-toggle","tooltip",1,"nav-link",3,"href","title","click"],["aria-hidden","true"],[1,"nav-link__hide"],["routerLinkActive","active","href","#","data-bs-toggle","tooltip",1,"nav-link",3,"title","click"],["style","cursor: pointer;","routerLinkActive","active","class","nav-link","data-bs-toggle","tooltip",3,"title","click",4,"ngIf"],["routerLinkActive","active","data-bs-toggle","tooltip",1,"nav-link",2,"cursor","pointer",3,"title","click"]],template:function(t,o){1&t&&e.YNc(0,w,4,3,"nav",0),2&t&&e.Q6J("ngIf",o.isVisible)},dependencies:[p.Od,f.sg,f.O5]}),i})(),N=(()=>{class i{constructor(){this.isVisible=!0}ngOnInit(){}onToggleMenu(t){this.isVisible=t}}return i.\u0275fac=function(t){return new(t||i)},i.\u0275cmp=e.Xpm({type:i,selectors:[["app-layout"]],inputs:{isVisible:"isVisible"},decls:5,vars:1,consts:[[3,"isVisibleBar"],[1,"wrapper","d-flex"],[3,"isVisible"]],template:function(t,o){1&t&&(e.TgZ(0,"app-navbar",0),e.NdJ("isVisibleBar",function(_){return o.onToggleMenu(_)}),e.qZA(),e.TgZ(1,"main",1),e._UZ(2,"app-sidebar",2)(3,"router-outlet"),e.qZA(),e._UZ(4,"app-footer")),2&t&&(e.xp6(2),e.Q6J("isVisible",o.isVisible))},dependencies:[p.lC,m,a,F]}),i})()}}]);