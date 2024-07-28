'use client'

import React, { ReactNode, useEffect, useMemo } from 'react';
import getValueBranch from '../../../primitives/helpers/getValueBranch';
import RenderClientVariable from './RenderClientVariable';

// ValueProps type
type ValueProps = {
    children?: any;
    branches?: Record<string, any>;
    [key: string]: any;
}

/**
 * Client-side value variable component that processes the given values and branches,
 * and renders the appropriate content based on the branch logic.
 * 
 * @param {any} children - Default children to render if no branches match.
 * @param {Record<string, any>} branches - Object containing conditionally rendered branches.
 * @param {Record<string, any>} ...values - Values to branch and translate around.
 * @returns {ReactNode}
 */
export default function ClientValue({ children, branches, values }: ValueProps): ReactNode {

    const branch = useMemo(() => {
        return ((typeof values !== 'undefined' && typeof branches !== 'undefined') ? getValueBranch(values, branches) : null) || children;
    }, [values, branches, children])

    const renderedChildren = useMemo(() => {
        return <RenderClientVariable variables={values ? values : undefined}>{branch}</RenderClientVariable>
    }, [branch, values])

    return (
        <span>
            {renderedChildren}
        </span>
    )

};