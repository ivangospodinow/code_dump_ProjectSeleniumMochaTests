import { By, WebDriver, WebElement } from "selenium-webdriver";
import { getBudgetSeedData } from "../../data/seed/budget";
import { CURRENT_LANGUAGE_ID } from "../../settings";
import { elementExists, elementsExists, goToUrl, waitUntilToastrMessage } from "../selenium";
import { presetDatatableIdBySearch } from "./datatable";
import { presetPopulateFormData, presetSubmitModal } from "./form";


export function presetCreateBudget(driver: WebDriver, settings: { expense_kind_id: number, project_id?: number | string }): Promise<object> {
    return new Promise(async function presetCreateBudgetPromise(resolve, reject) {

        await goToUrl(driver, '/commercial/budgets');

        await driver.findElement(By.css('button#create-budget')).click();
        const createButton = await getExpenseKindButton(driver, settings['expense_kind_id']);
        await createButton.click();

        const modelData = await presetPopulateFormData(driver, By.css('form#modal-form'), getBudgetSeedData(settings));

        await presetSubmitModal(driver);

        await waitUntilToastrMessage(driver);

        modelData['id'] = await presetDatatableIdBySearch(driver, 'budgets_datatable', modelData['name'][CURRENT_LANGUAGE_ID]);

        resolve(modelData);
    });
}

function getExpenseKindButton(driver: WebDriver, expenseKindId: number): Promise<WebElement | undefined> {
    return new Promise(async function getExpenseKindButtonPromise(resolve, reject) {
        const createButtom = await elementExists(driver, By.css('button#create-budget'))
        const parent = await createButtom.findElement(By.xpath("./.."));

        const compare = 'id=' + expenseKindId;
        const links = await elementsExists(parent, By.css('ul a[data-action]'));
        let link: WebElement;
        for (link of links) {
            if ((await link.getAttribute('data-action')).includes(compare)) {
                return resolve(link);
            }
        }
        return resolve(undefined);
    });
}