import { Component, OnInit } from '@angular/core';
import { BusinessService } from 'src/app/core/services/business.service';
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

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#4073B4', '#FFA726', '#D62D20', '#8F3985', '#009688']
  };

  // Datos del gráfico. Modifica esto según tus necesidades.
  lineChartData = [];

  barChartData = [];

  normalizedBarChartData = [];

  companies: { ID: string, NAME: string }[] = [];
  selectedCompany: string = 'Todas';

  constructor(private dashboardService: DashboardService, private businessService: BusinessService) { }

  ngOnInit(): void {
    for (let i = 2023; i <= this.currentYear; i++) {
      this.years.push(i);
    }
    this.loadData();
    this.loadBarChartData();
    this.loadAllStackedChartData();
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.businessService.getAllBusiness().subscribe(data => {
      // Agregar 'Todas' al inicio y luego agregar todas las empresas al arreglo
      this.companies = [{ ID: 'Todas', NAME: 'Todas' }, ...data.status];
    });
  }

  loadData() {
    // Comprobamos que la empresa seleccionada sea 'Todas'
    console.log(this.selectedCompany)
    if (this.selectedCompany === 'Todas') {
      this.dashboardService.getAllLinearDashboard(this.selectedYear).subscribe(data => {
        this.lineChartData = data.data;
      });
    }
    else {
      this.dashboardService.getLinearDashboard(this.selectedYear, this.selectedCompany).subscribe(data => {
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

  loadAllStackedChartData(): void {
    this.dashboardService.getAllStackedBarChartData(this.selectedYear).subscribe(
      data => {
        console.log(data)
        this.normalizedBarChartData = data.data;
      },
      error => {
        console.error('Error al obtener los datos para el gráfico de barras:', error);
      }
    );
  }

  onCompanyChange() {
    this.loadData();
    this.loadBarChartData();
    this.loadAllStackedChartData();
  }
}
