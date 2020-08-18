import { TestBed } from '@angular/core/testing';

import { BusinessDetailsService } from './business-details.service';

describe('BusinessDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BusinessDetailsService = TestBed.get(BusinessDetailsService);
    expect(service).toBeTruthy();
  });
});
