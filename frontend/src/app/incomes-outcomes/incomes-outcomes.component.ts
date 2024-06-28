import { Component, OnInit } from '@angular/core';
import { TarrifTableResponseModel } from '../tarrifs/model/tarrif-table-response-model';
import { MiForChkvResultModel } from '../mi-pricing/model/mi-for-chkv-result-model';
import { IncomesOutcomesModel } from './model/incomes-outcomes-model';
import { IncomesOutcomesSummaryModel } from './model/incomes-outcomes-summary-model';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import jsPDF from 'jspdf';
// import { PrintResultsComponent } from './print-results/print-results.component';
//import { IncomesOutcomesService } from './service/incomes-outcomes.service';

const RU_TEXTS = {
  patientModels: [
    'нестабильная стенокардия, острый и повторный инфаркт миокарда (с подъемом сегмента ST электрокардиограммы)',
    'нестабильная стенокардия, острый и повторный инфаркт миокарда (с подъемом сегмента ST электрокардиограммы)',
    'нестабильная стенокардия, острый и повторный инфаркт миокарда (с подъемом сегмента ST электрокардиограммы)',
    'нестабильная стенокардия, острый и повторный инфаркт миокарда (без подъема сегмента ST электрокардиограммы)',
    'нестабильная стенокардия, острый и повторный инфаркт миокарда (без подъема сегмента ST электрокардиограммы)',
    'нестабильная стенокардия, острый и повторный инфаркт миокарда (без подъема сегмента ST электрокардиограммы)',
    'ишемическая болезнь сердца со стенозированием 1 коронарной артерии',
    'ишемическая болезнь сердца со стенозированием 2 коронарных артерий',
    'ишемическая болезнь сердца со стенозированием 3 коронарных артерий',
    'ишемическая болезнь сердца',
    'ишемическая болезнь сердца',
    'ишемическая болезнь сердца',
    'ИБС со стенотическим или окклюзионным поражением коронарных артерий',
  ],
  healMethods: [
    'баллонная вазодилатация с установкой 1 стента в сосуд (сосуды)',
    'баллонная вазодилатация с установкой 2 стентов в сосуд (сосуды)',
    'баллонная вазодилатация с установкой 3 стентов в сосуд (сосуды)',
    'баллонная вазодилатация с установкой 1 стента в сосуд (сосуды)',
    'баллонная вазодилатация с установкой 2 стентов в сосуд (сосуды)',
    'баллонная вазодилатация с установкой 3 стентов в сосуд (сосуды)',
    'баллонная вазодилатация с установкой 1 стента в сосуд',
    'баллонная вазодилатация с установкой 2 стентов в сосуд (сосуды)',
    'баллонная вазодилатация с установкой 3 стентов в сосуд (сосуды)',
    'баллонная вазодилятация и (или) стентирование с установкой 1 стента в сосуд с применением методов внутрисосудистой визуализации*',
    'баллонная вазодилятация и (или) стентирование с установкой 2 стентов в сосуд с применением методов внутрисосудистой визуализации*',
    'баллонная вазодилятация и (или) стентирование с установкой 3 стента в сосуд с применением методов внутрисосудистой визуализации*',
    'ротационная коронарная атерэктомия, баллонная вазодилятация с установкой 1-3 стентов в коронарные артерии',
  ],
};

