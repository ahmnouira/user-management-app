import { TestBed } from '@angular/core/testing';

import { FirebaseDBService } from './firebase-db.service';

describe('FirebaseDBService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseDBService = TestBed.get(FirebaseDBService);
    expect(service).toBeTruthy();
  });
});
