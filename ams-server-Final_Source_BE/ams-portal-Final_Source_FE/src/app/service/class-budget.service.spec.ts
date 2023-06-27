import { TestBed } from '@angular/core/testing';

import { ClassBudgetService } from './class-budget.service';

describe('ClassBudgetService', () => {
  let service: ClassBudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassBudgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
