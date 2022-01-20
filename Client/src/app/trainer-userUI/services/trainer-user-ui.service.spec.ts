import { TestBed } from '@angular/core/testing';

import { TrainerUserUIService } from './trainer-user-ui.service';

describe('TrainerUserUIService', () => {
  let service: TrainerUserUIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainerUserUIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
