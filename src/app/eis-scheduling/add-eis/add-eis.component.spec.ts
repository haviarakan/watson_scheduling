import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEisComponent } from './add-eis.component';

describe('AddEisComponent', () => {
  let component: AddEisComponent;
  let fixture: ComponentFixture<AddEisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
