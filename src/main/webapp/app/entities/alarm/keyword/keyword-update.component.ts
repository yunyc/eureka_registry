import { Component, Vue, Inject } from 'vue-property-decorator';

import { required } from 'vuelidate/lib/validators';

import AlertService from '@/shared/alert/alert.service';

import AlarmService from '@/entities/alarm/alarm/alarm.service';
import { IAlarm } from '@/shared/model/alarm/alarm.model';

import { IKeyword, Keyword } from '@/shared/model/alarm/keyword.model';
import KeywordService from './keyword.service';

const validations: any = {
  keyword: {
    text: {
      required,
    },
  },
};

@Component({
  validations,
})
export default class KeywordUpdate extends Vue {
  @Inject('keywordService') private keywordService: () => KeywordService;
  @Inject('alertService') private alertService: () => AlertService;

  public keyword: IKeyword = new Keyword();

  @Inject('alarmService') private alarmService: () => AlarmService;

  public alarms: IAlarm[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.keywordId) {
        vm.retrieveKeyword(to.params.keywordId);
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
    if (this.keyword.id) {
      this.keywordService()
        .update(this.keyword)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('alarmApp.alarmKeyword.updated', { param: param.id });
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
      this.keywordService()
        .create(this.keyword)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('alarmApp.alarmKeyword.created', { param: param.id });
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

  public retrieveKeyword(keywordId): void {
    this.keywordService()
      .find(keywordId)
      .then(res => {
        this.keyword = res;
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
