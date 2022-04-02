import {NgxMatNativeDateAdapter} from "@angular-material-components/datetime-picker";
import {Injectable} from "@angular/core";

@Injectable()
export class ChineseDateAdapter extends NgxMatNativeDateAdapter {
  override parse(value: any): Date | null {
    return super.parse(value);
  }

  override format(date: Date, displayFormat: Object): string {
    const format = super.format(date, displayFormat)
    console.log(format)
    return format;
  }

  override getFirstDayOfWeek(): number {
    return 1;
  }
}
