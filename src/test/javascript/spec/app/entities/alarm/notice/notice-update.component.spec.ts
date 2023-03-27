/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';
import { ToastPlugin } from 'bootstrap-vue';

import * as config from '@/shared/config/config';
import NoticeUpdateComponent from '@/entities/alarm/notice/notice-update.vue';
import NoticeClass from '@/entities/alarm/notice/notice-update.component';
import NoticeService from '@/entities/alarm/notice/notice.service';

import AlarmService from '@/entities/alarm/alarm/alarm.service';
import AlertService from '@/shared/alert/alert.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
const router = new Router();
localVue.use(Router);
localVue.use(ToastPlugin);
localVue.component('font-awesome-icon', {});
localVue.component('b-input-group', {});
localVue.component('b-input-group-prepend', {});
localVue.component('b-form-datepicker', {});
localVue.component('b-form-input', {});

describe('Component Tests', () => {
  describe('Notice Management Update Component', () => {
    let wrapper: Wrapper<NoticeClass>;
    let comp: NoticeClass;
    let noticeServiceStub: SinonStubbedInstance<NoticeService>;

    beforeEach(() => {
      noticeServiceStub = sinon.createStubInstance<NoticeService>(NoticeService);

      wrapper = shallowMount<NoticeClass>(NoticeUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          noticeService: () => noticeServiceStub,
          alertService: () => new AlertService(),

          alarmService: () =>
            sinon.createStubInstance<AlarmService>(AlarmService, {
              retrieve: sinon.stub().resolves({}),
            } as any),
        },
      });
      comp = wrapper.vm;
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.notice = entity;
        noticeServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(noticeServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.notice = entity;
        noticeServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(noticeServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundNotice = { id: 123 };
        noticeServiceStub.find.resolves(foundNotice);
        noticeServiceStub.retrieve.resolves([foundNotice]);

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
