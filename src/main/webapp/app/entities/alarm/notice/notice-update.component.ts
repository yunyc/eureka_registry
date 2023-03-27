import { Component, Vue, Inject } from 'vue-property-decorator';

import { required } from 'vuelidate/lib/validators';

import AlertService from '@/shared/alert/alert.service';

import AlarmService from '@/entities/alarm/alarm/alarm.service';
import { IAlarm } from '@/shared/model/alarm/alarm.model';

import { INotice, Notice } from '@/shared/model/alarm/notice.model';
import NoticeService from './notice.service';

const validations: any = {
  notice: {
    content: {
      required,
    },
    saveEnabled: {},
    visiabled: {},
    crawledDate: {},
  },
};

@Component({
  validations,
})
export default class NoticeUpdate extends Vue {
  @Inject('noticeService') private noticeService: () => NoticeService;
  @Inject('alertService') private alertService: () => AlertService;

  public notice: INotice = new Notice();

  @Inject('alarmService') private alarmService: () => AlarmService;

  public alarms: IAlarm[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.noticeId) {
        vm.retrieveNotice(to.params.noticeId);
      }
      vm.initRelationships();
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
    if (this.notice.id) {
      this.noticeService()
        .update(this.notice)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('alarmApp.alarmNotice.updated', { param: param.id });
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
      this.noticeService()
        .create(this.notice)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('alarmApp.alarmNotice.created', { param: param.id });
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

  public retrieveNotice(noticeId): void {
    this.noticeService()
      .find(noticeId)
      .then(res => {
        this.notice = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.alarmService()
      .retrieve()
      .then(res => {
        this.alarms = res.data;
      });
  }
}