const EN_TEXTS = {
  patientModels: [
    'unstable angina, acute and recurrent myocardial infarction (with ST-segment elevation on the ECG)',
    'unstable angina, acute and recurrent myocardial infarction (with ST-segment elevation on the ECG)',
    'unstable angina, acute and recurrent myocardial infarction (with ST-segment elevation on the ECG)',
    'unstable angina, acute and recurrent myocardial infarction (without ST-segment elevation on the ECG)',
    'unstable angina, acute and recurrent myocardial infarction (without ST-segment elevation on the ECG)',
    'unstable angina, acute and recurrent myocardial infarction (without ST-segment elevation on the ECG)',
    'ischemic heart disease with stenosis of 1 coronary artery',
    'ischemic heart disease with stenosis of 2 coronary arteries',
    'ischemic heart disease with stenosis of 3 coronary arteries',
    'ischemic heart disease',
    'ischemic heart disease',
    'ischemic heart disease',
    'ischemic heart disease with stenotic or occlusive lesions of the coronary arteries',
  ],
  healMethods: [
    'balloon angioplasty with placement of 1 stent in the vessel (vessels)',
    'balloon angioplasty with placement of 2 stents in the vessel (vessels)',
    'balloon angioplasty with placement of 3 stents in the vessel (vessels)',
    'balloon angioplasty with placement of 1 stent in the vessel (vessels)',
    'balloon angioplasty with placement of 2 stents in the vessel (vessels)',
    'balloon angioplasty with placement of 3 stents in the vessel (vessels)',
    'balloon angioplasty with placement of 1 stent in the vessel',
    'balloon angioplasty with placement of 2 stents in the vessel (vessels)',
    'balloon angioplasty with placement of 3 stents in the vessel (vessels)',
    'balloon angioplasty and/or stenting with placement of 1 stent in the vessel using intravascular visualization methods',
    'balloon angioplasty and/or stenting with placement of 2 stents in the vessel using intravascular visualization methods',
    'balloon angioplasty and/or stenting with placement of 3 stents in the vessel using intravascular visualization methods',
    'rotational coronary atherectomy, balloon vasodilation with the placement of 1-3 stents in the coronary arteries',
  ],
};

@Component({
  selector: 'app-incomes-outcomes',
  templateUrl: './incomes-outcomes.component.html',
  styleUrls: ['./incomes-outcomes.component.scss'],
})
export class IncomesOutcomesComponent implements OnInit {
  currentLanguage: string = 'RU';
  textTariffsRequired!: string;
  textMIPriceRequired!: string;
  textGroupNumber!: string;
  textPatientModel!: string;
  textHealingMethod!: string;
  textPatientsPerYear!: string;
  textPatientsNeedRA!: string;
  textTariffMinusSalary!: string;
  textLPUCostsPerPatient!: string;
  textLPUCostsAllPatients!: string;
  textTotalCosts!: string;
  textTFOMSBudget!: string;
  textLPUIncome!: string;
  textWithoutRA!: string;
  textWithRA!: string;
  textTotal!: string;
  textTotalIncome!: string;
  textAdditionalPatients!: string;
  textNotApplicable!: string;
  textPrintPDF!: string;
  patientModels: string[] = [];
  healMethods: string[] = [];

  miPriceColsIndexes: number[] = [0, 1, 2, 0, 1, 2, 0, 1, 2, 3, 4, 5];
  datasource: IncomesOutcomesModel[] = [];
  summary: IncomesOutcomesSummaryModel | null = null;

  tariffsNotCalculated: boolean = false;
  miPriceNotCalculated: boolean = false;

  tariffs: TarrifTableResponseModel | null = null;
  miPrice: MiForChkvResultModel | null = null;

  // constructor(private _service: TarrifsService) {
  //   this.currentLanguage = localStorage.getItem('currentLanguage') || 'RU';
  //   this.loadTexts();
  // }

  ngOnInit(): void {
    // let source = localStorage.getItem("IncomesOutcomes");
    // if (source !== null){
    //   this. = JSON.parse(source);
    // }
    this.currentLanguage = localStorage.getItem('currentLanguage') || 'RU';
    this.loadTexts();

    let tariffsJson: string | null = localStorage.getItem('tariffs');
    if (tariffsJson === null) {
      this.tariffsNotCalculated = true;
      return;
    }
    let miPriceJson = localStorage.getItem('miPricing');
    if (miPriceJson === null) {
      console.log(miPriceJson);
      this.miPriceNotCalculated = true;
      return;
    }
    this.tariffs = JSON.parse(tariffsJson);
    this.miPrice = JSON.parse(miPriceJson);
    console.log(this.miPrice);
    this.calculateTable(true);
  }

