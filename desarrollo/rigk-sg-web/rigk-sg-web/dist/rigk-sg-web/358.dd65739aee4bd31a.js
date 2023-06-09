"use strict";(self.webpackChunkrigk_sg_web=self.webpackChunkrigk_sg_web||[]).push([[358],{9821:(y,A,l)=>{l.d(A,{d:()=>e});var m=l(2340),T=l(8256),E=l(529);let e=(()=>{class p{constructor(a){this.http=a,this.url=`${m.N.API_V1_URL}/establishment`}getAllEstablishment(){return this.http.get(`${this.url}/all/`)}getInovice(a,_,f,d,b){return this.http.post(`${this.url}/get/invoice/`,{invoice_number:a,vat:_,treatment_type:f,material_type:d,id_business:b})}saveInvoice(a,_,f,d,b,F,C,q,N,S){const c=new FormData;return c.append("vat",a),c.append("id_business",_),c.append("invoice_number",f),c.append("id_detail",d),c.append("date_pr",b),c.append("value",F),c.append("valued_total",C),c.append("treatment",q),c.append("id_material",N),c.append("file",S,S.name),this.http.post(`${this.url}/invoice/`,c)}addEstablishment(a,_,f){return this.http.post(`${this.url}/add/`,{name:a,region:_,id_business:f})}deleteEstablishment(a){return this.http.delete(`${this.url}/delete/${a}`)}getEstablishment(a){return this.http.get(`${this.url}/${a}`)}getEstablishmentByID(a){return this.http.get(`${this.url}/get/${a}`)}getDeclarationEstablishment(){return this.http.get(`${this.url}/declaration/`)}}return p.\u0275fac=function(a){return new(a||p)(T.LFG(E.eN))},p.\u0275prov=T.Yz7({token:p,factory:p.\u0275fac,providedIn:"root"}),p})()},6358:(y,A,l)=>{l.r(A),l.d(A,{ManagerStatementModule:()=>Te});var m=l(6895),T=l(5792),E=l(4135),e=l(8256);let p=(()=>{class o{constructor(){}ngOnInit(){}}return o.\u0275fac=function(n){return new(n||o)},o.\u0275cmp=e.Xpm({type:o,selectors:[["app-home"]],decls:22,vars:0,consts:[["id","content"],["aria-label","breadcrumb",1,"breadcrumbs","d-none","d-lg-block"],[1,"breadcrumb"],["aria-current","page",1,"breadcrumb-item"],["aria-hidden","true",1,"fa","fa-home"],[1,"inicio"],[1,"box","box-inicio"],[1,"row"],[1,"col-12","col-md-8"],[1,"h1"],[2,"visibility","hidden"]],template:function(n,t){1&n&&(e.TgZ(0,"div",0)(1,"nav",1)(2,"ol",2)(3,"li",3),e._UZ(4,"i",4),e._uU(5," Inicio"),e.qZA()()(),e.TgZ(6,"section",5)(7,"h1"),e._uU(8,"Inicio"),e.qZA(),e.TgZ(9,"div",6)(10,"div",7)(11,"div",8)(12,"h2",9),e._uU(13,"Bienvenido/a a M\xf3dulo de Gestores"),e.qZA(),e.TgZ(14,"p",10),e._uU(15,"Como parte de las obligaciones que establece la Ley REP, los Productores deben informar la cantidad de EyE no domiciliarios (POM) puestos en el mercado el a\xf1o anterior."),e.qZA(),e.TgZ(16,"p",10),e._uU(17,"ProREP pone a disposici\xf3n de sus socios la plataforma de declaraci\xf3n que dar\xe1 cumplimiento a la obligaci\xf3n de informar sus EyE."),e.qZA(),e.TgZ(18,"p",10),e._uU(19,"La informaci\xf3n deber\xe1 subirse en los meses de enero y febrero."),e.qZA(),e.TgZ(20,"p",10),e._uU(21,"En caso de tener dudas con respecto a su declaraci\xf3n puede ver los tutoriales y preguntas frecuentes."),e.qZA()()()()()())}}),o})();var Z=l(5861),a=l(4006),_=l(3224),f=l(5226),d=l.n(f),b=l(371),F=l(9821),C=l(8195);function q(o,i){if(1&o&&(e.TgZ(0,"option",60),e._uU(1),e.qZA()),2&o){const n=i.$implicit;e.s9C("value",n),e.xp6(1),e.Oqu(n)}}function N(o,i){if(1&o&&(e.TgZ(0,"option",60),e._uU(1),e.qZA()),2&o){const n=i.$implicit;e.s9C("value",n),e.xp6(1),e.Oqu(n)}}function S(o,i){if(1&o&&(e.TgZ(0,"option",60),e._uU(1),e.qZA()),2&o){const n=i.$implicit;e.s9C("value",n),e.xp6(1),e.Oqu(n)}}function c(o,i){if(1&o&&(e.TgZ(0,"option",60),e._uU(1),e.qZA()),2&o){const n=i.$implicit;e.s9C("value",n),e.xp6(1),e.Oqu(n)}}function x(o,i){if(1&o&&(e.TgZ(0,"option",60),e._uU(1),e.qZA()),2&o){const n=i.$implicit,t=e.oxw();e.Q6J("value",n),e.xp6(1),e.Oqu(t.getStateText(n))}}function D(o,i){1&o&&(e.TgZ(0,"span"),e._uU(1,"Por aprobar"),e.qZA())}function M(o,i){1&o&&(e.TgZ(0,"span"),e._uU(1,"Aprobado"),e.qZA())}const O=function(o){return{"no-pointer":o}};function R(o,i){if(1&o){const n=e.EpF();e.TgZ(0,"tr")(1,"td"),e._uU(2),e.qZA(),e.TgZ(3,"td"),e._uU(4),e.qZA(),e.TgZ(5,"td"),e._uU(6),e.qZA(),e.TgZ(7,"td"),e._uU(8),e.qZA(),e.TgZ(9,"td"),e._uU(10),e.qZA(),e.TgZ(11,"td"),e._uU(12),e.ALo(13,"date"),e.qZA(),e.TgZ(14,"td"),e.YNc(15,D,2,0,"span",47),e.YNc(16,M,2,0,"span",47),e.qZA(),e.TgZ(17,"td"),e._uU(18),e.qZA(),e.TgZ(19,"td"),e._uU(20),e.qZA(),e.TgZ(21,"td")(22,"a",61),e.NdJ("click",function(){const r=e.CHM(n),s=r.index,u=r.$implicit,h=e.oxw();return e.KtG(h.handleClick(s,u.STATE_GESTOR))}),e._UZ(23,"i",62),e.qZA()()()}if(2&o){const n=i.$implicit,t=e.oxw();e.xp6(2),e.Oqu(n.NAME_BUSINESS),e.xp6(2),e.Oqu(n.NAME_ESTABLISHMENT_REGION),e.xp6(2),e.Oqu(n.TipoTratamiento),e.xp6(2),e.Oqu(n.PRECEDENCE),e.xp6(2),e.Oqu(n.TYPE_RESIDUE),e.xp6(2),e.Oqu(e.xi3(13,13,n.FechaRetiro,"dd-MM-yyyy")),e.xp6(3),e.Q6J("ngIf",0==n.STATE_GESTOR),e.xp6(1),e.Q6J("ngIf",0!=n.STATE_GESTOR),e.xp6(2),e.Oqu(t.replaceDot(n.VALUE)),e.xp6(2),e.Oqu(t.formatValue(n.VALUE_DECLARATE)),e.xp6(2),e.Q6J("ngClass",e.VKq(16,O,0!==n.STATE_GESTOR)),e.uIk("data-bs-target",0==n.STATE_GESTOR?"#infoModal":null),e.xp6(1),e.Q6J("ngClass",0==n.STATE_GESTOR?"color-verde-opaco":"color-verde")}}const J=function(o,i){return{"btn-info":o,"btn-primary":i}};function P(o,i){if(1&o){const n=e.EpF();e.TgZ(0,"li")(1,"button",63),e.NdJ("click",function(){const s=e.CHM(n).index,u=e.oxw();return e.KtG(u.pagTo(s))}),e._uU(2),e.qZA()()}if(2&o){const n=i.index,t=e.oxw();e.xp6(1),e.Q6J("ngClass",e.WLB(2,J,t.pos==n+1,t.pos!=n+1)),e.xp6(1),e.Oqu(n+1)}}function W(o,i){1&o&&(e.TgZ(0,"p"),e._uU(1,"Debe ingresar un n\xfamero de factura."),e.qZA())}function w(o,i){if(1&o&&(e.TgZ(0,"div",64),e.YNc(1,W,2,0,"p",47),e.qZA()),2&o){const n=e.oxw();e.xp6(1),e.Q6J("ngIf",n.userForm.controls.invoiceNumber.errors.required)}}function Y(o,i){1&o&&(e.TgZ(0,"p"),e._uU(1,"El rut de la empresa es requerido."),e.qZA())}function V(o,i){1&o&&(e.TgZ(0,"p"),e._uU(1,"El formato del RUT es inv\xe1lido (Sin puntos y con gui\xf3n)."),e.qZA())}function B(o,i){1&o&&(e.TgZ(0,"p"),e._uU(1,"El digito verificador es incorrecto. "),e.qZA())}function Q(o,i){if(1&o&&(e.TgZ(0,"div",46),e.YNc(1,Y,2,0,"p",47),e.YNc(2,V,2,0,"p",47),e.YNc(3,B,2,0,"p",47),e.qZA()),2&o){const n=e.oxw();e.xp6(1),e.Q6J("ngIf",n.userForm.controls.rut.errors.required),e.xp6(1),e.Q6J("ngIf",n.userForm.controls.rut.errors.pattern),e.xp6(1),e.Q6J("ngIf",n.userForm.controls.rut.errors.rut)}}function k(o,i){if(1&o&&(e.TgZ(0,"option",60),e._uU(1),e.qZA()),2&o){const n=i.$implicit;e.s9C("value",n.ID),e.xp6(1),e.Oqu(n.NAME)}}function L(o,i){1&o&&(e.TgZ(0,"p"),e._uU(1,"Rut no se encuentra registrado en el sistema. "),e.qZA())}function G(o,i){1&o&&(e.TgZ(0,"p"),e._uU(1,"El rut de la empresa es requerido."),e.qZA())}function $(o,i){if(1&o&&(e.TgZ(0,"div",46),e.YNc(1,G,2,0,"p",47),e.qZA()),2&o){const n=e.oxw();e.xp6(1),e.Q6J("ngIf",n.userForm.controls.treatmentType.errors.required)}}function z(o,i){1&o&&(e.TgZ(0,"p"),e._uU(1,"El rut de la empresa es requerido."),e.qZA())}function H(o,i){if(1&o&&(e.TgZ(0,"div",46),e.YNc(1,z,2,0,"p",47),e.qZA()),2&o){const n=e.oxw();e.xp6(1),e.Q6J("ngIf",n.userForm.controls.material.errors.required)}}function j(o,i){1&o&&(e.TgZ(0,"p"),e._uU(1,"Debe ingresar una fecha."),e.qZA())}function K(o,i){1&o&&(e.TgZ(0,"p"),e._uU(1,"La fecha no puede ser futura."),e.qZA())}function X(o,i){if(1&o&&(e.TgZ(0,"div",64),e.YNc(1,j,2,0,"p",47),e.YNc(2,K,2,0,"p",47),e.qZA()),2&o){const n=e.oxw();e.xp6(1),e.Q6J("ngIf",n.userForm.controls.entryDate.errors.required),e.xp6(1),e.Q6J("ngIf",n.userForm.controls.entryDate.errors.futureDate)}}function ee(o,i){1&o&&(e.TgZ(0,"p"),e._uU(1,"Debe ingresar un peso total."),e.qZA())}function te(o,i){1&o&&(e.TgZ(0,"p"),e._uU(1,"Debe ingresar un n\xfamero v\xe1lido (con coma)."),e.qZA())}function ne(o,i){1&o&&(e.TgZ(0,"p"),e._uU(1,"El valor debe ser mayor que cero."),e.qZA())}function oe(o,i){if(1&o&&(e.TgZ(0,"div",64),e.YNc(1,ee,2,0,"p",47),e.YNc(2,te,2,0,"p",47),e.YNc(3,ne,2,0,"p",47),e.qZA()),2&o){const n=e.oxw();e.xp6(1),e.Q6J("ngIf",n.userForm.controls.totalWeight.errors.required),e.xp6(1),e.Q6J("ngIf",n.userForm.controls.totalWeight.errors.pattern),e.xp6(1),e.Q6J("ngIf",n.userForm.controls.totalWeight.errors.minStringValue)}}function re(o,i){1&o&&(e.TgZ(0,"p"),e._uU(1,"Debe ingresar un peso valorizado."),e.qZA())}function ie(o,i){1&o&&(e.TgZ(0,"p"),e._uU(1,"Debe ingresar un n\xfamero v\xe1lido (Con coma)."),e.qZA())}function ae(o,i){1&o&&(e.TgZ(0,"p"),e._uU(1,"El valor debe ser mayor que cero."),e.qZA())}function se(o,i){if(1&o&&(e.TgZ(0,"div",64),e.YNc(1,re,2,0,"p",47),e.YNc(2,ie,2,0,"p",47),e.YNc(3,ae,2,0,"p",47),e.qZA()),2&o){const n=e.oxw();e.xp6(1),e.Q6J("ngIf",n.userForm.controls.valuedWeight.errors.required),e.xp6(1),e.Q6J("ngIf",n.userForm.controls.valuedWeight.errors.pattern),e.xp6(1),e.Q6J("ngIf",n.userForm.controls.valuedWeight.errors.minStringValue)}}function le(o,i){1&o&&(e.TgZ(0,"div",46)(1,"p"),e._uU(2,"El peso remanente no puede ser menor que cero."),e.qZA()())}function ue(o,i){1&o&&(e.TgZ(0,"p"),e._uU(1,"El formato del archivo debe ser PDF, JPEG o JPG."),e.qZA())}function ce(o,i){1&o&&(e.TgZ(0,"p"),e._uU(1,"El tama\xf1o del archivo no debe superar 1 MB."),e.qZA())}function de(o,i){if(1&o&&(e.TgZ(0,"div",46),e.YNc(1,ue,2,0,"p",47),e.YNc(2,ce,2,0,"p",47),e.qZA()),2&o){const n=e.oxw();e.xp6(1),e.Q6J("ngIf",n.userForm.controls.attachment.errors.invalidFileType),e.xp6(1),e.Q6J("ngIf",n.userForm.controls.attachment.errors.invalidFileSize)}}let me=(()=>{class o{constructor(n,t,r,s){this.productorService=n,this.establishmentService=t,this.businessService=r,this.fb=s,this.disableWeightFields=!0,this.dbStatements=[],this.db=[],this.pos=1,this.business_name=[],this.establishment_name=[],this.material_name=[],this.treatment_name=[],this.years=[],this.state=[],this.cant=0,this.filteredStatements=[],this.selectedBusiness="-1",this.selectedMaterial="-1",this.selectedYear="-1",this.selectedTreatment="-1",this.selectedState="-1",this.autoFilter=!0,this.isRemainingWeightNegative=!1,this.index=0,this.userForm=this.fb.group({invoiceNumber:["",[a.kI.required]],rut:["",[a.kI.required,a.kI.pattern("^[0-9]{1,2}[0-9]{3}[0-9]{3}-[0-9Kk]{1}$"),this.verifyRut]],reciclador:["0",[a.kI.required]],treatmentType:["",[a.kI.required]],material:["",[a.kI.required]],entryDate:["",[a.kI.required,this.pastDateValidator()]],totalWeight:["",[a.kI.required,this.minStringValue(0),a.kI.pattern(/^[0-9]+(,[0-9]+)?$/)]],declarateWeight:[""],valuedWeight:["",[a.kI.required,this.minStringValue(0),a.kI.pattern(/^[0-9]+(,[0-9]+)?$/)]],remainingWeight:[""],asoc:[""],declarated:[""],attachment:[null,[a.kI.required,this.fileTypeValidator,this.fileSizeValidator]]}),this.dbBusiness=[],this.businessNoFound=!1}ngOnInit(){this.userData=JSON.parse(sessionStorage.getItem("user")),this.loadStatements().then(()=>{this.filter(),this.pagTo(this.pos-1)}),this.userForm.controls.valuedWeight.disable(),this.userForm.controls.totalWeight.disable(),this.userForm.controls.reciclador.disable()}loadStatements(){return new Promise(n=>{d().fire({title:"Cargando Datos",text:"Se est\xe1n recuperando datos",timerProgressBar:!0,showConfirmButton:!1,allowEscapeKey:!1,allowOutsideClick:!1}),d().showLoading(),this.establishmentService.getDeclarationEstablishment().subscribe(t=>{t.status&&(t.status=t.status.sort((r,s)=>{const u=new Date(s.FechaRetiro).getTime()-new Date(r.FechaRetiro).getTime();return 0===u?s.ID_DETAIL-r.ID_DETAIL:u}),t.status.forEach(r=>{-1==this.business_name.indexOf(r.NAME_BUSINESS)&&this.business_name.push(r.NAME_BUSINESS),-1==this.establishment_name.indexOf(r.NAME_ESTABLISHMENT_REGION)&&this.establishment_name.push(r.NAME_ESTABLISHMENT_REGION),-1==this.years.indexOf(r.FechaRetiroTipeada)&&this.years.push(r.FechaRetiroTipeada),-1==this.material_name.indexOf(r.PRECEDENCE)&&this.material_name.push(r.PRECEDENCE),-1==this.treatment_name.indexOf(r.TipoTratamiento)&&this.treatment_name.push(r.TipoTratamiento),-1==this.state.indexOf(r.STATE_GESTOR)&&this.state.push(r.STATE_GESTOR)}),this.years.sort((r,s)=>s-r),this.dbStatements=t.status,this.cant=Math.ceil(this.dbStatements.length/10),this.db=this.dbStatements.slice(10*(this.pos-1),10*this.pos).sort((r,s)=>{const u=new Date(s.FechaRetiro).getTime()-new Date(r.FechaRetiro).getTime();return 0===u?s.ID_DETAIL-r.ID_DETAIL:u}),d().close()),n()})})}filter(n=!1){n&&!this.autoFilter||(this.filteredStatements=this.dbStatements.filter(t=>!("-1"!==this.selectedBusiness&&t.NAME_BUSINESS!==this.selectedBusiness||"-1"!==this.selectedMaterial&&t.PRECEDENCE!==this.selectedMaterial||"-1"!==this.selectedTreatment&&t.TipoTratamiento!==this.selectedTreatment||"-1"!==this.selectedYear&&t.FechaRetiroTipeada!==this.selectedYear||"-1"!==this.selectedState&&parseInt(t.STATE_GESTOR)!==parseInt(this.selectedState))),this.db=this.filteredStatements.slice(0,10).sort((t,r)=>{const s=new Date(r.FechaRetiro).getTime()-new Date(t.FechaRetiro).getTime();return 0===s?r.ID_DETAIL-t.ID_DETAIL:s}),this.cant=Math.ceil(this.filteredStatements.length/10))}updateFilters(){this.business_name=this.dbStatements.filter(n=>!("-1"!==this.selectedTreatment&&n.TipoTratamiento!==this.selectedTreatment||"-1"!==this.selectedMaterial&&n.PRECEDENCE!==this.selectedMaterial||"-1"!==this.selectedYear&&n.FechaRetiroTipeada!==this.selectedYear||"-1"!==this.selectedState&&parseInt(n.STATE_GESTOR)!==parseInt(this.selectedState)&&void 0!==n.STATE_GESTOR)).map(n=>n.NAME_BUSINESS).filter((n,t,r)=>r.indexOf(n)===t),this.treatment_name=this.dbStatements.filter(n=>!("-1"!==this.selectedBusiness&&n.NAME_BUSINESS!==this.selectedBusiness||"-1"!==this.selectedMaterial&&n.PRECEDENCE!==this.selectedMaterial||"-1"!==this.selectedYear&&n.FechaRetiroTipeada!==this.selectedYear||"-1"!==this.selectedState&&parseInt(n.STATE_GESTOR)!==parseInt(this.selectedState)&&void 0!==n.STATE_GESTOR)).map(n=>n.TipoTratamiento).filter((n,t,r)=>r.indexOf(n)===t),this.material_name=this.dbStatements.filter(n=>!("-1"!==this.selectedBusiness&&n.NAME_BUSINESS!==this.selectedBusiness||"-1"!==this.selectedTreatment&&n.TipoTratamiento!==this.selectedTreatment||"-1"!==this.selectedYear&&n.FechaRetiroTipeada!==this.selectedYear||"-1"!==this.selectedState&&parseInt(n.STATE_GESTOR)!==parseInt(this.selectedState)&&void 0!==n.STATE_GESTOR)).map(n=>n.PRECEDENCE).filter((n,t,r)=>r.indexOf(n)===t),this.years=this.dbStatements.filter(n=>!("-1"!==this.selectedBusiness&&n.NAME_BUSINESS!==this.selectedBusiness||"-1"!==this.selectedTreatment&&n.TipoTratamiento!==this.selectedTreatment||"-1"!==this.selectedMaterial&&n.PRECEDENCE!==this.selectedMaterial||"-1"!==this.selectedState&&parseInt(n.STATE_GESTOR)!==parseInt(this.selectedState)&&void 0!==n.STATE_GESTOR)).map(n=>n.FechaRetiroTipeada).filter((n,t,r)=>r.indexOf(n)===t).sort((n,t)=>t-n),this.state=this.dbStatements.filter(n=>!("-1"!==this.selectedBusiness&&n.NAME_BUSINESS!==this.selectedBusiness||"-1"!==this.selectedTreatment&&n.TipoTratamiento!==this.selectedTreatment||"-1"!==this.selectedMaterial&&n.PRECEDENCE!==this.selectedMaterial||"-1"!==this.selectedYear&&n.FechaRetiroTipeada!==this.selectedYear)).map(n=>parseInt(n.STATE_GESTOR)).filter((n,t,r)=>r.indexOf(n)===t)}reset(){this.loadStatements().then(()=>{this.filter(),this.pagTo(this.pos-1)}),this.userForm.reset({reciclador:"0"})}pagTo(n){this.pos=n+1,this.db=this.filteredStatements.slice(10*n,10*(n+1)).sort((t,r)=>{const s=new Date(r.FechaRetiro).getTime()-new Date(t.FechaRetiro).getTime();return 0===s?r.ID_DETAIL-t.ID_DETAIL:s})}next(){this.pos>=this.cant||(this.pos++,this.db=this.filteredStatements.slice(10*(this.pos-1),10*this.pos).sort((n,t)=>{const r=new Date(t.FechaRetiro).getTime()-new Date(n.FechaRetiro).getTime();return 0===r?t.ID_DETAIL-n.ID_DETAIL:r}))}previus(){this.pos-1<=0||this.pos>=this.cant+1||(this.pos=this.pos-1,this.db=this.filteredStatements.slice(10*(this.pos-1),10*this.pos).sort((n,t)=>{const r=new Date(t.FechaRetiro).getTime()-new Date(n.FechaRetiro).getTime();return 0===r?t.ID_DETAIL-n.ID_DETAIL:r}))}setArrayFromNumber(){return new Array(this.cant)}getStateText(n){return 0===n?"Por aprobar":"Aprobado"}handleClick(n,t){this.dbBusiness=[],0===t&&(this.onMaterialTreatmentChange(n),this.index=n)}fileTypeValidator(n){const t=n.value;return t&&!["application/pdf","image/jpeg"].includes(t.type)?{invalidFileType:!0}:null}fileSizeValidator(n){const t=n.value;return t&&t.size>1048576?{invalidFileSize:!0}:null}onFileSelected(n){const t=n.target;if(t&&t.files&&t.files.length>0){const r=t.files[0];this.fileName=r.name,this.fileBuffer=r,this.selectedFile=t.files[0];const s=["pdf","jpeg","jpg"],u=this.selectedFile.name.split(".").pop()?.toLowerCase()||"";s.includes(u)?r.size>1048576?(this.userForm.controls.attachment.setErrors({invalidFileSize:!0}),this.userForm.controls.attachment.markAsTouched()):(this.userForm.controls.attachment.setErrors(null),this.userForm.controls.attachment.markAsTouched()):(this.userForm.controls.attachment.setErrors({invalidFileType:!0}),this.userForm.controls.attachment.markAsTouched())}else this.selectedFile=null}saveInvoice(n){var t=this;return(0,Z.Z)(function*(){if(t.selectedFile){const{rut:r,invoiceNumber:s,entryDate:u,valuedWeight:h,reciclador:v}=t.userForm.value,g=t.userForm.controls.totalWeight.value,U=t.db[n].TREATMENT_TYPE_NUMBER,Ze=t.db[n].PRECEDENCE_NUMBER,ve=t.db[n].ID_DETAIL;try{(yield t.establishmentService.saveInvoice(r,v,s,ve,u,h.replace(",","."),g.replace(",","."),U,Ze,t.selectedFile).toPromise()).status&&setTimeout((0,Z.Z)(function*(){yield d().fire({title:"La factura fue guardada exitosamente",text:"",icon:"success",showConfirmButton:!0})}),1500)}catch(I){console.error("Error:",I)}}else console.error("No file selected")})()}onChangeVAT(n){this.dbBusiness=[],this.businessService.getBusinessByVAT(n.value).subscribe(t=>{this.dbBusiness=t.status||[],this.userForm.controls.reciclador.enable(),this.businessNoFound=!1,0==this.dbBusiness.length&&(this.businessNoFound=!0,this.userForm.controls.reciclador.disable(),this.userForm.controls.reciclador.setValue("0"))})}formatNumber(n){return null==n?"":Number.isInteger(n)?n.toString():n.toLocaleString("es")}onRUTChange(n){var t=this;return(0,Z.Z)(function*(){const r=t.userForm.controls.rut.value,s=t.userForm.controls.invoiceNumber.value,u=t.db[n].TREATMENT_TYPE_NUMBER,h=t.db[n].PRECEDENCE_NUMBER,v=t.userForm.value.reciclador;if(r)try{const g=yield t.establishmentService.getInovice(s,r,u,h,v).toPromise();g.status?(t.userForm.controls.totalWeight.setValue(t.formatNumber(g.data[0]?.invoice_value)),t.userForm.controls.declarateWeight.setValue(t.formatNumber(g.data[0].value_declarated)),t.userForm.controls.asoc.setValue(g.data[0].num_asoc+1),parseInt(t.userForm.controls.asoc.value||"0")>1?s?t.userForm.controls.valuedWeight.enable():t.userForm.controls.valuedWeight.disable():s?(t.userForm.controls.valuedWeight.enable(),t.userForm.controls.totalWeight.enable()):(t.userForm.controls.valuedWeight.disable(),t.userForm.controls.totalWeight.disable())):(d().fire({icon:"error",text:g.msg}),t.userForm.controls.totalWeight.setValue(""),t.userForm.controls.declarateWeight.setValue(""),t.userForm.controls.asoc.setValue(""),t.userForm.controls.remainingWeight.setValue(""),t.userForm.controls.valuedWeight.disable(),t.userForm.controls.totalWeight.disable())}catch{t.userForm.controls.totalWeight.setValue(""),t.userForm.controls.declarateWeight.setValue(""),t.userForm.controls.asoc.setValue(""),t.userForm.controls.remainingWeight.setValue(""),t.userForm.controls.valuedWeight.disable(),t.userForm.controls.totalWeight.disable()}else t.userForm.controls.totalWeight.setValue(""),t.userForm.controls.declarateWeight.setValue(""),t.userForm.controls.asoc.setValue(""),t.userForm.controls.remainingWeight.setValue(""),t.userForm.controls.valuedWeight.disable(),t.userForm.controls.totalWeight.disable();t.userForm.controls.valuedWeight.updateValueAndValidity(),t.userForm.controls.totalWeight.updateValueAndValidity()})()}onMaterialTreatmentChange(n){var t=this;return(0,Z.Z)(function*(){t.userForm.controls.treatmentType.setValue(t.db[n].TipoTratamiento),t.userForm.controls.material.setValue(t.db[n].PRECEDENCE),t.userForm.controls.declarated.setValue(t.db[n].VALUE?.toString().replace(".",","))})()}verifyRut(n){return(0,_.validate)(n.value)?null:{rut:!0}}isTotalWeightEditable(){return!!this.userForm.controls.invoiceNumber.value&&!!this.userForm.controls.rut.value}getNumericValue(n){return n&&n.value?+n.value.toString().replace(",","."):0}calculateRemainingWeight(){const n=this.userForm.get("totalWeight"),t=this.userForm.get("valuedWeight"),r=this.userForm.get("declarateWeight"),v=this.getNumericValue(n)-this.getNumericValue(t)-this.getNumericValue(r);return this.isRemainingWeightNegative=v<0,v.toFixed(2).replace(".",",")}replaceDot(n){return 2==n.toString().split(".").length?n&&parseFloat(n).toFixed(2).replace(".",","):n&&n.toString().replace(".",",")}minStringValue(n){return t=>{if(!t.value)return null;const r=parseFloat(t.value.replace(",","."));return isNaN(r)||r<=n?{minStringValue:{value:t.value}}:null}}formatValue(n){return null==n?"":n%1==0?n.toString():n.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})}pastDateValidator(){return n=>{const t=new Date(n.value),r=new Date;return r.setHours(0,0,0,0),t>r?{futureDate:{value:n.value}}:null}}}return o.\u0275fac=function(n){return new(n||o)(e.Y36(b.u),e.Y36(F.d),e.Y36(C.m),e.Y36(a.qu))},o.\u0275cmp=e.Xpm({type:o,selectors:[["app-statements"]],decls:190,vars:28,consts:[[1,"container","mt-4"],["aria-label","breadcrumb",1,"breadcrumbs","d-none","d-lg-block"],[1,"breadcrumb"],[1,"breadcrumb-item"],["href","#"],["aria-hidden","true",1,"fa","fa-home"],["aria-current","page",1,"breadcrumb-item","active"],[1,"declaracion"],[1,"box","box-form","mb-4"],[1,"row","align-items-end"],[1,"col-12","col-xl-2","mb-3","mb-xl-0"],[1,"form-label"],[1,"input-group"],["id","f_name",1,"form-select",3,"ngModel","ngModelChange","change"],["value","-1","selected",""],[3,"value",4,"ngFor","ngForOf"],["id","f_establishment",1,"form-select",3,"ngModel","ngModelChange","change"],["id","f_material",1,"form-select",3,"ngModel","ngModelChange","change"],["id","f_year",1,"form-select",3,"ngModel","ngModelChange","change"],["id","f_state",1,"form-select",3,"ngModel","ngModelChange","change"],[1,"btn","btn-primary","w-100",3,"click"],[1,"table-responsive"],[1,"table","table-even","table-section","table-borderless","table-radius"],[1,"vertical-middle"],[4,"ngFor","ngForOf"],["aria-label","Navegaci\xf3n resultados"],[1,"pagination"],[1,"btn","btn-primary",3,"click"],["id","infoModal","tabindex","-1","aria-labelledby","exampleModalLabel","aria-hidden","true",1,"modal","fade",3,"hidden.bs.modal"],[1,"modal-dialog","modal-lg"],[1,"modal-content"],[1,"modal-header"],["id","exampleModalLabel",1,"modal-title","fs-5"],["type","button","data-bs-dismiss","modal","aria-label","Close",1,"btn-close"],[1,"modal-body"],[3,"formGroup"],["miFormulario","ngForm"],[1,"row","mb-3"],[1,"col-sm-4","col-form-label"],[1,"col-sm-8"],["type","text","placeholder","1234","formControlName","invoiceNumber",1,"form-control",3,"input"],["class","text-danger",4,"ngIf"],["type","text","placeholder","1-9","formControlName","rut",1,"form-control",3,"readonly","change"],["class","text-danger pl-0",4,"ngIf"],["formControlName","reciclador",1,"form-select",3,"disabled","change"],["value","0"],[1,"text-danger","pl-0"],[4,"ngIf"],["type","text","placeholder","Tipo tratamiento","formControlName","treatmentType","readonly","",1,"form-control"],["type","text","placeholder","Tipo material","formControlName","material","readonly","",1,"form-control"],["type","date","placeholder","10/4/2023","formControlName","entryDate",1,"form-control"],["type","text","formControlName","totalWeight",1,"form-control"],["type","text","formControlName","declarated","readonly","",1,"form-control"],["type","text","formControlName","valuedWeight",1,"form-control"],["type","text","formControlName","remainingWeight","readonly","",1,"form-control",3,"value"],["type","text","formControlName","asoc","readonly","",1,"form-control"],["type","file","formControlName","attachment","id","inp_attachment","accept","application/pdf, image/jpeg","required","",1,"form-control",3,"change"],[1,"modal-footer"],["type","button","data-bs-dismiss","modal",1,"btn","btn-secondary",3,"click"],["type","button","data-bs-dismiss","modal",1,"btn","btn-primary",3,"disabled","click"],[3,"value"],["data-bs-toggle","modal",1,"custom-cursor",3,"ngClass","click"],["aria-hidden","true",1,"fa","fa-check","fa-lg","fa-fw",3,"ngClass"],[1,"border","btn","btn-sm",3,"ngClass","click"],[1,"text-danger"]],template:function(n,t){1&n&&(e.TgZ(0,"div",0)(1,"nav",1)(2,"ol",2)(3,"li",3)(4,"a",4),e._UZ(5,"i",5),e._uU(6," Inicio"),e.qZA()(),e.TgZ(7,"li",6),e._uU(8,"Consulta de Declaraci\xf3n"),e.qZA()()(),e.TgZ(9,"section",7)(10,"h1"),e._uU(11,"Consulta de Declaraci\xf3n"),e.qZA(),e.TgZ(12,"div",8)(13,"div",9)(14,"div",10)(15,"label",11),e._uU(16,"Empresa CI:"),e.qZA(),e.TgZ(17,"div",12)(18,"select",13),e.NdJ("ngModelChange",function(s){return t.selectedBusiness=s})("change",function(){return t.updateFilters()}),e.TgZ(19,"option",14),e._uU(20,"Todos"),e.qZA(),e.YNc(21,q,2,2,"option",15),e.qZA()()(),e.TgZ(22,"div",10)(23,"label",11),e._uU(24,"Tipo de tratamiento:"),e.qZA(),e.TgZ(25,"div",12)(26,"select",16),e.NdJ("ngModelChange",function(s){return t.selectedTreatment=s})("change",function(){return t.updateFilters()}),e.TgZ(27,"option",14),e._uU(28,"Todos"),e.qZA(),e.YNc(29,N,2,2,"option",15),e.qZA()()(),e.TgZ(30,"div",10)(31,"label",11),e._uU(32,"Material:"),e.qZA(),e.TgZ(33,"div",12)(34,"select",17),e.NdJ("ngModelChange",function(s){return t.selectedMaterial=s})("change",function(){return t.updateFilters()}),e.TgZ(35,"option",14),e._uU(36,"Todos"),e.qZA(),e.YNc(37,S,2,2,"option",15),e.qZA()()(),e.TgZ(38,"div",10)(39,"label",11),e._uU(40,"Fecha de retiro:"),e.qZA(),e.TgZ(41,"div",12)(42,"select",18),e.NdJ("ngModelChange",function(s){return t.selectedYear=s})("change",function(){return t.updateFilters()}),e.TgZ(43,"option",14),e._uU(44,"Todos"),e.qZA(),e.YNc(45,c,2,2,"option",15),e.qZA()()(),e.TgZ(46,"div",10)(47,"label",11),e._uU(48,"Estado:"),e.qZA(),e.TgZ(49,"div",12)(50,"select",19),e.NdJ("ngModelChange",function(s){return t.selectedState=s})("change",function(){return t.updateFilters()}),e.TgZ(51,"option",14),e._uU(52,"Todos"),e.qZA(),e.YNc(53,x,2,2,"option",15),e.qZA()()(),e.TgZ(54,"div",10)(55,"label",11),e._uU(56,"\xa0"),e.qZA(),e.TgZ(57,"div",12)(58,"button",20),e.NdJ("click",function(){return t.autoFilter=!1,t.filter(),t.pagTo(0)}),e._uU(59,"Mostrar"),e.qZA()()()()(),e.TgZ(60,"div",21)(61,"table",22)(62,"thead",23)(63,"tr")(64,"th"),e._uU(65,"Empresa CI"),e.qZA(),e.TgZ(66,"th"),e._uU(67,"Establecimiento CI"),e.qZA(),e.TgZ(68,"th"),e._uU(69,"Tipo de tratamiento"),e.qZA(),e.TgZ(70,"th"),e._uU(71,"Material"),e.qZA(),e.TgZ(72,"th"),e._uU(73,"Subtipo"),e.qZA(),e.TgZ(74,"th"),e._uU(75,"Fecha Retiro"),e.qZA(),e.TgZ(76,"th"),e._uU(77,"Estado"),e.qZA(),e.TgZ(78,"th"),e._uU(79,"Peso Declarado"),e.qZA(),e.TgZ(80,"th"),e._uU(81,"Peso Valorizado"),e.qZA(),e.TgZ(82,"th"),e._uU(83,"Aprobar"),e.qZA()()(),e.TgZ(84,"tbody"),e.YNc(85,R,24,18,"tr",24),e.qZA()()(),e.TgZ(86,"nav",25)(87,"ul",26)(88,"li")(89,"button",27),e.NdJ("click",function(){return t.pagTo(0)}),e._uU(90,"Primero"),e.qZA()(),e.TgZ(91,"li")(92,"button",27),e.NdJ("click",function(){return t.previus()}),e._uU(93,"Anterior"),e.qZA()(),e.YNc(94,P,3,5,"li",24),e.TgZ(95,"li")(96,"button",27),e.NdJ("click",function(){return t.next()}),e._uU(97,"Siguiente"),e.qZA()(),e.TgZ(98,"li")(99,"button",27),e.NdJ("click",function(){return t.pagTo(t.cant-1)}),e._uU(100,"\xdaltimo"),e.qZA()()()()()(),e.TgZ(101,"div",28),e.NdJ("hidden.bs.modal",function(){return t.reset()}),e.TgZ(102,"div",29)(103,"div",30)(104,"div",31)(105,"h1",32),e._uU(106,"Asignar factura reciclador"),e.qZA(),e._UZ(107,"button",33),e.qZA(),e.TgZ(108,"div",34)(109,"form",35,36)(111,"div",37)(112,"label",38),e._uU(113,"N\xfam. Factura Reciclador"),e.qZA(),e.TgZ(114,"div",39)(115,"input",40),e.NdJ("input",function(){return t.onRUTChange(t.index)}),e.qZA(),e.YNc(116,w,2,1,"div",41),e.qZA()(),e.TgZ(117,"div",37)(118,"label",38),e._uU(119,"RUT Reciclador"),e.qZA(),e.TgZ(120,"div",39)(121,"input",42),e.NdJ("change",function(s){return t.onChangeVAT(s.target)}),e.qZA(),e.YNc(122,Q,4,3,"div",43),e.qZA()(),e.TgZ(123,"div",37)(124,"label",38),e._uU(125,"Reciclador"),e.qZA(),e.TgZ(126,"div",39)(127,"select",44),e.NdJ("change",function(){return t.onRUTChange(t.index)}),e.TgZ(128,"option",45),e._uU(129,"Seleccione Reciclador"),e.qZA(),e.YNc(130,k,2,2,"option",15),e.qZA(),e.TgZ(131,"div",46),e.YNc(132,L,2,0,"p",47),e.qZA()()(),e.TgZ(133,"div",37)(134,"label",38),e._uU(135,"Tipo Tratamiento"),e.qZA(),e.TgZ(136,"div",39),e._UZ(137,"input",48),e.YNc(138,$,2,1,"div",43),e.qZA()(),e.TgZ(139,"div",37)(140,"label",38),e._uU(141,"Material"),e.qZA(),e.TgZ(142,"div",39),e._UZ(143,"input",49),e.YNc(144,H,2,1,"div",43),e.qZA()(),e.TgZ(145,"div",37)(146,"label",38),e._uU(147,"Fecha Ingreso PR"),e.qZA(),e.TgZ(148,"div",39),e._UZ(149,"input",50),e.YNc(150,X,3,2,"div",41),e.qZA()(),e.TgZ(151,"div",37)(152,"label",38),e._uU(153,"Peso Total"),e.qZA(),e.TgZ(154,"div",39),e._UZ(155,"input",51),e.YNc(156,oe,4,3,"div",41),e.qZA()(),e.TgZ(157,"div",37)(158,"label",38),e._uU(159,"Peso Declarado"),e.qZA(),e.TgZ(160,"div",39),e._UZ(161,"input",52),e.qZA()(),e.TgZ(162,"div",37)(163,"label",38),e._uU(164,"Peso Valorizado"),e.qZA(),e.TgZ(165,"div",39),e._UZ(166,"input",53),e.YNc(167,se,4,3,"div",41),e.qZA()(),e.TgZ(168,"div",37)(169,"label",38),e._uU(170,"Peso Remanente"),e.qZA(),e.TgZ(171,"div",39),e._UZ(172,"input",54),e.YNc(173,le,3,0,"div",43),e.qZA()(),e.TgZ(174,"div",37)(175,"label",38),e._uU(176,"Num. Declaraciones asociadas"),e.qZA(),e.TgZ(177,"div",39),e._UZ(178,"input",55),e.qZA()(),e.TgZ(179,"div",37)(180,"label",38),e._uU(181,"Adjuntar"),e.qZA(),e.TgZ(182,"div",39)(183,"input",56),e.NdJ("change",function(s){return t.onFileSelected(s)}),e.qZA(),e.YNc(184,de,3,2,"div",43),e.qZA()()()(),e.TgZ(185,"div",57)(186,"button",58),e.NdJ("click",function(){return t.userForm.reset({reciclador:"0"})}),e._uU(187,"Volver"),e.qZA(),e.TgZ(188,"button",59),e.NdJ("click",function(){return t.saveInvoice(t.index)}),e._uU(189,"Guardar"),e.qZA()()()()()),2&n&&(e.xp6(18),e.Q6J("ngModel",t.selectedBusiness),e.xp6(3),e.Q6J("ngForOf",t.business_name),e.xp6(5),e.Q6J("ngModel",t.selectedTreatment),e.xp6(3),e.Q6J("ngForOf",t.treatment_name),e.xp6(5),e.Q6J("ngModel",t.selectedMaterial),e.xp6(3),e.Q6J("ngForOf",t.material_name),e.xp6(5),e.Q6J("ngModel",t.selectedYear),e.xp6(3),e.Q6J("ngForOf",t.years),e.xp6(5),e.Q6J("ngModel",t.selectedState),e.xp6(3),e.Q6J("ngForOf",t.state),e.xp6(32),e.Q6J("ngForOf",t.db),e.xp6(9),e.Q6J("ngForOf",t.setArrayFromNumber()),e.xp6(15),e.Q6J("formGroup",t.userForm),e.xp6(7),e.Q6J("ngIf",t.userForm.controls.invoiceNumber.errors&&t.userForm.controls.invoiceNumber.touched),e.xp6(5),e.Q6J("readonly",t.userForm.controls.invoiceNumber.invalid),e.xp6(1),e.Q6J("ngIf",t.userForm.controls.rut.errors&&t.userForm.controls.rut.touched),e.xp6(5),e.Q6J("disabled",""==t.userForm.controls.invoiceNumber.value),e.xp6(3),e.Q6J("ngForOf",t.dbBusiness),e.xp6(2),e.Q6J("ngIf",t.businessNoFound&&t.userForm.controls.rut.touched),e.xp6(6),e.Q6J("ngIf",t.userForm.controls.treatmentType.errors&&t.userForm.controls.treatmentType.touched),e.xp6(6),e.Q6J("ngIf",t.userForm.controls.material.errors&&t.userForm.controls.material.touched),e.xp6(6),e.Q6J("ngIf",t.userForm.controls.entryDate.errors&&t.userForm.controls.entryDate.touched),e.xp6(6),e.Q6J("ngIf",t.userForm.controls.totalWeight.errors&&t.userForm.controls.totalWeight.touched),e.xp6(11),e.Q6J("ngIf",t.userForm.controls.valuedWeight.errors&&t.userForm.controls.valuedWeight.touched),e.xp6(5),e.Q6J("value",t.calculateRemainingWeight()),e.xp6(1),e.Q6J("ngIf",t.isRemainingWeightNegative),e.xp6(11),e.Q6J("ngIf",t.userForm.controls.attachment.errors&&t.userForm.controls.attachment.touched),e.xp6(4),e.Q6J("disabled",t.userForm.invalid||t.isRemainingWeightNegative))},dependencies:[m.mk,m.sg,m.O5,a._Y,a.YN,a.Kr,a.Fj,a.EJ,a.JJ,a.JL,a.Q7,a.sg,a.u,a.On,m.uU],styles:["[_nghost-%COMP%]{width:90%!important;padding:1%}.color-verde[_ngcontent-%COMP%]{color:green}.color-verde-opaco[_ngcontent-%COMP%]{color:#0080004d}.custom-cursor[_ngcontent-%COMP%]{cursor:pointer}.no-pointer[_ngcontent-%COMP%]{cursor:default}"]}),o})();var pe=l(263);let he=(()=>{class o{constructor(n,t,r){this.fb=n,this.authService=t,this.router=r,this.pos="right",this.horaIngreso=new Date,this.formData=this.fb.group({actual:["",[a.kI.required]],password:["",[a.kI.required,a.kI.minLength(3)]],repeatPassword:["",[a.kI.required,a.kI.minLength(3)]]})}ngOnInit(){this.userData=JSON.parse(sessionStorage.getItem("user")),this.getProfile(this.userData.EMAIL),this.horaIngreso=new Date(sessionStorage.getItem("horaIngreso"))}btnrecovery(){const{actual:n,password:t,repeatPassword:r}=this.formData.value;this.authService.modifyPassword(t,r,n).subscribe({next:s=>{s.status?(d().fire({title:"Cambio de contrase\xf1a",text:"La contrase\xf1a fue cambiada exitosamente",icon:"success"}),this.router.navigate(["/mantenedor/home"])):(d().fire({title:"Validar informaci\xf3n",text:s.msg,icon:"error"}),this.formData.reset())},error:s=>{d().fire({title:"Formato inv\xe1lido",text:"Contrase\xf1a debe contener al menos 8 caracteres",icon:"error"})}})}displayModifyPassword(){this.pos="right"==this.pos?"down":"right"}getProfile(n){this.authService.getProfile(n).subscribe(t=>{sessionStorage.setItem("user",JSON.stringify(t.data.user)),this.userData=t.data.user})}}return o.\u0275fac=function(n){return new(n||o)(e.Y36(a.qu),e.Y36(pe.e),e.Y36(T.F0))},o.\u0275cmp=e.Xpm({type:o,selectors:[["app-profile"]],decls:81,vars:16,consts:[[1,"container","mt-4"],[1,"mi-perfil"],[1,"box","box-mi-perfil","mb-5","d-flex","align-items-start"],[1,"list","list-data","list-data-title-green","column-md-2","gap-0","list-unstyled"],[1,"list-data__title"],[1,"list-data__text"],[1,"color-verde"],[1,"list","list-links","list-unstyled"],["id","accordionPanelsStayOpenExample",1,"accordion","accordion-flush"],[1,"accordion-item"],["id","panelsStayOpen-headingOne",1,"accordion-header"],["data-bs-toggle","collapse","data-bs-target","#panelsStayOpen-collapseOne",3,"click"],["aria-hidden","true"],["id","panelsStayOpen-collapseOne","aria-labelledby","panelsStayOpen-headingOne",1,"accordion-collapse","collapse"],[1,"accordion-body"],["autocomplete","off",1,"form-recovery",3,"formGroup"],[1,"mb-4"],[1,"input-group"],[1,"input-group-text","input-group-text-left"],["aria-hidden","true",1,"fa","fa-lock","fa-fw"],["type","password","id","password","formControlName","actual","placeholder","Contrase\xf1a actual",1,"form-control"],["type","password","id","password","formControlName","password","placeholder","Nueva contrase\xf1a",1,"form-control"],["type","password","id","repeatPassword","formControlName","repeatPassword","placeholder","Repetir contrase\xf1a",1,"form-control"],["type","button",1,"btn","btn-primary","btn-fa","w-100",3,"click"],["aria-hidden","true",1,"fa","fa-long-arrow-right","fa-fw"]],template:function(n,t){1&n&&(e.TgZ(0,"div",0)(1,"section",1)(2,"h1"),e._uU(3,"Mi Perfil"),e.qZA(),e.TgZ(4,"div",2)(5,"ul",3)(6,"li")(7,"span",4),e._uU(8,"Nombre Usuario"),e.qZA(),e.TgZ(9,"span",5),e._uU(10),e.qZA()(),e.TgZ(11,"li")(12,"span",4),e._uU(13,"Perfil"),e.qZA(),e.TgZ(14,"span",5),e._uU(15),e.qZA()(),e.TgZ(16,"li")(17,"span",4),e._uU(18,"Tel\xe9fono"),e.qZA(),e.TgZ(19,"span",5),e._uU(20),e.qZA()(),e.TgZ(21,"li")(22,"span",4),e._uU(23,"Correo"),e.qZA(),e.TgZ(24,"span",5),e._uU(25),e.qZA()(),e.TgZ(26,"li")(27,"span",4),e._uU(28,"Instituci\xf3n"),e.qZA(),e.TgZ(29,"span",5),e._uU(30),e.qZA()(),e.TgZ(31,"li")(32,"span",4),e._uU(33,"Cargo"),e.qZA(),e.TgZ(34,"span",5),e._uU(35),e.qZA()(),e.TgZ(36,"li")(37,"span",4),e._uU(38,"Tel\xe9fono Oficina"),e.qZA(),e.TgZ(39,"span",5),e._uU(40),e.qZA()(),e.TgZ(41,"li")(42,"span",4)(43,"b"),e._uU(44,"Fecha/ Hora ingreso"),e.qZA()(),e.TgZ(45,"span",5),e._uU(46),e.ALo(47,"date"),e.qZA()()()(),e.TgZ(48,"h2",6),e._uU(49,"Acciones"),e.qZA(),e.TgZ(50,"ul",7)(51,"div",8)(52,"div",9)(53,"h2",10)(54,"li",11),e.NdJ("click",function(){return t.displayModifyPassword()}),e.TgZ(55,"a")(56,"span"),e._uU(57,"Cambio de contrase\xf1a"),e.qZA(),e._UZ(58,"i",12),e.qZA()()(),e.TgZ(59,"div",13)(60,"div",14)(61,"form",15)(62,"div",16)(63,"div",17)(64,"button",18),e._UZ(65,"i",19),e.qZA(),e._UZ(66,"input",20),e.qZA()(),e.TgZ(67,"div",16)(68,"div",17)(69,"button",18),e._UZ(70,"i",19),e.qZA(),e._UZ(71,"input",21),e.qZA()(),e.TgZ(72,"div",16)(73,"div",17)(74,"button",18),e._UZ(75,"i",19),e.qZA(),e._UZ(76,"input",22),e.qZA()(),e.TgZ(77,"div",16)(78,"button",23),e.NdJ("click",function(){return t.btnrecovery()}),e._uU(79," Enviar "),e._UZ(80,"i",24),e.qZA()()()()()()()()()()),2&n&&(e.xp6(10),e.AsE("",t.userData.FIRST_NAME," ",t.userData.LAST_NAME,""),e.xp6(5),e.Oqu(t.userData.ROL_NAME),e.xp6(5),e.Oqu(t.userData.PHONE),e.xp6(5),e.Oqu(t.userData.EMAIL),e.xp6(5),e.Oqu(t.userData.BUSINESS.join(" || ")),e.xp6(5),e.Oqu(t.userData.POSITION),e.xp6(5),e.Oqu(t.userData.PHONE_OFFICE),e.xp6(6),e.Oqu(e.xi3(47,13,t.horaIngreso,"dd-MM-yyyy H:mm:s")),e.xp6(12),e.Gre("fa fa-chevron-",t.pos,""),e.xp6(3),e.Q6J("formGroup",t.formData))},dependencies:[a._Y,a.Fj,a.JJ,a.JL,a.sg,a.u,m.uU]}),o})();var ge=l(9314);const _e=[{path:"",component:E.$,children:[{path:"home",component:p},{path:"statements",component:me},{path:"profile",component:he},{path:"faq",component:ge.v},{path:"**",redirectTo:"home",pathMatch:"full"}]}];let fe=(()=>{class o{}return o.\u0275fac=function(n){return new(n||o)},o.\u0275mod=e.oAB({type:o}),o.\u0275inj=e.cJS({imports:[T.Bz.forChild(_e),T.Bz]}),o})(),Te=(()=>{class o{}return o.\u0275fac=function(n){return new(n||o)},o.\u0275mod=e.oAB({type:o}),o.\u0275inj=e.cJS({imports:[m.ez,fe,a.UX,a.u5]}),o})()}}]);