import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Task} from "../model/Models";

@Component({
  selector: 'app-delete-task-dialog',
  templateUrl: './delete-task-dialog.component.html',
  styleUrls: ['./delete-task-dialog.component.css']
})
export class DeleteTaskDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Task) { }

  ngOnInit(): void {
  }

}
