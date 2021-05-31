import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeslaLogComponent } from './tesla-log.component';

describe('TeslaLogComponent', () => {
  let component: TeslaLogComponent;
  let fixture: ComponentFixture<TeslaLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeslaLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeslaLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
