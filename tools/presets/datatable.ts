import { By, until, WebDriver, WebElement } from "selenium-webdriver";
import { elementExists, elementsExists, waitUntilSelectorHasText, waitElementsExist, clearInput, sendKeys, clearSendKeys, waitElementExist, elementHasClass, waitElementVisible } from "../selenium";
import { debug, sleep, stringGetSeed, stringHasSeed } from "../tools";
import { awaitModalFormToLoad } from "./form";

export function presetDatatableSearch(driver: WebDriver, datatableId: string, search: string): Promise<boolean> {
    return new Promise(async function presetPopulateFormDataPromise(resolve, reject) {
        try {
            const table = await elementExists(driver, By.css('#' + datatableId + '_wrapper'));
            if (!table) {
                debug.warn('table doesnt exists')
                return resolve(false);
            }

            const input = await elementExists(table, By.css('.dataTables_filter input[type="search"]'));
            if (!input) {
                debug.warn('table search doesnt exists')
                return resolve(false);
            }

            if (stringHasSeed(search)) {
                search = stringGetSeed(search);
            }

            var currentSearchValue = await input.getAttribute('value');
            if (currentSearchValue !== search) {
                await clearSendKeys(driver, input, search);
                await waitElementExist(driver, By.css('#' + datatableId + '[data-datatable-ajax-loaded="1"]'));
            }

            resolve(true);
        } catch (error) {
            debug.error('presetDatatableSearch', error)
            reject(error);
        }
    });
}

export function presetDatatableIdBySearch(driver: WebDriver, datatableId: string, search: string): Promise<number | undefined> {
    return new Promise(async function presetPopulateFormDataPromise(resolve, reject) {
        try {
            const searched = await presetDatatableSearch(driver, datatableId, search);
            if (!searched) {
                return resolve(undefined);
            }
            const resultFound = await waitUntilSelectorHasText(driver, By.css('#' + datatableId + ' tbody tr td'), search);

            if (!resultFound) {
                debug.warn('table search result not found in row ', search)
                return resolve(undefined);
            }

            const actionsTd = await elementExists(driver, By.css('#' + datatableId + ' tbody tr td:last-child'));
            if (!actionsTd) {
                debug.warn('actions td not found');
                return resolve(undefined);
            }
            const elementWithId = await actionsTd.findElement(By.css('[data-origin-id]'));
            const id = parseInt(await elementWithId.getAttribute('data-origin-id'));
            if (!id) {
                debug.warn('get id by other way');
                return resolve(undefined);
            }
            return resolve(id);
        } catch (error) {
            debug.error('presetDatatableIdBySearch', error)
            reject(error);
        }
    });
}

export function presetDatatableResultsNotFound(driver: WebDriver, datatableId: string, search: string): Promise<boolean> {
    return new Promise(async function presetPopulateFormDataPromise(resolve, reject) {
        try {
            const searched = await presetDatatableSearch(driver, datatableId, search);
            if (!searched) {
                return resolve(undefined);
            }

            const resultsNotFound = await waitElementExist(driver, By.css('#' + datatableId + ' tbody td.dataTables_empty'));
            return resolve(resultsNotFound ? true : false);
        } catch (error) {
            debug.error('presetDatatableResultsNotFound', error)
            reject(error);
        }
    });
}


export function presetDatatableCellValueSearch(driver: WebDriver, datatableId: string, search: string, tdIndex: number = 0): Promise<string | undefined> {
    return new Promise(async function presetPopulateFormDataPromise(resolve, reject) {
        try {
            const searched = await presetDatatableSearch(driver, datatableId, search);
            if (!searched) {
                return resolve(undefined);
            }
            const resultFound = await waitUntilSelectorHasText(driver, By.css('#' + datatableId + ' tbody tr td'), search);

            if (!resultFound) {
                debug.warn('table search result not found in row ', search)
                return resolve(undefined);
            }
            const tds = await elementsExists(driver, By.css('#' + datatableId + ' tbody tr td'));
            if (undefined !== tds[tdIndex]) {
                return resolve(String(await tds[tdIndex].getText()).trim());
            }
            debug.warn('Td index not found', tdIndex)
            return resolve(undefined);
        } catch (error) {
            debug.error('presetDatatableCellValueSearch', error)
            reject(error);
        }
    });
}

export function presetDatatableClickEditButton(driver: WebDriver, datatableId: string, id: number): Promise<WebElement | undefined> {
    return new Promise(async function presetDatatableClickEditButtonPromise(resolve, reject) {
        try {
            const table = await elementExists(driver, By.css('#' + datatableId + '_wrapper'));
            if (!table) {
                debug.warn('table doesnt exists')
                return resolve(undefined);
            }

            await presetDatatableUncollapseResults(driver, By.css('#' + datatableId));
            await waitElementVisible(driver, By.css('button[data-edit][data-action]'));

            const buttons = await table.findElements(By.css('button[data-edit][data-action]'));
            let button: WebElement;
            let url: string;
            let buttonToClick: WebElement;
            for (button of buttons) {
                url = await button.getAttribute('data-action');
                if (url.includes('/' + id)) {
                    buttonToClick = button;
                    break;
                }
            }

            if (!buttonToClick) {
                debug.warn('datatable edit button not found');
                return resolve(undefined);
            }

            await buttonToClick.click();

            const form = await awaitModalFormToLoad(driver);
            if (!form) {
                debug.warn('Form not found');
            }
            resolve(form);
        } catch (error) {
            debug.error('presetDatatableClickEditButton', error)
            reject(error);
        }
    });
}

export function presetDatatableClickDeleteButton(driver: WebDriver, datatableId: string, id: number): Promise<WebElement | undefined> {
    return new Promise(async function presetDatatableClickDeleteButtonPromise(resolve, reject) {
        try {
            const table = await elementExists(driver, By.css('#' + datatableId + '_wrapper'));
            if (!table) {
                debug.warn('table doesnt exists')
                return resolve(undefined);
            }


            await presetDatatableUncollapseResults(driver, By.css('#' + datatableId));
            await waitElementVisible(driver, By.css('button.btn-wb-delete'));

            const buttons = await table.findElements(By.css('button.btn-wb-delete'));
            let button: WebElement;
            let url: string;
            let buttonToClick: WebElement;
            for (button of buttons) {
                url = await button.getAttribute('data-action');
                if (url.includes('/' + id)) {
                    buttonToClick = button;
                    break;
                }
            }

            if (!buttonToClick) {
                debug.warn('datatable edit button not found');
                return resolve(undefined);
            }

            await buttonToClick.click();

            const form = await awaitModalFormToLoad(driver);
            if (!form) {
                debug.warn('Form not found');
            }
            resolve(form);
        } catch (error) {
            debug.error('presetDatatableClickDeleteButton', error)
            reject(error);
        }
    });
}

export function presetDatatableUncollapseResults(driver: WebDriver, selector: WebElement | By): Promise<boolean> {
    return new Promise(async function presetPopulateFormDataPromise(resolve, reject) {
        try {
            let table: WebElement;
            if (selector instanceof By) {
                table = await elementExists(driver, selector);
            } else {
                table = selector;
            }

            if (await elementHasClass(table, 'collapsed')) {
                const firstTd = await elementExists(table, By.css('tbody tr td'));
                if (firstTd) {
                    await firstTd.click();
                } else {
                    debug.warn('Table collapsed by no tds found')
                }
            }
            resolve(true)
        } catch (error) {
            debug.error('presetDatatableResultsNotFound', error)
            reject(error);
        }
    });
}
