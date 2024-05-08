import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentLanguage: string = "RU"; // Предположим, что изначально язык установлен на русский

  homeTitle!: string;
  toolDescription!: string;
  dataDescription!: string;
  governmentResolutionText!: string;
  governmentResolutionLink!: string;
  healthMinistryLetterText!: string;
  healthMinistryLetterLink!: string;
  tariffAgreementsText!: string;
  afterProgramChanges!: string;

  constructor() {
    // При загрузке компонента проверяем наличие сохраненного языка в localStorage
    this.currentLanguage = localStorage.getItem('currentLanguage') || 'RU';
    this.loadTexts();
  }

  ngOnInit() {
  }

  onLanguageChanged(language: string) {
    this.currentLanguage = language;
    this.loadTexts();
  }

  loadTexts() {
    if (this.currentLanguage === "RU") {
      this.homeTitle = "Экономическая модель \"Чрескожные коронарные вмешательства с применением ротационной атерэктомии\"";
      this.toolDescription = "Инструмент для анализа возможности внедрения ротационной атерэктомии в клиническую практику в ходе чрескожных коронарных вмешательств в условиях текущего финансирования.";
      this.dataDescription = "Все использованные данные по размеру коэффициентов, базовых ставок и формул представлены в соответствии с:";
      this.governmentResolutionText = "1. постановлением Правительства РФ от 28.12.2023 № 2353 \"О Программе государственных гарантий бесплатного оказания гражданам медицинской помощи на 2024 год и плановый период 2025 и 2026 годов\",";
      this.governmentResolutionLink = "https://docs.cntd.ru/document/1300493218?ysclid=liel63plhz371586342";
      this.healthMinistryLetterText = "2. письмом Минздрава России от 19.02.2024 N 31-2/200 \"О методических рекомендациях по способам оплаты медицинской помощи за счет средств обязательного медицинского страхования\" (вместе с \"Методическими рекомендациями по способам оплаты медицинской помощи за счет средств обязательного медицинского страхования\", утв. Минздравом России N 31-2/200, ФФОМС N 00-10-26-2-06/2778 19.02.2024),";
      this.healthMinistryLetterLink = "https://docs.cntd.ru/document/1300734289?ysclid=lid508rb6i735991175";
      this.tariffAgreementsText = "3. тарифными соглашениями в сфере обязательного медицинского страхования субъектов России на 2024 год по состоянию на февраль 2024 г.";
      this.afterProgramChanges = "После принятия Программы государственных гарантий, методических рекомендаций, тарифных соглашений на 2025 год возможны изменения в используемых данных.";
    } else if (this.currentLanguage === "EN") {
      this.homeTitle = "Economic model \"Percutaneous Coronary Interventions with Rotational Atherectomy\"";
      this.toolDescription = "This tool is designed to analyze possibility of rotational atherectomy implementation in clinical practice during percutaneous coronary interventions in current reimbursement conditions.";
      this.dataDescription = "All data used in the file on the base rates, coefficients and formulas are presented in accordance with:";
      this.governmentResolutionText = "1. Government Decree of the Russian Federation dated 28.12.2023 № 2353 \"On the Program of state guarantees of free medical care to citizens for 2024 and the planning period of 2025 and 2026\",";
      this.governmentResolutionLink = "https://docs.cntd.ru/document/1300493218?ysclid=liel63plhz371586342";
      this.healthMinistryLetterText = "2. The letter of the Ministry of Health of the Russian Federation dated 19.02.2024 № 31-2/200 \"On methodological recommendations on ways to pay for medical care at the expense of compulsory medical insurance\",";
      this.healthMinistryLetterLink = "https://docs.cntd.ru/document/1300734289?ysclid=lid508rb6i735991175";
      this.tariffAgreementsText = "3. Tariff agreements in the field of compulsory medical insurance of the regions of Russia for 2024 as of Feb 2024.";
      this.afterProgramChanges = "After the entry into force of the new Program of state guarantees, methodological recommendations, tariff agreements for 2025, changes in the calculation are possible.";

    }
  }
}
