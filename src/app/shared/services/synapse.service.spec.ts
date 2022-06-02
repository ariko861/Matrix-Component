import { TestBed } from '@angular/core/testing';

import { SynapseService } from './synapse.service';

describe('SynapseService', () => {
  let service: SynapseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SynapseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
