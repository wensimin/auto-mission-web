import {AfterViewInit, Component, EventEmitter} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {interval, Subscription} from "rxjs";

@Component({
  selector: 'app-system-state',
  templateUrl: './system-state.component.html',
  styleUrls: ['./system-state.component.scss']
})
export class SystemStateComponent implements AfterViewInit {

  state: SystemState = new SystemState()
  taskProgress: number = 0;
  memoryProgress: number = 0;
  taskBuffer: number = 0;
  memoryBuffer: number = 0;
  private timeInterval: Subscription | undefined;
  private emitter = new EventEmitter()

  constructor(private httpClient: HttpClient) {
  }

  ngAfterViewInit(): void {
    this.getState()
    this.emitter.subscribe(() => {
      this.getState()
    })
    this.timeInterval = interval(1000).subscribe(() => {
      this.emitter.emit()
    })
  }

  ngOnDestroy(): void {
    this.timeInterval?.unsubscribe()
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  private getState() {
    this.httpClient.get<SystemState>(`${environment.resourceServer}/state`).subscribe(
      state => {
        this.state = state
        this.taskProgress = (100 * state.runningTaskCount) / state.taskMaxWorker;
        this.taskBuffer = (100 * state.taskWorker) / state.taskMaxWorker;
        this.memoryProgress = (100 * state.memoryUsage) / state.maxMemory;
        this.memoryBuffer = (100 * state.totalMemory) / state.maxMemory;
      }
    )
  }
}


class SystemState {
  runningTaskCount: number = 0
  taskWorker: number = 0
  taskMaxWorker: number = 0
  memoryUsage: number = 0
  totalMemory: number = 0
  maxMemory: number = 0
  threadCount: number = 0
}

