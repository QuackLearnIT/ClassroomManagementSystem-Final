import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaClassFormComponent } from './fa-class-form.component';

describe('FaClassFormComponent', () => {
  let component: FaClassFormComponent;
  let fixture: ComponentFixture<FaClassFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaClassFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaClassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
