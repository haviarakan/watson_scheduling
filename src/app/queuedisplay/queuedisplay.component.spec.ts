import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueuedisplayComponent } from './queuedisplay.component';

describe('QueuedisplayComponent', () => {
  let component: QueuedisplayComponent;
  let fixture: ComponentFixture<QueuedisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueuedisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueuedisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
