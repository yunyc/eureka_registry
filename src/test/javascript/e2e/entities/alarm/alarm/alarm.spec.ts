/* tslint:disable no-unused-expression */
import { browser } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import AlarmComponentsPage, { AlarmDeleteDialog } from './alarm.page-object';
import AlarmUpdatePage from './alarm-update.page-object';
import AlarmDetailsPage from './alarm-details.page-object';

import {
  clear,
  click,
  getRecordsCount,
  isVisible,
  selectLastOption,
  waitUntilAllDisplayed,
  waitUntilAnyDisplayed,
  waitUntilCount,
  waitUntilDisplayed,
  waitUntilHidden,
} from '../../../util/utils';

const expect = chai.expect;

describe('Alarm e2e test', () => {
  let navBarPage: NavBarPage;
  let updatePage: AlarmUpdatePage;
  let detailsPage: AlarmDetailsPage;
  let listPage: AlarmComponentsPage;
  let deleteDialog: AlarmDeleteDialog;
  let beforeRecordsCount = 0;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    await navBarPage.login(username, password);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });

  it('should load Alarms', async () => {
    await navBarPage.getEntityPage('alarm');
    listPage = new AlarmComponentsPage();

    await waitUntilAllDisplayed([listPage.title, listPage.footer]);

    expect(await listPage.title.getText()).not.to.be.empty;
    expect(await listPage.createButton.isEnabled()).to.be.true;

    await waitUntilAnyDisplayed([listPage.noRecords, listPage.table]);
    beforeRecordsCount = (await isVisible(listPage.noRecords)) ? 0 : await getRecordsCount(listPage.table);
  });
  describe('Create flow', () => {
    it('should load create Alarm page', async () => {
      await listPage.createButton.click();
      updatePage = new AlarmUpdatePage();

      await waitUntilAllDisplayed([updatePage.title, updatePage.footer, updatePage.saveButton]);

      expect(await updatePage.title.getAttribute('id')).to.match(/gatewayApp.alarmAlarm.home.createOrEditLabel/);
    });

    it('should create and save Alarms', async () => {
      await updatePage.userIdInput.sendKeys('5');

      await updatePage.siteUrlInput.sendKeys('Ol8');

      await updatePage.descriptionInput.sendKeys('description');

      await selectLastOption(updatePage.refeshTimeSelect);

      await updatePage.musicTitleInput.sendKeys('musicTitle');

      await updatePage.musicPathInput.sendKeys('musicPath');

      await updatePage.vbEnabledInput.click();

      await updatePage.useSwitchInput.click();

      await updatePage.createdDateInput.sendKeys('2001-01-01');

      await updatePage.crawlingDateInput.sendKeys('2001-01-01');

      expect(await updatePage.saveButton.isEnabled()).to.be.true;
      await updatePage.saveButton.click();

      await waitUntilHidden(updatePage.saveButton);
      expect(await isVisible(updatePage.saveButton)).to.be.false;

      await waitUntilCount(listPage.records, beforeRecordsCount + 1);
      expect(await listPage.records.count()).to.eq(beforeRecordsCount + 1);
    });

    describe('Details, Update, Delete flow', () => {
      after(async () => {
        const deleteButton = listPage.getDeleteButton(listPage.records.last());
        await click(deleteButton);

        deleteDialog = new AlarmDeleteDialog();
        await waitUntilDisplayed(deleteDialog.dialog);

        expect(await deleteDialog.title.getAttribute('id')).to.match(/gatewayApp.alarmAlarm.delete.question/);

        await click(deleteDialog.confirmButton);
        await waitUntilHidden(deleteDialog.dialog);

        expect(await isVisible(deleteDialog.dialog)).to.be.false;

        await waitUntilCount(listPage.records, beforeRecordsCount);
        expect(await listPage.records.count()).to.eq(beforeRecordsCount);
      });

      it('should load details Alarm page and fetch data', async () => {
        const detailsButton = listPage.getDetailsButton(listPage.records.last());
        await click(detailsButton);

        detailsPage = new AlarmDetailsPage();

        await waitUntilAllDisplayed([detailsPage.title, detailsPage.backButton, detailsPage.firstDetail]);

        expect(await detailsPage.title.getText()).not.to.be.empty;
        expect(await detailsPage.firstDetail.getText()).not.to.be.empty;

        await click(detailsPage.backButton);
        await waitUntilCount(listPage.records, beforeRecordsCount + 1);
      });

      it('should load edit Alarm page, fetch data and update', async () => {
        const editButton = listPage.getEditButton(listPage.records.last());
        await click(editButton);

        await waitUntilAllDisplayed([updatePage.title, updatePage.footer, updatePage.saveButton]);

        expect(await updatePage.title.getText()).not.to.be.empty;

        await clear(updatePage.userIdInput);
        await updatePage.userIdInput.sendKeys('6');

        await updatePage.siteUrlInput.clear();
        await updatePage.siteUrlInput.sendKeys('Wubl4');

        await updatePage.descriptionInput.clear();
        await updatePage.descriptionInput.sendKeys('modified');

        await updatePage.musicTitleInput.clear();
        await updatePage.musicTitleInput.sendKeys('modified');

        await updatePage.musicPathInput.clear();
        await updatePage.musicPathInput.sendKeys('modified');

        await updatePage.vbEnabledInput.click();

        await updatePage.useSwitchInput.click();

        await updatePage.createdDateInput.clear();
        await updatePage.createdDateInput.sendKeys('2019-01-01');

        await updatePage.crawlingDateInput.clear();
        await updatePage.crawlingDateInput.sendKeys('2019-01-01');

        await updatePage.saveButton.click();

        await waitUntilHidden(updatePage.saveButton);

        expect(await isVisible(updatePage.saveButton)).to.be.false;
        await waitUntilCount(listPage.records, beforeRecordsCount + 1);
      });
    });
  });
});
