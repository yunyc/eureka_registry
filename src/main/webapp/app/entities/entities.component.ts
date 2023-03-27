import { Component, Provide, Vue } from 'vue-property-decorator';

import UserService from '@/entities/user/user.service';
import AlarmService from './alarm/alarm/alarm.service';
import KeywordService from './alarm/keyword/keyword.service';
import NoticeService from './alarm/notice/notice.service';
// jhipster-needle-add-entity-service-to-entities-component-import - JHipster will import entities services here

@Component
export default class Entities extends Vue {
  @Provide('userService') private userService = () => new UserService();
  @Provide('alarmService') private alarmService = () => new AlarmService();
  @Provide('keywordService') private keywordService = () => new KeywordService();
  @Provide('noticeService') private noticeService = () => new NoticeService();
  // jhipster-needle-add-entity-service-to-entities-component - JHipster will import entities services here
}
