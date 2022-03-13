import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugCodeDialogComponent } from './debug-code-dialog.component';

describe('TestCodeDialogComponent', () => {
  let component: DebugCodeDialogComponent;
  let fixture: ComponentFixture<DebugCodeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebugCodeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugCodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
