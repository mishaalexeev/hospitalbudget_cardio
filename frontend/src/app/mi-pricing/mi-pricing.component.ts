import { Component, OnInit } from '@angular/core';
import { Pair } from '../help/pair';
import { MiForChkvTableModel } from './model/mi-for-chkv-table-model';
import { HttpClient } from '@angular/common/http';
import { MiPricingService } from './service/mi-pricing.service';
import { MiForChkvResultModel } from './model/mi-for-chkv-result-model';

@Component({
  selector: 'app-mi-pricing',
  templateUrl: './mi-pricing.component.html',
  styleUrls: ['./mi-pricing.component.scss'],
})
export class MiPricingComponent implements OnInit {
  currentLanguage: string = 'RU';
  textMIforCHKVHeader!: string;
  textCurrency!: string;
  textStent!: string;
  textIntroducer!: string;
  textDiagnosticCatheter!: string;
  textGuideCatheter!: string;
  textGuide!: string;
  textPredilatoryBalloon!: string;
  textPostdilatoryBalloon!: string;
  textVSUZIConductor!: string;
  textOKTConductor!: string;
  textMIforRAHeader!: string;
  textDrillConductor!: string;
  textDrillAdvance!: string;
  textTwoDrillsFrequency!: string;
  textRAforCHKVHeader!: string;
  textRA!: string;
  textVisualizationFrequency!: string;
  textVSUZI!: string;
  textOKT!: string;
  textMICostHeader!: string;
  textTreatmentMethod!: string;
  textCHKV!: string;
  textCHKVRA!: string;
  textRAwithThreeStents!: string;
  textDataNotLoaded!: string;
  textCalculate!: string;

  defaultPercentage = 50;

  loadingTable: boolean = false;

  miForChvkDataSource: MiForChkvTableModel = {
    rota_pro_cost: 0,
    stent: 0,
    introducer: 0,
    diagnostic_catheter: 0,
    guide_catheter: 0,
    guide: 0,
    predilatory_balloon: 0,
    postdilatory_balloon: 0,
    vsuzi_conductor: 0,
    okt_conductor: 0,
    conductor: 0,
    drill_advance: 0,
  };

  sliderCost: number = 10;

  miForChvkResultDataSource: MiForChkvResultModel = {
    rota_pro_cost: 0,
    ra_with_three_stents: 0,
    mi_cost_data: [],
    vsuzi_percent: this.defaultPercentage,
    okt_percent: this.defaultPercentage,
  };

  constructor(private _service: MiPricingService) {
    this.currentLanguage = localStorage.getItem('currentLanguage') || 'RU';
    this.loadTexts();
  }

