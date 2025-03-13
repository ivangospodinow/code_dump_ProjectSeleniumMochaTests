const dotenv = require('dotenv');
dotenv.config();

export const BROWSER_LIST = process.env.BROWSER_LIST.split(',');
export const COMPANY_LIST = process.env.COMPANY_LIST.split(',').map(companyId => parseInt(companyId));
export const BROWSER_MODE = process.env.BROWSER_MODE;
export const PROJECT_URL = process.env.PROJECT_URL;
export const PROJECT_API_KEY = process.env.PROJECT_API_KEY;
export const LOGIN_EMAIL = process.env.LOGIN_EMAIL;
export const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD;
export const DEBUG_ENABLED = process.argv.includes('--debug') ? true : process.env.DEBUG;

export const LANGUAGES = {
    bg: 1,
    en: 2,
};
export const LANGUAGES_IDS = Object.values(LANGUAGES);
export const CURRENT_LANGUAGE_ID = LANGUAGES.bg;
export const DROPDOWN_RANDOM_VALUE = 'dropdown_random_value';
export const EMPTY_VALUE = '';
export const WAIT_FOR_MS = 20000;
export const WAIT_FORM_FOR_MS = 30000;

export const PROJECT_BUDGET_EXPENSES = {
    COMMON_ADMIN: 'General & Administrative Expenses',
    DIRECT_OF_NET_EXPENSES: 'Direct Off-net expenses',
    DIRECT_ON_NET_EXPENSES: 'Direct On-net expenses',
    SELLING_EXPENSES: 'Selling Expenses',
    MARKETING_EXPENSES: 'Marketing Expenses',
};
