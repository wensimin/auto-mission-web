import { TestBed } from '@angular/core/testing';

import { TaskEditGuard } from './task-edit.guard';

describe('TaskEditGuard', () => {
  let guard: TaskEditGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TaskEditGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
