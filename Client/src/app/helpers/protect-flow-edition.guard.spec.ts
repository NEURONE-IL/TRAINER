import { TestBed } from '@angular/core/testing';

import { ProtectFlowEditionGuard } from './protect-flow-edition.guard';

describe('ProtectFlowEditionGuard', () => {
  let guard: ProtectFlowEditionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProtectFlowEditionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
