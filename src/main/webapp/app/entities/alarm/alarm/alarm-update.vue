<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="gatewayApp.alarmAlarm.home.createOrEditLabel"
          data-cy="AlarmCreateUpdateHeading"
          v-text="$t('gatewayApp.alarmAlarm.home.createOrEditLabel')"
        >
          Create or edit a Alarm
        </h2>
        <div>
          <div class="form-group" v-if="alarm.id">
            <label for="id" v-text="$t('global.field.id')">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="alarm.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.alarmAlarm.userId')" for="alarm-userId">User Id</label>
            <input
              type="number"
              class="form-control"
              name="userId"
              id="alarm-userId"
              data-cy="userId"
              :class="{ valid: !$v.alarm.userId.$invalid, invalid: $v.alarm.userId.$invalid }"
              v-model.number="$v.alarm.userId.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.alarmAlarm.siteUrl')" for="alarm-siteUrl">Site Url</label>
            <input
              type="text"
              class="form-control"
              name="siteUrl"
              id="alarm-siteUrl"
              data-cy="siteUrl"
              :class="{ valid: !$v.alarm.siteUrl.$invalid, invalid: $v.alarm.siteUrl.$invalid }"
              v-model="$v.alarm.siteUrl.$model"
              required
            />
            <div v-if="$v.alarm.siteUrl.$anyDirty && $v.alarm.siteUrl.$invalid">
              <small class="form-text text-danger" v-if="!$v.alarm.siteUrl.required" v-text="$t('entity.validation.required')">
                This field is required.
              </small>
              <small
                class="form-text text-danger"
                v-if="!$v.alarm.siteUrl.pattern"
                v-text="$t('entity.validation.pattern', { pattern: 'Site Url' })"
              >
                This field should follow pattern for "Site Url".
              </small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.alarmAlarm.description')" for="alarm-description">Description</label>
            <input
              type="text"
              class="form-control"
              name="description"
              id="alarm-description"
              data-cy="description"
              :class="{ valid: !$v.alarm.description.$invalid, invalid: $v.alarm.description.$invalid }"
              v-model="$v.alarm.description.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.alarmAlarm.refeshTime')" for="alarm-refeshTime">Refesh Time</label>
            <select
              class="form-control"
              name="refeshTime"
              :class="{ valid: !$v.alarm.refeshTime.$invalid, invalid: $v.alarm.refeshTime.$invalid }"
              v-model="$v.alarm.refeshTime.$model"
              id="alarm-refeshTime"
              data-cy="refeshTime"
              required
            >
              <option
                v-for="selectedTime in selectedTimeValues"
                :key="selectedTime"
                v-bind:value="selectedTime"
                v-bind:label="$t('gatewayApp.SelectedTime.' + selectedTime)"
              >
                {{ selectedTime }}
              </option>
            </select>
            <div v-if="$v.alarm.refeshTime.$anyDirty && $v.alarm.refeshTime.$invalid">
              <small class="form-text text-danger" v-if="!$v.alarm.refeshTime.required" v-text="$t('entity.validation.required')">
                This field is required.
              </small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.alarmAlarm.musicTitle')" for="alarm-musicTitle">Music Title</label>
            <input
              type="text"
              class="form-control"
              name="musicTitle"
              id="alarm-musicTitle"
              data-cy="musicTitle"
              :class="{ valid: !$v.alarm.musicTitle.$invalid, invalid: $v.alarm.musicTitle.$invalid }"
              v-model="$v.alarm.musicTitle.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.alarmAlarm.musicPath')" for="alarm-musicPath">Music Path</label>
            <input
              type="text"
              class="form-control"
              name="musicPath"
              id="alarm-musicPath"
              data-cy="musicPath"
              :class="{ valid: !$v.alarm.musicPath.$invalid, invalid: $v.alarm.musicPath.$invalid }"
              v-model="$v.alarm.musicPath.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.alarmAlarm.vbEnabled')" for="alarm-vbEnabled">Vb Enabled</label>
            <input
              type="checkbox"
              class="form-check"
              name="vbEnabled"
              id="alarm-vbEnabled"
              data-cy="vbEnabled"
              :class="{ valid: !$v.alarm.vbEnabled.$invalid, invalid: $v.alarm.vbEnabled.$invalid }"
              v-model="$v.alarm.vbEnabled.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.alarmAlarm.useSwitch')" for="alarm-useSwitch">Use Switch</label>
            <input
              type="checkbox"
              class="form-check"
              name="useSwitch"
              id="alarm-useSwitch"
              data-cy="useSwitch"
              :class="{ valid: !$v.alarm.useSwitch.$invalid, invalid: $v.alarm.useSwitch.$invalid }"
              v-model="$v.alarm.useSwitch.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.alarmAlarm.createdDate')" for="alarm-createdDate">Created Date</label>
            <b-input-group class="mb-3">
              <b-input-group-prepend>
                <b-form-datepicker
                  aria-controls="alarm-createdDate"
                  v-model="$v.alarm.createdDate.$model"
                  name="createdDate"
                  class="form-control"
                  :locale="currentLanguage"
                  button-only
                  today-button
                  reset-button
                  close-button
                >
                </b-form-datepicker>
              </b-input-group-prepend>
              <b-form-input
                id="alarm-createdDate"
                data-cy="createdDate"
                type="text"
                class="form-control"
                name="createdDate"
                :class="{ valid: !$v.alarm.createdDate.$invalid, invalid: $v.alarm.createdDate.$invalid }"
                v-model="$v.alarm.createdDate.$model"
              />
            </b-input-group>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.alarmAlarm.crawlingDate')" for="alarm-crawlingDate"
              >Crawling Date</label
            >
            <b-input-group class="mb-3">
              <b-input-group-prepend>
                <b-form-datepicker
                  aria-controls="alarm-crawlingDate"
                  v-model="$v.alarm.crawlingDate.$model"
                  name="crawlingDate"
                  class="form-control"
                  :locale="currentLanguage"
                  button-only
                  today-button
                  reset-button
                  close-button
                >
                </b-form-datepicker>
              </b-input-group-prepend>
              <b-form-input
                id="alarm-crawlingDate"
                data-cy="crawlingDate"
                type="text"
                class="form-control"
                name="crawlingDate"
                :class="{ valid: !$v.alarm.crawlingDate.$invalid, invalid: $v.alarm.crawlingDate.$invalid }"
                v-model="$v.alarm.crawlingDate.$model"
              />
            </b-input-group>
          </div>
        </div>
        <div>
          <button type="button" id="cancel-save" data-cy="entityCreateCancelButton" class="btn btn-secondary" v-on:click="previousState()">
            <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.cancel')">Cancel</span>
          </button>
          <button
            type="submit"
            id="save-entity"
            data-cy="entityCreateSaveButton"
            :disabled="$v.alarm.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./alarm-update.component.ts"></script>
