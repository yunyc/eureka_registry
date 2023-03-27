<template>
  <div>
    <b-dropdown-item to="/alarm">
      <font-awesome-icon icon="asterisk" />
      <span v-text="$t('global.menu.entities.alarmAlarm')">Alarm</span>
    </b-dropdown-item>
    <b-dropdown-item to="/keyword">
      <font-awesome-icon icon="asterisk" />
      <span v-text="$t('global.menu.entities.alarmKeyword')">Keyword</span>
    </b-dropdown-item>
    <b-dropdown-item to="/notice">
      <font-awesome-icon icon="asterisk" />
      <span v-text="$t('global.menu.entities.alarmNotice')">Notice</span>
    </b-dropdown-item>
    <!-- jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here -->
  </div>
</template>

<script lang="ts" src="./entities-menu.component.ts"></script>
