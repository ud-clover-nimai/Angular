import { TestBed } from '@angular/core/testing';

import { KycuploadService } from './kycupload.service';

describe('KycuploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KycuploadService = TestBed.get(KycuploadService);
    expect(service).toBeTruthy();
  });
});
