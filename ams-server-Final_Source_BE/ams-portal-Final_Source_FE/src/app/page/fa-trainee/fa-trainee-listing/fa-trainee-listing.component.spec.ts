import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaTraineeListingComponent } from './fa-trainee-listing.component';

describe('FaTraineeListingComponent', () => {
  let component: FaTraineeListingComponent;
  let fixture: ComponentFixture<FaTraineeListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaTraineeListingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaTraineeListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
