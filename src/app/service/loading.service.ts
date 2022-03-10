import {Injectable} from '@angular/core';
import {finalize, Observable, Subject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading = new Subject<boolean>()
  loading$ = this.loading.asObservable()
  loadingCount = 0

  constructor() {
  }

  isLoading() {
    return this.loading$
  }

  private addLoading() {
    this.loading.next(++this.loadingCount > 0)
  }

  private loadEnd() {
    this.loading.next(--this.loadingCount > 0)
  }

  setLoading<T>() {
    this.addLoading()
    return (source: Observable<T>) => {
      return source.pipe(finalize(() => {
        this.loadEnd()
      }))
    }
  }

}
