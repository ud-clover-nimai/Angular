import { TestBed } from '@angular/core/testing';

import { NewTransactionService } from './new-transaction.service';

describe('NewTransactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewTransactionService = TestBed.get(NewTransactionService);
    expect(service).toBeTruthy();
  });
});
