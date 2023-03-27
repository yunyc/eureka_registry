<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="gatewayApp.alarmKeyword.home.createOrEditLabel"
          data-cy="KeywordCreateUpdateHeading"
          v-text="$t('gatewayApp.alarmKeyword.home.createOrEditLabel')"
        >
          Create or edit a Keyword
        </h2>
        <div>
          <div class="form-group" v-if="keyword.id">
            <label for="id" v-text="$t('global.field.id')">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="keyword.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.alarmKeyword.text')" for="keyword-text">Text</label>
            <input
              type="text"
              class="form-control"
              name="text"
              id="keyword-text"
              data-cy="text"
              :class="{ valid: !$v.keyword.text.$invalid, invalid: $v.keyword.text.$invalid }"
              v-model="$v.keyword.text.$model"
              required
            />
            <div v-if="$v.keyword.text.$anyDirty && $v.keyword.text.$invalid">
              <small class="form-text text-danger" v-if="!$v.keyword.text.required" v-text="$t('entity.validation.required')">
                This field is required.
              </small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.alarmKeyword.alarm')" for="keyword-alarm">Alarm</label>
            <select class="form-control" id="keyword-alarm" data-cy="alarm" name="alarm" v-model="keyword.alarm">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="keyword.alarm && alarmOption.id === keyword.alarm.id ? keyword.alarm : alarmOption"
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
            :disabled="$v.keyword.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./keyword-update.component.ts"></script>
