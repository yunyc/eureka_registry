/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';
import { ToastPlugin } from 'bootstrap-vue';

import * as config from '@/shared/config/config';
import AlarmUpdateComponent from '@/entities/alarm/alarm/alarm-update.vue';
import AlarmClass from '@/entities/alarm/alarm/alarm-update.component';
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
  describe('Alarm Management Update Component', () => {
    let wrapper: Wrapper<AlarmClass>;
    let comp: AlarmClass;
    let alarmServiceStub: SinonStubbedInstance<AlarmService>;

    beforeEach(() => {
      alarmServiceStub = sinon.createStubInstance<AlarmService>(AlarmService);

      wrapper = shallowMount<AlarmClass>(AlarmUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          alarmService: () => alarmServiceStub,
          alertService: () => new AlertService(),
        },
      });
      comp = wrapper.vm;
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.alarm = entity;
        alarmServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(alarmServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.alarm = entity;
        alarmServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(alarmServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundAlarm = { id: 123 };
        alarmServiceStub.find.resolves(foundAlarm);
        alarmServiceStub.retrieve.resolves([foundAlarm]);

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
