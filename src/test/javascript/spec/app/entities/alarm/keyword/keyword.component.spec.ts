/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import { ToastPlugin } from 'bootstrap-vue';

import * as config from '@/shared/config/config';
import KeywordComponent from '@/entities/alarm/keyword/keyword.vue';
import KeywordClass from '@/entities/alarm/keyword/keyword.component';
import KeywordService from '@/entities/alarm/keyword/keyword.service';
import AlertService from '@/shared/alert/alert.service';

const localVue = createLocalVue();
localVue.use(ToastPlugin);

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('b-badge', {});
localVue.directive('b-modal', {});
localVue.component('b-button', {});
localVue.component('router-link', {});

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  describe('Keyword Management Component', () => {
    let wrapper: Wrapper<KeywordClass>;
    let comp: KeywordClass;
    let keywordServiceStub: SinonStubbedInstance<KeywordService>;

    beforeEach(() => {
      keywordServiceStub = sinon.createStubInstance<KeywordService>(KeywordService);
      keywordServiceStub.retrieve.resolves({ headers: {} });

      wrapper = shallowMount<KeywordClass>(KeywordComponent, {
        store,
        i18n,
        localVue,
        stubs: { bModal: bModalStub as any },
        provide: {
          keywordService: () => keywordServiceStub,
          alertService: () => new AlertService(),
        },
      });
      comp = wrapper.vm;
    });

    it('Should call load all on init', async () => {
      // GIVEN
      keywordServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.retrieveAllKeywords();
      await comp.$nextTick();

      // THEN
      expect(keywordServiceStub.retrieve.called).toBeTruthy();
      expect(comp.keywords[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
    it('Should call delete service on confirmDelete', async () => {
      // GIVEN
      keywordServiceStub.delete.resolves({});

      // WHEN
      comp.prepareRemove({ id: 123 });
      expect(keywordServiceStub.retrieve.callCount).toEqual(1);

      comp.removeKeyword();
      await comp.$nextTick();

      // THEN
      expect(keywordServiceStub.delete.called).toBeTruthy();
      expect(keywordServiceStub.retrieve.callCount).toEqual(2);
    });
  });
});
