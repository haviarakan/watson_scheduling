import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StagequeuemanagementComponent } from './stagequeuemanagement.component';

describe('StagequeuemanagmentComponent', () => {
  let component: StagequeuemanagementComponent;
  let fixture: ComponentFixture<StagequeuemanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StagequeuemanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StagequeuemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
