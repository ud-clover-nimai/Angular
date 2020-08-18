import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermAndConditionsComponent } from './term-and-conditions.component';

describe('TermAndConditionsComponent', () => {
  let component: TermAndConditionsComponent;
  let fixture: ComponentFixture<TermAndConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermAndConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermAndConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
