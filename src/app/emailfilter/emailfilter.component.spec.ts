import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailfilterComponent } from './emailfilter.component';

describe('EmailfilterComponent', () => {
  let component: EmailfilterComponent;
  let fixture: ComponentFixture<EmailfilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailfilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
