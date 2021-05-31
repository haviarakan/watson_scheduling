import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingscreenComponent } from './onboardingscreen.component';

describe('OnboardingscreenComponent', () => {
  let component: OnboardingscreenComponent;
  let fixture: ComponentFixture<OnboardingscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingscreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
