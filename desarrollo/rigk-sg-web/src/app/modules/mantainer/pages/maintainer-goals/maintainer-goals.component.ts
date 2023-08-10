import { JsonPipe } from '@angular/common';
import { ParseError, ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { validate } from 'rut.js';
import { GoalsTsService } from 'src/app/core/services/goals.ts.service';
import { RatesTsService } from 'src/app/core/services/rates.ts.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-maintainer-goals',
  templateUrl: './maintainer-goals.component.html',
  styleUrls: ['./maintainer-goals.component.css']
})
export class MaintainerGoalsComponent implements OnInit {
  
    list: any[] = [];
    pos = 1;
    cant = 0;
  
    formData: any;
    existingCode: any = '';
    popupVisible = false;
    popupModify = false;
    id = '';
    index = 0;
    year: any[] = [];
    type: any[] = [];
    price: any[] = [];
    isok:boolean=false;
    
    userData: any | null;
    defaultYear:any =  [];
    selectedYear: any;

    dbGoalsYear: any[]=[];
    goalsYear:{material:any, goal:any}[]=[];
    
    goalsForm = this.fb.group({
      year: ['0',[Validators.required, Validators.min(2021)]],
      type_0: ['',[Validators.required, Validators.min(0), Validators.max(100)]],
      type_1: ['',[Validators.required, Validators.min(0), Validators.max(100)]],
      type_2: ['',[Validators.required, Validators.min(0), Validators.max(100)]],
      type_3: ['',[Validators.required, Validators.min(0), Validators.max(100)]],
    })

    constructor(private fb: FormBuilder, public goalsTsService: GoalsTsService) { }
      
    modify(goal:any) {
      this.isEditing = true;
      this.goalsForm.controls['year'].setValue(this.getYear(goal));
      this.selectedYear = this.getYear(goal);

      const g0 = (parseFloat(this.getCumpYear(this.list,this.selectedYear,"0"))*100).toFixed(2).replace(".",",");
      const g1 = (parseFloat(this.getCumpYear(this.list,this.selectedYear,"1"))*100).toFixed(2).replace(".",",");
      const g2 = (parseFloat(this.getCumpYear(this.list,this.selectedYear,"2"))*100).toFixed(2).replace(".",",");
      const g3 = (parseFloat(this.getCumpYear(this.list,this.selectedYear,"3"))*100).toFixed(2).replace(".",",");

      this.goalsForm.controls['type_0'].setValue(g0);
      this.goalsForm.controls['type_1'].setValue(g1);
      this.goalsForm.controls['type_2'].setValue(g2);
      this.goalsForm.controls['type_3'].setValue(g3);
    }
    
    ngOnInit(): void {
      this.userData = JSON.parse(sessionStorage.getItem('user')!);
      this.getAllGoals();
  
      this.formData = this.fb.group({
        year: ['', [Validators.required]],
        type_0: ['', [Validators.required]],
        type_1: ['', [Validators.required]],
        type_2: ['', [Validators.required]],
        type_3: ['', [Validators.required]],
      });
  
      for (let i = 2021; i <= (new Date()).getFullYear()+1; i++) {
        this.defaultYear.push(i);
      }
    }

    isEditing = false;
    
    saveForm() {

      this.goalsForm.controls['type_0'].setValue(this.goalsForm.controls['type_0'].getRawValue()?.toString().replace(",",".") || '');
      this.goalsForm.controls['type_1'].setValue(this.goalsForm.controls['type_1'].getRawValue()?.toString().replace(",",".") || '');
      this.goalsForm.controls['type_2'].setValue(this.goalsForm.controls['type_2'].getRawValue()?.toString().replace(",",".") || '');
      this.goalsForm.controls['type_3'].setValue(this.goalsForm.controls['type_3'].getRawValue()?.toString().replace(",",".") || '');

      if(this.goalsForm.invalid) {
        Swal.fire({
          icon: 'warning',
          text:'Debe ingresar todos los campos. Todos los cumplimientos deben ser numéricos y mayores o iguales a 0 y menores o iguales a 100.'
        });

        this.goalsForm.controls['type_0'].setValue(this.goalsForm.controls['type_0'].getRawValue()?.toString().replace(".",",") || '');
        this.goalsForm.controls['type_1'].setValue(this.goalsForm.controls['type_1'].getRawValue()?.toString().replace(".",",") || '');
        this.goalsForm.controls['type_2'].setValue(this.goalsForm.controls['type_2'].getRawValue()?.toString().replace(".",",") || '');
        this.goalsForm.controls['type_3'].setValue(this.goalsForm.controls['type_3'].getRawValue()?.toString().replace(".",",") || '');

        return;
      }

      this.goalsForm.controls['type_0'].setValue(this.goalsForm.controls['type_0'].getRawValue()?.toString().replace(".",",") || '');
      this.goalsForm.controls['type_1'].setValue(this.goalsForm.controls['type_1'].getRawValue()?.toString().replace(".",",") || '');
      this.goalsForm.controls['type_2'].setValue(this.goalsForm.controls['type_2'].getRawValue()?.toString().replace(".",",") || '');
      this.goalsForm.controls['type_3'].setValue(this.goalsForm.controls['type_3'].getRawValue()?.toString().replace(".",",") || '');

      const pattern = /^[0-9]+(,[0-9]+)?$/;
      if(!pattern.test(this.goalsForm.value.type_0!) || !pattern.test(this.goalsForm.value.type_1!) || !pattern.test(this.goalsForm.value.type_2!) || !pattern.test(this.goalsForm.value.type_3!))
      {
        Swal.fire({
          icon: 'warning',
          text:'Separador de miles con punto y separador de decimales con coma. Máximo 2 decimales'
        });
        return; 
      }
      if(this.isEditing) {
        this.goalsTsService.updateGoals(this.goalsForm.value).subscribe({
          next: r=> {
            if(r.status){
              this.getAllGoals();
              document.getElementById('closeModallll')?.click();
              document.getElementById('closeModallll2')?.click();
            } else {
              document.getElementById('closeModallll')?.click();
              document.getElementById('closeModallll2')?.click();
              Swal.fire({
                icon: 'error',
                text: r.msg + ""
              })
            }
          }
        })
      } else {
        this.goalsTsService.saveGoals(this.goalsForm.value).subscribe({
          next: r=> {
            if(r.status){
              this.getAllGoals();
              document.getElementById('closeModallll')?.click();
            } else {
              Swal.fire({
                icon: 'error',
                text: r.msg
              })
            }
          }
        });
      }
    }
    
