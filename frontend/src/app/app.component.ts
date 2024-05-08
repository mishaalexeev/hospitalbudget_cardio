import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rotapro';
  currentLanguage: string = "RU";

  homePageText!: string;
  tarrifsPageText!: string;
  pricingPageText!: string;
  incomesoutcomesPageText!: string;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit() {
    this.currentLanguage = localStorage.getItem('currentLanguage') || 'RU';
    this.loadTexts();
  }

  onLanguageChanged(language: string) {
    this.currentLanguage = language;
    this.loadTexts();
    this.cdr.detectChanges();
  }

  loadTexts() {
    if (this.currentLanguage === "RU") {
      this.homePageText = "🏚️ Домашняя страница";
      this.tarrifsPageText = "1️⃣ Расчет тарифа";
      this.pricingPageText = "2️⃣ Стоимость МИ";
      this.incomesoutcomesPageText = "3️⃣ Доходы и расходы МО";
    } else if (this.currentLanguage === "EN") {
      this.homePageText = "🏚️ Home";
      this.tarrifsPageText = "1️⃣ Tariff calculation";
      this.pricingPageText = "2️⃣ Cost of medical devices";
      this.incomesoutcomesPageText = "3️⃣ MO incomes and outcomes";
    }

    // Принудительно запускаем обнаружение изменений
    this.cdr.detectChanges();
    // Запускаем обнаружение изменений в зоне Angular
    this.ngZone.run(() => {
      this.cdr.detectChanges();
    });

  }
}
