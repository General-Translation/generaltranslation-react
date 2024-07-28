import 'server-only'

import React, { ReactNode } from 'react';
import renderNumeric from '../value/renderVariable';
import getNumericBranch, { Range } from '../helpers/getNumericBranch';

type NumericProps = {
    n?: number;
    children?: any;
    ranges?: Range[];
    locale: string;
    [key: string]: any;
}

/**
 * Numeric component that processes a given number and renders the appropriate branch or children.
 * 
 * @param {ReactNode} children - Default children.
 * @param {number} n - Number to branch based on.
 * @param {Range[]} ranges - Array of range objects used for branch selection.
 * @param {Record<string, any>} ...branches - Named branches, e.g. "singular", "plural" and their associated branches.
 * @returns {JSX.Element}
 */
export default function Numeric({ children, n, ranges, locale, ...branches }: NumericProps): ReactNode {

    if (typeof n !== 'number') {
        console.warn(`WARNING: No values provided to <Numeric> component with children ${JSON.stringify(children)}.`)
    }

    let { 'data-generaltranslation': generaltranslation, ...otherParams }: any = branches;

    branches = { ...otherParams, ranges: ranges };
    
    let branch = ((typeof n === 'number' && branches) ? getNumericBranch(n, locale, branches) : null) || children;

    const renderedChildren = renderNumeric(branch, locale, (typeof n === 'number') ? { n } : undefined);

    return (
        <span data-n={n} data-unrendered-branches={branches} data-generaltranslation={generaltranslation}>
            {renderedChildren}
        </span>
    );

};