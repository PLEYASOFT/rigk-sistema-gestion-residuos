import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  @Input() isVisible: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleMenu(event: any) {
    this.isVisible = event;
  }

}
