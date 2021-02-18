import {SET_LANG} from '../../static/constant'
import I18n from 'react-native-i18n';

const initLang = {
    languageLearning: 'Portuguese',
    languageNative: 'English',
}

export default (state = initLang, action) => {
    switch (action.type) {
        case SET_LANG:
            const lang = action.payload
            I18n.defaultLocale = lang.languageNative;
            I18n.locale = lang.languageNative;
            I18n.currentLocale();
            return {
                ...lang
            }
        default:
            return state
    }
}