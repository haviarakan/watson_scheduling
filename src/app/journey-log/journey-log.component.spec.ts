import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyLogComponent } from './journey-log.component';

describe('JourneyLogComponent', () => {
  let component: JourneyLogComponent;
  let fixture: ComponentFixture<JourneyLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JourneyLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
