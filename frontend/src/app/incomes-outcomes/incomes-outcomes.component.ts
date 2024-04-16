import {Component, OnInit} from '@angular/core';
import {TarrifTableResponseModel} from "../tarrifs/model/tarrif-table-response-model";
import {MiForChkvResultModel} from "../mi-pricing/model/mi-for-chkv-result-model";
import {IncomesOutcomesModel} from "./model/incomes-outcomes-model";
import {IncomesOutcomesSummaryModel} from "./model/incomes-outcomes-summary-model";

@Component({
  selector: 'app-incomes-outcomes',
  templateUrl: './incomes-outcomes.component.html',
  styleUrls: ['./incomes-outcomes.component.scss']
})
export class IncomesOutcomesComponent implements OnInit {

  patientModels: string[] = [
    "нестабильная стенокардия, острый и повторный инфаркт миокарда (с подъемом сегмента ST электрокардиограммы)",
    "нестабильная стенокардия, острый и повторный инфаркт миокарда (с подъемом сегмента ST электрокардиограммы)",
    "нестабильная стенокардия, острый и повторный инфаркт миокарда (с подъемом сегмента ST электрокардиограммы)",
    "нестабильная стенокардия, острый и повторный инфаркт миокарда (без подъема сегмента ST электрокардиограммы)",
    "нестабильная стенокардия, острый и повторный инфаркт миокарда (без подъема сегмента ST электрокардиограммы)",
    "нестабильная стенокардия, острый и повторный инфаркт миокарда (без подъема сегмента ST электрокардиограммы)",
    "ишемическая болезнь сердца со стенозированием 1 коронарной артерии",
    "ишемическая болезнь сердца со стенозированием 2 коронарных артерий",
    "ишемическая болезнь сердца со стенозированием 3 коронарных артерий",
    "ишемическая болезнь сердца",
    "ишемическая болезнь сердца",
    "ишемическая болезнь сердца"
  ];
  healMethods: string[] = [
    "баллонная вазодилатация с установкой 1 стента в сосуд (сосуды)",
    "баллонная вазодилатация с установкой 2 стентов в сосуд (сосуды)",
    "баллонная вазодилатация с установкой 3 стентов в сосуд (сосуды)",
    "баллонная вазодилатация с установкой 1 стента в сосуд (сосуды)",
    "баллонная вазодилатация с установкой 2 стентов в сосуд (сосуды)",
    "баллонная вазодилатация с установкой 3 стентов в сосуд (сосуды)",
    "баллонная вазодилатация с установкой 1 стента в сосуд",
    "баллонная вазодилатация с установкой 2 стентов в сосуд (сосуды)",
    "баллонная вазодилатация с установкой 3 стентов в сосуд (сосуды)",
    "баллонная вазодилятация и (или) стентирование с установкой 1 стента в сосуд с применением методов внутрисосудистой визуализации*",
    "баллонная вазодилятация и (или) стентирование с установкой 2 стентов в сосуд с применением методов внутрисосудистой визуализации*",
    "баллонная вазодилятация и (или) стентирование с установкой 3 стента в сосуд с применением методов внутрисосудистой визуализации*",
  ];
  miPriceColsIndexes: number[] = [
    0, 1, 2, 0, 1, 2, 0, 1, 2, 3, 4, 5
  ];
  datasource: IncomesOutcomesModel[] = [];
  summary: IncomesOutcomesSummaryModel | null = null;

  tariffsNotCalculated: boolean = false;
  miPriceNotCalculated: boolean = false;

  tariffs: TarrifTableResponseModel | null = null
  miPrice: MiForChkvResultModel | null = null

