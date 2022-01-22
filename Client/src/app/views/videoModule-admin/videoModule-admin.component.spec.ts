import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVideoModuleComponent } from './videoModule-admin.component';

describe('AdminVideoModuleComponent', () => {
  let component: AdminVideoModuleComponent;
  let fixture: ComponentFixture<AdminVideoModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminVideoModuleComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVideoModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
