import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductorService } from '../../../../core/services/productor.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  /**
   * BORRAR
   */

  tablas = ['Reciclable','No Reciclable','Retornables / Reutilizados'];
  residuos = [
    'Papel Cartón',
    'Metal',
    'Plástico',
    'Madera**',
    'Otro/Env. Compuesto'
  ];
  /**
   * END BORRAr
   */


  isSubmited = false;
  isEdited = false;


  id_business: number = 0;
  year_statement: number = 0;

  detail = this.fb.group({
    precedence: [],
    hazard: [],
    recyclability: [1],
    type_residue: [1],
    value: [],
    amount: []
  });

  detailForm: any[] = [];

  headLastForm: any = {};
  detailLastForm: any[] = [];

  constructor(private fb: FormBuilder,
              public productorService: ProductorService,
              private router: Router,
              private actived: ActivatedRoute ) {
              this.actived.queryParams.subscribe(r=>{
                this.id_business = r['id_business'];
                this.year_statement = r['year'];
              })
              }

              async ngOnDestroy() {
                if(!this.isSubmited && this.isEdited) {
                  await this.submitForm(false);
                }
              }

  ngOnInit(): void {

    Swal.fire({
      title: 'Cargando Datos',
      text: 'Se está recuperando datos del servidor',
      timerProgressBar: true,
      showConfirmButton: false
    });
    Swal.showLoading();

    this.getValueStatementByYear();

  }

  submitForm( state = true ) {

    Swal.fire({
      title: 'Guardando Datos',
      text: `Se está guardando datos en servidor ${!this.isSubmited ? 'como borrador':''}`,
      timerProgressBar: true,
      showConfirmButton: false,
      willClose: ()=>{
        
      }
    });
    Swal.showLoading();
    

    const detail = this.detailForm;
    
    const header = {
      id_business: this.id_business,
      year_statement: this.year_statement,
      state
    }

    this.productorService.saveForm({header, detail}).subscribe(r=>{
      if(r.status) {
        Swal.close();
        Swal.fire({
          title: 'Datos Guardados',
          text: `Se guardaron correctamente los datos en el servidor ${!this.isSubmited ? 'como borrador':''}`,
          icon: 'success'
        }).then(result => {
          if(result.isConfirmed) {
            this.isSubmited = true;
            this.router.navigate(['/productor/home']);
          }
        });
        
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Algo salió mal',
          icon: 'error'
        })
      }
    });
  }
  updateValue(recyclability:any,type_residue:any, precedence:any, hazard:any,target:any) {
    this.isEdited = true;
    let tmp;
    let sum = 0;
    let value = parseInt(target.value);
    if(!target.value || target.value < 0) {
      value = 0;
      target.value = 0;
    }

    for (let i = 0; i < this.detailForm.length; i++) {
      const r = this.detailForm[i];
      console.log("r",r)
      sum +=parseInt(r.value);
      if(r.type_residue == type_residue && r.precedence == precedence && r.hazard == hazard) {
        tmp = r;
      }
    }  

    if(this.detailForm.length == 0) {
      sum = 0;
    }
    
    if(tmp) {
      const index = this.detailForm.indexOf(tmp);
      sum = sum - {...this.detailForm[index]}.value;
      console.log("first", sum)
      
      this.detailForm[index].value = value;
      sum += this.detailForm[index].value;
      console.log("sec", sum)
    } else {
      sum += value;
      this.detailForm.push({precedence,hazard,value,type_residue,amount:(sum * 16269), recyclability});
    }
    
    (document.getElementById(`actual_weight_${recyclability}_${type_residue}`) as HTMLInputElement).value = sum.toString();
    (document.getElementById(`actual_amount_${recyclability}_${type_residue}`) as HTMLInputElement).value = (sum * 16269).toString();

    const last_weight = parseInt((document.getElementById(`last_weight_${recyclability}_${type_residue}`) as HTMLInputElement).value);
    const diff = (((sum-last_weight)/last_weight)*100);
    (document.getElementById(`actual_dif_${recyclability}_${type_residue}`) as HTMLInputElement).value = `${diff == Infinity ? 100:diff || 0}%`;
  }


  getValueStatementByYear() {
    const year = this.year_statement -1;
    this.productorService.getValueStatementByYear(this.id_business, year).subscribe(r=>{
      console.log(r)
      if(!r.status) {
        Swal.close();
        Swal.fire({
          title: 'Tuvimos problemas',
          text: r.msg,
          icon: 'error'
        }).then(event => {
          if(event.isConfirmed) {
            this.router.navigate(['/productor/home']);
          }
        })
      }

      this.detailLastForm = r.data.detail;
      this.headLastForm = r.data.health;
      Swal.close();

      this.detailLastForm?.forEach(r=>{
        console.log(r);
        
        (document.getElementById(`inp_l_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}_${r?.PRECEDENCE}_${r?.HAZARD}`) as HTMLInputElement).value = r?.VALUE;
        const tmp_weight = (parseInt((document.getElementById(`last_weight_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLInputElement).value) || 0) + parseInt(r?.VALUE);
        const tmp_amount = (parseInt((document.getElementById(`last_amount_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLInputElement).value) || 0) + parseInt(r?.AMOUNT);
        
        (document.getElementById(`last_weight_${r?.RECYCLABILITY}_${r.TYPE_RESIDUE}`) as HTMLInputElement).value = tmp_weight.toString();
        (document.getElementById(`last_amount_${r?.RECYCLABILITY}_${r.TYPE_RESIDUE}`) as HTMLInputElement).value = tmp_amount.toString();
      });
    });
  }
}