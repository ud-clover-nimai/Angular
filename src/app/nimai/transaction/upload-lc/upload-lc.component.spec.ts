import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadLCComponent } from './upload-lc.component';

describe('UploadLCComponent', () => {
  let component: UploadLCComponent;
  let fixture: ComponentFixture<UploadLCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadLCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadLCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
