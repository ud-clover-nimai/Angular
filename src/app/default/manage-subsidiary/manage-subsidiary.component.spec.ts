import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSubsidiaryComponent } from './manage-subsidiary.component';

describe('ManageSubsidiaryComponent', () => {
  let component: ManageSubsidiaryComponent;
  let fixture: ComponentFixture<ManageSubsidiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSubsidiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSubsidiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
