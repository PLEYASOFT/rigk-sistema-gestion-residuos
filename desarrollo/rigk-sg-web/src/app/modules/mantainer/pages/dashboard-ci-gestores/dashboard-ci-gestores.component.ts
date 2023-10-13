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

  view: any = [1200, 400]; 
  view_barras: any = [600, 400]; 

  gradient: boolean = false;

  colorScheme: any = {
    domain: ['#08a47c', '#FCB241', '#d32f2f', '#1976D2', '#388E3C', '#8E24AA', '#FBC02D']
  };

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
      this.companies = [{ ID: 'Todas', NAME: 'Todas' }, ...data.status];
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
      });
    }
    else {
      this.dashboardService.getBarChartDataByCompanyId(this.selectedYear, this.selectedCompany).subscribe(data => {
        this.barChartData = data.data;
      });
    }
  }

  loadAllStackedChartData(): void {
    if (this.selectedCompany === 'Todas') {
      this.dashboardService.getAllStackedBarChartData(this.selectedYear).subscribe(data => {
        this.normalizedBarChartData = data.data;
      });
    }
    else {
      this.dashboardService.getStackedBarChartDataByCompanyId(this.selectedYear, this.selectedCompany).subscribe(data => {
        this.normalizedBarChartData = data.data;
      });
    }
  }

  onCompanyChange() {
    this.loadData();
    this.loadBarChartData();
    this.loadAllStackedChartData();
  }
}
