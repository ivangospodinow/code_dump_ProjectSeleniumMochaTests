
import { DROPDOWN_RANDOM_VALUE, LANGUAGES } from '../../settings';
import { createRandomStringWithLength, createSeedName } from '../../tools/tools';

export function getServiceSeedData() {

    return {
        name: {
            [LANGUAGES.bg]: createSeedName('Търговска услуга'),
            [LANGUAGES.en]: createSeedName('Service'),
        },
        service_code: createRandomStringWithLength(5),
        service_group_id: DROPDOWN_RANDOM_VALUE,
        deal_type: DROPDOWN_RANDOM_VALUE,
        structures: DROPDOWN_RANDOM_VALUE,
        address_types: DROPDOWN_RANDOM_VALUE,
        'params-select': DROPDOWN_RANDOM_VALUE,
        'params-for-stopping-select': DROPDOWN_RANDOM_VALUE,
    };
}
