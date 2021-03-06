import { TestBed } from '@angular/core/testing';

import { DashboardDetailsService } from './dashboard-details.service';

describe('DashboardDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardDetailsService = TestBed.get(DashboardDetailsService);
    expect(service).toBeTruthy();
  });
});
