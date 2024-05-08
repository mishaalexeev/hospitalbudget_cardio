import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss']
})
export class CookieBannerComponent implements OnInit {

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    const cookieBanner = this.elementRef.nativeElement.querySelector('.cookie-banner');
    const agreeBtn = this.elementRef.nativeElement.querySelector('#agreeBtn');
    
    // Проверяем, согласился ли пользователь с политикой
    const agreed = localStorage.getItem("cookieAgreed");
    // Если пользователь не согласился, показываем баннер
    if (!agreed) {
      cookieBanner.style.display = "block";
    }

    // Обработчик клика по кнопке "Согласен"
    agreeBtn.addEventListener("click", () => {
      // Сохраняем состояние согласия в localStorage
      localStorage.setItem("cookieAgreed", "true");
      // Скрываем баннер
      cookieBanner.style.display = "none";
    });
  }
}
