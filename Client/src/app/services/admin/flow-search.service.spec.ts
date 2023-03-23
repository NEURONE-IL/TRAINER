import { TestBed } from '@angular/core/testing';

import { FlowSearchService } from './flow-search.service';

describe('FlowSearchService', () => {
  let service: FlowSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
