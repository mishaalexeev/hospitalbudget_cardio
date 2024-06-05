import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss'],
})
export class CookieBannerComponent implements OnInit {
  agreed: boolean = false;

  ngOnInit(): void {
    this.agreed = localStorage.getItem('cookieAgreed') == 'true';
  }

  agree() {
    this.agreed = true;
    localStorage.setItem('cookieAgreed', 'true');
  }
}
