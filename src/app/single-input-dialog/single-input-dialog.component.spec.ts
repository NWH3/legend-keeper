import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleInputDialogComponent } from './single-input-dialog.component';

describe('SingleInputDialogComponent', () => {
  let component: SingleInputDialogComponent;
  let fixture: ComponentFixture<SingleInputDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleInputDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
