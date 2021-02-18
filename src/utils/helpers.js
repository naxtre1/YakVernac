export const countryList = [
    { id: 0, name: 'I speak English', type: 'en', source: require('../assets/united-kingdom.png'), isAvailable: true },
    { id: 1, name: 'Eu falo Português', type: 'pt', source: require('../assets/brazil.png'), isAvailable: true },
    { id: 2, name: 'Yo hablo Español', type: 'es', source: require('../assets/mexico.png'), isAvailable: false },
    { id: 3, name: 'Je parle Français', type: 'ot', source: require('../assets/france.png'), isAvailable: false },
    { id: 4, name: 'я говорю на русском', type: 'ot', source: require('../assets/russia.png'), isAvailable: false },
    { id: 5, name: 'Io parlo Italiano', type: 'ot', source: require('../assets/italy.png'), isAvailable: false },
    { id: 6, name: '我说德语', type: 'ot', source: require('../assets/china.png'), isAvailable: false },
    { id: 7, name: 'Ich spreche Deutsch', type: 'ot', source: require('../assets/germany.png'), isAvailable: false },
    { id: 8, name: 'मैं हिंदी बोलते हैं', type: 'ot', source: require('../assets/india.png'), isAvailable: false },
]

export const learnLangList = [
    { id: 0, name: 'English', type: 'en', source: require('../assets/united-kingdom.png'), isAvailable: true, isSelected: false },
    { id: 1, name: 'Portuguese (Brazil)', type: 'pt', source: require('../assets/brazil.png'), isAvailable: true, isSelected: false },
    { id: 2, name: 'Spanish', type: 'es', source: require('../assets/mexico.png'), isAvailable: false, isSelected: false },
    { id: 3, name: 'French', type: 'ot', source: require('../assets/france.png'), isAvailable: false, isSelected: false },
    { id: 4, name: 'Italian', type: 'ot', source: require('../assets/italy.png'), isAvailable: false, isSelected: false },
    { id: 5, name: 'Russian', type: 'ot', source: require('../assets/russia.png'), isAvailable: false, isSelected: false },
    { id: 6, name: 'German', type: 'ot', source: require('../assets/germany.png'), isAvailable: false, isSelected: false },
    { id: 7, name: 'Chinese', type: 'ot', source: require('../assets/china.png'), isAvailable: false, isSelected: false },
    { id: 8, name: 'Hindi', type: 'ot', source: require('../assets/india.png'), isAvailable: false, isSelected: false },
];

export const getLangResourceByType = (language) => {
    switch (language) {
        case 'English': return { id: 0, name: 'I speak English', type: 'en', source: require('../assets/united-kingdom.png'), isAvailable: true, lang: 'English' };
            break;
        case 'Portuguese': return { id: 1, name: 'Eu falo portuguese', type: 'pt', source: require('../assets/brazil.png'), isAvailable: true, lang: 'Portuguese' };
            break;
        default: return { id: 0, name: 'I speak English', type: 'en', source: require('../assets/united-kingdom.png'), isAvailable: true, lang: 'English' };
            break;
    }
}

export const getLangLocalisationsByLanguage = (language) => {
    switch (language.toLowerCase()) {
        case 'english': return { key: 'english', type: 'en', source: require('../assets/united-kingdom.png'), english: 'English', portuguese: 'Portuguese' };
            break;
        case 'portuguese': return { key: 'portuguese', type: 'en', source: require('../assets/united-kingdom.png'), english: 'Inglês', portuguese: 'Português' };
            break;
        default: return { key: 'english', type: 'en', source: require('../assets/united-kingdom.png'), english: 'English', portuguese: 'Portuguese' };
            break;
    }
}