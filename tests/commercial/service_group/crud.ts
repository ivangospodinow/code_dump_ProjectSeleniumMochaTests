import { ThenableWebDriver, WebDriver } from "selenium-webdriver";

import { presetLoginAndGoTo } from "../../../tools/presets/login";
import { presetCreateServiceGroup } from "../../../tools/presets/servcie_group";
import { getDriverList, goToUrlWaitForDataTable, waitUntilToastrMessage } from "../../../tools/selenium";
import { presetDatatableClickDeleteButton, presetDatatableClickEditButton, presetDatatableIdBySearch, presetDatatableResultsNotFound } from '../../../tools/presets/datatable';
import { CURRENT_LANGUAGE_ID } from "../../../settings";
import { presetVerifyFormData, presetPopulateFormData, presetSubmitModal } from "../../../tools/presets/form";
import { getServiceGroupSeedData } from "../../../data/seed/service_group";
import { Console } from "console";
const assert = require('assert');


getDriverList().forEach((driverSetting: DriverSetting) => {
    describe('Service group with ' + driverSetting['label'], function () {
        let driver: WebDriver;
        let serviceGroup = {};
        before(async function () {
            driver = await driverSetting.createDriver();
        });

        it('Creating Service group', async function () {
            await presetLoginAndGoTo(driver, '/commercial/groups');
            serviceGroup = await presetCreateServiceGroup(driver);
            assert.ok(serviceGroup, 'Service group created');

            // verify created
            await goToUrlWaitForDataTable(driver, '/commercial/groups', 'servicegroup_datatable');

            const foundId = await presetDatatableIdBySearch(driver, 'servicegroup_datatable', serviceGroup['name'][CURRENT_LANGUAGE_ID]);
            assert.ok(serviceGroup['id'] > 0 && foundId > 0 && foundId === serviceGroup['id'], 'Service group found');

            const form = await presetDatatableClickEditButton(driver, 'servicegroup_datatable', foundId);
            assert.ok(form, 'Service group edit form loaded');

            serviceGroup['service_group_id'] = foundId;
            const sameData = await presetVerifyFormData(driver, form, serviceGroup);
            assert.ok(sameData, 'Service group edit load has same data');

        });

        it('Editing Service group', async function () {
            await goToUrlWaitForDataTable(driver, '/commercial/groups', 'servicegroup_datatable');

            const foundId = await presetDatatableIdBySearch(driver, 'servicegroup_datatable', serviceGroup['name'][CURRENT_LANGUAGE_ID]);
            assert.ok(serviceGroup['id'] > 0 && foundId > 0 && foundId === serviceGroup['id'], 'Service group found');

            const form = await presetDatatableClickEditButton(driver, 'servicegroup_datatable', foundId);
            assert.ok(form, 'Service group edit form loaded');

            const serviceGroupUpdateData = await presetPopulateFormData(driver, form, getServiceGroupSeedData());

            // update the original state of the service group so further action can rely on it
            serviceGroup = { ...serviceGroup, ...serviceGroupUpdateData };

            await presetSubmitModal(driver);

            await waitUntilToastrMessage(driver);

            // verify updated
            await goToUrlWaitForDataTable(driver, '/commercial/groups', 'servicegroup_datatable');

            const updatedId = await presetDatatableIdBySearch(driver, 'servicegroup_datatable', serviceGroupUpdateData['name'][CURRENT_LANGUAGE_ID]);
            assert.ok(foundId === updatedId, 'Service group found');

            const updateForm = await presetDatatableClickEditButton(driver, 'servicegroup_datatable', updatedId);
            assert.ok(updateForm, 'Service group edit form loaded');

            const sameData = await presetVerifyFormData(driver, updateForm, serviceGroupUpdateData);
            assert.ok(sameData, 'Service group edit load has same data');
        });

        it('Deleting Service group', async function () {
            await goToUrlWaitForDataTable(driver, '/commercial/groups', 'servicegroup_datatable');

            await presetDatatableIdBySearch(driver, 'servicegroup_datatable', serviceGroup['name'][CURRENT_LANGUAGE_ID]);

            const form = await presetDatatableClickDeleteButton(driver, 'servicegroup_datatable', serviceGroup['id']);
            assert.ok(form, 'Service group delete form loaded');

            await presetSubmitModal(driver);

            await waitUntilToastrMessage(driver);

            await goToUrlWaitForDataTable(driver, '/commercial/groups', 'servicegroup_datatable');
            const resouldsNotFound = await presetDatatableResultsNotFound(driver, 'servicegroup_datatable', serviceGroup['name'][CURRENT_LANGUAGE_ID]);
            assert.ok(resouldsNotFound, 'Service deleted not found id');
        });

        after(() => {
            driver.quit();
        });
    });
});
