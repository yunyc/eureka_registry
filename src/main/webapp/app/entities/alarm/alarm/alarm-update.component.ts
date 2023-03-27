import { Component, Vue, Inject } from 'vue-property-decorator';

import { required } from 'vuelidate/lib/validators';

import AlertService from '@/shared/alert/alert.service';

import { IAlarm, Alarm } from '@/shared/model/alarm/alarm.model';
import AlarmService from './alarm.service';
import { SelectedTime } from '@/shared/model/enumerations/selected-time.model';

const validations: any = {
  alarm: {
    userId: {},
    siteUrl: {
      required,
    },
    description: {},
    refeshTime: {
      required,
    },
    musicTitle: {},
    musicPath: {},
    vbEnabled: {},
    useSwitch: {},
    createdDate: {},
    crawlingDate: {},
  },
};

@Component({
  validations,
})
export default class AlarmUpdate extends Vue {
  @Inject('alarmService') private alarmService: () => AlarmService;
  @Inject('alertService') private alertService: () => AlertService;

  public alarm: IAlarm = new Alarm();
  public selectedTimeValues: string[] = Object.keys(SelectedTime);
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.alarmId) {
        vm.retrieveAlarm(to.params.alarmId);
      }
    });
  }

  created(): void {
    this.currentLanguage = this.$store.getters.currentLanguage;
    this.$store.watch(
      () => this.$store.getters.currentLanguage,
      () => {
        this.currentLanguage = this.$store.getters.currentLanguage;
      }
    );
  }

  public save(): void {
    this.isSaving = true;
    if (this.alarm.id) {
      this.alarmService()
        .update(this.alarm)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('alarmApp.alarmAlarm.updated', { param: param.id });
          return (this.$root as any).$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Info',
            variant: 'info',
            solid: true,
            autoHideDelay: 5000,
          });
        })
        .catch(error => {
          this.isSaving = false;
          this.alertService().showHttpError(this, error.response);
        });
    } else {
      this.alarmService()
        .create(this.alarm)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('alarmApp.alarmAlarm.created', { param: param.id });
          (this.$root as any).$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Success',
            variant: 'success',
            solid: true,
            autoHideDelay: 5000,
          });
        })
        .catch(error => {
          this.isSaving = false;
          this.alertService().showHttpError(this, error.response);
        });
    }
  }

  public retrieveAlarm(alarmId): void {
    this.alarmService()
      .find(alarmId)
      .then(res => {
        this.alarm = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {}
}
