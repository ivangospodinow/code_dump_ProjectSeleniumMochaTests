// import { ThenableWebDriver, WebDriver } from "selenium-webdriver";

// import { presetLoginAndGoTo } from "../../../tools/presets/login";
// import { presetCreateServiceGroup } from "../../../tools/presets/servcie_group";
// import { DriverSetting, getDriverList, goToUrl, goToUrlWaitForDataTable, waitUntilToastrMessage } from "../../../tools/selenium";
// import { presetDatatableClickDeleteButton, presetDatatableClickEditButton, presetDatatableIdBySearch, presetDatatableResultsNotFound } from '../../../tools/presets/datatable';
// import { CURRENT_LANGUAGE_ID, EMPTY_VALUE, PROJECT_BUDGET_EXPENSES } from "../../../settings";
// import { presetVerifyFormData, presetPopulateFormData, presetSubmitModal } from "../../../tools/presets/form";
// import { getServiceGroupSeedData } from "../../../data/seed/service_group";
// import { presetCreateProject } from "../../../tools/presets/project";
// import { getProjectSeedData } from "../../../data/seed/project";
// import { presetCreateBudget } from "../../../tools/presets/budgets";
// import { getProjectBudgetExpenseId } from "../../../tools/project";
// import { getBudgetSeedData } from "../../../data/seed/budget";
// const assert = require('assert');



// getDriverList().forEach((driverSetting: DriverSetting) => {
//     let driver: WebDriver;
//     Object.keys(PROJECT_BUDGET_EXPENSES).forEach((budgetExpenseKey, budgetExpenseIndex) => {

//         describe('Budget crud expense: ' + PROJECT_BUDGET_EXPENSES[budgetExpenseKey] + ' with ' + driverSetting['label'], function () {
//             let expenseId: number;
//             let budget;
//             before(async function () {
//                 if (!driver) {
//                     driver = await driverSetting.createDriver();
//                     await presetLoginAndGoTo(driver, '/commercial/budgets');
//                 }
//             });


//             it('Creating Budget', async function () {
//                 await goToUrl(driver, '/commercial/budgets');

//                 expenseId = await getProjectBudgetExpenseId(driverSetting.companyId, PROJECT_BUDGET_EXPENSES[budgetExpenseKey]);
//                 budget = await presetCreateBudget(driver, { expense_kind_id: expenseId, project_id: EMPTY_VALUE });
//                 assert.ok(budget, 'Budget created');

//                 // verify created
//                 await goToUrlWaitForDataTable(driver, '/commercial/budgets', 'budgets_datatable');

//                 const foundId = await presetDatatableIdBySearch(driver, 'budgets_datatable', budget['name'][CURRENT_LANGUAGE_ID]);
//                 assert.ok(budget['id'] > 0 && foundId > 0 && foundId === budget['id'], 'Budget found');

//                 const form = await presetDatatableClickEditButton(driver, 'budgets_datatable', foundId);
//                 assert.ok(form, 'Budget edit form loaded');

//                 const sameData = await presetVerifyFormData(driver, form, budget);
//                 assert.ok(sameData, 'Budget edit load has same data');

//             });

//             it('Editing Budget', async function () {
//                 await goToUrlWaitForDataTable(driver, '/commercial/budgets', 'budgets_datatable');

//                 const foundId = await presetDatatableIdBySearch(driver, 'budgets_datatable', budget['name'][CURRENT_LANGUAGE_ID]);
//                 assert.ok(budget['id'] > 0 && foundId > 0 && foundId === budget['id'], 'Budget found');

//                 const form = await presetDatatableClickEditButton(driver, 'budgets_datatable', foundId);
//                 assert.ok(form, 'Budget edit form loaded');

//                 const updateData = await presetPopulateFormData(driver, form, getBudgetSeedData({ expense_kind_id: expenseId, project_id: EMPTY_VALUE }));

//                 // update the original state of the Project so further action can rely on it
//                 budget = { ...budget, ...updateData };

//                 await presetSubmitModal(driver);

//                 await waitUntilToastrMessage(driver);

//                 // verify updated
//                 await goToUrlWaitForDataTable(driver, '/commercial/budgets', 'budgets_datatable');

//                 const updatedId = await presetDatatableIdBySearch(driver, 'budgets_datatable', updateData['name'][CURRENT_LANGUAGE_ID]);
//                 assert.ok(foundId === updatedId, 'Budget found');

//                 const updateForm = await presetDatatableClickEditButton(driver, 'budgets_datatable', updatedId);
//                 assert.ok(updateForm, 'Budget edit form loaded');

//                 const sameData = await presetVerifyFormData(driver, updateForm, updateData);
//                 assert.ok(sameData, 'Budget edit load has same data');
//             });

//             // it('Deleting Project', async function () {
//             //     await goToUrlWaitForDataTable(driver, '/commercial/projects', 'projects_datatable');

//             //     await presetDatatableIdBySearch(driver, 'projects_datatable', project['name'][CURRENT_LANGUAGE_ID]);

//             //     const form = await presetDatatableClickDeleteButton(driver, 'projects_datatable', project['id']);
//             //     assert.ok(form, 'Project delete form loaded');

//             //     await presetSubmitModal(driver);

//             //     await waitUntilToastrMessage(driver);

//             //     await goToUrlWaitForDataTable(driver, '/commercial/projects', 'projects_datatable');
//             //     const resouldsNotFound = await presetDatatableResultsNotFound(driver, 'projects_datatable', project['name'][CURRENT_LANGUAGE_ID]);
//             //     assert.ok(resouldsNotFound, 'Project deleted');
//             // });

//             after(() => {
//                 if (budgetExpenseIndex >= Object.keys(PROJECT_BUDGET_EXPENSES).length - 1) {
//                     driver.quit();
//                 }
//             });
//         });
//     });
// });
