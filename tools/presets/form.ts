import { By, WebDriver, WebElement } from "selenium-webdriver";
import { DROPDOWN_RANDOM_VALUE, EMPTY_VALUE, WAIT_FORM_FOR_MS } from "../../settings";
import { elementExists, waitElementDisplayed, waitElementExist, waitElementHasClass } from "../selenium";
import { debug, isObjectDataContainedInObject, isObjectI18n, isStringJson, randArrayValues, sleep } from "../tools";

export function presetPopulateFormData(driver: WebDriver, formSelector: By | WebElement, formData: object): Promise<object | undefined> {
    return new Promise(async function presetPopulateFormDataPromise(resolve, reject) {
        try {
            let form: WebElement;
            if (formSelector instanceof By) {
                form = await waitElementExist(driver, formSelector, WAIT_FORM_FOR_MS);
            } else {
                form = formSelector;
            }

            if (!form) {
                debug.warn('Form not found')
                return resolve(undefined);
            }

            const result = {};
            let element: WebElement;
            let elementTag = '';
            for (let elementName of Object.keys(formData)) {
                elementTag = '';
                element = await presetGetFormElement(form, elementName);
                if (element) {
                    elementTag = await element.getTagName();
                }

                if (!element) {
                    debug.warn('Form element not found ', elementName);
                    result[elementName] = undefined;
                } else if (formData[elementName] === EMPTY_VALUE) {
                    result[elementName] = '';
                } else if (isObjectI18n(formData[elementName])) {
                    result[elementName] = await presetPopulateFormI18n(driver, form, elementName, formData[elementName])
                } else if (formData[elementName] === DROPDOWN_RANDOM_VALUE) {
                    result[elementName] = await presetSelectWithRandomValue(driver, form, elementName)
                } else if (elementTag === 'input') {
                    result[elementName] = await presetPopulateFormInput(driver, form, elementName, formData[elementName])
                } else if (elementTag === 'select') {
                    result[elementName] = await presetSelectWithValues(driver, form, elementName, [formData[elementName]]);
                } else {
                    debug.error('Form element not handled ', elementName);
                }
            }

            resolve(result);
        } catch (error) {
            debug.error('presetPopulateFormData', error)
            reject(error);
        }
    });
}

export function presetPopulateFormI18n(driver: WebDriver, form: WebElement, elementName: string, i18nData: object): Promise<object> {
    return new Promise(async function ppresetPopulateFormI18nPromise(resolve, reject) {
        try {
            let i18nWrapper = await form.findElement(By.css('div[as="' + elementName + '"]'));;
            let languageId: string;
            let addTranslationButton: WebElement | undefined;

            // if more than 1 transaltion is added
            // it will not work if you have only en string, and default language is bg
            if (Object.keys(i18nData).length > 1) {
                addTranslationButton = await elementExists(i18nWrapper, By.css('button.add-translation-button'));
                if (addTranslationButton) {
                    await addTranslationButton.click();
                }
            }

            let input: WebElement;
            for (languageId of Object.keys(i18nData)) {
                input = await i18nWrapper.findElement(By.css('[data-name="' + elementName + '[' + languageId + ']"]'));
                await input.clear();
                await input.sendKeys(i18nData[languageId]);
            }

            return resolve(i18nData);
        } catch (error) {
            debug.error('presetPopulateFormI18n', error)
            reject(error);
        }
    });
}

export function presetSelectWithRandomValue(driver: WebDriver, form: WebElement, elementName: string): Promise<string[]> {
    return new Promise(async function presetSelectWithRandomValuePromise(resolve, reject) {
        try {
            const select = await presetGetFormElement(form, elementName);
            if (!select) {
                return resolve([]);
            }

            const isMultiple = await select.getAttribute('multiple')
            const values = await presetGetSelectOptionsValues(select);
            resolve(await presetSelectWithValues(driver, form, elementName, randArrayValues(values, isMultiple ? 5 : 1), values));
        } catch (error) {
            debug.error('presetSelectWithRandomValue', error);
            reject(error);
        }
    });
}

