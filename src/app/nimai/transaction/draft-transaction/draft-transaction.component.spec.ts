import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftTransactionComponent } from './draft-transaction.component';

describe('DraftTransactionComponent', () => {
  let component: DraftTransactionComponent;
  let fixture: ComponentFixture<DraftTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
