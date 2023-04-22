import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyexpenseComponent } from './myexpense.component';

describe('MyexpenseComponent', () => {
  let component: MyexpenseComponent;
  let fixture: ComponentFixture<MyexpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyexpenseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyexpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
