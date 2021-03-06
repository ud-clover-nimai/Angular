import { TestBed } from '@angular/core/testing';

import { ReferService } from './refer.service';

describe('ReferService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReferService = TestBed.get(ReferService);
    expect(service).toBeTruthy();
  });
});
