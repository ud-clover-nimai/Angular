import { TestBed } from '@angular/core/testing';

import { SubscriptionDetailsService } from './subscription-details.service';

describe('SubscriptionDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubscriptionDetailsService = TestBed.get(SubscriptionDetailsService);
    expect(service).toBeTruthy();
  });
});
