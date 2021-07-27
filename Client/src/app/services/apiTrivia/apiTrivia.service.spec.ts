import { TestBed } from '@angular/core/testing';

import { ApiTriviaService } from './apiTrivia.service';

describe('ApiTriviaService', () => {
  let service: ApiTriviaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiTriviaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
