import { TestBed } from '@angular/core/testing';

import { UploadLcService } from './upload-lc.service';

describe('UploadLcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadLcService = TestBed.get(UploadLcService);
    expect(service).toBeTruthy();
  });
});
