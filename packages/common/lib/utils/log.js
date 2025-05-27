import debug from 'debug';

const base = debug('nodext4___v0.1.0-rc.1');

export const log = base.extend('info');
export const warn = base.extend('warn');
export const error = base.extend('error');
