import { Component, Vue, Inject } from 'vue-property-decorator';

import { IAlarm } from '@/shared/model/alarm/alarm.model';
import AlarmService from './alarm.service';
import AlertService from '@/shared/alert/alert.service';

@Component
export default class AlarmDetails extends Vue {
  @Inject('alarmService') private alarmService: () => AlarmService;
  @Inject('alertService') private alertService: () => AlertService;

  public alarm: IAlarm = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.alarmId) {
        vm.retrieveAlarm(to.params.alarmId);
      }
    });
  }

  public retrieveAlarm(alarmId) {
    this.alarmService()
      .find(alarmId)
      .then(res => {
        this.alarm = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
