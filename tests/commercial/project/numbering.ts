import { ThenableWebDriver, WebDriver } from "selenium-webdriver";

import { presetLoginAndGoTo } from "../../../tools/presets/login";
import { presetCreateServiceGroup } from "../../../tools/presets/servcie_group";
import { DriverSetting, getDriverList, goToUrl, goToUrlWaitForDataTable, waitUntilToastrMessage } from "../../../tools/selenium";
import { presetDatatableCellValueSearch, presetDatatableClickDeleteButton, presetDatatableClickEditButton, presetDatatableIdBySearch } from '../../../tools/presets/datatable';
import { CURRENT_LANGUAGE_ID } from "../../../settings";
import { presetCreateProject } from "../../../tools/presets/project";
const assert = require('assert');



getDriverList().forEach((driverSetting: DriverSetting) => {
    describe('Project numbering ' + driverSetting['label'], function () {
        let driver: WebDriver;
        let project = {};
        before(async function () {
            driver = await driverSetting.createDriver();
        });

        it('Creating 3 Projects and checking number increases', async function () {
            await presetLoginAndGoTo(driver, '/commercial/projects');

            let projectNumbers = [];
            let projectNumber: string;

            // create 3 projects
            for (let _ of new Array(3)) {
                await goToUrl(driver, '/commercial/projects');

                project = await presetCreateProject(driver);
                assert.ok(project, 'Project created');

                projectNumber = await presetDatatableCellValueSearch(driver, 'projects_datatable', project['name'][CURRENT_LANGUAGE_ID]);
                projectNumbers.push(projectNumber);
            }

            const projectInts = projectNumbers.map(str => parseInt(str.replace(/\D/g, '')));

            assert.ok(projectInts.length === 3, '3 projects created ' + projectInts.join(','));
            assert.ok(projectInts[1] > projectInts[0], 'project number increased ' + projectInts.join(','));
            assert.ok(projectInts[2] > projectInts[1], 'project number increased ' + projectInts.join(','));
        });

        after(() => {
            driver.quit();
        });
    });
});
