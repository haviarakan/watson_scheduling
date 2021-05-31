import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationformComponent } from './confirmationform.component';

describe('ConfirmationformComponent', () => {
  let component: ConfirmationformComponent;
  let fixture: ComponentFixture<ConfirmationformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
