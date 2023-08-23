import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { GoalsTsService } from 'src/app/core/services/goals.ts.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentMonth: any;
  pom: any
  globalGoal: any;
  paperCardboardGoal: any;
  metalGoal: any;
  plasticGoal: any;
  count_business: any;
  months: any;
  currentYear = new Date().getFullYear();
  toneladas: any;
  graphCumGlobal: any;
  graphCumPapel: any;
  graphCumMetal: any;
  graphCumPlastico: any;
  years: number[] = [];
  selectedYear: any = '';
  single1: any;
  single2: any;
  single3: any;
  single4: any;
  view: any = [600, 300];
  view2: any = [500, 300];
  bigView: any = [500, 400];
  smallView: any = [400, 300];
  legend: boolean = false; // Añadido para deshabilitar la leyenda
  colorScheme: any = {
    domain: ['#08a47c', '#FCB241', '#FFA500', '#FF8C00', '#FF7F50', '#FF6347', '#FF4500', '#FF0000']
  };
  colorBarras: any = {
    domain: ['#6FCF97', '#9B51E0', '#56CCF2', '#F2C94C', '#FFA69E', '#FFCAD4', '#D0F0C0', '#F3C4FB']
  };

  multi: any[] = [];
  multi2: any[] = [];
  multi2Original: any[] = [];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Material';
  xAxisLabel2 = 'Años';
  showYAxisLabel = true;
  yAxisLabel = 'Toneladas Valorizadas';

  dashboardData: any;
  constructor(private dashboardService: DashboardService, private goalsService: GoalsTsService) { }

  ngOnInit() {
    this.getDataCum();
    this.getDataSemester();
    this.getYearlyMaterialWeights();
    this.getCountBusiness();
    this.getAllTonByYear();
    this.getAllGoals();
    this.currentMonth = new Date().getMonth() + 1;
    this.months = [
      { num: 1, name: 'Ene', isCurrent: false, isDisabled: false },
      { num: 2, name: 'Feb', isCurrent: false, isDisabled: false },
      { num: 3, name: 'Mar', isCurrent: false, isDisabled: false },
      { num: 4, name: 'Abr', isCurrent: false, isDisabled: false },
      { num: 5, name: 'May', isCurrent: false, isDisabled: false },
      { num: 6, name: 'Jun', isCurrent: false, isDisabled: false },
      { num: 7, name: 'Jul', isCurrent: false, isDisabled: false },
      { num: 8, name: 'Ago', isCurrent: false, isDisabled: false },
      { num: 9, name: 'Sep', isCurrent: false, isDisabled: false },
      { num: 10, name: 'Oct', isCurrent: false, isDisabled: false },
      { num: 11, name: 'Nov', isCurrent: false, isDisabled: false },
      { num: 12, name: 'Dic', isCurrent: false, isDisabled: false },
    ];
    for (let i = 0; i < this.currentMonth; i++) {
      this.months[i].isCurrent = true;
    }
    this.generateYears();
    this.setDisabledMonths();
  }

  generateYears(): void {
    for (let i = 2022; i <= this.currentYear; i++) {
      this.years.push(i);
    }
  }

  onYearChange(): void {
    if (this.selectedYear) {
      this.getDataSemester();
      this.filterDataBasedOnYear();
    } else {
      // Si no hay un año seleccionado, mostramos todos los datos.
      this.showAllData();
    }
  }

  showAllData(): void {
    this.multi2 = [...this.multi2Original];
  }

  filterDataBasedOnYear(): void {
    if (this.selectedYear && this.multi2Original) {
      this.multi2 = this.multi2Original.filter(data => {
        return parseInt(data.name) >= this.selectedYear!;
      });
    }
  }

  valueFormatting(c: any): string {
    return `${c}%`;
  }

  isLastMonth(month: any): boolean {
    return this.months ? this.months.indexOf(month) === this.months.length - 1 : false;
  }

  getDataCum(): any {
    this.dashboardService.getDashboard().subscribe({
      next: r => {
        this.dashboardData = r.data;
        this.selectMonth(this.currentMonth - 1);  // Restamos 1 porque los meses están indexados desde 0 en JavaScript.
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getAllTonByYear(): any {
    this.dashboardService.getAllTonByYear(this.currentYear - 1).subscribe({
      next: r => {
        this.pom = r.data.statements[0].totalToneladas;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getAllGoals(): any {
    this.goalsService.getAllGoals().subscribe({
      next: r => {
        const currentYear = new Date().getFullYear();
        const currentYearGoals = r.data.filter((item: any) => item.YEAR === currentYear);
        for (const goal of currentYearGoals) {
          switch (goal.TYPE_MATERIAL) {
            case '0':
              this.globalGoal = goal.PERCENTAGE_CUM;
              break;
            case '1':
              this.paperCardboardGoal = goal.PERCENTAGE_CUM;
              break;
            case '2':
              this.metalGoal = goal.PERCENTAGE_CUM;
              break;
            case '3':
              this.plasticGoal = goal.PERCENTAGE_CUM;
              break;
          }
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getDataSemester(): any {
    this.dashboardService.getSemesterDashboard().subscribe({
      next: r => {
        this.multi = this.transformToSemesterData(r.data);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  transformToSemesterData(data: any[]): any[] {
    const transformedData: any[] = [];
    const materialGroup: { [key: string]: any } = {};

    data.forEach(item => {
      if (item.year && item.year >= this.selectedYear) {
        if (!materialGroup[item.name]) {
          materialGroup[item.name] = {
            name: item.name,
            series: []
          };
          transformedData.push(materialGroup[item.name]);
        }

        item.series.forEach((semester: any) => {
          materialGroup[item.name].series.push({
            name: `${semester.name} - ${item.year}`,
            value: semester.value
          });
        });
      }
    });

    return transformedData;
  }

  getYearlyMaterialWeights(): any {
    this.dashboardService.getYearlyMaterialWeights().subscribe({
      next: r => {
        this.multi2 = [...r.data];
        this.multi2Original = [...r.data];
        this.selectedYear = this.currentYear;
        this.onYearChange();
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getCountBusiness(): any {
    this.dashboardService.getCountBusiness().subscribe({
      next: r => {
        this.count_business = r.data[0].total_empresas;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  transformDataForSelectedMonth(rawData: any[]): any[] {
    if (rawData.length === 0) return [];
    const currentData = rawData.filter(data => data.ANIO === this.currentYear);
    const currentMonthData = currentData[0];

    if (!currentMonthData) return [];
    const segments = Array(9).fill(0);
    let rawValue = Math.min(currentMonthData.percentage, 800);

    segments[Math.floor(rawValue / 100)] = rawValue % 100;

    for (let i = Math.floor(rawValue / 100) - 1; i >= 0; i--) {
      segments[i] = 100;
    }
    return segments.map((value, index) => {
      return {
        name: `${index * 100}-${(index + 1) * 100}`,
        value: Number(value.toFixed(2)),
        toneladas: parseFloat(currentMonthData.value)
      }
    }).filter(segment => segment.value > 0);
  }

  selectMonth(selectedMonth: number) {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentMonthData = this.dashboardData.filter((data: any) => data.MESES_ABREV === months[selectedMonth]);
    this.currentMonth = selectedMonth + 1;

    this.graphCumGlobal = this.transformDataForSelectedMonth(currentMonthData.filter((data: any) => data.TYPE_MATERIAL === 'Global'));
    this.graphCumPapel = this.transformDataForSelectedMonth(currentMonthData.filter((data: any) => data.TYPE_MATERIAL === 'Papel/Carton'));
    this.graphCumMetal = this.transformDataForSelectedMonth(currentMonthData.filter((data: any) => data.TYPE_MATERIAL === 'Metal'));
    this.graphCumPlastico = this.transformDataForSelectedMonth(currentMonthData.filter((data: any) => data.TYPE_MATERIAL === 'Plastico'));

    this.single1 = this.graphCumGlobal;
    this.single2 = this.graphCumPapel;
    this.single3 = this.graphCumMetal;
    this.single4 = this.graphCumPlastico;
  }

  setFormato(num: number | string): string {
    const numero = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
    const decimal = Math.round(numero * 100) / 100;
    const [entero, decimales] = decimal.toString().split('.');
    const enteroConPuntos = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return decimales && decimales !== '0' ? `${enteroConPuntos},${decimales.padEnd(2, '0')}` : enteroConPuntos;
  }

  setDisabledMonths() {
    const currentMonthNumber = new Date().getMonth() + 1;
    for (let month of this.months) {
      if (month.num > currentMonthNumber) {
        month.isDisabled = true;
      }
    }
  }
}
