import { Component, OnInit } from '@angular/core';
import { BusinessService } from 'src/app/core/services/business.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-dashboard-ci-gestor',
  templateUrl: './dashboard-ci-gestor.component.html',
  styleUrls: ['./dashboard-ci-gestor.component.css']
})
export class DashboardCiGestorComponent implements OnInit {


  years: number[] = [];
  currentYear: number = new Date().getFullYear();
  selectedYear: number = this.currentYear;

  view: any = [1200, 400];
  view_barras: any = [600, 400];

  gradient: boolean = false;

  colorScheme: any = {
    domain: ['#08a47c', '#FCB241', '#d32f2f', '#1976D2', '#388E3C', '#8E24AA', '#FBC02D']
  };

  lineChartData:any = [];
  barChartData:any = [];
  normalizedBarChartData:any = [];

  companies: { ID: string, NAME: string }[] = [];
  selectedCompany: string = 'Todas';
  userId: any;

  constructor(private dashboardService: DashboardService, private businessService: BusinessService) { }

  ngOnInit(): void {
    for (let i = 2023; i <= this.currentYear; i++) {
      this.years.push(i);
    }
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.userId = user.ID;
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.businessService.getBusinessByUserId(this.userId).subscribe(data => {
      this.companies = [{ ID: 'Todas', NAME: 'Todas' }, ...data.data];
      this.loadData();
      this.loadBarChartData();
      this.loadAllStackedChartData();
    });
  }

  loadData() {
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
    this.loadBarChartData();
    this.loadAllStackedChartData();
  }

  loadBarChartData(): void {

    if (this.selectedCompany === 'Todas') {
      this.dashboardService.getAllBarChartData(this.selectedYear).subscribe(data => {
        this.barChartData = data.data;
        this.barChartData[0].name = this.barChartData[0].name + ' - ' + this.selectedYear;
        this.barChartData[1].name = this.barChartData[1].name + ' - ' + this.selectedYear;
      });
    }
    else {
      this.dashboardService.getBarChartDataByCompanyId(this.selectedYear, this.selectedCompany).subscribe(data => {
        this.barChartData = data.data;
        this.barChartData[0].name = this.barChartData[0].name + ' - ' + this.selectedYear;
        this.barChartData[1].name = this.barChartData[1].name + ' - ' + this.selectedYear;
      });
    }
  }

  loadAllStackedChartData(): void {
    if (this.selectedCompany === 'Todas') {
      this.dashboardService.getAllStackedBarChartData(this.selectedYear).subscribe(data => {
        this.normalizedBarChartData = data.data;
        this.normalizedBarChartData[0].name = this.normalizedBarChartData[0].name + ' - ' + this.selectedYear;
        this.normalizedBarChartData[1].name = this.normalizedBarChartData[1].name + ' - ' + this.selectedYear;
      });
    }
    else {
      this.dashboardService.getStackedBarChartDataByCompanyId(this.selectedYear, this.selectedCompany).subscribe(data => {
        this.normalizedBarChartData = data.data;
        this.normalizedBarChartData[0].name = this.normalizedBarChartData[0].name + ' - ' + this.selectedYear;
        this.normalizedBarChartData[1].name = this.normalizedBarChartData[1].name + ' - ' + this.selectedYear;
      });
    }
  }

  onCompanyChange() {
    this.loadData();
    this.loadBarChartData();
    this.loadAllStackedChartData();
  }

  setFormato(num: number | string): string {
    const numero = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
    const decimal = Math.round(numero * 100) / 100;
    const [entero, decimales] = decimal.toString().split('.');
    const enteroConPuntos = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return decimales && decimales !== '0' ? `${enteroConPuntos},${decimales.padEnd(2, '0')}` : enteroConPuntos;
  }
}
