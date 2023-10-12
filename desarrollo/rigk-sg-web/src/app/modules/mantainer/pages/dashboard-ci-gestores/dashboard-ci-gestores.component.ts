import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-dashboard-ci-gestores',
  templateUrl: './dashboard-ci-gestores.component.html',
  styleUrls: ['./dashboard-ci-gestores.component.css']
})
export class DashboardCiGestoresComponent implements OnInit {

  years: number[] = [];
  currentYear: number = new Date().getFullYear();
  selectedYear: number = this.currentYear;

  view: any = [1200, 400]; // Dimensiones del gráfico. Puedes cambiarlas según tus necesidades.
  view_barras: any = [600, 400]; // Dimensiones del gráfico. Puedes cambiarlas según tus necesidades.
  
  gradient: boolean = false;
  
  colorScheme:any = {
    domain: ['#5AA454', '#A10A28', '#4073B4', '#FFA726', '#D62D20', '#8F3985', '#009688']
  };
  
  // Datos del gráfico. Modifica esto según tus necesidades.
  lineChartData = [];

  barChartData = [];

  normalizedBarChartData = [
    {
      "name": "Papel/Cartón",
      "series": [
        { "name": "Reciclaje Mecánico", "value": 10 },
        { "name": "Valorización Energética", "value": 20 },
        { "name": "Disposición Final en RS", "value": 30 },
        { "name": "Reciclaje Interno", "value": 40 },
        { "name": "Preparación Reutilización", "value": 50 },
        { "name": "DF en Relleno Sanitario", "value": 60 },
        { "name": "DF en Relleno Seguridad", "value": 70 },
      ]
    },
    {
      "name": "Metal",
      "series": [
        { "name": "Reciclaje Mecánico", "value": 10 },
        { "name": "Valorización Energética", "value": 20 },
        { "name": "Disposición Final en RS", "value": 30 },
        { "name": "Reciclaje Interno", "value": 40 },
        { "name": "Preparación Reutilización", "value": 50 },
        { "name": "DF en Relleno Sanitario", "value": 60 },
        { "name": "DF en Relleno Seguridad", "value": 70 },
      ]
    },
    {
      "name": "Plástico",
      "series": [
        { "name": "Reciclaje Mecánico", "value": 10 },
        { "name": "Valorización Energética", "value": 20 },
        { "name": "Disposición Final en RS", "value": 30 },
        { "name": "Reciclaje Interno", "value": 40 },
        { "name": "Preparación Reutilización", "value": 50 },
        { "name": "DF en Relleno Sanitario", "value": 60 },
        { "name": "DF en Relleno Seguridad", "value": 70 },
      ]
    },
    {
      "name": "Madera",
      "series": [
        { "name": "Reciclaje Mecánico", "value": 10 },
        { "name": "Valorización Energética", "value": 20 },
        { "name": "Disposición Final en RS", "value": 30 },
        { "name": "Reciclaje Interno", "value": 40 },
        { "name": "Preparación Reutilización", "value": 50 },
        { "name": "DF en Relleno Sanitario", "value": 60 },
        { "name": "DF en Relleno Seguridad", "value": 70 },
      ]
    },
    {
      "name": "Mezclados",
      "series": [
        { "name": "Reciclaje Mecánico", "value": 10 },
        { "name": "Valorización Energética", "value": 20 },
        { "name": "Disposición Final en RS", "value": 30 },
        { "name": "Reciclaje Interno", "value": 40 },
        { "name": "Preparación Reutilización", "value": 50 },
        { "name": "DF en Relleno Sanitario", "value": 60 },
        { "name": "DF en Relleno Seguridad", "value": 70 },
      ]
    },
  ];

  companies: string[] = ['Todas', 'Empresa 1', 'Empresa 2', 'Empresa 3']; // Puedes agregar o modificar las empresas aquí
  selectedCompany: string = 'Todas';

  constructor(private dashboardService: DashboardService,) { }

  ngOnInit(): void {
    for(let i = 2023; i <= this.currentYear; i++) {
      this.years.push(i);
    }
    this.loadData();
    this.loadBarChartData();
  }

  loadData() {
    // Comprobamos que la empresa seleccionada sea 'Todas'
    if (this.selectedCompany === 'Todas') {
      this.dashboardService.getAllLinearDashboard(this.selectedYear).subscribe(data => {
        console.log(data)
        this.lineChartData = data.data; 
      });
    }
  }

  onYearChange() {
    this.loadData();
  }

  loadBarChartData(): void {
    this.dashboardService.getAllBarChartData(this.selectedYear).subscribe(
        data => {
            this.barChartData = data.data;
        },
        error => {
            console.error('Error al obtener los datos para el gráfico de barras:', error);
        }
    );
}
}
