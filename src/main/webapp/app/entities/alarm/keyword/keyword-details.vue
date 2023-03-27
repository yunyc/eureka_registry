<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="keyword">
        <h2 class="jh-entity-heading" data-cy="keywordDetailsHeading">
          <span v-text="$t('gatewayApp.alarmKeyword.detail.title')">Keyword</span> {{ keyword.id }}
        </h2>
        <dl class="row jh-entity-details">
          <dt>
            <span v-text="$t('gatewayApp.alarmKeyword.text')">Text</span>
          </dt>
          <dd>
            <span>{{ keyword.text }}</span>
          </dd>
          <dt>
            <span v-text="$t('gatewayApp.alarmKeyword.alarm')">Alarm</span>
          </dt>
          <dd>
            <div v-if="keyword.alarm">
              <router-link :to="{ name: 'AlarmView', params: { alarmId: keyword.alarm.id } }">{{ keyword.alarm.id }}</router-link>
            </div>
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
        </button>
        <router-link v-if="keyword.id" :to="{ name: 'KeywordEdit', params: { keywordId: keyword.id } }" custom v-slot="{ navigate }">
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.edit')"> Edit</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./keyword-details.component.ts"></script>
