import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminformslookComponent } from './adminformslook.component';

describe('AdminformslookComponent', () => {
  let component: AdminformslookComponent;
  let fixture: ComponentFixture<AdminformslookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminformslookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminformslookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
