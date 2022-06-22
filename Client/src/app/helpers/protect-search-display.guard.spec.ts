import { TestBed } from '@angular/core/testing';

import { ProtectSearchDisplayGuard } from './protect-search-display.guard';

describe('ProtectSearchDisplayGuard', () => {
  let guard: ProtectSearchDisplayGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProtectSearchDisplayGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
