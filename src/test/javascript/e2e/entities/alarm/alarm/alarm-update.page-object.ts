import { by, element, ElementFinder } from 'protractor';

import AlertPage from '../../../page-objects/alert-page';

export default class AlarmUpdatePage extends AlertPage {
  title: ElementFinder = element(by.id('gatewayApp.alarmAlarm.home.createOrEditLabel'));
  footer: ElementFinder = element(by.id('footer'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));

  userIdInput: ElementFinder = element(by.css('input#alarm-userId'));

  siteUrlInput: ElementFinder = element(by.css('input#alarm-siteUrl'));

  descriptionInput: ElementFinder = element(by.css('input#alarm-description'));

  refeshTimeSelect = element(by.css('select#alarm-refeshTime'));

  musicTitleInput: ElementFinder = element(by.css('input#alarm-musicTitle'));

  musicPathInput: ElementFinder = element(by.css('input#alarm-musicPath'));

  vbEnabledInput: ElementFinder = element(by.css('input#alarm-vbEnabled'));

  useSwitchInput: ElementFinder = element(by.css('input#alarm-useSwitch'));

  createdDateInput: ElementFinder = element(by.css('input#alarm-createdDate'));

  crawlingDateInput: ElementFinder = element(by.css('input#alarm-crawlingDate'));
}
