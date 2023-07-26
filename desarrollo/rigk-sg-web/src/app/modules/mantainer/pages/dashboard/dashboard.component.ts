import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentMonth: any;
  months: Array<{ num: any; name: any; isCurrent: any; }> | undefined;
  toneladas: any;
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
  colorBarras:any = {
    domain: ['#6FCF97', '#9B51E0', '#56CCF2', '#F2C94C', '#FFA69E', '#FFCAD4', '#D0F0C0', '#F3C4FB']
  };
  

  multi: any[] = [];
  multi2: any[] = [];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Material';
  xAxisLabel2 = 'Años';
  showYAxisLabel = true;
  yAxisLabel = 'Toneladas Valorizadas';

  constructor() { }

  ngOnInit() {
    this.currentMonth = new Date().getMonth() + 1;  
    this.months = [
      {num: 1, name: 'Ene', isCurrent: false},
      {num: 2, name: 'Feb', isCurrent: false},
      {num: 3, name: 'Mar', isCurrent: false},
      {num: 4, name: 'Abr', isCurrent: false},
      {num: 5, name: 'May', isCurrent: false},
      {num: 6, name: 'Jun', isCurrent: false},
      {num: 7, name: 'Jul', isCurrent: false},
      {num: 8, name: 'Ago', isCurrent: false},
      {num: 9, name: 'Sep', isCurrent: false},
      {num: 10, name: 'Oct', isCurrent: false},
      {num: 11, name: 'Nov', isCurrent: false},
      {num: 12, name: 'Dic', isCurrent: false},
    ];
    for (let i = 0; i < this.currentMonth; i++) {
      this.months[i].isCurrent = true;
    }
    this.toneladas = 0;
    this.single1 = this.generateData(800);
    this.single2 = this.generateData(800);
    this.single3 = this.generateData(800);
    this.single4 = this.generateData(800);

    this.multi = [
      {
        name: 'Total',
        series: [
          {
            name: 'Semestre 1',
            value: 10000
          },
          {
            name: 'Semestre 2',
            value: 8000
          }
        ]
      },
      {
        name: 'Papel/Cartón',
        series: [
          {
            name: 'Semestre 1',
            value: 3000
          },
          {
            name: 'Semestre 2',
            value: 2500
          }
        ]
      },
      {
        name: 'Metal',
        series: [
          {
            name: 'Semestre 1',
            value: 2000
          },
          {
            name: 'Semestre 2',
            value: 1500
          }
        ]
      },
      {
        name: 'Plástico',
        series: [
          {
            name: 'Semestre 1',
            value: 3000
          },
          {
            name: 'Semestre 2',
            value: 2500
          }
        ]
      }
    ];

    this.multi2 = [
      {
        name: '2022',
        series: [
          {
            name: 'Papel/Cartón',
            value: 500
          },
          {
            name: 'Metal',
            value: 240
          },
          {
            name: 'Plástico',
            value: 1050
          }
        ]
      },
      {
        name: '2023',
        series: [
          {
            name: 'Papel/Cartón',
            value: 890
          },
          {
            name: 'Metal',
            value: 500
          },
          {
            name: 'Plástico',
            value: 1000
          }
        ]
      }
    ];
  }

  generateData(maxValue: number): any[] {
    const rawData = Math.floor(Math.random() * (maxValue + 1));
    const segments = Array(9).fill(0);
    segments[Math.min(Math.floor(rawData / 100), 8)] = rawData % 100;
    for (let i = Math.min(Math.floor(rawData / 100), 8) - 1; i >= 0; i--) {
      segments[i] = 100;
    }

    return segments.map((value, index) => {
      return {
        name: `${index * 100}-${(index + 1) * 100}`,
        value: value
      }
    }).filter(segment => segment.value > 0);
  }


  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  valueFormatting(c: any): string {
    return `${c}%`;
  }
  
  isLastMonth(month: any): boolean {
    return this.months ? this.months.indexOf(month) === this.months.length - 1 : false;
  }  
  
}
