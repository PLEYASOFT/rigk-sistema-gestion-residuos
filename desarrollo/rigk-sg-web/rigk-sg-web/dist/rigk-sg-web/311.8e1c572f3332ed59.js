"use strict";(self.webpackChunkrigk_sg_web=self.webpackChunkrigk_sg_web||[]).push([[311],{7311:(M,m,l)=>{l.r(m),l.d(m,{ConsumerStatementModule:()=>w});var u=l(6895),p=l(2045),f=l(2730),e=l(8256);let g=(()=>{class n{constructor(){}ngOnInit(){}}return n.\u0275fac=function(t){return new(t||n)},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-form"]],decls:2,vars:0,template:function(t,o){1&t&&(e.TgZ(0,"p"),e._uU(1,"form works!"),e.qZA())}}),n})();var h=l(2227);function Z(n,a){if(1&n&&(e.TgZ(0,"li")(1,"span"),e._uU(2),e.qZA(),e.TgZ(3,"span"),e._uU(4),e.qZA()()),2&n){const t=a.$implicit;e.xp6(2),e.Oqu(t.name),e.xp6(2),e.Oqu(t.price)}}let T=(()=>{class n{constructor(t){this.ratesService=t,this.types=["EyE reciclables de papel/cart\xf3n","EyE reciclables de metal","EyE reciclables de pl\xe1sticos","EyE no reciclables"],this.year=(new Date).getFullYear(),this.rates=[]}ngOnInit(){this.ratesService.getRates(this.year).subscribe(t=>{t.status&&t.data.forEach(o=>{this.rates.push({name:this.types[o.type-1],price:o.price})})})}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(h.z))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-home"]],decls:45,vars:1,consts:[["id","content"],["aria-label","breadcrumb",1,"breadcrumbs","d-none","d-lg-block"],[1,"breadcrumb"],["aria-current","page",1,"breadcrumb-item"],["aria-hidden","true",1,"fa","fa-home"],[1,"inicio"],[1,"box","box-inicio"],[1,"row"],[1,"col-12","col-md-7"],[1,"h1"],["href","tel:+56998172845",1,"color-white"],["href","mailto:contacto@prorep.cl",1,"color-white"],[1,"col-12","col-md-5"],[1,"pt-4","pt-md-0","mt-3","mt-md-0","border-top","border-top-md-0"],[1,"list","list-tarifas","list-unstyled"],[1,"text-end","d-block","bg-blue","color-white"],[4,"ngFor","ngForOf"]],template:function(t,o){1&t&&(e.TgZ(0,"div",0)(1,"nav",1)(2,"ol",2)(3,"li",3),e._UZ(4,"i",4),e._uU(5," Inicio"),e.qZA()()(),e.TgZ(6,"section",5)(7,"h1"),e._uU(8,"Inicio"),e.qZA(),e.TgZ(9,"div",6)(10,"div",7)(11,"div",8)(12,"h2",9),e._uU(13,"Bienvenida a mi declaraci\xf3n"),e.qZA(),e.TgZ(14,"p"),e._uU(15,"Como parte de las obligaciones que establece la Ley REP, los Productores deben informar la cantidad de EyE no domiciliarios (POM) puestos en el mercado el a\xf1o anterior."),e.qZA(),e.TgZ(16,"p"),e._uU(17,"ProREP pone a disposici\xf3n de sus socios la plataforma de declaraci\xf3n que dar\xe1 cumplimiento a la obligaci\xf3n de informar sus EyE."),e.qZA(),e.TgZ(18,"p"),e._uU(19,"La informaci\xf3n deber\xe1 subirse hasta el 15 de marzo del 2023."),e.qZA(),e.TgZ(20,"p"),e._uU(21,"En caso de tener dudas con respecto a su declaraci\xf3n puede ver los tutoriales y preguntas frecuentes."),e.qZA(),e.TgZ(22,"h2",9),e._uU(23,"Contacto:"),e.qZA(),e.TgZ(24,"p")(25,"strong"),e._uU(26,"\xbfAlguna pregunta?"),e.qZA(),e._uU(27," P\xf3ngase en contacto con nuestro equipo de atenci\xf3n al cliente."),e.qZA(),e.TgZ(28,"p"),e._uU(29,"Celular "),e.TgZ(30,"strong")(31,"a",10),e._uU(32,"+56 9 98172845"),e.qZA()(),e._uU(33," y mail "),e.TgZ(34,"strong")(35,"a",11),e._uU(36,"contacto@prorep.cl"),e.qZA()()()(),e.TgZ(37,"div",12)(38,"div",13)(39,"p"),e._uU(40,"Las tarifas por subcategor\xeda son de car\xe1cter anual por lo que estar\xe1n vigentes por todo el a\xf1o 2023."),e.qZA(),e.TgZ(41,"ul",14)(42,"li",15),e._uU(43,"Tarifas por tonelada (UF)"),e.qZA(),e.YNc(44,Z,5,2,"li",16),e.qZA()()()()()()()),2&t&&(e.xp6(44),e.Q6J("ngForOf",o.rates))},dependencies:[u.sg]}),n})();var r=l(433),b=l(5226),d=l.n(b),_=l(263);let A=(()=>{class n{constructor(t,o,i){this.fb=t,this.authService=o,this.router=i,this.pos="right",this.horaIngreso=new Date,this.formData=this.fb.group({actual:["",[r.kI.required]],password:["",[r.kI.required,r.kI.minLength(3)]],repeatPassword:["",[r.kI.required,r.kI.minLength(3)]]})}ngOnInit(){this.userData=JSON.parse(sessionStorage.getItem("user")),this.horaIngreso=new Date(sessionStorage.getItem("horaIngreso"))}btnrecovery(){const{actual:t,password:o,repeatPassword:i}=this.formData.value;this.authService.modifyPassword(o,i,t).subscribe({next:s=>{s.status?(d().fire({title:"Cambio de contrase\xf1a",text:"La contrase\xf1a fue cambiada exitosamente",icon:"success"}),this.router.navigate(["/auth/login"])):(d().fire({title:"Validar informaci\xf3n",text:s.msg,icon:"error"}),this.formData.reset())},error:s=>{d().fire({title:"Formato inv\xe1lido",text:"Contrase\xf1a debe contener al menos 8 caracteres",icon:"error"})}})}displayModifyPassword(){this.pos="right"==this.pos?"down":"right"}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(r.qu),e.Y36(_.e),e.Y36(p.F0))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-profile"]],decls:81,vars:16,consts:[[1,"container","mt-4"],[1,"mi-perfil"],[1,"box","box-mi-perfil","mb-5","d-flex","align-items-start"],[1,"list","list-data","list-data-title-green","column-md-2","gap-0","list-unstyled"],[1,"list-data__title"],[1,"list-data__text"],[1,"color-verde"],[1,"list","list-links","list-unstyled"],["id","accordionPanelsStayOpenExample",1,"accordion","accordion-flush"],[1,"accordion-item"],["id","panelsStayOpen-headingOne",1,"accordion-header"],["data-bs-toggle","collapse","data-bs-target","#panelsStayOpen-collapseOne",3,"click"],["aria-hidden","true"],["id","panelsStayOpen-collapseOne","aria-labelledby","panelsStayOpen-headingOne",1,"accordion-collapse","collapse"],[1,"accordion-body"],["autocomplete","off",1,"form-recovery",3,"formGroup"],[1,"mb-4"],[1,"input-group"],[1,"input-group-text","input-group-text-left"],["aria-hidden","true",1,"fa","fa-lock","fa-fw"],["type","password","id","password","formControlName","actual","placeholder","Contrase\xf1a actual",1,"form-control"],["type","password","id","password","formControlName","password","placeholder","Nueva contrase\xf1a",1,"form-control"],["type","password","id","repeatPassword","formControlName","repeatPassword","placeholder","Repetir contrase\xf1a",1,"form-control"],["type","button",1,"btn","btn-primary","btn-fa","w-100",3,"click"],["aria-hidden","true",1,"fa","fa-long-arrow-right","fa-fw"]],template:function(t,o){1&t&&(e.TgZ(0,"div",0)(1,"section",1)(2,"h1"),e._uU(3,"Mi Perfil"),e.qZA(),e.TgZ(4,"div",2)(5,"ul",3)(6,"li")(7,"span",4),e._uU(8,"Nombre Usuario"),e.qZA(),e.TgZ(9,"span",5),e._uU(10),e.qZA()(),e.TgZ(11,"li")(12,"span",4),e._uU(13,"Perfil"),e.qZA(),e.TgZ(14,"span",5),e._uU(15),e.qZA()(),e.TgZ(16,"li")(17,"span",4),e._uU(18,"Tel\xe9fono M\xf3vil"),e.qZA(),e.TgZ(19,"span",5),e._uU(20),e.qZA()(),e.TgZ(21,"li")(22,"span",4),e._uU(23,"Correo"),e.qZA(),e.TgZ(24,"span",5),e._uU(25),e.qZA()(),e.TgZ(26,"li")(27,"span",4),e._uU(28,"Instituci\xf3n"),e.qZA(),e.TgZ(29,"span",5),e._uU(30),e.qZA()(),e.TgZ(31,"li")(32,"span",4),e._uU(33,"Cargo"),e.qZA(),e.TgZ(34,"span",5),e._uU(35),e.qZA()(),e.TgZ(36,"li")(37,"span",4),e._uU(38,"Tel\xe9fono Oficina"),e.qZA(),e.TgZ(39,"span",5),e._uU(40),e.qZA()(),e.TgZ(41,"li")(42,"span",4)(43,"b"),e._uU(44,"Fecha/ Hora ingreso"),e.qZA()(),e.TgZ(45,"span",5),e._uU(46),e.ALo(47,"date"),e.qZA()()()(),e.TgZ(48,"h2",6),e._uU(49,"Acciones"),e.qZA(),e.TgZ(50,"ul",7)(51,"div",8)(52,"div",9)(53,"h2",10)(54,"li",11),e.NdJ("click",function(){return o.displayModifyPassword()}),e.TgZ(55,"a")(56,"span"),e._uU(57,"Cambio de contrase\xf1a"),e.qZA(),e._UZ(58,"i",12),e.qZA()()(),e.TgZ(59,"div",13)(60,"div",14)(61,"form",15)(62,"div",16)(63,"div",17)(64,"button",18),e._UZ(65,"i",19),e.qZA(),e._UZ(66,"input",20),e.qZA()(),e.TgZ(67,"div",16)(68,"div",17)(69,"button",18),e._UZ(70,"i",19),e.qZA(),e._UZ(71,"input",21),e.qZA()(),e.TgZ(72,"div",16)(73,"div",17)(74,"button",18),e._UZ(75,"i",19),e.qZA(),e._UZ(76,"input",22),e.qZA()(),e.TgZ(77,"div",16)(78,"button",23),e.NdJ("click",function(){return o.btnrecovery()}),e._uU(79," Enviar "),e._UZ(80,"i",24),e.qZA()()()()()()()()()()),2&t&&(e.xp6(10),e.AsE("",o.userData.FIRST_NAME," ",o.userData.LAST_NAME,""),e.xp6(5),e.Oqu(o.userData.ROL_NAME),e.xp6(5),e.Oqu(o.userData.PHONE),e.xp6(5),e.Oqu(o.userData.EMAIL),e.xp6(5),e.Oqu(o.userData.BUSINESS),e.xp6(5),e.Oqu(o.userData.POSITION),e.xp6(5),e.Oqu(o.userData.PHONE_OFFICE),e.xp6(6),e.Oqu(e.xi3(47,13,o.horaIngreso,"dd-MM-yyyy H:mm:s")),e.xp6(12),e.Gre("fa fa-chevron-",o.pos,""),e.xp6(3),e.Q6J("formGroup",o.formData))},dependencies:[r._Y,r.Fj,r.JJ,r.JL,r.sg,r.u,u.uU]}),n})();var E=l(371);function v(n,a){if(1&n&&(e.TgZ(0,"option",31),e._uU(1),e.qZA()),2&n){const t=a.$implicit;e.s9C("value",t),e.xp6(1),e.Oqu(t)}}function U(n,a){if(1&n&&(e.TgZ(0,"option",31),e._uU(1),e.qZA()),2&n){const t=a.$implicit;e.s9C("value",t),e.xp6(1),e.Oqu(t)}}function S(n,a){if(1&n&&(e.TgZ(0,"tr")(1,"td"),e._uU(2),e.qZA(),e.TgZ(3,"td"),e._uU(4),e.qZA(),e.TgZ(5,"td"),e._uU(6),e.ALo(7,"date"),e.qZA(),e.TgZ(8,"td"),e._UZ(9,"i",32),e.qZA()()),2&n){const t=a.$implicit;e.xp6(2),e.Oqu(t.NAME_BUSINESS),e.xp6(2),e.Oqu(t.AMOUNT.toFixed(2).replace(".",",")),e.xp6(2),e.Oqu(e.xi3(7,3,t.UPDATED_AT,"dd-MM-yyyy H:m:ss"))}}const q=function(n,a){return{"btn-info":n,"btn-primary":a}};function y(n,a){if(1&n){const t=e.EpF();e.TgZ(0,"li")(1,"button",33),e.NdJ("click",function(){const s=e.CHM(t).index,c=e.oxw();return e.KtG(c.pagTo(s))}),e._uU(2),e.qZA()()}if(2&n){const t=a.index,o=e.oxw();e.xp6(1),e.Q6J("ngClass",e.WLB(2,q,o.pos==t+1,o.pos!=t+1)),e.xp6(1),e.Oqu(t+1)}}const F=[{path:"",component:f.$,children:[{path:"home",component:T},{path:"form",component:g},{path:"profile",component:A},{path:"statements",component:(()=>{class n{constructor(t){this.productorService=t,this.dbStatements=[],this.db=[],this.pos=1,this.business_name=[],this.years=[],this.cant=0}ngOnInit(){this.loadStatements()}loadStatements(){this.productorService.getStatementByUser.subscribe(t=>{t.status&&(t.data=t.data.sort((o,i)=>i.YEAR_STATEMENT-o.YEAR_STATEMENT),t.data.forEach(o=>{-1==this.business_name.indexOf(o.NAME_BUSINESS)&&this.business_name.push(o.NAME_BUSINESS),-1==this.years.indexOf(o.YEAR_STATEMENT)&&this.years.push(o.YEAR_STATEMENT)}),this.years.sort((o,i)=>i-o),this.dbStatements=t.data,this.cant=Math.ceil(this.dbStatements.length/10),this.db=this.dbStatements.slice(0,10).sort((o,i)=>i.YEAR_STATEMENT-o.YEAR_STATEMENT))})}filter(){const t=document.getElementById("f_name").value,o=document.getElementById("f_year").value,i=this.dbStatements.filter(s=>{if("-1"!=t&&s.NAME_BUSINESS==t){if("-1"==o)return s;if(s.YEAR_STATEMENT==o)return s}if("-1"==t){if("-1"==o)return s;if(s.YEAR_STATEMENT==o)return s}});this.db=i.slice(0,10).sort((s,c)=>c.YEAR_STATEMENT-s.YEAR_STATEMENT),this.cant=Math.ceil(i.length/10)}reset(){this.loadStatements()}pagTo(t){this.pos=t+1,this.db=this.dbStatements.slice(10*t,10*(t+1)).sort((o,i)=>i.YEAR_STATEMENT-o.YEAR_STATEMENT)}next(){this.pos>=this.cant||(this.pos++,this.db=this.dbStatements.slice(10*(this.pos-1),10*this.pos).sort((t,o)=>o.YEAR_STATEMENT-t.YEAR_STATEMENT))}previus(){this.pos-1<=0||this.pos>=this.cant+1||(this.pos=this.pos-1,this.db=this.dbStatements.slice(10*(this.pos-1),10*this.pos).sort((t,o)=>o.YEAR_STATEMENT-t.YEAR_STATEMENT))}downloadPDF(t,o){d().fire({title:"Espere",text:"Generando PDF",showConfirmButton:!1}),d().showLoading(),this.productorService.downloadPDF(t,o).subscribe(i=>{const s=new Blob([i],{type:"application/pdf"});let c=document.createElement("a");c.href=window.URL.createObjectURL(s),c.download=`Reporte_${o}`,document.body.appendChild(c),c.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})),c.remove(),window.URL.revokeObjectURL(c.href),d().close()})}setArrayFromNumber(){return new Array(this.cant)}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(E.u))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-statements"]],decls:68,vars:4,consts:[[1,"container","mt-4"],["aria-label","breadcrumb",1,"breadcrumbs","d-none","d-lg-block"],[1,"breadcrumb"],[1,"breadcrumb-item"],["href","#"],["aria-hidden","true",1,"fa","fa-home"],["aria-current","page",1,"breadcrumb-item","active"],[1,"declaracion"],[1,"d-sm-flex","justify-content-between","mb-3","mb-md-0"],[1,"box","box-form","mb-4"],[1,"row","align-items-end"],[1,"col-12","col-xl-4","mb-3","mb-xl-0"],[1,"form-label"],[1,"input-group"],["id","f_name",1,"form-select"],["value","-1","selected",""],[3,"value",4,"ngFor","ngForOf"],[1,"col-12","col-xl-1","text-xl-center","mb-3","mb-xl-0"],[1,"mb-xl-2"],[1,"col-12","col-xl-3","mb-5","mb-xl-0"],["id","f_year",1,"form-select"],[1,"row"],[1,"col-6"],[1,"btn","btn-primary","col-12",3,"click"],[1,"table-responsive"],[1,"table","table-even","table-section","table-borderless","table-radius"],[1,"vertical-middle"],[4,"ngFor","ngForOf"],["aria-label","Navegaci\xf3n resultados"],[1,"pagination"],[1,"btn","btn-primary",3,"click"],[3,"value"],["aria-hidden","true",1,"fa","fa-eye","fa-lg","fa-fw","color-verde"],[1,"border","btn","btn-sm",3,"ngClass","click"]],template:function(t,o){1&t&&(e.TgZ(0,"div",0)(1,"nav",1)(2,"ol",2)(3,"li",3)(4,"a",4),e._UZ(5,"i",5),e._uU(6," Inicio"),e.qZA()(),e.TgZ(7,"li",6),e._uU(8,"Registro de Declaraci\xf3n"),e.qZA()()(),e.TgZ(9,"section",7)(10,"h1"),e._uU(11,"Registro de Declaraci\xf3n"),e.qZA(),e._UZ(12,"div",8),e.TgZ(13,"div",9)(14,"div",10)(15,"div",11)(16,"label",12),e._uU(17,"Empresa:"),e.qZA(),e.TgZ(18,"div",13)(19,"select",14)(20,"option",15),e._uU(21,"Todos"),e.qZA(),e.YNc(22,v,2,2,"option",16),e.qZA()()(),e.TgZ(23,"div",17)(24,"div",18),e._uU(25,"y/o"),e.qZA()(),e.TgZ(26,"div",19)(27,"label",12),e._uU(28,"A\xf1o:"),e.qZA(),e.TgZ(29,"div",13)(30,"select",20)(31,"option",15),e._uU(32,"Todos"),e.qZA(),e.YNc(33,U,2,2,"option",16),e.qZA()()(),e.TgZ(34,"div",11)(35,"div",21)(36,"div",22)(37,"button",23),e.NdJ("click",function(){return o.filter()}),e._uU(38,"Mostrar"),e.qZA()()()()()(),e.TgZ(39,"div",24)(40,"table",25)(41,"thead",26)(42,"tr")(43,"th"),e._uU(44,"Nombre Empresa"),e.qZA(),e.TgZ(45,"th"),e._uU(46,"Establecimiento"),e.qZA(),e.TgZ(47,"th"),e._uU(48,"Fecha declaraci\xf3n"),e.qZA(),e.TgZ(49,"th"),e._uU(50,"Ver detalle"),e.qZA()()(),e.TgZ(51,"tbody"),e.YNc(52,S,10,6,"tr",27),e.qZA()()(),e.TgZ(53,"nav",28)(54,"ul",29)(55,"li")(56,"button",30),e.NdJ("click",function(){return o.pagTo(0)}),e._uU(57,"Primero"),e.qZA()(),e.TgZ(58,"li")(59,"button",30),e.NdJ("click",function(){return o.previus()}),e._uU(60,"Anterior"),e.qZA()(),e.YNc(61,y,3,5,"li",27),e.TgZ(62,"li")(63,"button",30),e.NdJ("click",function(){return o.next()}),e._uU(64,"Siguiente"),e.qZA()(),e.TgZ(65,"li")(66,"button",30),e.NdJ("click",function(){return o.pagTo(o.cant-1)}),e._uU(67,"\xdaltimo"),e.qZA()()()()()()),2&t&&(e.xp6(22),e.Q6J("ngForOf",o.business_name),e.xp6(11),e.Q6J("ngForOf",o.years),e.xp6(19),e.Q6J("ngForOf",o.db),e.xp6(9),e.Q6J("ngForOf",o.setArrayFromNumber()))},dependencies:[u.mk,u.sg,r.YN,r.Kr,u.uU],styles:["[_nghost-%COMP%]{width:90%!important;padding:1%}"]}),n})()},{path:"**",redirectTo:"home",pathMatch:"full"}]}];let N=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[p.Bz.forChild(F),p.Bz]}),n})();var O=l(4466);let w=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[u.ez,N,O.m,r.u5,r.UX]}),n})()}}]);