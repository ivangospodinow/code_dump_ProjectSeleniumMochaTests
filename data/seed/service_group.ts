
import { DROPDOWN_RANDOM_VALUE, LANGUAGES } from '../../settings';
import { createSeedName } from '../../tools/tools';

export function getServiceGroupSeedData() {

    return {
        name: {
            [LANGUAGES.bg]: createSeedName('Група търговска услуга'),
            [LANGUAGES.en]: createSeedName('Service group'),
        },
        product_managers: DROPDOWN_RANDOM_VALUE,
    };
}