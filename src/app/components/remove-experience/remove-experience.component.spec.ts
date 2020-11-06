import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveExperienceComponent } from './remove-experience.component';

describe('RemoveExperienceComponent', () => {
  let component: RemoveExperienceComponent;
  let fixture: ComponentFixture<RemoveExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
