import { by, element, ElementFinder } from 'protractor';

import AlertPage from '../../../page-objects/alert-page';

export default class KeywordUpdatePage extends AlertPage {
  title: ElementFinder = element(by.id('gatewayApp.alarmKeyword.home.createOrEditLabel'));
  footer: ElementFinder = element(by.id('footer'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));

  textInput: ElementFinder = element(by.css('input#keyword-text'));

  alarmSelect = element(by.css('select#keyword-alarm'));
}
