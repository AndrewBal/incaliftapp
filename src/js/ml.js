import Vue from 'vue'
import { MLInstaller, MLCreate, MLanguage } from 'vue-multilanguage'
import eng from '../locales/ENG'
import ukr from '../locales/UKR'


Vue.use(MLInstaller)

export default new MLCreate({
    initial: 'ENG',
    save: process.env.NODE_ENV === 'production',
    languages: [
        new MLanguage('ENG').create(eng),
        new MLanguage('UKR').create(ukr)
    ]
})