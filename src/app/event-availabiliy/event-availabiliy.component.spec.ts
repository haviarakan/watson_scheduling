import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAvailabiliyComponent } from './event-availabiliy.component';

describe('EventAvailabiliyComponent', () => {
  let component: EventAvailabiliyComponent;
  let fixture: ComponentFixture<EventAvailabiliyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventAvailabiliyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAvailabiliyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
