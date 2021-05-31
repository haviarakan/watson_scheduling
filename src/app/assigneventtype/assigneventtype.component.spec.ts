import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigneventtypeComponent } from './assigneventtype.component';

describe('AssigneventtypeComponent', () => {
  let component: AssigneventtypeComponent;
  let fixture: ComponentFixture<AssigneventtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssigneventtypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigneventtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
