import { By, WebDriver } from "selenium-webdriver";
import { getServiceGroupSeedData } from "../../data/seed/service_group";
import { CURRENT_LANGUAGE_ID } from "../../settings";
import { goToUrl, waitUntilToastrMessage } from "../selenium";
import { presetDatatableIdBySearch } from "./datatable";
import { presetPopulateFormData, presetSubmitModal } from "./form";


export function presetCreateServiceGroup(driver: WebDriver): Promise<object> {
    return new Promise(async function presetCreateServiceGroupPromise(resolve, reject) {

        await goToUrl(driver, '/commercial/groups');

        await driver.findElement(By.css('button#create-service-group')).click();

        const modelData = await presetPopulateFormData(driver, By.css('form#modal-form'), getServiceGroupSeedData());

        await presetSubmitModal(driver);

        await waitUntilToastrMessage(driver);

        modelData['id'] = await presetDatatableIdBySearch(driver, 'servicegroup_datatable', modelData['name'][CURRENT_LANGUAGE_ID]);

        resolve(modelData);
    });
}