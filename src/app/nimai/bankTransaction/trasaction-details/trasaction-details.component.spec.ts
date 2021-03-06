import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrasactionDetailsComponent } from './trasaction-details.component';

describe('TrasactionDetailsComponent', () => {
  let component: TrasactionDetailsComponent;
  let fixture: ComponentFixture<TrasactionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrasactionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrasactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
