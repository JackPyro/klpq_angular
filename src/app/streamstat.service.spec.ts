import { TestBed } from '@angular/core/testing';

import { StreamstatService } from './streamstat.service';

describe('StreamstatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StreamstatService = TestBed.get(StreamstatService);
    expect(service).toBeTruthy();
  });
});
