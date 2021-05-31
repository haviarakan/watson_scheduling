import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNeweisdialogComponent } from './add-neweisdialog.component';

describe('AddNeweisdialogComponent', () => {
  let component: AddNeweisdialogComponent;
  let fixture: ComponentFixture<AddNeweisdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNeweisdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNeweisdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
