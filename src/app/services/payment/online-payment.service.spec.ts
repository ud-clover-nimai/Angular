import { TestBed } from '@angular/core/testing';

import { OnlinePaymentService } from './online-payment.service';

describe('OnlinePaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnlinePaymentService = TestBed.get(OnlinePaymentService);
    expect(service).toBeTruthy();
  });
});
