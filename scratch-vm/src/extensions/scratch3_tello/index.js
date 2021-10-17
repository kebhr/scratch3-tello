const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABWhJREFUeNrsW+1x4zgMZXb2v9KB04GyFSgd6K4CbQfaq0DbgdKBLhUoHchbgXwVyKlATgU5awacwAhIQh92bAdvBpPYsinqEQQeQdoYhUKhUCgUCoVCoVAoFAqF4mJwcyb9WO3tznFts7dXJfAQ6d4ewO6F39mCbcDWe3v5agQWe/vJeNsa/u6AnDvymQePdz7u7enaQ0Wyt25vb2DD//ne4hFt1PDdCqxH7bUj27ooZORBk4nt2DYi0rYdmP7ayasnfD+GNirkuRkMAva4EuyqYuCQKJ7R6x3Esluwe0dM28H/vz2xj37HJpfhfv9dg+dFKEYNsa5BnnhsS66BwBwepkHT7xTWkhh5dHw7cvvPIFuOjQ3c58epRfexdWAMGu92ZjtWH1LduB65UkmB6EE7/rmU6bxidJskjpXodbZQPySxMjlVGIhJzEuFHlCApGmJsM6InivRtaXEPCawZ4jKyfUa+rUYoSnxphjeszddjWyvJCTaRFCg94sjEWiTHHWKhqya3tAKaDXlxhE8RMfcPEJLrKliOQ1M7/qIBPrCQwTXauKV2VjiemYNi0eCEruaOEh4ytak3WqBaeQiUBIiqI4tJDfriLclgTXqGxLOcx6wIUIcP6jVlXPX09RigabtSYxMJetXG5PGdKqZmSU7ofhuJ2Rn14oo9/SpJ4RlniR0QF7JfFk6qlPRBWJhzMTjHt6TTPHM0bZrSraOONxwxMdMYPWy7SFwarxKR3hIRqSQlEjOC0uPQuiYNlNutrUoYHM3rAOjtIQHUsHbC+JdQkjpAjEtcgxS6fDUOOA4BwGcYxvHAS7mVCNjZkic92ZalTkhg5mPnDVWQcTCFVCPCawCwdQ3IrVgOoQkTEYGop4RBiriwZwA7jyhonfMRK8HdgINV6JOxZ7ONMJpmjPkTxkAOhitg5wGeVQoy1fCMNOzbApGF5MorclZT/MVV7OFyLN9WBE1YfveBeSRtN5ZjyUQJ42exAvXCKbMiPfMEimeGTtpRi5Jm6HBkxZkIzQAGSUlFo50JegIt36ugdA5ySKUeBpmsBogtEDXO2a1Iylc1FyoKoVz31VJCVmPHqAgDxwtRB724hju13r6VDK6s/I4TYrI72m+WAnTv1TZS6wy8+C7d0PMtfrACwXOYxtmEJzhpmDSfyaorvSBhyigLVxnm1uiyslAWBnUCgauQwTWKJYlghj5oSp0w2TZn45Or5n3HiYSMOxJ/DND59k+Dn+fyFQb9pu35uP5m+G9FyBqeJaNed+bHvZsXkkbD2A7+PyzYQ4z3ThG97eRbwRxnX02h5tAFnfw0MO1HxNkyhoebgftDH38y7xv2HN92yLC1tCHzUKD6RWKFeP6CbIVEz8lRVWJZIrhHjmTeDpHhh+zd7xUEhtVzm+FFY5QcqhRFozQOrY0pzvBUJgzQ4yqxaERTUmyejuxzRXtZ4Huk4jD9cLIXOg5muSEhDVIMEcO2XZxJEaOKswYa2buv2ACZ8XDb59A4KC3/kaS5l+H5OGwIZp0zpmbW4++FeP7J3riC4jgJ5KM7OHLW6TlHglZW/h7P+P+dhGwM18Aufl4MGjO9gHewvgyoFpzTgxszlUPjtGNY08wrAx/WmHsURJcVY8u3ZvGFFMjj/CuTPh4XUyy/0WfpY7Nx8NDIU/KHEVaTuJUaA3NHVfLzBUgIjVIS2Ts+KwlITeHJ8QieC2pBfbmSk7xhyo/dk8lM4e/RpIkDd926eIx7+bMiPwF9b07x2cezXuB0yC9aLXjPdGLOxDqj+YMftl56vVyKZyWXMleklSuzgNDhN56Vh5b8/5zr1ejUCgUCoVCoVAoFAqFQqFQKDj8L8AArqESEfsu3jMAAAAASUVORK5CYII=';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABWhJREFUeNrsW+1x4zgMZXb2v9KB04GyFSgd6K4CbQfaq0DbgdKBLhUoHchbgXwVyKlATgU5awacwAhIQh92bAdvBpPYsinqEQQeQdoYhUKhUCgUCoVCoVAoFAqF4mJwcyb9WO3tznFts7dXJfAQ6d4ewO6F39mCbcDWe3v5agQWe/vJeNsa/u6AnDvymQePdz7u7enaQ0Wyt25vb2DD//ne4hFt1PDdCqxH7bUj27ooZORBk4nt2DYi0rYdmP7ayasnfD+GNirkuRkMAva4EuyqYuCQKJ7R6x3Esluwe0dM28H/vz2xj37HJpfhfv9dg+dFKEYNsa5BnnhsS66BwBwepkHT7xTWkhh5dHw7cvvPIFuOjQ3c58epRfexdWAMGu92ZjtWH1LduB65UkmB6EE7/rmU6bxidJskjpXodbZQPySxMjlVGIhJzEuFHlCApGmJsM6InivRtaXEPCawZ4jKyfUa+rUYoSnxphjeszddjWyvJCTaRFCg94sjEWiTHHWKhqya3tAKaDXlxhE8RMfcPEJLrKliOQ1M7/qIBPrCQwTXauKV2VjiemYNi0eCEruaOEh4ytak3WqBaeQiUBIiqI4tJDfriLclgTXqGxLOcx6wIUIcP6jVlXPX09RigabtSYxMJetXG5PGdKqZmSU7ofhuJ2Rn14oo9/SpJ4RlniR0QF7JfFk6qlPRBWJhzMTjHt6TTPHM0bZrSraOONxwxMdMYPWy7SFwarxKR3hIRqSQlEjOC0uPQuiYNlNutrUoYHM3rAOjtIQHUsHbC+JdQkjpAjEtcgxS6fDUOOA4BwGcYxvHAS7mVCNjZkic92ZalTkhg5mPnDVWQcTCFVCPCawCwdQ3IrVgOoQkTEYGop4RBiriwZwA7jyhonfMRK8HdgINV6JOxZ7ONMJpmjPkTxkAOhitg5wGeVQoy1fCMNOzbApGF5MorclZT/MVV7OFyLN9WBE1YfveBeSRtN5ZjyUQJ42exAvXCKbMiPfMEimeGTtpRi5Jm6HBkxZkIzQAGSUlFo50JegIt36ugdA5ySKUeBpmsBogtEDXO2a1Iylc1FyoKoVz31VJCVmPHqAgDxwtRB724hju13r6VDK6s/I4TYrI72m+WAnTv1TZS6wy8+C7d0PMtfrACwXOYxtmEJzhpmDSfyaorvSBhyigLVxnm1uiyslAWBnUCgauQwTWKJYlghj5oSp0w2TZn45Or5n3HiYSMOxJ/DND59k+Dn+fyFQb9pu35uP5m+G9FyBqeJaNed+bHvZsXkkbD2A7+PyzYQ4z3ThG97eRbwRxnX02h5tAFnfw0MO1HxNkyhoebgftDH38y7xv2HN92yLC1tCHzUKD6RWKFeP6CbIVEz8lRVWJZIrhHjmTeDpHhh+zd7xUEhtVzm+FFY5QcqhRFozQOrY0pzvBUJgzQ4yqxaERTUmyejuxzRXtZ4Huk4jD9cLIXOg5muSEhDVIMEcO2XZxJEaOKswYa2buv2ACZ8XDb59A4KC3/kaS5l+H5OGwIZp0zpmbW4++FeP7J3riC4jgJ5KM7OHLW6TlHglZW/h7P+P+dhGwM18Aufl4MGjO9gHewvgyoFpzTgxszlUPjtGNY08wrAx/WmHsURJcVY8u3ZvGFFMjj/CuTPh4XUyy/0WfpY7Nx8NDIU/KHEVaTuJUaA3NHVfLzBUgIjVIS2Ts+KwlITeHJ8QieC2pBfbmSk7xhyo/dk8lM4e/RpIkDd926eIx7+bMiPwF9b07x2cezXuB0yC9aLXjPdGLOxDqj+YMftl56vVyKZyWXMleklSuzgNDhN56Vh5b8/5zr1ejUCgUCoVCoVAoFAqFQqFQKDj8L8AArqESEfsu3jMAAAAASUVORK5CYII=';

