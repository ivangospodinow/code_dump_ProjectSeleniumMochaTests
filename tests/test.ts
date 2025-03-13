
import { webdriver, Builder, By, Key, until, WebDriver } from 'selenium-webdriver';
import { presetLoginAndGoTo } from "../tools/presets/login";
import { getServiceGroupSeedData } from "../data/seed/service_group";
import { BROWSER_LIST, CURRENT_LANGUAGE_ID, LANGUAGES } from '../settings';
import { presetPopulateFormData } from '../tools/presets/form';
import { DriverSetting, getDriverList, goToUrl, goToUrlWaitForDataTable, waitElementExist } from '../tools/selenium';
import { randArrayValues } from '../tools/tools';
import { presetDatatableIdBySearch } from '../tools/presets/datatable';
import { presetCreateServiceGroup } from '../tools/presets/servcie_group';
import { presetCreateService } from '../tools/presets/service';

const assert = require('assert');


getDriverList().forEach((driverSetting: DriverSetting) => {
    describe('test with ' + driverSetting['label'], function () {
        let driver: WebDriver;
        before(async function () {
            driver = await driverSetting.createDriver();
        });

        it('test', async function () {
            // await presetLoginAndGoTo(driver, '/commercial/service');
            // const serviceGroup = await presetCreateService(driver);


        });

        after(() => {
            driver.quit();
        });
    });
});
