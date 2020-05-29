import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import de from 'vuetify/src/locale/de';

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: {de},
        current: 'de',
    },
    icons: {
        iconfont: 'fa',
    },
    theme: {
        options: {
            cspNonce: 'QllPRCBMYXVuY2hlciB2b24gUGV0ZXIgR2lzbGVy',
        },
        themes: {
            light: {
                primary: '#9e303c'
            }
        }
    }
});
