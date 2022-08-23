const axios = require('axios').default;

const getLanguageCode = (language) => {
    let lang;
    switch (language) {
        case 'Arabic':
            lang = "ar";
            break;
        case 'Bengali':
            lang = "bn";
            break;
        case 'Chinese':
            lang = "zh";
            break;
        case 'English':
            lang = "en";
            break;
        case 'Spanish':
            lang = "es";
            break;
        case 'French':
            lang = "fr";
            break;
        case 'Indonesian':
            lang = "id";
            break;
        case 'Russian':
            lang = "ru";
            break;
        case 'Swedish':
            lang = "sv";
            break;
        case 'Turkish':
            lang = "tr";
            break;
        case 'Urdu':
            lang = "ur";
            break;
        default:
            lang = "ar";
            break;
    }
    return lang;
}


const getAya = async (config) => {
    const language = getLanguageCode(config.get('quran.zakerQuranLanguage'));
    const randomCharpter = Math.floor(1 + Math.random()*114);
    const basmalah = {
        text: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ",
        transliteration: "Bismi Allahi alrrahmani alrraheemi"
    };
    try {
        let chapterUrl = `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/${language}/${randomCharpter}.json`
        if(language == "ar") {
            chapterUrl = `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/${randomCharpter}.json`
        }
        const { name, transliteration, total_verses, verses } = (await axios.get(chapterUrl)).data;
        const randomVerse = Math.floor(1 + Math.random()*total_verses-1);
        const foundInitialVerse = verses.find(verse => verse.id === randomVerse);
        const foundSecondVerse = verses.find(verse => verse.id === randomVerse+1);
        return {
            language,
            basmalah,
            name,
            transliteration,
            foundInitialVerse,
            foundSecondVerse
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = getAya;