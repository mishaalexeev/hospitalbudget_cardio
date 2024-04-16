import {Component, OnInit} from '@angular/core';
import {TarrifTableResponseModel} from "./model/tarrif-table-response-model";
import {RegionsListResponse} from "./model/regions-list-response";
import {TarrifsService} from "./service/tarrifs.service";

@Component({
  selector: 'app-tarrifs',
  templateUrl: './tarrifs.component.html',
  styleUrls: ['./tarrifs.component.scss']
})
export class TarrifsComponent implements OnInit {

  loadingRegions: boolean = false;
  loadingTable: boolean = false;
  dataLoaded: boolean = false;

  regions: RegionsListResponse = {
    data: []
  }

  tarrifDatasource: TarrifTableResponseModel = {
    data: []
  }

  pickedRegion: string | null = null;

  salaryAndOthers: number = 10;

  constructor(private _service: TarrifsService) {
  }

  ngOnInit(): void {
    let sourceRegion = localStorage.getItem("pickedRegion");
    if (sourceRegion !== null) {
      this.pickedRegion = sourceRegion;
    }
    let sourceTarrif = localStorage.getItem("tarrifRes");
    let salaryAndOthersSource = localStorage.getItem("salaryAndOthers");
    if (sourceTarrif !== null && salaryAndOthersSource !== null) {
      this.tarrifDatasource = JSON.parse(sourceTarrif);
      this.salaryAndOthers = parseInt(salaryAndOthersSource, 10);
      this.calculateTarifMinusSalaryAndOthers();
    }
    this.loadingRegions = true;
    this._service.loadRegions().subscribe({
      next: res => {
        console.log(res)
        this.regions = res;
        this.regions.data = this.regions.data.sort((a, b) => ('' + a.region).localeCompare(b.region))
        this.loadingRegions = false;
      },
      error: err => {
        console.log(err);
        this.loadingRegions = false;
      }
    })
  }

  public loadTarrifs(): void {
    this.loadingTable = true;
    this._service.loadTarrifs(this.pickedRegion!).subscribe({
      next: res => {
        console.log(res);
        this.tarrifDatasource = res;
        localStorage.setItem("pickedRegion", this.pickedRegion!);
        localStorage.setItem("tarrifRes", JSON.stringify(res));
        localStorage.setItem("salaryAndOthers", this.salaryAndOthers.toString());
        this.calculateTarifMinusSalaryAndOthers();
        this.loadingTable = false
      },
      error: err => {
        console.log(err);
        this.loadingTable = false;
      }
    })
  }

  calculateTarifMinusSalaryAndOthers() {
    this.tarrifDatasource.data.forEach(tariff => {
      tariff.calculated = tariff.tarif - (tariff.tarif * this.salaryAndOthers/100)
    })
    localStorage.setItem("tariffs", JSON.stringify(this.tarrifDatasource));
  }

  changeRegions() {
    console.log(this.pickedRegion);
  }

  getKdFromRegion(): string {
    let index = this.regions.data.findIndex(region => {
      return region.region === this.pickedRegion;
    });
    if (index === -1) {
      return 'КД не определен'
    }
    return this.regions.data[index].coef + '';
  }

  setStorage() {
    localStorage.setItem('tarrifRes', JSON.stringify(this.tarrifDatasource));
  }
}
