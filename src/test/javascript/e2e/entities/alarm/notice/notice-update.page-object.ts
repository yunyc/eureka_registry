import { by, element, ElementFinder } from 'protractor';

import AlertPage from '../../../page-objects/alert-page';

export default class NoticeUpdatePage extends AlertPage {
  title: ElementFinder = element(by.id('gatewayApp.alarmNotice.home.createOrEditLabel'));
  footer: ElementFinder = element(by.id('footer'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));

  contentInput: ElementFinder = element(by.css('input#notice-content'));

  saveEnabledInput: ElementFinder = element(by.css('input#notice-saveEnabled'));

  visiabledInput: ElementFinder = element(by.css('input#notice-visiabled'));

  crawledDateInput: ElementFinder = element(by.css('input#notice-crawledDate'));

  alarmSelect = element(by.css('select#notice-alarm'));
}
