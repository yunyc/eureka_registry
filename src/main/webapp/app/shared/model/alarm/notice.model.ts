import { IAlarm } from '@/shared/model/alarm/alarm.model';

export interface INotice {
  id?: number;
  content?: string;
  saveEnabled?: boolean | null;
  visiabled?: boolean | null;
  crawledDate?: Date | null;
  alarm?: IAlarm | null;
}

export class Notice implements INotice {
  constructor(
    public id?: number,
    public content?: string,
    public saveEnabled?: boolean | null,
    public visiabled?: boolean | null,
    public crawledDate?: Date | null,
    public alarm?: IAlarm | null
  ) {
    this.saveEnabled = this.saveEnabled ?? false;
    this.visiabled = this.visiabled ?? false;
  }
}
