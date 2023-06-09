<template>
  <div>
    <h2 id="page-heading" data-cy="NoticeHeading">
      <span v-text="$t('gatewayApp.alarmNotice.home.title')" id="notice-heading">Notices</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span v-text="$t('gatewayApp.alarmNotice.home.refreshListLabel')">Refresh List</span>
        </button>
        <router-link :to="{ name: 'NoticeCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-notice"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span v-text="$t('gatewayApp.alarmNotice.home.createLabel')"> Create a new Notice </span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && notices && notices.length === 0">
      <span v-text="$t('gatewayApp.alarmNotice.home.notFound')">No notices found</span>
    </div>
    <div class="table-responsive" v-if="notices && notices.length > 0">
      <table class="table table-striped" aria-describedby="notices">
        <thead>
          <tr>
            <th scope="row" v-on:click="changeOrder('id')">
              <span v-text="$t('global.field.id')">ID</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'id'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('content')">
              <span v-text="$t('gatewayApp.alarmNotice.content')">Content</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'content'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('saveEnabled')">
              <span v-text="$t('gatewayApp.alarmNotice.saveEnabled')">Save Enabled</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'saveEnabled'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('visiabled')">
              <span v-text="$t('gatewayApp.alarmNotice.visiabled')">Visiabled</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'visiabled'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('crawledDate')">
              <span v-text="$t('gatewayApp.alarmNotice.crawledDate')">Crawled Date</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'crawledDate'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('alarm.id')">
              <span v-text="$t('gatewayApp.alarmNotice.alarm')">Alarm</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'alarm.id'"></jhi-sort-indicator>
            </th>
            <th scope="row"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="notice in notices" :key="notice.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'NoticeView', params: { noticeId: notice.id } }">{{ notice.id }}</router-link>
            </td>
            <td>{{ notice.content }}</td>
            <td>{{ notice.saveEnabled }}</td>
            <td>{{ notice.visiabled }}</td>
            <td>{{ notice.crawledDate }}</td>
            <td>
              <div v-if="notice.alarm">
                <router-link :to="{ name: 'AlarmView', params: { alarmId: notice.alarm.id } }">{{ notice.alarm.id }}</router-link>
              </div>
            </td>
            <td class="text-right">
              <div class="btn-group">
                <router-link :to="{ name: 'NoticeView', params: { noticeId: notice.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'NoticeEdit', params: { noticeId: notice.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                  </button>
                </router-link>
                <b-button
                  v-on:click="prepareRemove(notice)"
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
        ><span id="gatewayApp.alarmNotice.delete.question" data-cy="noticeDeleteDialogHeading" v-text="$t('entity.delete.title')"
          >Confirm delete operation</span
        ></span
      >
      <div class="modal-body">
        <p id="jhi-delete-notice-heading" v-text="$t('gatewayApp.alarmNotice.delete.question', { id: removeId })">
          Are you sure you want to delete this Notice?
        </p>
      </div>
      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          id="jhi-confirm-delete-notice"
          data-cy="entityConfirmDeleteButton"
          v-text="$t('entity.action.delete')"
          v-on:click="removeNotice()"
        >
          Delete
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./notice.component.ts"></script>
