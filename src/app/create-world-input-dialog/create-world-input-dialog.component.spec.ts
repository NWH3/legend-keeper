import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorldInputDialogComponent } from './create-world-input-dialog.component';

describe('CreateWorldInputDialogComponent', () => {
  let component: CreateWorldInputDialogComponent;
  let fixture: ComponentFixture<CreateWorldInputDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWorldInputDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorldInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
