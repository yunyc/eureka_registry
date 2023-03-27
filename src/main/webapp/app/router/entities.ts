import { Authority } from '@/shared/security/authority';
/* tslint:disable */
// prettier-ignore
const Entities = () => import('@/entities/entities.vue');

// prettier-ignore
const Alarm = () => import('@/entities/alarm/alarm/alarm.vue');
// prettier-ignore
const AlarmUpdate = () => import('@/entities/alarm/alarm/alarm-update.vue');
// prettier-ignore
const AlarmDetails = () => import('@/entities/alarm/alarm/alarm-details.vue');
// prettier-ignore
const Keyword = () => import('@/entities/alarm/keyword/keyword.vue');
// prettier-ignore
const KeywordUpdate = () => import('@/entities/alarm/keyword/keyword-update.vue');
// prettier-ignore
const KeywordDetails = () => import('@/entities/alarm/keyword/keyword-details.vue');
// prettier-ignore
const Notice = () => import('@/entities/alarm/notice/notice.vue');
// prettier-ignore
const NoticeUpdate = () => import('@/entities/alarm/notice/notice-update.vue');
// prettier-ignore
const NoticeDetails = () => import('@/entities/alarm/notice/notice-details.vue');
// jhipster-needle-add-entity-to-router-import - JHipster will import entities to the router here

export default {
  path: '/',
  component: Entities,
  children: [
    {
      path: 'alarm',
      name: 'Alarm',
      component: Alarm,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'alarm/new',
      name: 'AlarmCreate',
      component: AlarmUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'alarm/:alarmId/edit',
      name: 'AlarmEdit',
      component: AlarmUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'alarm/:alarmId/view',
      name: 'AlarmView',
      component: AlarmDetails,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'keyword',
      name: 'Keyword',
      component: Keyword,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'keyword/new',
      name: 'KeywordCreate',
      component: KeywordUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'keyword/:keywordId/edit',
      name: 'KeywordEdit',
      component: KeywordUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'keyword/:keywordId/view',
      name: 'KeywordView',
      component: KeywordDetails,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'notice',
      name: 'Notice',
      component: Notice,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'notice/new',
      name: 'NoticeCreate',
      component: NoticeUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'notice/:noticeId/edit',
      name: 'NoticeEdit',
      component: NoticeUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'notice/:noticeId/view',
      name: 'NoticeView',
      component: NoticeDetails,
      meta: { authorities: [Authority.USER] },
    },
    // jhipster-needle-add-entity-to-router - JHipster will add entities to the router here
  ],
};
