import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaClassListingComponent } from './fa-class-listing.component';

describe('FaClassListingComponent', () => {
  let component: FaClassListingComponent;
  let fixture: ComponentFixture<FaClassListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaClassListingComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FaClassListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
