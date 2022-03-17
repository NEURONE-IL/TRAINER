import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedalShowcaseComponent } from './medal-showcase.component';

describe('MedalShowcaseComponent', () => {
  let component: MedalShowcaseComponent;
  let fixture: ComponentFixture<MedalShowcaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedalShowcaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedalShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
