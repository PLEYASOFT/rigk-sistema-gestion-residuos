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
  constructor(public productorService: ProductorService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const id_header = this.route.snapshot.params['id_header'];
    console.log(id_header)
    this.productorService.getStatementsById(id_header).subscribe(r => {
      this.listData = r;
      console.log(this.listData)
    })
  }
}
