import {derived, writable} from 'svelte/store';
import * as path from 'path';

export const allowedExtensions = ['jpg', 'png', 'jpeg', 'gif'];
export const operationModes = ['index', 'name'].reduce((a, e, i) => ({...a, [e]: i}), {})

export const currentPath = writable('.');
export const currentPathIndex = writable([]);
export const filePath = writable(null);
export const operationMode = writable(operationModes.index);