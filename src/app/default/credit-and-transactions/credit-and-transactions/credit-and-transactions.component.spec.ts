import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditAndTransactionsComponent } from './credit-and-transactions.component';

describe('CreditAndTransactionsComponent', () => {
  let component: CreditAndTransactionsComponent;
  let fixture: ComponentFixture<CreditAndTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditAndTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditAndTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
