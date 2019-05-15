import { TestBed, inject } from '@angular/core/testing';

import { MySchematicService } from './my-schematic.service';

describe('MySchematicService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MySchematicService]
    });
  });

  it('should be created', inject([MySchematicService], (service: MySchematicService) => {
    expect(service).toBeTruthy();
  }));
});
