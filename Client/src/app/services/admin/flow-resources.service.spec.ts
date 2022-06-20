import { TestBed } from '@angular/core/testing';

import { FlowResourcesService } from './flow-resources.service';

describe('FlowResourcesService', () => {
  let service: FlowResourcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowResourcesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