  loadTexts() {
    if (this.currentLanguage === 'RU') {
      this.textMIforCHKVHeader =
        'Медицинские изделия (МИ) для чрескожного коронарного вмешательства (ЧКВ)';
      this.textCurrency = 'руб.';
      this.textStent = 'Стент';
      this.textIntroducer = 'Интродьюсер';
      this.textDiagnosticCatheter = 'Диагностический катетер';
      this.textGuideCatheter = 'Проводниковый катетер';
      this.textGuide = 'Проводник';
      this.textPredilatoryBalloon = 'Баллон предилятационный';
      this.textPostdilatoryBalloon = 'Баллон постдилятационный';
      this.textVSUZIConductor = 'Проводник для ВСУЗИ';
      this.textOKTConductor = 'Проводник для ОКТ';
      this.textMIforRAHeader = 'МИ для ротационной атерэктомии (РА)';
      this.textDrillConductor = 'Проводник для бура';
      this.textDrillAdvance = 'Бур с эдвансером';
      this.textTwoDrillsFrequency =
        'Средняя частота использования двух буров на 1 пациента';
      this.textRAforCHKVHeader = 'Стоимость РА для проведения ЧКВ';
      this.textRA = 'Ротационная атерэктомия';
      this.textVisualizationFrequency =
        'Средняя частота использования метода визуализации';
      this.textVSUZI = 'ВСУЗИ';
      this.textOKT = 'ОКТ';
      this.textMICostHeader = 'Стоимость МИ для проведения ЧКВ, руб.';
      this.textTreatmentMethod = 'Метод лечения';
      this.textCHKV = 'ЧКВ, руб';
      this.textCHKVRA = 'ЧКВ+РА, руб';
      this.textRAwithThreeStents = 'РА с 1-3 стентами*';
      this.textDataNotLoaded = 'Данные не загружены';
      this.textCalculate = 'Произвести расчет';
    } else if (this.currentLanguage === 'EN') {
      this.textMIforCHKVHeader =
        'Medical Devices (MD) for Percutaneous Coronary Intervention (PCI)';
      this.textCurrency = 'rub.';
      this.textStent = 'Stent';
      this.textIntroducer = 'Introducer';
      this.textDiagnosticCatheter = 'Diagnostic Catheter';
      this.textGuideCatheter = 'Guide Catheter';
      this.textGuide = 'Guidewire';
      this.textPredilatoryBalloon = 'Predilatation Balloon';
      this.textPostdilatoryBalloon = 'Postdilatation Balloon';
      this.textVSUZIConductor = 'IVUS catheter';
      this.textOKTConductor = 'OCT catheter';
      this.textMIforRAHeader = 'MD for Rotational Atherectomy (RA)';
      this.textDrillConductor = 'Guidewire for Drill';
      this.textDrillAdvance = 'Drill with Advancer';
      this.textTwoDrillsFrequency =
        'Average Frequency of Using Two Drills per Patient';
      this.textRAforCHKVHeader = 'Cost of MD for RA';
      this.textRA = 'Rotational Atherectomy';
      this.textVisualizationFrequency =
        'Average Frequency of Visualization Method Use';
      this.textVSUZI = 'IVUS';
      this.textOKT = 'OCT';
      this.textMICostHeader = 'Cost of MD for PCI, rub.';
      this.textTreatmentMethod = 'Treatment Method';
      this.textCHKV = 'PCI, rub';
      this.textCHKVRA = 'PCI+RA, rub';
      this.textRAwithThreeStents = 'RA with 1-3 stents*';
      this.textDataNotLoaded = 'Data not loaded';
      this.textCalculate = 'Calculate';
    }
  }

  ngOnInit(): void {
    let source = localStorage.getItem('miForChvkDataSource');
    if (source !== null) {
      this.miForChvkDataSource = JSON.parse(source);
    }
    let result = localStorage.getItem('miPricing');
    if (result !== null) {
      this.miForChvkResultDataSource = JSON.parse(result);
    }
    let sliderCostSrc = localStorage.getItem('sliderCost');
    if (sliderCostSrc !== null) {
      this.sliderCost = parseInt(sliderCostSrc, 10);
    }
    this.miForChvkDataSource.rota_pro_cost = this.calculateRotaCost();
    if (this.miForChvkDataSource != null) {
      this.sendData()
    }
  }

  sendData() {
    this.loadingTable = true;
    this._service.calculateMi(this.miForChvkDataSource).subscribe({
      next: (resp) => {
        this.miForChvkResultDataSource = resp;
        this.miForChvkResultDataSource.okt_percent = this.defaultPercentage;
        this.miForChvkResultDataSource.vsuzi_percent = this.defaultPercentage;
        localStorage.setItem(
          'miPricing',
          JSON.stringify(this.miForChvkResultDataSource)
        );
        localStorage.setItem('sliderCost', this.sliderCost.toString());
        this.loadingTable = false;
      },
      error: (err) => {
        console.log(err);
        this.loadingTable = false;
      },
    });
  }

  costSliderChange($event: any) {
    this.miForChvkDataSource.rota_pro_cost = this.calculateRotaCost();
  }

  calculateRotaCost(): number {
    console.log(this.sliderCost);
    return Math.floor(
      this.miForChvkDataSource.conductor +
        this.miForChvkDataSource.drill_advance +
        this.miForChvkDataSource.drill_advance * (this.sliderCost / 100)
    );
  }

  setStorage() {
    this.miForChvkDataSource.rota_pro_cost = this.calculateRotaCost();
    localStorage.setItem(
      'miForChvkDataSource',
      JSON.stringify(this.miForChvkDataSource)
    );
  }

  updateValues() {
    // Обновление значения для второго инпута так, чтобы общая сумма была равна 100
    this.miForChvkDataSource.drill_advance =
      100 - this.miForChvkDataSource.conductor;
    this.setStorage();
  }
}
