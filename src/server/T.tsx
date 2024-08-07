import React, { ReactNode, Suspense, lazy } from 'react'
import addGTIdentifier from './helpers/addGTIdentifier';
import writeChildrenAsObjects from './helpers/writeChildrenAsObjects';
import generateHash from '../primitives/generateHash';
import renderChildren from './renderChildren';
import { getLanguageDirection } from 'generaltranslation';
import I18NConfiguration from '../config/I18NConfiguration';
import Resolver from './helpers/Resolver';

type ServerTProps = {
    I18NConfig: I18NConfiguration
    children: any;
    locale: string;
    id?: string;
    [key: string]: any; // This allows additional metadata props with any key and type
}

const ServerT = async ({ 
    I18NConfig, children, locale, ...props
}: ServerTProps): Promise<ReactNode> => {
    
    // Handle case where translation is not required, for example if the user's browser is in the default locale
    const translationRequired: boolean = (children && I18NConfig.translationRequired(locale)) ? true : false;
    if (!translationRequired) {
        return (
            <>
                {children}
            </>
        )
    }

    // Fetch translations promise
    const translationsPromise = I18NConfig.getTranslations(locale, props.dictionaryName);

    const defaultLocale = I18NConfig.getDefaultLocale();
    let renderAttributes: any = {};
    const dir = getLanguageDirection(locale);
    if (dir === 'rtl') renderAttributes = { ...renderAttributes, dir }
   
    const taggedChildren = addGTIdentifier(children);
    const childrenAsObjects = writeChildrenAsObjects(taggedChildren);
    
    const key: string = await generateHash(childrenAsObjects);
    const id = props.id ? props.id : key;
    
    const translation = await I18NConfig.getTranslation(locale, key, id, props.dictionaryName ?? undefined, await translationsPromise)
    
    // Check if a translation for this site already exists and return it if it does
    const translationExists: boolean = translation ? true : false;
    if (translationExists) {
        const I18NChildren = renderChildren({ source: taggedChildren, target: translation, renderAttributes, locale, defaultLocale });
        return (
            <>
                {I18NChildren}
            </>
        )
    }

    // Check if a new translation for this site can be created

    const renderSettings = I18NConfig.getRenderSettings();

    if (!I18NConfig.automaticTranslationEnabled()) {
        return (
            <>{children}</>
        )
    }

    // Create a new translation for this site and render it
    
    const I18NChildrenPromise = I18NConfig.translateChildren({ children: childrenAsObjects, targetLanguage: locale, metadata: { ...props } });
    
    const renderMethod = props?.renderMethod || renderSettings.method;
    const timeout = renderSettings?.timeout;
    let promise: Promise<any> = I18NChildrenPromise.then(target => renderChildren({ source: taggedChildren, target, renderAttributes, locale, defaultLocale }));
    if (typeof timeout === 'number') {
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(children), timeout));
        promise = Promise.race([promise, timeoutPromise])
    }

    if (renderMethod === "skeleton") {
        // Return the site but without text
        // Replace with translated site when ready
        return (
            <Suspense fallback={<></>}>
                {/* @ts-expect-error Server Component */}
                <Resolver fallback={children}>{promise}</Resolver>
            </Suspense>
        )
    }

    if (renderMethod === "replace") {
        // Return the site in the default language
        // Replace with translated site when ready
        return (
            <Suspense fallback={children}>
                {/* @ts-expect-error Server Component */}
                <Resolver fallback={children}>{promise}</Resolver>
            </Suspense>
        )
    }

    if (renderMethod === "hang") {
        // Wait until the site is translated to return
        return (
            <>
                {await promise}
            </>
        )
    }

    return (
        // return the children, with no special rendering
        // a translation may be available from a cached translation dictionary next time the component is loaded
        <> 
            {children}
        </>
    )
    
}

ServerT.gtTransformation = "translate";

export default ServerT;