import { Builder, By, Key, until, WebDriver, WebElement } from "selenium-webdriver";
import { BROWSER_LIST, BROWSER_MODE, COMPANY_LIST, PROJECT_URL, WAIT_FOR_MS } from "../settings";
import { debug, sleep } from "./tools";
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

export interface DriverSetting {
    browser: string,
    companyId: number,
    label: string,
    createDriver(): Promise<WebDriver>,
}


export function elementExists(driver: WebDriver | WebElement, selector: By): Promise<WebElement | undefined> {
    return new Promise(function elementExistsPromise(resolve, reject) {
        driver.findElements(selector).then((elements) => {
            resolve(elements.length > 0 ? elements[0] : undefined);
        }).catch(() => {
            resolve(undefined);
        });
    });
}

export function waitElementExist(driver: WebDriver, selector: By, timeout: number = WAIT_FOR_MS): Promise<WebElement | undefined> {
    return new Promise(async function elementExistsPromise(resolve, reject) {
        try {
            await driver.wait(until.elementLocated(selector), timeout);
            resolve(await elementExists(driver, selector));
        } catch (error) {
            debug.error('waitElementExist', error);
            reject(error);
        }
    });
}

export function waitElementDisplayed(driver: WebDriver, selector: By, timeout: number = WAIT_FOR_MS): Promise<WebElement | undefined> {
    return new Promise(async function waitElementDisplayedPromise(resolve, reject) {
        const element = await elementExists(driver, selector);
        if (!element) {
            return resolve(undefined);
        }
        await driver.wait(until.elementIsVisible(element), timeout);
        if (await element.isDisplayed()) {
            return resolve(element);
        } else {
            return resolve(undefined);
        }

    });
}

export function waitElementVisible(driver: WebDriver, selector: By, timeout: number = WAIT_FOR_MS): Promise<WebElement | undefined> {
    return new Promise(async function elementExistsPromise(resolve, reject) {
        await driver.wait(until.elementLocated(selector), timeout);
        resolve(await elementExists(driver, selector));
    });
}

export function elementsExists(driver: WebDriver | WebElement, selector: By): Promise<WebElement[] | undefined> {
    return new Promise(function elementsExistsPromise(resolve, reject) {
        driver.findElements(selector).then((elements) => {
            resolve(elements.length > 0 ? elements : undefined);
        }).catch((error) => {
            debug.error('elementsExists', error);
            reject(error);
        });
    });
}

export function waitElementsExist(driver: WebDriver, selector: By, timeout: number = WAIT_FOR_MS): Promise<WebElement[] | undefined> {
    return new Promise(async function waitElementsExistPromise(resolve, reject) {
        await driver.wait(until.elementLocated(selector), timeout);
        resolve(await elementsExists(driver, selector));
    });
}


export function goToUrl(driver: WebDriver, url: string): Promise<boolean> {
    return new Promise(async function goToUrlPromise(resolve, reject) {
        await driver.get(PROJECT_URL + url);
        await driver.wait(until.urlIs(PROJECT_URL + url));
        resolve(true);
    });
}

export function goToUrlWaitForDataTable(driver: WebDriver, url: string, datatableId: string): Promise<boolean> {
    return new Promise(async function goToUrlWaitForDataTablePromise(resolve, reject) {
        await goToUrl(driver, url);
        await waitElementsExist(driver, By.css('#' + datatableId + '[data-datatable-loaded="1"]'));
        resolve(true);
    });
}


export function waitUntilSelectorHasText(driver: WebDriver, selector: By, text: string): Promise<boolean> {
    return new Promise(async function waitUntilSelectorHasTextPromise(resolve, reject) {
        try {
            let element: WebElement;
            let elements: WebElement[] | undefined;
            let elementText: string;
            let canWait = true;
            let timer = setTimeout(function () {
                canWait = false;
            }, WAIT_FOR_MS);

            while (true) {
                elements = await elementsExists(driver, selector);
                if (elements) {
                    for (element of elements) {
                        try {
                            elementText = await element.getText();
                        } catch (error) {
                            elementText = undefined;
                        }
                        if (undefined !== elementText && (elementText === text || elementText.includes(text))) {
                            clearTimeout(timer);
                            return resolve(true);
                        }
                    }
                }
                if (!canWait) {
                    break;
                }
            }
            resolve(false);
        } catch (error) {
            debug.error('waitUntilSelectorHasText', error);
            reject(error);
        }
    });
}

