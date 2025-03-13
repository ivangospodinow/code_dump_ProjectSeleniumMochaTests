import { By, WebDriver, until } from "selenium-webdriver";
import { LOGIN_EMAIL, LOGIN_PASSWORD, PROJECT_URL } from "../../settings";
import { elementExists } from "../selenium";
import { addParamsToUrl, debug } from "../tools";

export function presetLoginAndGoTo(driver: WebDriver, goToUrl: string): Promise<boolean> {
    return new Promise(async function loginAndGoToPromise(resolve, reject) {
        try {
            await driver.get(addParamsToUrl(PROJECT_URL + '/auth/login', {
                for_testing: true,
                email: LOGIN_EMAIL,
                password: LOGIN_PASSWORD,
                company_id: driver['_COMPANY_ID'],
                forward: PROJECT_URL + goToUrl,
            }));

            await driver.wait(until.urlIs(PROJECT_URL + goToUrl));
            var hideMenuButton = await elementExists(driver, By.css('a.navbar-minimalize'));
            if (hideMenuButton) {
                await hideMenuButton.click();
            } else {
                debug.warn('Hide menu button not found');
            }

            resolve(true);
        } catch (error) {
            debug.error('presetLoginAndGoTo', error)
            reject(error);
        }
    });
}

