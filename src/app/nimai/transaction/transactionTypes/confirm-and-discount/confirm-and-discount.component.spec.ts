import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAndDiscountComponent } from './confirm-and-discount.component';

describe('ConfirmAndDiscountComponent', () => {
  let component: ConfirmAndDiscountComponent;
  let fixture: ComponentFixture<ConfirmAndDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmAndDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAndDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
