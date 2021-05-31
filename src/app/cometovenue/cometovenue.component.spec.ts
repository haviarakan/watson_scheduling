import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CometovenueComponent } from './cometovenue.component';

describe('CometovenueComponent', () => {
  let component: CometovenueComponent;
  let fixture: ComponentFixture<CometovenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CometovenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CometovenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
