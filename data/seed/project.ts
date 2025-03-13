
import { DROPDOWN_RANDOM_VALUE, LANGUAGES } from '../../settings';
import { createRandomStringWithLength, createSeedName } from '../../tools/tools';

export function getProjectSeedData() {

    return {
        name: {
            [LANGUAGES.bg]: createSeedName('Проект'),
            [LANGUAGES.en]: createSeedName('Project'),
        },
    };
}