const message = {
    takeoff: {
        'ja': '離陸する',
        'ja-Hira': 'りりくする',
        'en': 'takeoff',
        'ru': 'взлёт'
    },
    land: {
        'ja': '着陸する',
        'ja-Hira': 'ちゃくりくする',
        'en': 'land',
        'ru': 'посадка'
    },
    up: {
        'ja': '上に [X]cm 上がる',
        'ja-Hira': 'うえに [X] センチあがる',
        'en': 'up [X] cm',
        'ru': 'вверх [X] см'
    },
    down: {
        'ja': '下に [X]cm 下がる',
        'ja-Hira': 'したに [X] センチさがる',
        'en': 'down [X] cm',
        'ru': 'вниз [X] см'
    },
    left: {
        'ja': '左に [X]cm 動く',
        'ja-Hira': 'ひだりに [X] センチうごく',
        'en': 'move left [X] cm',
        'ru': 'влево [X] см'
    },
    right: {
        'ja': '右に [X]cm 動く',
        'ja-Hira': 'みぎに [X] センチうごく',
        'en': 'move right [X] cm',
        'ru': 'вправо [X] см'
    },
    forward: {
        'ja': '前に [X]cm 進む',
        'ja-Hira': 'まえに [X] センチすすむ',
        'en': 'move forward [X] cm',
        'ru': 'вперёд [X] см'
    },
    back: {
        'ja': '後ろに [X]cm 下がる',
        'ja-Hira': 'うしろに [X] センチさがる',
        'en': 'move back [X] cm',
        'ru': 'назад [X] см'
    },
    cw: {
        'ja': '[X] 度右に回る',
        'ja-Hira': '[X] どみぎにまわる',
        'en': 'rotate [X] degrees right',
        'ru': 'повернуть на [X] градусов вправо'
    },
    ccw: {
        'ja': '[X] 度左に回る',
        'ja-Hira': '[X] どひだりにまわる',
        'en': 'rotate [X] degrees left',
        'ru': 'повернуть на [X] градусов влево'
    },
    pitch: {
        'ja': 'ピッチ',
        'ja-Hira': 'ピッチ',
        'en': 'pitch',
        'ru': 'наклон'
    },
    roll: {
        'ja': 'ロール',
        'ja-Hira': 'ロール',
        'en': 'roll',
        'ru': 'крен'
    },
    yaw: {
        'ja': 'ヨー',
        'ja-Hira': 'ヨー',
        'en': 'yaw',
        'ru': 'вращение вокруг оси Z'
    },
    vgx: {
        'ja': 'x方向の速度',
        'ja-Hira': 'xほうこうのはやさ',
        'en': 'speed x',
        'ru': 'скорость x'
    },
    vgy: {
        'ja': 'y方向の速度',
        'ja-Hira': 'yほうこうのはやさ',
        'en': 'speed y',
        'ru': 'скорость y'
    },
    vgz: {
        'ja': 'z方向の速度',
        'ja-Hira': 'zほうこうのはやさ',
        'en': 'speed z',
        'ru': 'скорость z'
    },
    tof: {
        'ja': '地面からの高度',
        'ja-Hira': 'じめんからのたかさ',
        'en': 'height from ground',
        'ru': 'высота от земли'
    },
    height: {
        'ja': '離陸した場所からの高度',
        'ja-Hira': 'りりくしたばしょからのたかさ',
        'en': 'height from takeoff point',
        'ru': 'высота от точки взлёта'
    },
    bat: {
        'ja': 'バッテリー残量',
        'ja-Hira': 'バッテリーざんりょう',
        'en': 'battery remaining',
        'ru': 'заряд батареи'
    },
    baro: {
        'ja': '気圧計による高さ',
        'ja-Hira': 'きあつけいによるたかさ',
        'en': 'height by barometer',
        'ru': 'высота по барометру'
    },
    time: {
        'ja': '飛行時間',
        'ja-Hira': 'ひこうじかん',
        'en': 'flying time',
        'ru': 'время полёта'
    },
    agx: {
        'ja': 'x方向の加速度',
        'ja-Hira': 'xほうこうのかそくど',
        'en': 'acceleration x',
        'ru': 'ускорение x'
    },
    agy: {
        'ja': 'y方向の加速度',
        'ja-Hira': 'yほうこうのかそくど',
        'en': 'acceleration y',
        'ru': 'ускорение y'
    },
    agz: {
        'ja': 'z方向の加速度',
        'ja-Hira': 'zほうこうのかそくど',
        'en': 'acceleration z',
        'ru': 'ускорение z'
    }

};

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
        this.state = {};
        this.getState();
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        if (formatMessage.setup().locale === 'ja' || formatMessage.setup().locale === 'ja-Hira' || formatMessage.setup().locale === 'ru') {
            this.locale = formatMessage.setup().locale;
        } else {
            this.locale = 'en';
        }

        return {
            id: 'tello',
            name: 'Tello',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'takeoff',
                    text: message.takeoff[this.locale],
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'land',
                    text: message.land[this.locale],
                    blockType: BlockType.COMMAND
                },
                '---',
                {
                    opcode: 'up',
                    text: message.up[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'down',
                    text: message.down[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'left',
                    text: message.left[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'right',
                    text: message.right[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'forward',
                    text: message.forward[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'back',
                    text: message.back[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'cw',
                    text: message.cw[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'ccw',
                    text: message.ccw[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                '---',
                {
                    opcode: 'pitch',
                    text: message.pitch[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'roll',
                    text: message.roll[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'yaw',
                    text: message.yaw[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'vgx',
                    text: message.vgx[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'vgy',
                    text: message.vgy[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'vgz',
                    text: message.vgz[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'tof',
                    text: message.tof[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'height',
                    text: message.height[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'bat',
                    text: message.bat[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'baro',
                    text: message.baro[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'time',
                    text: message.time[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'agx',
                    text: message.agx[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'agy',
                    text: message.agy[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'agz',
                    text: message.agz[this.locale],
                    blockType: BlockType.REPORTER
                }
            ],
            menus: {
            }
        };
    }

    getState () {
        setInterval(() => {
            telloProcessor.state().then(response => {
                this.state = JSON.parse(response);
            });
        }, 100);
    }

    takeoff () {
        telloProcessor.send('takeoff');
    }

    land () {
        telloProcessor.send('land');
    }

    up (args) {
        telloProcessor.send(`up ${Cast.toString(args.X)}`);
    }

    down (args) {
        telloProcessor.send(`down ${Cast.toString(args.X)}`);
    }

    left (args) {
        telloProcessor.send(`left ${Cast.toString(args.X)}`);
    }

    right (args) {
        telloProcessor.send(`right ${Cast.toString(args.X)}`);
    }

    forward (args) {
        telloProcessor.send(`forward ${Cast.toString(args.X)}`);
    }

    back (args) {
        telloProcessor.send(`back ${Cast.toString(args.X)}`);
    }

    cw (args) {
        telloProcessor.send(`cw ${Cast.toString(args.X)}`);
    }

    ccw (args) {
        telloProcessor.send(`ccw ${Cast.toString(args.X)}`);
    }

    pitch () {
        return this.state.pitch;
    }

    roll () {
        return this.state.roll;
    }

    yaw () {
        return this.state.yaw;
    }

    vgx () {
        return this.state.vgx;
    }

    vgy () {
        return this.state.vgy;
    }

    vgz () {
        return this.state.vgz;
    }

    tof () {
        return this.state.tof;
    }

    height () {
        return this.state.h;
    }

    bat () {
        return this.state.bat;
    }

    baro () {
        return this.state.baro;
    }

    time () {
        return this.state.time;
    }

    agx () {
        return this.state.agx;
    }

    agy () {
        return this.state.agy;
    }

    agz () {
        return this.state.agz;
    }
}
module.exports = Scratch3Tello;
