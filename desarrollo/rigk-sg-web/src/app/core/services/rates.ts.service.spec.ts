import { TestBed } from '@angular/core/testing';

import { RatesTsService } from './rates.ts.service';

describe('RatesTsService', () => {
  let service: RatesTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RatesTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
