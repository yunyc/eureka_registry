/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import { ToastPlugin } from 'bootstrap-vue';

import * as config from '@/shared/config/config';
import AlarmComponent from '@/entities/alarm/alarm/alarm.vue';
import AlarmClass from '@/entities/alarm/alarm/alarm.component';
import AlarmService from '@/entities/alarm/alarm/alarm.service';
import AlertService from '@/shared/alert/alert.service';

const localVue = createLocalVue();
localVue.use(ToastPlugin);

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('b-badge', {});
localVue.component('jhi-sort-indicator', {});
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
  describe('Alarm Management Component', () => {
    let wrapper: Wrapper<AlarmClass>;
    let comp: AlarmClass;
    let alarmServiceStub: SinonStubbedInstance<AlarmService>;

    beforeEach(() => {
      alarmServiceStub = sinon.createStubInstance<AlarmService>(AlarmService);
      alarmServiceStub.retrieve.resolves({ headers: {} });

      wrapper = shallowMount<AlarmClass>(AlarmComponent, {
        store,
        i18n,
        localVue,
        stubs: { jhiItemCount: true, bPagination: true, bModal: bModalStub as any },
        provide: {
          alarmService: () => alarmServiceStub,
          alertService: () => new AlertService(),
        },
      });
      comp = wrapper.vm;
    });

    it('Should call load all on init', async () => {
      // GIVEN
      alarmServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.retrieveAllAlarms();
      await comp.$nextTick();

      // THEN
      expect(alarmServiceStub.retrieve.called).toBeTruthy();
      expect(comp.alarms[0]).toEqual(expect.objectContaining({ id: 123 }));
    });

    it('should load a page', async () => {
      // GIVEN
      alarmServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });
      comp.previousPage = 1;

      // WHEN
      comp.loadPage(2);
      await comp.$nextTick();

      // THEN
      expect(alarmServiceStub.retrieve.called).toBeTruthy();
      expect(comp.alarms[0]).toEqual(expect.objectContaining({ id: 123 }));
    });

    it('should re-initialize the page', async () => {
      // GIVEN
      alarmServiceStub.retrieve.reset();
      alarmServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.loadPage(2);
      await comp.$nextTick();
      comp.clear();
      await comp.$nextTick();

      // THEN
      expect(alarmServiceStub.retrieve.callCount).toEqual(2);
      expect(comp.page).toEqual(1);
      expect(comp.alarms[0]).toEqual(expect.objectContaining({ id: 123 }));
    });

    it('should calculate the sort attribute for an id', () => {
      // WHEN
      const result = comp.sort();

      // THEN
      expect(result).toEqual(['id,asc']);
    });

    it('should calculate the sort attribute for a non-id attribute', () => {
      // GIVEN
      comp.propOrder = 'name';

      // WHEN
      const result = comp.sort();

      // THEN
      expect(result).toEqual(['name,asc', 'id']);
    });
    it('Should call delete service on confirmDelete', async () => {
      // GIVEN
      alarmServiceStub.delete.resolves({});

      // WHEN
      comp.prepareRemove({ id: 123 });
      expect(alarmServiceStub.retrieve.callCount).toEqual(1);

      comp.removeAlarm();
      await comp.$nextTick();

      // THEN
      expect(alarmServiceStub.delete.called).toBeTruthy();
      expect(alarmServiceStub.retrieve.callCount).toEqual(2);
    });
  });
});
