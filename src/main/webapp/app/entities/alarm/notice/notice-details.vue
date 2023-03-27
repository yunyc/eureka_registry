<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="notice">
        <h2 class="jh-entity-heading" data-cy="noticeDetailsHeading">
          <span v-text="$t('gatewayApp.alarmNotice.detail.title')">Notice</span> {{ notice.id }}
        </h2>
        <dl class="row jh-entity-details">
          <dt>
            <span v-text="$t('gatewayApp.alarmNotice.content')">Content</span>
          </dt>
          <dd>
            <span>{{ notice.content }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.alarmNotice.saveEnabled')">Save Enabled</span>
          </dt>
          <dd>
            <span>{{ notice.saveEnabled }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.alarmNotice.visiabled')">Visiabled</span>
          </dt>
          <dd>
            <span>{{ notice.visiabled }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.alarmNotice.crawledDate')">Crawled Date</span>
          </dt>
          <dd>
            <span>{{ notice.crawledDate }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.alarmNotice.alarm')">Alarm</span>
          </dt>
          <dd>
            <div v-if="notice.alarm">
              <router-link :to="{ name: 'AlarmView', params: { alarmId: notice.alarm.id } }">{{ notice.alarm.id }}</router-link>
            </div>
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
        </button>
        <router-link v-if="notice.id" :to="{ name: 'NoticeEdit', params: { noticeId: notice.id } }" custom v-slot="{ navigate }">
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.edit')"> Edit</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./notice-details.component.ts"></script>
