
import { DROPDOWN_RANDOM_VALUE, LANGUAGES } from '../../settings';
import { createRandomStringWithLength, createSeedName } from '../../tools/tools';

export function getBudgetSeedData(extend: {}) {

    return {
        ...{
            name: {
                [LANGUAGES.bg]: createSeedName('Бюджет'),
                [LANGUAGES.en]: createSeedName('Budget'),
            },
            project_id: DROPDOWN_RANDOM_VALUE,
            budget_term_type_id: DROPDOWN_RANDOM_VALUE,
            expense_kind_id: DROPDOWN_RANDOM_VALUE,
            expense_group_id: DROPDOWN_RANDOM_VALUE,
        },
        ...extend,
    };
}
