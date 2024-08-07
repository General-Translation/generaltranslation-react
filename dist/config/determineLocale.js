import { isSameLanguage } from "generaltranslation";
export default function determineLocale(approvedLocales, possibleLocales, defaultLocale = '') {
    if (typeof possibleLocales === 'string')
        possibleLocales = [possibleLocales];
    if (!possibleLocales || !Array.isArray(possibleLocales))
        return defaultLocale;
    // if no approved locales, anything goes
    if (!approvedLocales)
        return possibleLocales[0];
    // check for an exact match
    for (const locale of possibleLocales) {
        for (const approvedLocale of approvedLocales) {
            if (locale === approvedLocale) {
                return approvedLocale;
            }
        }
    }
    // check for a linguistic match
    for (const locale of possibleLocales) {
        for (const approvedLocale of approvedLocales) {
            if (isSameLanguage(locale, approvedLocale)) {
                return approvedLocale;
            }
        }
    }
    // default
    return defaultLocale;
}
//# sourceMappingURL=determineLocale.js.map