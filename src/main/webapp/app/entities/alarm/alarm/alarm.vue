<template>
  <div>
    <h2 id="page-heading" data-cy="AlarmHeading">
      <span v-text="$t('gatewayApp.alarmAlarm.home.title')" id="alarm-heading">Alarms</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span v-text="$t('gatewayApp.alarmAlarm.home.refreshListLabel')">Refresh List</span>
        </button>
        <router-link :to="{ name: 'AlarmCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-alarm"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span v-text="$t('gatewayApp.alarmAlarm.home.createLabel')"> Create a new Alarm </span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && alarms && alarms.length === 0">
      <span v-text="$t('gatewayApp.alarmAlarm.home.notFound')">No alarms found</span>
    </div>
    <div class="table-responsive" v-if="alarms && alarms.length > 0">
      <table class="table table-striped" aria-describedby="alarms">
        <thead>
          <tr>
            <th scope="row" v-on:click="changeOrder('id')">
              <span v-text="$t('global.field.id')">ID</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'id'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('userId')">
              <span v-text="$t('gatewayApp.alarmAlarm.userId')">User Id</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'userId'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('siteUrl')">
              <span v-text="$t('gatewayApp.alarmAlarm.siteUrl')">Site Url</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'siteUrl'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('description')">
              <span v-text="$t('gatewayApp.alarmAlarm.description')">Description</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'description'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('refeshTime')">
              <span v-text="$t('gatewayApp.alarmAlarm.refeshTime')">Refesh Time</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'refeshTime'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('musicTitle')">
              <span v-text="$t('gatewayApp.alarmAlarm.musicTitle')">Music Title</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'musicTitle'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('musicPath')">
              <span v-text="$t('gatewayApp.alarmAlarm.musicPath')">Music Path</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'musicPath'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('vbEnabled')">
              <span v-text="$t('gatewayApp.alarmAlarm.vbEnabled')">Vb Enabled</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'vbEnabled'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('useSwitch')">
              <span v-text="$t('gatewayApp.alarmAlarm.useSwitch')">Use Switch</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'useSwitch'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('createdDate')">
              <span v-text="$t('gatewayApp.alarmAlarm.createdDate')">Created Date</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'createdDate'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('crawlingDate')">
              <span v-text="$t('gatewayApp.alarmAlarm.crawlingDate')">Crawling Date</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'crawlingDate'"></jhi-sort-indicator>
            </th>
            <th scope="row"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alarm in alarms" :key="alarm.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'AlarmView', params: { alarmId: alarm.id } }">{{ alarm.id }}</router-link>
            </td>
            <td>{{ alarm.userId }}</td>
            <td>{{ alarm.siteUrl }}</td>
            <td>{{ alarm.description }}</td>
            <td v-text="$t('gatewayApp.SelectedTime.' + alarm.refeshTime)">{{ alarm.refeshTime }}</td>
            <td>{{ alarm.musicTitle }}</td>
            <td>{{ alarm.musicPath }}</td>
            <td>{{ alarm.vbEnabled }}</td>
            <td>{{ alarm.useSwitch }}</td>
            <td>{{ alarm.createdDate }}</td>
            <td>{{ alarm.crawlingDate }}</td>
            <td class="text-right">
              <div class="btn-group">
                <router-link :to="{ name: 'AlarmView', params: { alarmId: alarm.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'AlarmEdit', params: { alarmId: alarm.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                  </button>
                </router-link>
                <b-button
                  v-on:click="prepareRemove(alarm)"
                  variant="danger"
                  class="btn btn-sm"
                  data-cy="entityDeleteButton"
                  v-b-modal.removeEntity
                >
                  <font-awesome-icon icon="times"></font-awesome-icon>
                  <span class="d-none d-md-inline" v-text="$t('entity.action.delete')">Delete</span>
                </b-button>
              </div>
            </td>
          </tr>
        </tbody>
        <infinite-loading
          ref="infiniteLoading"
          v-if="totalItems > itemsPerPage"
          :identifier="infiniteId"
          slot="append"
          @infinite="loadMore"
          force-use-infinite-wrapper=".el-table__body-wrapper"
          :distance="20"
        >
        </infinite-loading>
      </table>
    </div>
    <b-modal ref="removeEntity" id="removeEntity">
      <span slot="modal-title"
        ><span id="gatewayApp.alarmAlarm.delete.question" data-cy="alarmDeleteDialogHeading" v-text="$t('entity.delete.title')"
          >Confirm delete operation</span
        ></span
      >
      <div class="modal-body">
        <p id="jhi-delete-alarm-heading" v-text="$t('gatewayApp.alarmAlarm.delete.question', { id: removeId })">
          Are you sure you want to delete this Alarm?
        </p>
      </div>
      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          id="jhi-confirm-delete-alarm"
          data-cy="entityConfirmDeleteButton"
          v-text="$t('entity.action.delete')"
          v-on:click="removeAlarm()"
        >
          Delete
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./alarm.component.ts"></script>