export function presetSelectWithValues(driver: WebDriver, form: WebElement, elementName: string, values: string[], optionsValues?: string[]): Promise<string[]> {
    return new Promise(async function presetSelectWithValuesPromise(resolve, reject) {
        try {
            const select = await presetGetFormElement(form, elementName);
            if (!select) {
                return resolve([]);
            }

            values = values.map(val => String(val));

            let value: string;
            const parent = await select.findElement(By.xpath("./.."));
            const chosenContainer = await elementExists(parent, By.css('.chosen-container'));

            var result = [];
            if (chosenContainer) {
                const chosenSearchField: WebElement = await elementExists(parent, By.css('.chosen-search-input'));
                const choosenContainerId = await chosenContainer.getAttribute('id');
                const clearSelectInput = await elementExists(parent, By.css('.clear-all-btn'));
                if (clearSelectInput) {
                    const clearSelectInputClass = await clearSelectInput.getAttribute('class');
                    if (!clearSelectInputClass.includes('hidden')) {
                        await clearSelectInput.click();
                    }
                }

                if (!optionsValues) {
                    optionsValues = await presetGetSelectOptionsValues(select);
                }

                let index: number;
                let listItem: WebElement;
                let chosenOptionElement: WebElement;
                let chosenReultsHolderDisplayed: boolean;
                for (value of values) {
                    index = optionsValues.indexOf(value);
                    if (index >= 0) {
                        await chosenContainer.click();
                        await sleep(100);
                        chosenReultsHolderDisplayed = await waitElementHasClass(driver, By.css('#' + choosenContainerId), 'chosen-with-drop');
                        if (!chosenReultsHolderDisplayed) {
                            debug.warn('chosen container not visible', choosenContainerId);
                        }
                        chosenOptionElement = await elementExists(driver, By.css('#' + choosenContainerId + ' li[data-option-array-index="' + index + '"]'));

                        await chosenSearchField.clear();
                        if (chosenOptionElement) {
                            await chosenSearchField.sendKeys(await chosenOptionElement.getText());
                        } else {
                            debug.warn('chosen container option is not found', choosenContainerId);
                        }


                        listItem = await waitElementDisplayed(driver, By.css('#' + choosenContainerId + ' li[data-option-array-index="' + index + '"]'));
                        if (listItem) {
                            result.push(value);
                            await listItem.click();
                        }
                    }
                }
            } else {
                await select.click();

                let option: WebElement;
                for (value of values) {
                    option = await elementExists(select, By.css('option[value="' + value + '"]'));
                    await sleep(100);
                    if (option) {
                        result.push(value);
                        await option.click();
                    }
                }
            }

            const isMultiple = await select.getAttribute('multiple');
            if (result.length) {
                resolve(isMultiple ? result : result[0]);
            } else {
                resolve(result);
            }

        } catch (error) {
            debug.error('presetSelectWithValues', error)
            reject(error);
        }
    });
}

export function presetGetSelectOptionsValues(select: WebElement): Promise<string[]> {
    return new Promise(async function presetGetSelectOptionsValuesPromise(resolve, reject) {
        try {
            const options = await select.findElements(By.css('option[value]'));
            let option: WebElement
            var promises = [];
            for (option of options) {
                promises.push(option.getAttribute('value'));
            }

            let values = (await Promise.all(promises)).filter(value => value.length > 0);
            resolve(values);
        } catch (error) {
            debug.error('presetGetSelectOptionsValues', error)
            reject(error);
        }
    });
}


export function presetPopulateFormInput(driver: WebDriver, form: WebElement, elementName: string, value: string): Promise<string | undefined> {
    return new Promise(async function ppresetPopulateFormI18nPromise(resolve, reject) {
        try {
            const input = await elementExists(form, By.css('[name="' + elementName + '"]'));
            if (input) {
                await input.clear();
                await input.sendKeys(value);
                resolve(value);
            } else {
                resolve(undefined);
            }
        } catch (error) {
            debug.error('presetPopulateFormInput', error)
            reject(error);
        }

    });
}

