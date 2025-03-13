import { PROJECT_API_KEY, PROJECT_BUDGET_EXPENSES, PROJECT_URL } from "../settings";
import { debug } from "./tools";
const fetch = require("node-fetch");
let projectData = null;
var projectDataIsLoading = false;
var projectDataCallbacks: CallableFunction[] = [];

export function getProjectData(): Promise<object> {
    return new Promise((resolve, reject) => {
        if (projectData) {
            return resolve(projectData);
        } else if (projectDataIsLoading) {
            projectDataCallbacks.push(resolve);
        } else {
            projectDataIsLoading = true;
            projectDataCallbacks.push(resolve);

            fetch(PROJECT_URL + '/api/v1/selenium-testing-data?api_token=' + PROJECT_API_KEY, {
                "method": "GET",
                "mode": 'no-cors',
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json"
                }
            })
                .then(response => response.json())
                .then(response => {
                    projectData = response.data;
                    for (let callback of projectDataCallbacks) {
                        callback(projectData);
                    }
                })
                .catch(err => {
                    debug.error('can not load project data', err)
                    for (let callback of projectDataCallbacks) {
                        callback({});
                    }
                });
        }
    });
}

export function getProjectBudgetExpenseId(companyId: number, label: keyof typeof PROJECT_BUDGET_EXPENSES): Promise<number | undefined> {
    return new Promise(async function getProjectBudgetExpenseIdPromise(resolve, reject) {
        const data = await getProjectData();
        const rows = data['expense_kinds'][companyId] || undefined;
        if (!rows) {
            return resolve(undefined);
        }
        for (let row of Object.values(rows)) {
            if (Object.values(row['name']).includes(label)) {
                return resolve(row['id']);
            }
        }
        return resolve(undefined);
    });
}