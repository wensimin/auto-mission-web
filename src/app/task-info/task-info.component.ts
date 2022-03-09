import {AfterViewInit, Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Task} from "../model/Models";
import {environment} from "../../environments/environment";
import {catchError, of} from "rxjs";
import {SnackBarServiceService} from "../service/snack-bar-service.service";

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.scss']
})
export class TaskInfoComponent implements AfterViewInit {

  editorOptions = {theme: 'vs-dark', language: 'kotlin'}
  taskForm: FormGroup = this.fb.group(new Task())

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private snackBarServiceService: SnackBarServiceService
  ) {
  }

  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params["id"]
      if (!id) return
      this.httpClient.get<Task>(`${environment.resourceServer}/task/${id}`).pipe(
        catchError(() => {
            this.router.navigate(['/notFound']).then()
            return of(null)
          }
        )).subscribe(task => {
          if (task) {
            this.taskForm.setValue(task)
          }
        }
      )
    })
  }

  saveTask() {
    this.httpClient.post(`${environment.resourceServer}/task`, this.taskForm.value)
      .subscribe(() => {
          this.snackBarServiceService.message({type: "success", message: "保存成功"})
          this.router.navigate(['/task']).then()
        }
      )
  }
}
