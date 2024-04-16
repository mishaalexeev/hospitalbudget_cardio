import {Component, OnInit} from '@angular/core';
import {Pair} from "../help/pair";
import {MiForChkvTableModel} from "./model/mi-for-chkv-table-model";
import {HttpClient} from "@angular/common/http";
import {MiPricingService} from "./service/mi-pricing.service";
import {MiForChkvResultModel} from "./model/mi-for-chkv-result-model";

@Component({
  selector: 'app-mi-pricing',
  templateUrl: './mi-pricing.component.html',
  styleUrls: ['./mi-pricing.component.scss']
})
export class MiPricingComponent implements OnInit{

  defaultPercentage = 50;

  loadingTable: boolean = false;

  miForChvkDataSource: MiForChkvTableModel = {
    rota_pro_cost: 0,
    stent: 28_000,
    introducer: 3_300,
    diagnostic_catheter: 1_600,
    guide_catheter: 7_000,
    guide: 8_000,
    predilatory_balloon: 13_000,
    postdilatory_balloon: 13_000,
    vsuzi_conductor: 100_000,
    okt_conductor: 135_000,
    conductor: 17_000,
    drill_advance: 86_000
  }

  sliderCost: number = 10;

  miForChvkResultDataSource: MiForChkvResultModel = {
    rota_pro_cost: 0,
    ra_with_three_stents: 0,
    mi_cost_data: [],
    vsuzi_percent: this.defaultPercentage,
    okt_percent: this.defaultPercentage
  }

  constructor(private _service: MiPricingService) {
  }

  ngOnInit(): void {
    let source = localStorage.getItem("miForChvkDataSource");
    if (source !== null) {
      this.miForChvkDataSource = JSON.parse(source);
    }
    let result = localStorage.getItem("miPricing");
    if (result !== null) {
      this.miForChvkResultDataSource = JSON.parse(result);
    }
    let sliderCostSrc = localStorage.getItem("sliderCost");
    if (sliderCostSrc !== null) {
      this.sliderCost = parseInt(sliderCostSrc, 10);
    }
    this.miForChvkDataSource.rota_pro_cost = this.calculateRotaCost();
  }

  sendData() {
    this.loadingTable = true;
    this._service.calculateMi(this.miForChvkDataSource).subscribe({
      next: resp => {
        this.miForChvkResultDataSource = resp;
        this.miForChvkResultDataSource.okt_percent = this.defaultPercentage;
        this.miForChvkResultDataSource.vsuzi_percent = this.defaultPercentage;
        localStorage.setItem("miPricing", JSON.stringify(this.miForChvkResultDataSource));
        localStorage.setItem("sliderCost", this.sliderCost.toString());
        this.loadingTable = false;
      },
      error: err => {
        console.log(err);
        this.loadingTable = false;
      }
    })
  }

  costSliderChange($event: any) {
    this.miForChvkDataSource.rota_pro_cost = this.calculateRotaCost();
  }

  calculateRotaCost(): number {
    console.log(this.sliderCost)
    return Math.floor(this.miForChvkDataSource.conductor + this.miForChvkDataSource.drill_advance + this.miForChvkDataSource.drill_advance * (this.sliderCost/100));
  }

  setStorage() {
    this.miForChvkDataSource.rota_pro_cost = this.calculateRotaCost();
    localStorage.setItem('miForChvkDataSource', JSON.stringify(this.miForChvkDataSource));
  }

  updateValues() {
    // Обновление значения для второго инпута так, чтобы общая сумма была равна 100
    this.miForChvkDataSource.drill_advance = 100 - this.miForChvkDataSource.conductor;
    this.setStorage();
  }

}
