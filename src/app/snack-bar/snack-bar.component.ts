import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from "@angular/material/snack-bar";

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {
  type: String
  message: String

  constructor(@Inject(MAT_SNACK_BAR_DATA) data: SnackBarConfig) {
    this.type = data.type
    this.message = data.message
  }

  ngOnInit(): void {
  }

}

interface SnackBarConfig {
  type: "error" | "info" | "success",
  message: String
}
