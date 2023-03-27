/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import AlarmDetailComponent from '@/entities/alarm/alarm/alarm-details.vue';
import AlarmClass from '@/entities/alarm/alarm/alarm-details.component';
import AlarmService from '@/entities/alarm/alarm/alarm.service';
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
  describe('Alarm Management Detail Component', () => {
    let wrapper: Wrapper<AlarmClass>;
    let comp: AlarmClass;
    let alarmServiceStub: SinonStubbedInstance<AlarmService>;

    beforeEach(() => {
      alarmServiceStub = sinon.createStubInstance<AlarmService>(AlarmService);

      wrapper = shallowMount<AlarmClass>(AlarmDetailComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: { alarmService: () => alarmServiceStub, alertService: () => new AlertService() },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundAlarm = { id: 123 };
        alarmServiceStub.find.resolves(foundAlarm);

        // WHEN
        comp.retrieveAlarm(123);
        await comp.$nextTick();

        // THEN
        expect(comp.alarm).toBe(foundAlarm);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundAlarm = { id: 123 };
        alarmServiceStub.find.resolves(foundAlarm);

        // WHEN
        comp.beforeRouteEnter({ params: { alarmId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.alarm).toBe(foundAlarm);
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
