import { By, WebDriver } from "selenium-webdriver";
import { getServiceSeedData } from "../../data/seed/service";
import { CURRENT_LANGUAGE_ID } from "../../settings";
import { goToUrl, waitUntilToastrMessage } from "../selenium";
import { presetDatatableIdBySearch } from "./datatable";
import { presetPopulateFormData, presetSubmitModal } from "./form";


export function presetCreateService(driver: WebDriver): Promise<object> {
    return new Promise(async function presetCreateServicePromise(resolve, reject) {

        await goToUrl(driver, '/commercial/service');

        await driver.findElement(By.css('button#create-service')).click();

        const modelData = await presetPopulateFormData(driver, By.css('form#modal-form'), getServiceSeedData());

        await presetSubmitModal(driver);

        await waitUntilToastrMessage(driver);

        modelData['id'] = await presetDatatableIdBySearch(driver, 'service_datatable', modelData['name'][CURRENT_LANGUAGE_ID]);

        resolve(modelData);
    });
}