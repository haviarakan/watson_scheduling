import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtemplateComponent } from './etemplate.component';

describe('EtemplateComponent', () => {
  let component: EtemplateComponent;
  let fixture: ComponentFixture<EtemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
