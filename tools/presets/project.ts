import { By, WebDriver } from "selenium-webdriver";
import { getProjectSeedData } from "../../data/seed/project";
import { CURRENT_LANGUAGE_ID } from "../../settings";
import { goToUrl, waitUntilToastrMessage } from "../selenium";
import { presetDatatableIdBySearch } from "./datatable";
import { presetPopulateFormData, presetSubmitModal } from "./form";


export function presetCreateProject(driver: WebDriver): Promise<object> {
    return new Promise(async function presetCreateServiceGroupPromise(resolve, reject) {

        await goToUrl(driver, '/commercial/projects');

        await driver.findElement(By.css('button#create-project')).click();

        const modelData = await presetPopulateFormData(driver, By.css('form#modal-form'), getProjectSeedData());

        await presetSubmitModal(driver);

        await waitUntilToastrMessage(driver);

        modelData['id'] = await presetDatatableIdBySearch(driver, 'projects_datatable', modelData['name'][CURRENT_LANGUAGE_ID]);

        resolve(modelData);
    });
}