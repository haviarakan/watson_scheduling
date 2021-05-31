import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleInitiationComponent } from './sale-initiation.component';

describe('SaleInitiationComponent', () => {
  let component: SaleInitiationComponent;
  let fixture: ComponentFixture<SaleInitiationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleInitiationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleInitiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
