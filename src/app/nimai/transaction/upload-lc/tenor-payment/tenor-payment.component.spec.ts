import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenorPaymentComponent } from './tenor-payment.component';

describe('TenorPaymentComponent', () => {
  let component: TenorPaymentComponent;
  let fixture: ComponentFixture<TenorPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenorPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenorPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
