import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiPricingComponent } from './mi-pricing.component';

describe('MiPricingComponent', () => {
  let component: MiPricingComponent;
  let fixture: ComponentFixture<MiPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiPricingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
