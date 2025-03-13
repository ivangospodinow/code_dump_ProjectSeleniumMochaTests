import { WebDriver } from "selenium-webdriver";
import { LOGIN_EMAIL, LOGIN_PASSWORD, PROJECT_URL } from "../../settings";
import { DriverSetting, getDriverList, waitElementExist } from "../../tools/selenium";

import { By } from 'selenium-webdriver';
const assert = require('assert');



getDriverList().forEach((driverSetting: DriverSetting) => {
    describe('Login to project with ' + driverSetting['label'], function () {
        let driver: WebDriver;

        before(async function () {
            driver = await driverSetting.createDriver();
        });

        it('Login to dashboard', async function () {
            await driver.get(PROJECT_URL + '/auth/login');

            await driver.findElement(By.css('form#login input[name="email"]')).sendKeys(LOGIN_EMAIL);
            await driver.findElement(By.css('form#login input[name="password"]')).sendKeys(LOGIN_PASSWORD);

            await driver.findElement(By.css('form#login button.btn-primary')).click();

            const selectCompanyListExists = await waitElementExist(driver, By.css('form#select-login-company'));
            assert.ok(selectCompanyListExists, 'Select login company form exists');

            await driver.findElement(By.css('form#select-login-company [data-company-id="' + driver['_COMPANY_ID'] + '"]')).click();

            const mainMenuExists = await waitElementExist(driver, By.css('#wb-main-nav'));
            assert.ok(mainMenuExists, 'Dashboard screen after login');
        });

        after(() => {
            driver.quit();
        });
    });
});
