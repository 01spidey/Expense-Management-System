import { TestBed } from '@angular/core/testing';

import { RevGuardGuard } from './rev-guard.guard';

describe('RevGuardGuard', () => {
  let guard: RevGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RevGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
