import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewproductDialogComponent } from './add-newproduct-dialog.component';

describe('AddNewproductDialogComponent', () => {
  let component: AddNewproductDialogComponent;
  let fixture: ComponentFixture<AddNewproductDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewproductDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewproductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
