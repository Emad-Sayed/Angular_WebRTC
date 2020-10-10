import { TestBed } from '@angular/core/testing';

import { ConnectionHandlingService } from './connection-handling.service';

describe('ConnectionHandlingService', () => {
  let service: ConnectionHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectionHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
