import { Component, OnInit } from '@angular/core';
import { environment_custom } from 'src/environments/environment.custom';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  version_x!:string
  version_y!:string
  constructor() { }

  ngOnInit(): void {
    this.version_x = environment_custom.version_x
    this.version_y = environment_custom.version_y
  }

}
