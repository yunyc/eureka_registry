/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';
import { ToastPlugin } from 'bootstrap-vue';

import * as config from '@/shared/config/config';
import KeywordUpdateComponent from '@/entities/alarm/keyword/keyword-update.vue';
import KeywordClass from '@/entities/alarm/keyword/keyword-update.component';
import KeywordService from '@/entities/alarm/keyword/keyword.service';

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
  describe('Keyword Management Update Component', () => {
    let wrapper: Wrapper<KeywordClass>;
    let comp: KeywordClass;
    let keywordServiceStub: SinonStubbedInstance<KeywordService>;

    beforeEach(() => {
      keywordServiceStub = sinon.createStubInstance<KeywordService>(KeywordService);

      wrapper = shallowMount<KeywordClass>(KeywordUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          keywordService: () => keywordServiceStub,
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
        comp.keyword = entity;
        keywordServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(keywordServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.keyword = entity;
        keywordServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(keywordServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundKeyword = { id: 123 };
        keywordServiceStub.find.resolves(foundKeyword);
        keywordServiceStub.retrieve.resolves([foundKeyword]);

        // WHEN
        comp.beforeRouteEnter({ params: { keywordId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.keyword).toBe(foundKeyword);
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