  loadTexts() {
    if (this.currentLanguage === 'RU') {
      this.textTariffsRequired = 'Требуется расчет тарифов';
      this.textMIPriceRequired = 'Требуется расчет стоимости МИ';
      this.textGroupNumber = 'Номер группы ВМП';
      this.textPatientModel = 'Модель пациента';
      this.textHealingMethod = 'Метод лечения';
      this.textPatientsPerYear = 'Число пациентов в год';
      this.textPatientsNeedRA = 'Из них число пациентов, нуждающихся в РА';
      this.textTariffMinusSalary =
        'Тариф за вычетом ДЗП и прочих расходов, руб.';
      this.textLPUCostsPerPatient =
        'Затраты ЛПУ на расходные материалы на 1 пациента';
      this.textLPUCostsAllPatients = 'Затраты ЛПУ на всех пациентов';
      this.textTotalCosts = 'Суммарные затраты на расходные материалы, руб.';
      this.textTFOMSBudget =
        'Бюджет, который ЛПУ получит от ТФОМС за вычетом ДЗП и пр.расходов, руб.';
      this.textLPUIncome = 'Доход ЛПУ, руб.';
      this.textWithoutRA = 'Без ротационной атерэктомии';
      this.textWithRA = 'С ротационной атерэктомией';
      this.textTotal = 'Итого';
      this.textTotalIncome = 'Общий размер дохода ЛПУ, руб.';
      this.textAdditionalPatients =
        'Дополнительное число пациентов, которым можно провести ротационную атерэктомию в ходе ЧКВ с 1 стентом';
      this.textNotApplicable = 'Не применимо';
      this.textPrintPDF = 'Распечатать PDF';
      this.patientModels = RU_TEXTS.patientModels;
      this.healMethods = RU_TEXTS.healMethods;
    } else if (this.currentLanguage === 'EN') {
      this.textTariffsRequired = 'Tariff calculation required';
      this.textMIPriceRequired = 'MI cost calculation required';
      this.textGroupNumber = 'Group Number';
      this.textPatientModel = 'Patient Model';
      this.textHealingMethod = 'Treatment Method';
      this.textPatientsPerYear = 'Number of Patients per Year';
      this.textPatientsNeedRA = 'Number of Patients Needing RA';
      this.textTariffMinusSalary =
        'Tariff minus Salary and Other Expenses, rub.';
      this.textLPUCostsPerPatient = 'Costs for Consumables per Patient';
      this.textLPUCostsAllPatients = 'Costs for All Patients';
      this.textTotalCosts = 'Total Costs for Consumables, rub.';
      this.textTFOMSBudget =
        'Budget Received by MO from CMI fund minus Salary and Other Expenses, rub.';
      this.textLPUIncome = 'MO Income, rub.';
      this.textWithoutRA = 'Without Rotational Atherectomy';
      this.textWithRA = 'With Rotational Atherectomy';
      this.textTotal = 'Total';
      this.textTotalIncome = 'Total MO Income, rub.';
      this.textAdditionalPatients =
        'Additional Number of Patients Who Can Undergo Rotational Atherectomy during PCI with 1 Stent';
      this.textNotApplicable = 'Not Applicable';
      this.textPrintPDF = 'Print PDF';
      this.patientModels = EN_TEXTS.patientModels;
      this.healMethods = EN_TEXTS.healMethods;
    }
  }

