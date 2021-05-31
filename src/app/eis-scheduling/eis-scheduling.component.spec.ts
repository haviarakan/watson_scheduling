import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EISSchedulingComponent } from './eis-scheduling.component';

describe('EISSchedulingComponent', () => {
  let component: EISSchedulingComponent;
  let fixture: ComponentFixture<EISSchedulingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EISSchedulingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EISSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
