import { TestBed } from '@angular/core/testing';

import { ApiSGService } from './apiSG.service';

describe('ApiTriviaService', () => {
  let service: ApiSGService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiSGService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
