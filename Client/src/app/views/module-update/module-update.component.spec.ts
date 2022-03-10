import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleUpdateComponent } from './module-update.component';

describe('ModuleUpdateComponent', () => {
  let component: ModuleUpdateComponent;
  let fixture: ComponentFixture<ModuleUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
