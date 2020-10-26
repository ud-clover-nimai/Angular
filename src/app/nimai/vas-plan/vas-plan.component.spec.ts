import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VasPlanComponent } from './vas-plan.component';

describe('VasPlanComponent', () => {
  let component: VasPlanComponent;
  let fixture: ComponentFixture<VasPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VasPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VasPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
