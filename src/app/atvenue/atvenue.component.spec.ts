import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtvenueComponent } from './atvenue.component';

describe('AtvenueComponent', () => {
  let component: AtvenueComponent;
  let fixture: ComponentFixture<AtvenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AtvenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtvenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
