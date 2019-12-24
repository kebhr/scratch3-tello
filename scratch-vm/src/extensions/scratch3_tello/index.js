const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAI1JREFUeNpiYBgFo2AUjIJRQCzQB+L7QPyfCng/EPNT24HrqeQ4GJ5PjKVMJDjwA5U9/IAYRYwkGAiKkgIgdsAhrwDFyA7A5YgDQNxI7zRajxaF9dQwlGmw58xRB446cNSBow4cdeCoA0cdOOrAUQeOOnDUgYPFgQ9o3Aukat+ZJh3zUTAKRsFQBAABBgCoVDVJPyGtBgAAAABJRU5ErkJggg==';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAI1JREFUeNpiYBgFo2AUjIJRQCzQB+L7QPyfCng/EPNT24HrqeQ4GJ5PjKVMJDjwA5U9/IAYRYwkGAiKkgIgdsAhrwDFyA7A5YgDQNxI7zRajxaF9dQwlGmw58xRB446cNSBow4cdeCoA0cdOOrAUQeOOnDUgYPFgQ9o3Aukat+ZJh3zUTAKRsFQBAABBgCoVDVJPyGtBgAAAABJRU5ErkJggg==';

/**
 * Class for the Tello
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3Tello {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;


    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'tello',
            name: 'Tello',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'writeLog',
                    text: 'log [TEXT]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    }
                }
            ],
            menus: {
            }
        };
    }

    writeLog (args) {
        log.log(Cast.toString(args.TEXT));

        telloProcessor.log();
    }

}
module.exports = Scratch3Tello;
