import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductorService } from 'src/app/core/services/productor.service';

@Component({
  selector: 'app-maintainer-productor-detail',
  templateUrl: './maintainer-productor-detail.component.html',
  styleUrls: ['./maintainer-productor-detail.component.css']
})
export class MaintainerProductorDetailComponent implements OnInit {

  listData: any = [];
  MV_consulta: any = [];
  constructor(public productorService: ProductorService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.loadData();
    this.loadMV();
  }

  loadData() {
    const id_header = this.route.snapshot.params['id_header'];
    console.log(id_header)
    this.productorService.getStatementsById(id_header).subscribe(r => {
      this.listData = r;
      console.log(this.listData)
    })
  }
  loadMV() {
    const id_header = this.route.snapshot.params['id_header'];
    this.productorService.getMV(id_header).subscribe(r => {
      if (r.status) {
        this.MV_consulta = r.data.header;
        console.log(this.MV_consulta)
      }
    });
  }
  downloadFile(fileId: number, fileName: string) {
    this.productorService.downloadMV(fileId).subscribe(
      (data) => {
        const blob = new Blob([data], { type: data.type });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();

        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error al descargar el archivo:', error);
      }
    );
  }
}