export function waitUntilToastrMessage(driver: WebDriver): Promise<WebElement | undefined> {
    return new Promise(async function waitUntilToastrMessagePromise(resolve, reject) {
        resolve(await waitElementExist(driver, By.css('#toast-container')));
    });
}

export function clearInput(driver: WebDriver, input: WebElement): Promise<any> {
    return new Promise(async function clearInputPromise(resolve, reject) {
        try {
            await input.sendKeys(Key.chord(Key.CONTROL, "a"));
            await input.sendKeys(Key.DELETE);
            resolve(true);
        } catch (error) {
            debug.error('clearInput', error);
            reject(error);
        }
    });
}

export function clearSendKeys(driver: WebDriver, input: WebElement, text: string): Promise<any> {
    return new Promise(async function clearInputPromise(resolve, reject) {
        try {
            // await clearInput(driver, input);
            const inputValue = await input.getAttribute('value');
            if (inputValue.length) {
                await clearInput(driver, input);
            }
            await input.sendKeys(text);
            const newValues = await input.getAttribute('value');
            if (newValues !== text) {
                // second run
                await clearInput(driver, input);
                await sleep(10);
                await input.sendKeys(text);
            }
            await sleep(10);

            resolve(true);
        } catch (error) {
            debug.error('clearSendKeys', error);
            reject(error);
        }
    });
}

export function elementHasClass(element: WebElement, className: string): Promise<boolean> {
    return new Promise(async function elementExistsPromise(resolve, reject) {
        try {
            resolve((await element.getAttribute('class')).includes(className))
        } catch (error) {
            debug.error('elementHasClass', error);
            reject(error);
        }
    });
}

export function waitElementHasClass(driver: WebDriver, selector: By, className: string): Promise<boolean> {
    return new Promise(async function waitElementHasClassPromise(resolve, reject) {
        try {
            let element: WebElement;
            let canWait = true;
            let timer = setTimeout(function () {
                canWait = false;
            }, WAIT_FOR_MS);

            while (true) {
                element = await elementExists(driver, selector);
                if (element) {
                    if (elementHasClass(element, className)) {
                        clearTimeout(timer);
                        return resolve(true);
                    }
                }
                if (!canWait) {
                    break;
                }
            }
            resolve(false);

        } catch (error) {
            debug.error('waitElementHasClass', error);
            reject(error);
        }
    });
}


export function getDriverList(): DriverSetting[] {
    let companyId: number;
    let browser: string;
    let platforms: DriverSetting[] = [];
    const screen = {
        width: 1280,
        height: 768
    };

    for (companyId of COMPANY_LIST) {
        for (browser of BROWSER_LIST) {
            platforms.push({
                browser: browser,
                companyId: companyId,
                label: '[browser:' + browser + screen['width'] + 'x' + screen['height'] + ' company:' + companyId + ']',
                createDriver: async function (): Promise<WebDriver> {
                    const chromeOptions = new chrome.Options().windowSize(screen);
                    const firefoxOptions = new firefox.Options().windowSize(screen);
                    if (BROWSER_MODE === 'headless') {
                        chromeOptions.headless();
                        firefoxOptions.headless();
                    }

                    const builder = new Builder()
                        .forBrowser(browser)
                        .setChromeOptions(chromeOptions)
                        .setFirefoxOptions(firefoxOptions);

                    const platform = await builder.build();

                    const capabilities = await platform.getCapabilities();
                    capabilities.setPageLoadStrategy('normal');

                    platform['_BROWSER_NAME'] = browser;
                    platform['_COMPANY_ID'] = companyId;
                    platform['_TEST_SETTING'] = '[browser:' + browser + screen['width'] + 'x' + screen['height'] + ' company:' + companyId + ']';
                    return platform;
                },
            });
        }
    }

    return platforms;
}