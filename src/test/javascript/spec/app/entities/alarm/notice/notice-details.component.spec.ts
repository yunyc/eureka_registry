/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import NoticeDetailComponent from '@/entities/alarm/notice/notice-details.vue';
import NoticeClass from '@/entities/alarm/notice/notice-details.component';
import NoticeService from '@/entities/alarm/notice/notice.service';
import router from '@/router';
import AlertService from '@/shared/alert/alert.service';

const localVue = createLocalVue();
localVue.use(VueRouter);

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('router-link', {});

describe('Component Tests', () => {
  describe('Notice Management Detail Component', () => {
    let wrapper: Wrapper<NoticeClass>;
    let comp: NoticeClass;
    let noticeServiceStub: SinonStubbedInstance<NoticeService>;

    beforeEach(() => {
      noticeServiceStub = sinon.createStubInstance<NoticeService>(NoticeService);

      wrapper = shallowMount<NoticeClass>(NoticeDetailComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: { noticeService: () => noticeServiceStub, alertService: () => new AlertService() },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundNotice = { id: 123 };
        noticeServiceStub.find.resolves(foundNotice);

        // WHEN
        comp.retrieveNotice(123);
        await comp.$nextTick();

        // THEN
        expect(comp.notice).toBe(foundNotice);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundNotice = { id: 123 };
        noticeServiceStub.find.resolves(foundNotice);

        // WHEN
        comp.beforeRouteEnter({ params: { noticeId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.notice).toBe(foundNotice);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        comp.previousState();
        await comp.$nextTick();

        expect(comp.$router.currentRoute.fullPath).toContain('/');
      });
    });
  });
});
