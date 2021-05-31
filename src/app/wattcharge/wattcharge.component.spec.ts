import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WattchargeComponent } from './wattcharge.component';

describe('WattchargeComponent', () => {
  let component: WattchargeComponent;
  let fixture: ComponentFixture<WattchargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WattchargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WattchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
