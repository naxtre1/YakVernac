import ReactNative from 'react-native'
import I18n, { getLanguages } from 'react-native-i18n'
import firestore from '@react-native-firebase/firestore'
import assign from 'assign-deep'

// Import all locales
import en from './en.json';
import pt from './pt.json';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true

export function loadString(callback) {
    firestore().collection('string').get().then(snapshot => {
        for (const stringDocs of snapshot.docs) {
            if (stringDocs.id == 'English') {
                I18n.translations[stringDocs.id] = assign(en, stringDocs.data())
                continue
            }
            if (stringDocs.id == 'Portuguese') {
                I18n.translations[stringDocs.id] = assign(pt, stringDocs.data())
                continue
            }
            I18n.translations[stringDocs.id] = stringDocs.data()
        }
        callback()
    })

}

getLanguages().then(languages => {
    if (languages[0] == 'pt-BR' || languages[0] == 'pt-PT') {
        I18n.defaultLocale = "Portuguese";
        I18n.locale = "Portuguese";
        I18n.currentLocale();
    } else {
        I18n.defaultLocale = "English";
        I18n.locale = "English";
        I18n.currentLocale();
    }
}).catch(e => {
    I18n.defaultLocale = "English";
    I18n.locale = "English";
    I18n.currentLocale();

})

const currentLocale = I18n.currentLocale();

// Is it a RTL language?
export const isRTL = currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
    return I18n.t(name, params);
}

export default I18n;