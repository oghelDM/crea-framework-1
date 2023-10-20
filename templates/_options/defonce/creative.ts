// OPTION_DEFONCE_IMPORT
import { Defonce } from '@/effects/defonce';

// OPTION_DEFONCE_CODE_EXAMPLE
// Defonce effect
const defonce = new Defonce({
    targetElement: cuber,
    // debug: true,
    maskUrl: 'images/chanel.svg'
});
// no uses of defonce