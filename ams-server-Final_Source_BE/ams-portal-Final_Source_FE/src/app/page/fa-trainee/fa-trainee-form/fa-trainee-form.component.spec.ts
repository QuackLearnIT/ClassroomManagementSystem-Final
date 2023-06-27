import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaTraineeFormComponent } from './fa-trainee-form.component';

describe('FaTraineeFormComponent', () => {
  let component: FaTraineeFormComponent;
  let fixture: ComponentFixture<FaTraineeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaTraineeFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaTraineeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
