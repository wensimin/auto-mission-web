import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-test-code-dialog',
  templateUrl: './test-code-dialog.component.html',
  styleUrls: ['./test-code-dialog.component.css']
})
export class TestCodeDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: String) {

  }

  ngOnInit(): void {
  }

}
