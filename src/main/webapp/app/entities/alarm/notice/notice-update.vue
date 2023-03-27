<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="gatewayApp.alarmNotice.home.createOrEditLabel"
          data-cy="NoticeCreateUpdateHeading"
          v-text="$t('gatewayApp.alarmNotice.home.createOrEditLabel')"
        >
          Create or edit a Notice
        </h2>
        <div>
          <div class="form-group" v-if="notice.id">
            <label for="id" v-text="$t('global.field.id')">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="notice.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.alarmNotice.content')" for="notice-content">Content</label>
            <input
              type="text"
              class="form-control"
              name="content"
              id="notice-content"
              data-cy="content"
              :class="{ valid: !$v.notice.content.$invalid, invalid: $v.notice.content.$invalid }"
              v-model="$v.notice.content.$model"
              required
            />
            <div v-if="$v.notice.content.$anyDirty && $v.notice.content.$invalid">
              <small class="form-text text-danger" v-if="!$v.notice.content.required" v-text="$t('entity.validation.required')">
                This field is required.
              </small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.alarmNotice.saveEnabled')" for="notice-saveEnabled"
              >Save Enabled</label
            >
            <input
              type="checkbox"
              class="form-check"
              name="saveEnabled"
              id="notice-saveEnabled"
              data-cy="saveEnabled"
              :class="{ valid: !$v.notice.saveEnabled.$invalid, invalid: $v.notice.saveEnabled.$invalid }"
              v-model="$v.notice.saveEnabled.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.alarmNotice.visiabled')" for="notice-visiabled">Visiabled</label>
            <input
              type="checkbox"
              class="form-check"
              name="visiabled"
              id="notice-visiabled"
              data-cy="visiabled"
              :class="{ valid: !$v.notice.visiabled.$invalid, invalid: $v.notice.visiabled.$invalid }"
              v-model="$v.notice.visiabled.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.alarmNotice.crawledDate')" for="notice-crawledDate"
              >Crawled Date</label
            >
            <b-input-group class="mb-3">
              <b-input-group-prepend>
                <b-form-datepicker
                  aria-controls="notice-crawledDate"
                  v-model="$v.notice.crawledDate.$model"
                  name="crawledDate"
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
                id="notice-crawledDate"
                data-cy="crawledDate"
                type="text"
                class="form-control"
                name="crawledDate"
                :class="{ valid: !$v.notice.crawledDate.$invalid, invalid: $v.notice.crawledDate.$invalid }"
                v-model="$v.notice.crawledDate.$model"
              />
            </b-input-group>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.alarmNotice.alarm')" for="notice-alarm">Alarm</label>
            <select class="form-control" id="notice-alarm" data-cy="alarm" name="alarm" v-model="notice.alarm">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="notice.alarm && alarmOption.id === notice.alarm.id ? notice.alarm : alarmOption"
                v-for="alarmOption in alarms"
                :key="alarmOption.id"
              >
                {{ alarmOption.id }}
              </option>
            </select>
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
            :disabled="$v.notice.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./notice-update.component.ts"></script>
