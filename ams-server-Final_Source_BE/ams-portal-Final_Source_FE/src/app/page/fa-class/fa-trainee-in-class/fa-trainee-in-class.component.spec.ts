import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaTraineeInClassComponent } from './fa-trainee-in-class.component';

describe('FaTraineeInClassComponent', () => {
  let component: FaTraineeInClassComponent;
  let fixture: ComponentFixture<FaTraineeInClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaTraineeInClassComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaTraineeInClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