    dbGoals: any[]=[];
    goals:{year_material:string, goal:any}[]=[];

    getAllGoals() {
      this.list = [];
      this.goals = [];
      this.dbGoals = [];
      this.year = [];
      this.type = [];
      this.price = [];
      this.goalsTsService.getAllGoals().subscribe({
        next: resp => {
          if(resp.status){
            this.dbGoals = resp.data;
            this.dbGoals.forEach(r => {
              const index = this.goals.findIndex((e:any)=>e.year_material == r.YEAR + '_' + r.TYPE_MATERIAL);
              if(index > -1) {
                this.goals[index].goal.push(r.PERCENTAGE_CUM);
              } else {
                this.goals.push({year_material: r.YEAR+'_'+r.TYPE_MATERIAL, goal:r.PERCENTAGE_CUM});
              }
            });
            if(this.goals.length == (new Date()).getFullYear() - 2021+2) {
              this.isok = true;
            }
            this.list = this.goals;
            this.cant = Math.ceil(this.goals.length / 10) || 1;
            this.goals = this.list.slice(0, 10);
          }
        },
        error: r => {
          Swal.close();
          Swal.fire({
            icon: 'error',
            text: r.msg,
            title: '¡Ups!'
          });
        }
      });
    }

    getGoalsYear(year:number) {
      this.goalsYear = [];
      this.dbGoalsYear = [];
      this.goalsTsService.getGoalsYear(year).subscribe({
        next: resp => {
          if(resp.status){
            this.dbGoalsYear = resp.data
            this.dbGoalsYear.forEach(r => {
              const index = this.goalsYear.findIndex((e:any)=>e.material == r.TYPE_MATERIAL);
              if(index > -1) {
                this.goalsYear[index].goal.push(r.PERCENTAGE_CUM);
              } else {
                this.goalsYear.push({material: r.TYPE_MATERIAL, goal:r.PERCENTAGE_CUM});
              }
            });
          }
        },
        error: r => {
          Swal.close();
          Swal.fire({
            icon: 'error',
            text: r.msg,
            title: '¡Ups!'
          });
        }
      });
    }

    getYear(val:any){
      return val.year_material.split("_")[0];
    }
  
    getMaterial(val:any){
      switch(val.year_material.split("_")[1]) {
        case "1": { 
           return "Papel";  
        } 
        case "2": { 
          return "Plástico"; 
        } 
        case "3": { 
          return "Metal";  
        }
        default: { 
          return "Global"; 
        } 
     }
    }

    getCumpYear(_goals:any,year:string,material:string){
      const i = _goals.findIndex((e:any)=>e.year_material == year + '_' + material);
      return this.list[i].goal || 0;
    }
  
    pagTo(i: number) {
      this.pos = i + 1;
      this.goals = this.list.slice((i * 10), (i + 1) * 10);
    }

    next() {
      if (this.pos >= this.cant) return;
      this.pos++;
      this.goals = this.list.slice((this.pos - 1) * 10, (this.pos) * 10);
    }

    previus() {
      if (this.pos - 1 <= 0 || this.pos >= this.cant + 1) return;
      this.pos = this.pos - 1;
      this.goals = this.list.slice((this.pos - 1) * 10, (this.pos) * 10);
    }

    setArrayFromNumber() {
      return new Array(this.cant);
    }
}