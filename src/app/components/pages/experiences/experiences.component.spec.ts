import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperiencesPageComponent } from './experiences.component';

describe('ExperiencesComponent', () => {
  let component: ExperiencesPageComponent;
  let fixture: ComponentFixture<ExperiencesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperiencesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperiencesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
