<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="alarm">
        <h2 class="jh-entity-heading" data-cy="alarmDetailsHeading">
          <span v-text="$t('gatewayApp.alarmAlarm.detail.title')">Alarm</span> {{ alarm.id }}
        </h2>
        <dl class="row jh-entity-details">
          <dt>
            <span v-text="$t('gatewayApp.alarmAlarm.userId')">User Id</span>
          </dt>
          <dd>
            <span>{{ alarm.userId }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.alarmAlarm.siteUrl')">Site Url</span>
          </dt>
          <dd>
            <span>{{ alarm.siteUrl }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.alarmAlarm.description')">Description</span>
          </dt>
          <dd>
            <span>{{ alarm.description }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.alarmAlarm.refeshTime')">Refesh Time</span>
          </dt>
          <dd>
            <span v-text="$t('gatewayApp.SelectedTime.' + alarm.refeshTime)">{{ alarm.refeshTime }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.alarmAlarm.musicTitle')">Music Title</span>
          </dt>
          <dd>
            <span>{{ alarm.musicTitle }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.alarmAlarm.musicPath')">Music Path</span>
          </dt>
          <dd>
            <span>{{ alarm.musicPath }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.alarmAlarm.vbEnabled')">Vb Enabled</span>
          </dt>
          <dd>
            <span>{{ alarm.vbEnabled }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.alarmAlarm.useSwitch')">Use Switch</span>
          </dt>
          <dd>
            <span>{{ alarm.useSwitch }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.alarmAlarm.createdDate')">Created Date</span>
          </dt>
          <dd>
            <span>{{ alarm.createdDate }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.alarmAlarm.crawlingDate')">Crawling Date</span>
          </dt>
          <dd>
            <span>{{ alarm.crawlingDate }}</span>
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
        </button>
        <router-link v-if="alarm.id" :to="{ name: 'AlarmEdit', params: { alarmId: alarm.id } }" custom v-slot="{ navigate }">
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.edit')"> Edit</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./alarm-details.component.ts"></script>
