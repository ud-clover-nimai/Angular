import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadLcNewComponent } from './upload-lc-new.component';

describe('UploadLcNewComponent', () => {
  let component: UploadLcNewComponent;
  let fixture: ComponentFixture<UploadLcNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadLcNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadLcNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
