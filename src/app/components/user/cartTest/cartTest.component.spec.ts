/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CartTestComponent } from './cartTest.component';

describe('CartTestComponent', () => {
  let component: CartTestComponent;
  let fixture: ComponentFixture<CartTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
