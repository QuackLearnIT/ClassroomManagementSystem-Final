import { TestBed } from '@angular/core/testing';

import { ClassAuditService } from './class-audit.service';

describe('ClassAuditService', () => {
  let service: ClassAuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassAuditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
