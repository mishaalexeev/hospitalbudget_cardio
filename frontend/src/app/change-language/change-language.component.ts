import { Component, Output, EventEmitter } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-change-language',
  templateUrl: './change-language.component.html',
  styleUrls: ['./change-language.component.scss']
})
export class ChangeLanguageComponent {

  currentLanguage: string = "RU";
  @Output() languageChanged = new EventEmitter<string>();

  constructor(private cdr: ChangeDetectorRef) {
    // При загрузке компонента проверяем наличие сохраненного языка в localStorage
    this.currentLanguage = localStorage.getItem('currentLanguage') || 'RU';
  }

  changeLanguage() {
    // Сохраняем текущий язык в localStorage
    this.currentLanguage = this.currentLanguage === "RU" ? "EN" : "RU";
    localStorage.setItem('currentLanguage', this.currentLanguage);
    // Посылаем событие о смене языка
    this.languageChanged.emit(this.currentLanguage);
    this.cdr.detectChanges(); // Добавьте эту строку
  }
}

//123