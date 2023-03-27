import { Component, Vue, Inject } from 'vue-property-decorator';

import { IKeyword } from '@/shared/model/alarm/keyword.model';
import KeywordService from './keyword.service';
import AlertService from '@/shared/alert/alert.service';

@Component
export default class KeywordDetails extends Vue {
  @Inject('keywordService') private keywordService: () => KeywordService;
  @Inject('alertService') private alertService: () => AlertService;

  public keyword: IKeyword = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.keywordId) {
        vm.retrieveKeyword(to.params.keywordId);
      }
    });
  }

  public retrieveKeyword(keywordId) {
    this.keywordService()
      .find(keywordId)
      .then(res => {
        this.keyword = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
