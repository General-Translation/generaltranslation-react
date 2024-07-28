import React, { ComponentType } from 'react'

export default interface GeneralTranslation {

    /**
    * The `<I18N>` component. Translates its ReactNode children into the user's locale.
    * 
    * `children?` - (any) - Children to translate.
    * 
    * `id?` - (string) - Specifies an ID in the target dictionary for the created translation. Used to prevent storing unnecessary translations by overwriting previous translations with the same ID. Defaults to a hash of the component's children.
    * 
    * `...props` - ([key: string]: any) - Optional metadata which will override the global `gt-react` configuration. See https://docs.generaltranslation.com for a full list of possible props.
    */
    I18N: ComponentType<{ 
        children?: any;
        id?: string;
        [key: string]: any;
    }>;
  
    /**
    * Translates a string asynchronously, storing the result in the translation dictionary.
    * 
    * `content` - (string) - Text content to translate into the user's language.
    * 
    * `options?` - ({ [key: string]: any }) - Other parameters. See https://docs.generaltranslation.com for a full list.
    * 
    * `options.targetLanguage?` - (string) - A BCP 47 language tag which represents the language to translate into. Defaults to the user's locale.
    * 
    * `options.id?` - (string) - Specifies an ID in the target dictionary for the created translation. Used to prevent storing unnecessary translations by overwriting previous translations with the same ID. Defaults to `content`. (string)
    */
    intl: (content: string, options?: { 
        targetLanguage?: string;
        id?: string;
        [key: string]: any 
    }) => Promise<string>;
  
    /**
    * The `<GTProvider>` component. Used on the server, but all children must be client components (or able to run on the client). Provides translations and locale data to its children using React's context API. Children are able to use the `useGT`, `useLocale`, and `useDefaultLocale` hooks.
    * 
    * If `id` or `dictionary` components are not provided, translations of all entries in the default `createGT` dictionary are provided.
    * 
    * These translations can be accessed on the client using the `useGT` hook.
    * 
    * `children?` - (any) - Children to which context is provided.
    * 
    * `id?` - (string) - If provided, only the items in the initial dictionary which fall under that ID will be provided to the client, alongside any additional items in the `dictionary` prop. Any new translations created by this component will be assigned (`id + '.'`) as a prefix.
    * 
    * `dictionary?` - (Record<string, any>) - Object representing a dictionary, where keys are strings and the values are strings or React children, which are translated and sent to the client. Advanced: dictionary entries can also be arbitrary promises which are resolved and provided the client.
    * 
    * `...props` - ([key: string]: any) - Optional metadata which will override the global `gt-react` configuration. See https://docs.generaltranslation.com for a full list of possible props.
    */
    GTProvider: ComponentType<{
        children?: any;
        id?: string;
        dictionary?: Record<string, any>;
        [key: string]: any
    }>;
  
    /**
    * Server-side function which gets an entry from the default dictionary and wraps it in the `<I18N>` component.
    * 
    * `id` - (string) - ID of the item in the dictionary.
    * 
    * `options?` - ({ [key: string]: any }) - Other parameters which override the global `gt-react` configuration. See https://docs.generaltranslation.com for a full list.
    */
    t: (id: string, options?: Record<string, any>) => any;
  
    /**
    * Server-side function which gets an entry from the default dictionary, in its original language.
    * 
    * `id` - (string) - ID of the item in the dictionary.
    */
    dict: (id: string) => any;
  
    /**
     * Component for rendering localized values.
     * 
     * `children?` - (any) - The default content to render if no conditions are met.
     * 
     * `branches?` - (Record<string, any>) - An object containing conditional branches to render. Keys represent condition names, and values are the corresponding content.
     * 
     * `values?` - (Record<string, any>) - A set of values used for conditional rendering.
     */
    Value: ComponentType<{
        children?: any;
        branches?: Record<string, any>;
        values?: Record<string, any>;
    }>;

    /**
     * Component for rendering localized numeric values.
     * 
     * `children?` - (any) - The default content to render if no numeric conditions are met.
     * 
     * `n` - (number) - The number to evaluate against defined ranges or conditions.
     * 
     * `ranges?` - ({ min: number, max: number, children: any }[]) - An array of range objects for determining which branch to render based on the number `n`.
    **/
    Numeric: ComponentType<{
        children?: any;
        n: number;
        ranges?: { min: number, max: number, children: any }[];
    }>;

    /**
     * Component for rendering variables.
     * 
     * `children?` - (any) - The content to render if provided. Overrides `defaultValue`.
     * 
     * `name?` - (string) - The name of the variable, used for identifying the component.
     * 
     * `defaultValue?` - (any) - The default value to display if `children` is not provided.
    **/
    Variable: ComponentType<{
        children?: any;
        name?: string;
        defaultValue?: any;
    }>;

    /**
     * Component for rendering number variables.
     * 
     * `children?` - (any) - The content to render if provided. Overrides `defaultValue`.
     * 
     * `name?` - (string) - The name of the variable, used for identifying the component.
     * 
     * `defaultValue?` - (any) - The default value to display if `children` is not provided. This can be a number or a string representation of a number.
     * 
     * `options?` - (Record<string, any>) - Additional options for `Intl.NumberFormat` for formatting the number.
    **/
    NumberVariable: ComponentType<{
        children?: any;
        name?: string;
        defaultValue?: any;
        options?: Record<string, any>;
    }>;

    /**
     * Component for rendering date variables.
     * 
     * `children?` - (any) - The content to render if provided. Overrides `defaultValue`.
     * 
     * `name?` - (string) - The name of the variable, used for identifying the component.
     * 
     * `defaultValue?` - (any) - The default value to display if `children` is not provided. This can be a number (Unix timestamp), string, or Date object.
     * 
     * `options?` - (Record<string, any>) - Additional options for `Intl.DateTimeFormat` for formatting the date.
    **/
    DateVariable: ComponentType<{
        children?: any;
        name?: string;
        defaultValue?: any;
        options?: Record<string, any>;
    }>;

    /**
     * Component for rendering currency variables.
     * 
     * `children?` - (any) - The content to render if provided. Overrides `defaultValue`.
     * 
     * `name?` - (string) - The name of the variable, used for identifying the component.
     * 
     * `defaultValue?` - (any) - The default value to display if `children` is not provided. This should be a number or a string representation of a number.
     * 
     * `currency?` - (string) - The currency code to use for formatting. Defaults to "USD".
     * 
     * `options?` - (Record<string, any>) - Additional options for `Intl.NumberFormat` for formatting the currency.
    **/
    CurrencyVariable: ComponentType<{
        children?: any;
        name?: string;
        defaultValue?: any;
        currency?: string;
        options?: Record<string, any>;
    }>;

  
    /**
    * Server-side function which gets the user's current locale.
    * Returns a BCP 47 language code representing the user's language, e.g. `en-US`.
    **/
    getLocale: () => string;
  
    /** 
     * Server-side function which gets the application's default locale.
     * Returns a BCP 47 language code representing a language, e.g. `en-US`.
    **/
    getDefaultLocale: () => string;

}