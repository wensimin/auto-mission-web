import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCodeDialogComponent } from './test-code-dialog.component';

describe('TestCodeDialogComponent', () => {
  let component: TestCodeDialogComponent;
  let fixture: ComponentFixture<TestCodeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestCodeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