export function presetGetFormElement(form: WebElement, elementName: string): Promise<WebElement | undefined> {
    return new Promise(async function ppresetPopulateFormI18nPromise(resolve, reject) {

        let select = await elementExists(form, By.css('[name="' + elementName + '"]'));
        if (!select) {
            select = await elementExists(form, By.css('[name="' + elementName + '[]"]'))
        }
        if (!select) {
            select = await elementExists(form, By.css('#' + elementName));
        }


        if (select) {
            return resolve(select);
        }
        return resolve(undefined);
    });
}

export function presetVerifyFormData(driver: WebDriver, form: WebElement, data: object) {
    return new Promise(async function presetVerifyFormDataPromise(resolve, reject) {
        try {
            const formData = await presetGetFormData(form);
            const hasSameData = isObjectDataContainedInObject(data, formData);
            if (!hasSameData) {
                debug.warn('form data not the same', data, formData);
            }
            resolve(hasSameData);
        } catch (error) {
            debug.error('presetGetFormData', error)
            reject(error);
        }

    });
}

export function presetGetFormData(form: WebElement): Promise<object> {
    return new Promise(async function presetGetFormDataPromise(resolve, reject) {
        try {
            const data = {};
            const elements = await form.findElements(By.css('[name]'));
            let element: WebElement;
            let type: string;
            let name: string;
            for (element of elements) {
                type = await element.getTagName();
                name = await element.getAttribute('name');
                // @TODO cover all cases
                name = name.replace('[]', '');
                if (type === 'select') {
                    data[name] = await presetGetFormSelectData(element);
                } else if (type === 'input') {
                    data[name] = await presetGetFormInputData(element);
                } else if (type === 'textarea') {
                    data[name] = await element.getText();
                }
            }

            resolve(data);
        } catch (error) {
            debug.error('presetGetFormData', error)
            reject(error);
        }
    });
}

export function presetGetFormSelectData(element: WebElement): Promise<string | string[]> {
    return new Promise(async function presetGetFormSelectDataPromise(resolve, reject) {
        try {
            const values = [];
            const multiple = await element.getAttribute('multiple');
            const options = await element.findElements(By.css('option[selected]'));
            let option: WebElement;
            for (option of options) {
                values.push(await option.getAttribute('value'));
            }
            if (!options.length) {
                const loaded = await element.getAttribute('loaded');
                if (loaded) {
                    values.push(loaded);
                }
            }

            if (multiple === 'multiple' || multiple === 'true') {
                resolve(values)
            } else {
                resolve(values[0] || '');
            }
        } catch (error) {
            debug.error('presetGetFormSelectData', error)
            reject(error);
        }
    });
}

export function presetGetFormInputData(element: WebElement): Promise<string | string[] | object> {
    return new Promise(async function presetGetFormSelectDataPromise(resolve, reject) {
        try {
            const value = String(await element.getAttribute('value'));
            if (isStringJson(value)) {
                return resolve(JSON.parse(value));
            }
            resolve(value);
        } catch (error) {
            debug.error('presetGetFormInputData', error)
            reject(error);
        }
    });
}

export function awaitModalFormToLoad(driver: WebDriver): Promise<WebElement | undefined> {
    return new Promise(async function awaitModalFormToLoadPromise(resolve, reject) {
        await waitElementExist(driver, By.css('form#modal-form'));
        resolve(await elementExists(driver, By.css('form#modal-form')));
    });
}

export function presetSubmitModal(driver: WebDriver): Promise<WebElement | undefined> {
    return new Promise(async function presetSubmitModalPromise(resolve, reject) {
        try {
            const button = await elementExists(driver, By.css('form#modal-form #submit-form-button'));

            if (button) {
                await button.click();
                resolve(button);
            } else {
                resolve(undefined);
            }
        } catch (error) {
            debug.error('presetGetFormInputData', error)
            reject(error);
        }
    });
}

