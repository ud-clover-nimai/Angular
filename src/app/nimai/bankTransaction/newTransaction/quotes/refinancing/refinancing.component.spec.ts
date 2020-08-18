import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefinancingComponent } from './refinancing.component';

describe('RefinancingComponent', () => {
  let component: RefinancingComponent;
  let fixture: ComponentFixture<RefinancingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefinancingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefinancingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
