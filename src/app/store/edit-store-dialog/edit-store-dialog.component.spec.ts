import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStoreDialogComponent } from './edit-store-dialog.component';

describe('EditStoreDialogComponent', () => {
  let component: EditStoreDialogComponent;
  let fixture: ComponentFixture<EditStoreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStoreDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