  calculateTable(firstTime: boolean): void {
    for (let i = 0; i < this.tariffs!.data.length; i++) {
      let tariffData = this.tariffs!.data[i];
      let tariff: number = tariffData.calculated;
      let healMethod: string = this.healMethods[i];
      let patientModel: string = this.patientModels[i];
      let miPriceIndex = this.miPriceColsIndexes[i];
      if (miPriceIndex === undefined) {
        continue;
      }
      let miPriceData = this.miPrice!.mi_cost_data[miPriceIndex];
      let dChkv = miPriceData.ckv;
      let eChkvRa = miPriceData.ckvpa;
      if (firstTime) {
        let groupNumber = 43 + i;
        let lpu1withoutRotateAtr = dChkv;
        let lpu1withRotateAtr = eChkvRa;
        if (groupNumber === 52) {
          lpu1withoutRotateAtr =
            this.miPrice!.mi_cost_data[3].ckv *
              this.miPrice!.vsuzi_percent *
              0.01 +
            this.miPrice!.mi_cost_data[6].ckv *
              this.miPrice!.okt_percent *
              0.01;
          lpu1withRotateAtr =
            this.miPrice!.mi_cost_data[3].ckvpa *
              this.miPrice!.vsuzi_percent *
              0.01 +
            this.miPrice!.mi_cost_data[6].ckvpa *
              this.miPrice!.okt_percent *
              0.01;
        }
        if (groupNumber === 53) {
          lpu1withoutRotateAtr =
            this.miPrice!.mi_cost_data[4].ckv *
              this.miPrice!.vsuzi_percent *
              0.01 +
            this.miPrice!.mi_cost_data[7].ckv *
              this.miPrice!.okt_percent *
              0.01;
          lpu1withRotateAtr =
            this.miPrice!.mi_cost_data[4].ckvpa *
              this.miPrice!.vsuzi_percent *
              0.01 +
            this.miPrice!.mi_cost_data[7].ckvpa *
              this.miPrice!.okt_percent *
              0.01;
        }
        if (groupNumber === 54) {
          lpu1withoutRotateAtr =
            this.miPrice!.mi_cost_data[5].ckv *
              this.miPrice!.vsuzi_percent *
              0.01 +
            this.miPrice!.mi_cost_data[8].ckv *
              this.miPrice!.okt_percent *
              0.01;
          lpu1withRotateAtr =
            this.miPrice!.mi_cost_data[5].ckvpa *
              this.miPrice!.vsuzi_percent *
              0.01 +
            this.miPrice!.mi_cost_data[8].ckvpa *
              this.miPrice!.okt_percent *
              0.01;
          console.log(this.miPrice!.vsuzi_percent);
        }
        let resultModel: IncomesOutcomesModel = {
          haveQuotas: true,
          groupNumber: groupNumber,
          patientModel: patientModel,
          healingMethod: healMethod,
          summaryPatientsCount: 0,
          // было тут сто
          countNeedToRA: 0,
          tariff: tariff,
          lpu1withoutRotateAtr: lpu1withoutRotateAtr,
          lpu1withRotateAtr: lpu1withRotateAtr,
          lpu2withoutRotateAtr: 0,
          lpu2withRotateAtr: 0,
          summaryOutcomeForMaterials: 0,
          budgetLpu: 0,
          incomeLpu: 0,
        };
        let datasource = localStorage.getItem('datasource');
        if (datasource !== null) {
          var parsedds: IncomesOutcomesModel[] = JSON.parse(datasource);
          resultModel.summaryPatientsCount = parsedds[i].summaryPatientsCount;
          resultModel.countNeedToRA = parsedds[i].countNeedToRA;
        }
        this.calculateOvers(resultModel);
        this.datasource.push(resultModel);
      } else {
        let incomesOutcomesModel = this.datasource[i];
        this.calculateOvers(incomesOutcomesModel);
      }
    }
    // ГРУППА 60
    if (firstTime) {
      let tariffData = this.tariffs!.data[this.tariffs!.data.length - 1];
      let tariff: number = tariffData.calculated;
      let miPriceData =
        this.miPrice!.mi_cost_data[this.miPrice!.mi_cost_data.length - 1];
      let dChkv = miPriceData.ckv;
      let eChkvRa = miPriceData.ckvpa;
      let resultModel: IncomesOutcomesModel = {
        haveQuotas: true,
        groupNumber: 60,
        // patientModel:
        //   'ИБС со стенотическим или окклюзионным поражением коронарных артерий',
        // healingMethod:
        //   'ротационная коронарная атерэктомия, баллонная вазодилятация с установкой 1-3 стентов в коронарные артерии',
        patientModel: this.patientModels[12],
        healingMethod: this.healMethods[12],
        summaryPatientsCount: 0,
        // было тут сто
        countNeedToRA: -1,
        tariff: tariff,
        lpu1withoutRotateAtr: -1,
        lpu1withRotateAtr: this.miPrice!.ra_with_three_stents,
        lpu2withoutRotateAtr: 0,
        lpu2withRotateAtr: 0,
        summaryOutcomeForMaterials: 0,
        budgetLpu: 0,
        incomeLpu: 0,
      };
      this.calculateOvers(resultModel);
      this.datasource.push(resultModel);
    } else {
      this.calculateOvers(this.datasource[this.datasource.length - 1]);
    }
    this.summary = this.calculateSummary();
    localStorage.setItem('datasource', JSON.stringify(this.datasource));
  }

  calculateSummary(): IncomesOutcomesSummaryModel {
    console.log(this.summary!);
    let summary: IncomesOutcomesSummaryModel = {
      summaryOutcome: 0,
      summaryBudget: 0,
      summaryIncomeLpu: 0,
      additionalPatients: 0,
    };
    for (let element of this.datasource) {
      summary.summaryOutcome =
        summary.summaryOutcome + element.summaryOutcomeForMaterials;
      summary.summaryBudget = summary.summaryBudget + element.budgetLpu;
      summary.summaryIncomeLpu = summary.summaryIncomeLpu + element.incomeLpu;
    }
    summary.additionalPatients =
      summary.summaryIncomeLpu / this.datasource[0].lpu1withRotateAtr;
    return summary;
  }