  ngOnInit(): void {
    // let source = localStorage.getItem("IncomesOutcomes");
    // if (source !== null){
    //   this. = JSON.parse(source);
    // }

    let tariffsJson: string | null = localStorage.getItem("tariffs");
    if (tariffsJson === null) {
      this.tariffsNotCalculated = true;
      return;
    }
    let miPriceJson = localStorage.getItem("miPricing");
    if (miPriceJson === null) {
      console.log(miPriceJson)
      this.miPriceNotCalculated = true;
      return;
    }
    this.tariffs = JSON.parse(tariffsJson);
    this.miPrice = JSON.parse(miPriceJson);
    console.log(this.miPrice)
    this.calculateTable(true);
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
          lpu1withoutRotateAtr = this.miPrice!.mi_cost_data[3].ckv * this.miPrice!.vsuzi_percent * 0.01
          + this.miPrice!.mi_cost_data[6].ckv * this.miPrice!.okt_percent * 0.01
          lpu1withRotateAtr = this.miPrice!.mi_cost_data[3].ckvpa * this.miPrice!.vsuzi_percent * 0.01
            + this.miPrice!.mi_cost_data[6].ckvpa * this.miPrice!.okt_percent * 0.01
        }
        if (groupNumber === 53) {
          lpu1withoutRotateAtr = this.miPrice!.mi_cost_data[4].ckv * this.miPrice!.vsuzi_percent * 0.01
            + this.miPrice!.mi_cost_data[7].ckv * this.miPrice!.okt_percent * 0.01
          lpu1withRotateAtr = this.miPrice!.mi_cost_data[4].ckvpa * this.miPrice!.vsuzi_percent * 0.01
            + this.miPrice!.mi_cost_data[7].ckvpa * this.miPrice!.okt_percent * 0.01
        }
        if (groupNumber === 54) {
          lpu1withoutRotateAtr = this.miPrice!.mi_cost_data[5].ckv * this.miPrice!.vsuzi_percent * 0.01
            + this.miPrice!.mi_cost_data[8].ckv * this.miPrice!.okt_percent * 0.01
          lpu1withRotateAtr = this.miPrice!.mi_cost_data[5].ckvpa * this.miPrice!.vsuzi_percent * 0.01
            + this.miPrice!.mi_cost_data[8].ckvpa * this.miPrice!.okt_percent * 0.01
          console.log(this.miPrice!.vsuzi_percent)
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
        }
        let datasource = localStorage.getItem("datasource");
        if (datasource !== null) {
          var parsedds:IncomesOutcomesModel[] = JSON.parse(datasource);
          resultModel.summaryPatientsCount = parsedds[i].summaryPatientsCount;
          resultModel.countNeedToRA = parsedds[i].countNeedToRA;
        }
        this.calculateOvers(resultModel);
        this.datasource.push(resultModel)
      } else {
        let incomesOutcomesModel = this.datasource[i];
        this.calculateOvers(incomesOutcomesModel);
      }
    }
    if (firstTime) {
      let tariffData = this.tariffs!.data[this.tariffs!.data.length - 1];
      let tariff: number = tariffData.calculated;
      let miPriceData = this.miPrice!.mi_cost_data[this.miPrice!.mi_cost_data.length - 1];
      let dChkv = miPriceData.ckv;
      let eChkvRa = miPriceData.ckvpa;
      let resultModel: IncomesOutcomesModel = {
        haveQuotas: true,
        groupNumber: 60,
        patientModel: "ИБС со стенотическим или окклюзионным поражением коронарных артерий",
        healingMethod: "ротационная коронарная атерэктомия, баллонная вазодилятация с установкой 1-3 стентов в коронарные артерии",
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
      }
      this.calculateOvers(resultModel);
      this.datasource.push(resultModel)
    } else {
      this.calculateOvers(this.datasource[this.datasource.length - 1]);
    }
    this.summary = this.calculateSummary();
   localStorage.setItem("datasource", JSON.stringify(this.datasource))
  }

  calculateSummary(): IncomesOutcomesSummaryModel {
    console.log(this.summary!)
    let summary: IncomesOutcomesSummaryModel = {
      summaryOutcome: 0,
      summaryBudget: 0,
      summaryIncomeLpu: 0,
      additionalPatients: 0
    }
    for (let element of this.datasource) {
      summary.summaryOutcome = summary.summaryOutcome + element.summaryOutcomeForMaterials;
      summary.summaryBudget = summary.summaryBudget + element.budgetLpu;
      summary.summaryIncomeLpu = summary.summaryIncomeLpu + element.incomeLpu;
    }
    summary.additionalPatients = summary.summaryIncomeLpu / this.datasource[0].lpu1withRotateAtr;
    return summary;
  }

  calculateOvers(model: IncomesOutcomesModel) {
    let countNeedToRAtoUse = model.countNeedToRA;
    if (model.countNeedToRA === -1) {
      countNeedToRAtoUse = 0;
    }
    if (model.countNeedToRA !== -1) {
      model.lpu2withoutRotateAtr = (model.summaryPatientsCount - countNeedToRAtoUse) * model.lpu1withoutRotateAtr;
    } else {
      model.lpu2withoutRotateAtr = -1;
    }
    model.lpu2withRotateAtr = countNeedToRAtoUse * model.lpu1withRotateAtr;
    model.summaryOutcomeForMaterials = model.lpu2withRotateAtr + model.lpu2withoutRotateAtr;
    if (model.lpu2withoutRotateAtr === -1) {
      model.lpu2withRotateAtr = model.summaryPatientsCount * model.lpu1withRotateAtr
      model.summaryOutcomeForMaterials = model.lpu2withRotateAtr;
    }
    model.budgetLpu = model.summaryPatientsCount * model.tariff;
    model.incomeLpu = model.budgetLpu - model.summaryOutcomeForMaterials;
  }

  getTooltip(healingMethod: string): string {
    if (healingMethod === 'баллонная вазодилятация и (или) стентирование с установкой 1 стента в сосуд с применением методов внутрисосудистой визуализации*') {
      return 'баллонная вазодилятация и (или) стентирование с установкой 1 стента в сосуд с применением методов внутрисосудистой визуализации и (или) в сочетании с оценкой гемодинамической значимости стеноза по данным физиологической оценки коронарного кровотока (ФРК или МРК) при ишемической болезни сердца';
    } else if (healingMethod === 'баллонная вазодилятация и (или) стентирование с установкой 2 стентов в сосуд с применением методов внутрисосудистой визуализации*') {
      return 'баллонная вазодилятация и (или) стентирование с установкой 2 стентов в сосуд с применением методов внутрисосудистой визуализации и (или) в сочетании с оценкой гемодинамической значимости стеноза по данным физиологической оценки коронарного кровотока (ФРК или МРК) при ишемической болезни сердца';
    } else if (healingMethod === 'баллонная вазодилятация и (или) стентирование с установкой 3 стента в сосуд с применением методов внутрисосудистой визуализации*') {
      return 'Ваш текст подсказки для 3 стентов с внутрисосудистой визуализацией';
    } else if (healingMethod === 'баллонная вазодилятация и (или) стентирование с установкой 3 стентов в сосуд с применением методов внутрисосудистой визуализации и (или) в сочетании с оценкой гемодинамической значимости стеноза по данным физиологической оценки коронарного кровотока (ФРК или МРК) при ишемической болезни сердца') {
      return 'Вбаллонная вазодилятация и (или) стентирование с установкой 3 стентов в сосуд с применением методов внутрисосудистой визуализации и (или) в сочетании с оценкой гемодинамической значимости стеноза по данным физиологической оценки коронарного кровотока (ФРК или МРК) при ишемической болезни сердца';
    } else {
      return '';
    }
  }

}
