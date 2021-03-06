import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountingComponent } from './discounting.component';

describe('DiscountingComponent', () => {
  let component: DiscountingComponent;
  let fixture: ComponentFixture<DiscountingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
