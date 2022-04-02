import {NgxMatNativeDateAdapter} from "@angular-material-components/datetime-picker";
import {Injectable} from "@angular/core";

@Injectable()
export class ChineseDateAdapter extends NgxMatNativeDateAdapter {
  override getDateNames(): string[] {
    return super.getDateNames().flatMap(it => it.replace("日", ""));
  }

  override getFirstDayOfWeek(): number {
    return 1;
  }
}
