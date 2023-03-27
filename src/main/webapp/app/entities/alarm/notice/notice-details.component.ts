import { Component, Vue, Inject } from 'vue-property-decorator';

import { INotice } from '@/shared/model/alarm/notice.model';
import NoticeService from './notice.service';
import AlertService from '@/shared/alert/alert.service';

@Component
export default class NoticeDetails extends Vue {
  @Inject('noticeService') private noticeService: () => NoticeService;
  @Inject('alertService') private alertService: () => AlertService;

  public notice: INotice = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.noticeId) {
        vm.retrieveNotice(to.params.noticeId);
      }
    });
  }

  public retrieveNotice(noticeId) {
    this.noticeService()
      .find(noticeId)
      .then(res => {
        this.notice = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
