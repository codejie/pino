'use strict'

const logger = require('../../helper/logger');

logger.level = 'debug'
logger.trace('not show');
logger.debug('show');

logger.level = 'trace';
logger.trace('show');
logger.debug('show');

logger.pretty = true;
logger.trace('show');
logger.debug('show');

logger.pretty = false;
logger.level = 'debug';
logger.trace('not show');
logger.debug('show');

logger.pretty = true;
logger.name = 'TTT';
logger.level = 'trace';
logger.trace('show');
logger.debug('show');


