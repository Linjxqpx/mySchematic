import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySchematicComponent } from './my-schematic.component';

describe('MySchematicComponent', () => {
  let component: MySchematicComponent;
  let fixture: ComponentFixture<MySchematicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySchematicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySchematicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
