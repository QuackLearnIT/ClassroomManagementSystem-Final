import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaTraineeDetailComponent } from './fa-trainee-detail.component';

describe('FaTraineeDetailComponent', () => {
  let component: FaTraineeDetailComponent;
  let fixture: ComponentFixture<FaTraineeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaTraineeDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaTraineeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
