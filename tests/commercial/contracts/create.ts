import { ThenableWebDriver, WebDriver } from "selenium-webdriver";

import { webdriver, Builder, By, Key, until } from 'selenium-webdriver';

import { BROWSER_LIST } from "../../../settings";
import { presetLoginAndGoTo } from "../../../tools/presets/login";
import { DriverSetting, elementExists, getDriverList, waitElementExist } from "../../../tools/selenium";
const assert = require('assert');



getDriverList().forEach((driverSetting: DriverSetting) => {
    describe('Contract create with ' + driverSetting['label'], function () {
        let driver: WebDriver;

        before(async function () {
            driver = await driverSetting.createDriver();
        });

        it('Creating contract', async function () {
            await presetLoginAndGoTo(driver, '/commercial/contracts');

            const creatButton = await elementExists(driver, By.css('button#create-new-sale-contract'));
            assert.ok(creatButton, 'Create contract button');
            creatButton.click();

            const contractorSelectExists = await waitElementExist(driver, By.css('form#modal-form select[id="contractor_id"]'));
            assert.ok(contractorSelectExists, 'Create contract form is loaded');

            await waitElementExist(driver, By.css('form#modal-form #contractor_id_chosen'));
            await driver.findElement(By.css('form#modal-form #contractor_id_chosen')).click();

            const contractorOptions = await driver.findElements(By.css('form#modal-form #contractor_id_chosen [data-option-array-index]'));
            assert.ok(contractorOptions.length > 1, 'Contractor select options not filled');

            // @TODO make it with code
            contractorOptions[5].click();

            await driver.findElement(By.css('form#modal-form #second-submit-form-button')).click();

            const createOfferExists = await waitElementExist(driver, By.css('#contract-create-contract-order'));
            assert.ok(createOfferExists, 'Create offer button');
        });

        after(() => {
            driver.quit();
        });
    });
});
