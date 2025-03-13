import { ThenableWebDriver, WebDriver } from "selenium-webdriver";

import { presetLoginAndGoTo } from "../../../tools/presets/login";
import { presetCreateServiceGroup } from "../../../tools/presets/servcie_group";
import { DriverSetting, getDriverList, goToUrlWaitForDataTable, waitUntilToastrMessage } from "../../../tools/selenium";
import { presetDatatableClickDeleteButton, presetDatatableClickEditButton, presetDatatableIdBySearch, presetDatatableResultsNotFound } from '../../../tools/presets/datatable';
import { CURRENT_LANGUAGE_ID } from "../../../settings";
import { presetVerifyFormData, presetPopulateFormData, presetSubmitModal } from "../../../tools/presets/form";
import { getServiceGroupSeedData } from "../../../data/seed/service_group";
import { presetCreateProject } from "../../../tools/presets/project";
import { getProjectSeedData } from "../../../data/seed/project";
const assert = require('assert');



getDriverList().forEach((driverSetting: DriverSetting) => {
    describe('Project with ' + driverSetting['label'], function () {
        let driver: WebDriver;
        let project = {};
        before(async function () {
            driver = await driverSetting.createDriver();
        });


        it('Creating Project', async function () {
            await presetLoginAndGoTo(driver, '/commercial/projects');
            project = await presetCreateProject(driver);
            assert.ok(project, 'Proejct created');

            // verify created
            await goToUrlWaitForDataTable(driver, '/commercial/projects', 'projects_datatable');

            const foundId = await presetDatatableIdBySearch(driver, 'projects_datatable', project['name'][CURRENT_LANGUAGE_ID]);
            assert.ok(project['id'] > 0 && foundId > 0 && foundId === project['id'], 'Project found');

            const form = await presetDatatableClickEditButton(driver, 'projects_datatable', foundId);
            assert.ok(form, 'Project edit form loaded');

            const sameData = await presetVerifyFormData(driver, form, project);
            assert.ok(sameData, 'Project edit load has same data');

        });

        it('Editing project', async function () {
            await goToUrlWaitForDataTable(driver, '/commercial/projects', 'projects_datatable');

            const foundId = await presetDatatableIdBySearch(driver, 'projects_datatable', project['name'][CURRENT_LANGUAGE_ID]);
            assert.ok(project['id'] > 0 && foundId > 0 && foundId === project['id'], 'Project found');

            const form = await presetDatatableClickEditButton(driver, 'projects_datatable', foundId);
            assert.ok(form, 'Project edit form loaded');

            const projetUpdateData = await presetPopulateFormData(driver, form, getProjectSeedData());

            // update the original state of the Project so further action can rely on it
            project = { ...project, ...projetUpdateData };
            await presetSubmitModal(driver);

            await waitUntilToastrMessage(driver);

            // verify updated
            await goToUrlWaitForDataTable(driver, '/commercial/projects', 'projects_datatable');

            const updatedId = await presetDatatableIdBySearch(driver, 'projects_datatable', projetUpdateData['name'][CURRENT_LANGUAGE_ID]);
            assert.ok(foundId === updatedId, 'Project found');

            const updateForm = await presetDatatableClickEditButton(driver, 'projects_datatable', updatedId);
            assert.ok(updateForm, 'Project edit form loaded');

            const sameData = await presetVerifyFormData(driver, updateForm, projetUpdateData);
            assert.ok(sameData, 'Project edit load has same data');
        });

        it('Deleting Project', async function () {
            await goToUrlWaitForDataTable(driver, '/commercial/projects', 'projects_datatable');

            await presetDatatableIdBySearch(driver, 'projects_datatable', project['name'][CURRENT_LANGUAGE_ID]);

            const form = await presetDatatableClickDeleteButton(driver, 'projects_datatable', project['id']);
            assert.ok(form, 'Project delete form loaded');

            await presetSubmitModal(driver);

            await waitUntilToastrMessage(driver);

            await goToUrlWaitForDataTable(driver, '/commercial/projects', 'projects_datatable');
            const resouldsNotFound = await presetDatatableResultsNotFound(driver, 'projects_datatable', project['name'][CURRENT_LANGUAGE_ID]);
            assert.ok(resouldsNotFound, 'Project deleted');
        });

        after(() => {
            driver.quit();
        });
    });
});
