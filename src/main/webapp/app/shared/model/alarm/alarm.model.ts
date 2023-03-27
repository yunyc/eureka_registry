import { SelectedTime } from '@/shared/model/enumerations/selected-time.model';
export interface IAlarm {
  id?: number;
  userId?: number | null;
  siteUrl?: string;
  description?: string | null;
  refeshTime?: SelectedTime;
  musicTitle?: string | null;
  musicPath?: string | null;
  vbEnabled?: boolean | null;
  useSwitch?: boolean | null;
  createdDate?: Date | null;
  crawlingDate?: Date | null;
}

export class Alarm implements IAlarm {
  constructor(
    public id?: number,
    public userId?: number | null,
    public siteUrl?: string,
    public description?: string | null,
    public refeshTime?: SelectedTime,
    public musicTitle?: string | null,
    public musicPath?: string | null,
    public vbEnabled?: boolean | null,
    public useSwitch?: boolean | null,
    public createdDate?: Date | null,
    public crawlingDate?: Date | null
  ) {
    this.vbEnabled = this.vbEnabled ?? false;
    this.useSwitch = this.useSwitch ?? false;
  }
}
