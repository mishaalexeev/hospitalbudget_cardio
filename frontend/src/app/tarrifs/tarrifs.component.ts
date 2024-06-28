import { Component, OnInit } from '@angular/core';
import { TarrifTableResponseModel } from './model/tarrif-table-response-model';
import { RegionsListResponse } from './model/regions-list-response';
import { TarrifsService } from './service/tarrifs.service';
import {Region} from "./model/region";

@Component({
  selector: 'app-tarrifs',
  templateUrl: './tarrifs.component.html',
  styleUrls: ['./tarrifs.component.scss'],
})
export class TarrifsComponent implements OnInit {
  currentLanguage: string = 'RU';
  textGroupVMP!: string;
  textTarrif!: string;
  textTarrifMinusDZP!: string;
  textKoeffDiff!: string;
  textKoeffDiffInfo!: string;
  textZP!: string;
  textZPInfo!: string;
  textButtonCount!: string;
  textChooseRegion!: string;
  textDataUnloaded!: string;

  loadingRegions: boolean = false;
  loadingTable: boolean = false;
  dataLoaded: boolean = false;

  regions: RegionsListResponse = {
    data: [],
  };

  tarrifDatasource: TarrifTableResponseModel = {
    data: [],
  };

  pickedRegion: Region | null = null;
  displayPickedRegion: string | null = null;
  salaryAndOthers: number = 10;

  constructor(private _service: TarrifsService) {
    this.currentLanguage = localStorage.getItem('currentLanguage') || 'RU';
    this.loadTexts();
  }

  loadTexts() {
    if (this.currentLanguage === 'RU') {
      this.textGroupVMP = 'Группа ВМП';
      this.textTarrif = 'Тариф, руб';
      this.textTarrifMinusDZP = 'Тариф за вычетом ДЗП и пр.расходов, руб.';
      this.textKoeffDiff = 'Коэффициент дифференциации:';
      this.textKoeffDiffInfo = 'Значение КД влияет на размер тарифа.';
      this.textZP = 'Заработная плата и прочие расходы:';
      this.textZPInfo =
        'Доля на заработную плату (ДЗП) и пр.расходы вычитается из тарифа.';
      this.textButtonCount = 'Рассчитать тариф';
      this.textChooseRegion = 'Выберите регион';
      this.textDataUnloaded = 'Данные не загружены';
    } else if (this.currentLanguage === 'EN') {
      this.textGroupVMP = 'HTMC group';
      this.textTarrif = 'Tariff, rub';
      this.textTarrifMinusDZP = 'Tariff minus salary and other expenses, rub.';
      this.textKoeffDiff = 'Coefficient of differentiation:';
      this.textKoeffDiffInfo = 'The CD value affects the size of the tariff.';
      this.textZP = 'Share of salary and other expenses:';
      this.textZPInfo =
        'The share of salary (SS) and other expenses is deducted from the tariff.';
      this.textButtonCount = 'Calculate tariff';
      this.textChooseRegion = 'Choose region';
      this.textDataUnloaded = 'Data not loaded';
    }
  }

  ngOnInit(): void {
    let sourceRegion = localStorage.getItem('pickedRegion');
    if (sourceRegion !== null) {
      this.pickedRegion = JSON.parse(sourceRegion);
      this.displayPickedRegion = this.pickedRegion!.region;
    }
    let sourceTarrif = localStorage.getItem('tarrifRes');
    let salaryAndOthersSource = localStorage.getItem('salaryAndOthers');
    if (sourceTarrif !== null && salaryAndOthersSource !== null) {
      this.tarrifDatasource = JSON.parse(sourceTarrif);
      this.salaryAndOthers = parseInt(salaryAndOthersSource, 10);
      this.calculateTarifMinusSalaryAndOthers();
    }
    this.loadingRegions = true;
    this._service.loadRegions().subscribe({
      next: (res) => {
        console.log(res);
        this.regions = res;
        this.regions.data = this.regions.data.sort((a, b) =>
          ('' + a.region).localeCompare(b.region)
        );
        if (this.pickedRegion != null) {
          for (let regLoaded of this.regions.data) {
            if (regLoaded.id === this.pickedRegion.id) {
              this.pickedRegion = regLoaded
              this.displayPickedRegion = this.pickedRegion.region
              this.loadTarrifs()
            }
          }
        }
        this.loadingRegions = false;
      },
      error: (err) => {
        console.log(err);
        this.loadingRegions = false;
      },
    });
  }

  public loadTarrifs(): void {
    this.loadingTable = true;
    this._service.loadTarrifs(this.pickedRegion!.id).subscribe({
      next: (res) => {
        console.log(res);
        this.tarrifDatasource = res;
        localStorage.setItem('pickedRegion', JSON.stringify(this.pickedRegion));
        localStorage.setItem('tarrifRes', JSON.stringify(res));
        localStorage.setItem(
          'salaryAndOthers',
          this.salaryAndOthers.toString()
        );
        this.calculateTarifMinusSalaryAndOthers();
        this.loadingTable = false;
      },
      error: (err) => {
        console.log(err);
        this.loadingTable = false;
      },
    });
  }

  calculateTarifMinusSalaryAndOthers() {
    this.tarrifDatasource.data.forEach((tariff) => {
      tariff.calculated =
        tariff.tarif - (tariff.tarif * this.salaryAndOthers) / 100;
    });
    localStorage.setItem('tariffs', JSON.stringify(this.tarrifDatasource));
  }

  changeRegions(region: Region) {
    this.pickedRegion = region
    console.log(this.pickedRegion);
  }

  getKdFromRegion(): string {
    let index = this.regions.data.findIndex((region) => {
      return region.id === this.pickedRegion?.id;
    });
    if (index === -1) {
      return '?';
    }
    return this.regions.data[index].coef + '';
  }

  setStorage() {
    localStorage.setItem('tarrifRes', JSON.stringify(this.tarrifDatasource));
  }
}
