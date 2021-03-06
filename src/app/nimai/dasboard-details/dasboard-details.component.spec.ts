import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DasboardDetailsComponent } from './dasboard-details.component';

describe('DasboardDetailsComponent', () => {
  let component: DasboardDetailsComponent;
  let fixture: ComponentFixture<DasboardDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DasboardDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DasboardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
