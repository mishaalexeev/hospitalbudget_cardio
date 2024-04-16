import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MiPricingComponent} from "./mi-pricing/mi-pricing.component";
import {TarrifsComponent} from "./tarrifs/tarrifs.component";
import {IncomesOutcomesComponent} from "./incomes-outcomes/incomes-outcomes.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  {path: 'pricing', component: MiPricingComponent},
  {path: 'tarrifs', component: TarrifsComponent},
  {path: 'incomes-outcomes', component: IncomesOutcomesComponent},
  {path: 'home', component: HomeComponent},
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
