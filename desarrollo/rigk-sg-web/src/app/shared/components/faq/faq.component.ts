import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    localStorage.removeItem('statementsState');
  }

  public scrollTo(sectionId: string): void {
    const section = this.elementRef.nativeElement.querySelector(`#${sectionId}`);
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  zoomImage(event: any) {
    const image = event.target;
    image.classList.toggle('zoom');
    const msg = image.nextElementSibling;
    msg.style.display = 'block';
  }
}
