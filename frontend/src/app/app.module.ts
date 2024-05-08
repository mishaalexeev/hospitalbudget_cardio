import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ClarityModule} from "@clr/angular";
import {MiPricingComponent} from './mi-pricing/mi-pricing.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MiPricingService} from "./mi-pricing/service/mi-pricing.service";
import {HttpClientModule} from "@angular/common/http";
import {TarrifsComponent} from './tarrifs/tarrifs.component';
import {TarrifsService} from "./tarrifs/service/tarrifs.service";
import { RoundPipe } from './round.pipe';
import { IncomesOutcomesComponent } from './incomes-outcomes/incomes-outcomes.component';
import { HomeComponent } from './home/home.component';
import { CookieBannerComponent } from './cookie-banner/cookie-banner.component';
import { ChangeLanguageComponent } from './change-language/change-language.component';

@NgModule({
  declarations: [
    AppComponent,
    MiPricingComponent,
    TarrifsComponent,
    RoundPipe,
    IncomesOutcomesComponent,
    HomeComponent,
    CookieBannerComponent,
    ChangeLanguageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    MiPricingService,
    TarrifsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
