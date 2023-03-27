/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import KeywordDetailComponent from '@/entities/alarm/keyword/keyword-details.vue';
import KeywordClass from '@/entities/alarm/keyword/keyword-details.component';
import KeywordService from '@/entities/alarm/keyword/keyword.service';
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
  describe('Keyword Management Detail Component', () => {
    let wrapper: Wrapper<KeywordClass>;
    let comp: KeywordClass;
    let keywordServiceStub: SinonStubbedInstance<KeywordService>;

    beforeEach(() => {
      keywordServiceStub = sinon.createStubInstance<KeywordService>(KeywordService);

      wrapper = shallowMount<KeywordClass>(KeywordDetailComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: { keywordService: () => keywordServiceStub, alertService: () => new AlertService() },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundKeyword = { id: 123 };
        keywordServiceStub.find.resolves(foundKeyword);

        // WHEN
        comp.retrieveKeyword(123);
        await comp.$nextTick();

        // THEN
        expect(comp.keyword).toBe(foundKeyword);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundKeyword = { id: 123 };
        keywordServiceStub.find.resolves(foundKeyword);

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
