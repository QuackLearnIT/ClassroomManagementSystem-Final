import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaClassViewComponent } from './fa-class-view.component';

describe('FaClassViewComponent', () => {
  let component: FaClassViewComponent;
  let fixture: ComponentFixture<FaClassViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaClassViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaClassViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
