import { Component, Vue, Inject } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import { IKeyword } from '@/shared/model/alarm/keyword.model';

import KeywordService from './keyword.service';
import AlertService from '@/shared/alert/alert.service';

@Component({
  mixins: [Vue2Filters.mixin],
})
export default class Keyword extends Vue {
  @Inject('keywordService') private keywordService: () => KeywordService;
  @Inject('alertService') private alertService: () => AlertService;

  private removeId: number = null;

  public keywords: IKeyword[] = [];

  public isFetching = false;

  public mounted(): void {
    this.retrieveAllKeywords();
  }

  public clear(): void {
    this.retrieveAllKeywords();
  }

  public retrieveAllKeywords(): void {
    this.isFetching = true;
    this.keywordService()
      .retrieve()
      .then(
        res => {
          this.keywords = res.data;
          this.isFetching = false;
        },
        err => {
          this.isFetching = false;
          this.alertService().showHttpError(this, err.response);
        }
      );
  }

  public handleSyncList(): void {
    this.clear();
  }

  public prepareRemove(instance: IKeyword): void {
    this.removeId = instance.id;
    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }

  public removeKeyword(): void {
    this.keywordService()
      .delete(this.removeId)
      .then(() => {
        const message = this.$t('alarmApp.alarmKeyword.deleted', { param: this.removeId });
        this.$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
        this.removeId = null;
        this.retrieveAllKeywords();
        this.closeDialog();
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
  }
}