  calculateOvers(model: IncomesOutcomesModel) {
    let countNeedToRAtoUse = model.countNeedToRA;
    if (model.countNeedToRA === -1) {
      countNeedToRAtoUse = 0;
    }
    if (model.countNeedToRA !== -1) {
      model.lpu2withoutRotateAtr =
        (model.summaryPatientsCount - countNeedToRAtoUse) *
        model.lpu1withoutRotateAtr;
    } else {
      model.lpu2withoutRotateAtr = -1;
    }
    model.lpu2withRotateAtr = countNeedToRAtoUse * model.lpu1withRotateAtr;
    model.summaryOutcomeForMaterials =
      model.lpu2withRotateAtr + model.lpu2withoutRotateAtr;
    if (model.lpu2withoutRotateAtr === -1) {
      model.lpu2withRotateAtr =
        model.summaryPatientsCount * model.lpu1withRotateAtr;
      model.summaryOutcomeForMaterials = model.lpu2withRotateAtr;
    }
    model.budgetLpu = model.summaryPatientsCount * model.tariff;
    model.incomeLpu = model.budgetLpu - model.summaryOutcomeForMaterials;
  }

  getTooltip(healingMethod: string): string {
    if (
      healingMethod ===
      'баллонная вазодилятация и (или) стентирование с установкой 1 стента в сосуд с применением методов внутрисосудистой визуализации*'
    ) {
      return 'баллонная вазодилятация и (или) стентирование с установкой 1 стента в сосуд с применением методов внутрисосудистой визуализации и (или) в сочетании с оценкой гемодинамической значимости стеноза по данным физиологической оценки коронарного кровотока (ФРК или МРК) при ишемической болезни сердца';
    } else if (
      healingMethod ===
      'баллонная вазодилятация и (или) стентирование с установкой 2 стентов в сосуд с применением методов внутрисосудистой визуализации*'
    ) {
      return 'баллонная вазодилятация и (или) стентирование с установкой 2 стентов в сосуд с применением методов внутрисосудистой визуализации и (или) в сочетании с оценкой гемодинамической значимости стеноза по данным физиологической оценки коронарного кровотока (ФРК или МРК) при ишемической болезни сердца';
    } else if (
      healingMethod ===
      'баллонная вазодилятация и (или) стентирование с установкой 3 стента в сосуд с применением методов внутрисосудистой визуализации*'
    ) {
      return 'баллонная вазодилятация и (или) стентирование с установкой 3 стентов в сосуд с применением методов внутрисосудистой визуализации и (или) в сочетании с оценкой гемодинамической значимости стеноза по данным физиологической оценки коронарного кровотока (ФРК или МРК) при ишемической болезни сердца';
    } else if (
      healingMethod ===
      'баллонная вазодилятация и (или) стентирование с установкой 3 стентов в сосуд с применением методов внутрисосудистой визуализации и (или) в сочетании с оценкой гемодинамической значимости стеноза по данным физиологической оценки коронарного кровотока (ФРК или МРК) при ишемической болезни сердца'
    ) {
      return 'В баллонная вазодилятация и (или) стентирование с установкой 3 стентов в сосуд с применением методов внутрисосудистой визуализации и (или) в сочетании с оценкой гемодинамической значимости стеноза по данным физиологической оценки коронарного кровотока (ФРК или МРК) при ишемической болезни сердца';
    } else {
      return '';
    }
  }

  printPdf(tableHead: HTMLTableSectionElement, pdfHeader: HTMLParagraphElement) {
    let bufStyle = tableHead.style.position;
    tableHead.style.position = 'unset'
    pdfHeader.style.display = 'inline'
    var data = document.getElementById('printed-table');
    // @ts-ignore
    html2canvas(data!, { dpi: 300, letterRendering: true, width: data.scrollWidth, height: data.scrollHeight}).then(canvas => {
      // Few necessary setting options
      let imgWidth = 208;
      let pageHeight = 305;
      let imgHeight = canvas.height * imgWidth / canvas.width - 10;
      let heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      let position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('Доходы_и_расходы_МО.pdf'); // Generated PDF
    });
    tableHead.style.position = bufStyle;
    pdfHeader.style.display = 'none'
  }
}
