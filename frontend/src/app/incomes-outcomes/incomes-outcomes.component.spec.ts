import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomesOutcomesComponent } from './incomes-outcomes.component';

describe('IncomesOutcomesComponent', () => {
  let component: IncomesOutcomesComponent;
  let fixture: ComponentFixture<IncomesOutcomesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomesOutcomesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomesOutcomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
