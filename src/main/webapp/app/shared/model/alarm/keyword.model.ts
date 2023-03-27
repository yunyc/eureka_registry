import { IAlarm } from '@/shared/model/alarm/alarm.model';

export interface IKeyword {
  id?: number;
  text?: string;
  alarm?: IAlarm | null;
}

export class Keyword implements IKeyword {
  constructor(public id?: number, public text?: string, public alarm?: IAlarm | null) {}
}
