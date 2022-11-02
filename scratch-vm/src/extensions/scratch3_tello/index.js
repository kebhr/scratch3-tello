const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');

const TelloProcessor = require('./telloProcessor');

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
        'ru': 'взлёт',
        'fr': 'décollage'
    },
    land: {
        'ja': '着陸する',
        'ja-Hira': 'ちゃくりくする',
        'en': 'land',
        'ru': 'посадка',
        'fr': 'atterrissage'
    },
    up: {
        'ja': '上に [X]cm 上がる',
        'ja-Hira': 'うえに [X] センチあがる',
        'en': 'up [X] cm',
        'ru': 'вверх [X] см',
        'fr': 'montée de [X] cm'
    },
    down: {
        'ja': '下に [X]cm 下がる',
        'ja-Hira': 'したに [X] センチさがる',
        'en': 'down [X] cm',
        'ru': 'вниз [X] см',
        'fr': 'descente de [X] cm'
    },
    left: {
        'ja': '左に [X]cm 動く',
        'ja-Hira': 'ひだりに [X] センチうごく',
        'en': 'move left [X] cm',
        'ru': 'влево [X] см',
        'fr': 'voler à gauche [X] cm'
    },
    right: {
        'ja': '右に [X]cm 動く',
        'ja-Hira': 'みぎに [X] センチうごく',
        'en': 'move right [X] cm',
        'ru': 'вправо [X] см',
        'fr': 'voler à droite [X] cm'
    },
    forward: {
        'ja': '前に [X]cm 進む',
        'ja-Hira': 'まえに [X] センチすすむ',
        'en': 'move forward [X] cm',
        'ru': 'вперёд [X] см',
        'fr': 'voler vers l\'avant [X] cm'
    },
    back: {
        'ja': '後ろに [X]cm 下がる',
        'ja-Hira': 'うしろに [X] センチさがる',
        'en': 'move back [X] cm',
        'ru': 'назад [X] см',
        'fr': 'voler vers l\'arrière [X] cm'
    },
    cw: {
        'ja': '[X] 度右に回る',
        'ja-Hira': '[X] どみぎにまわる',
        'en': 'rotate [X] degrees right',
        'ru': 'повернуть на [X] градусов вправо',
        'fr': 'tourner de [X] degrés vers la droite'
    },
    ccw: {
        'ja': '[X] 度左に回る',
        'ja-Hira': '[X] どひだりにまわる',
        'en': 'rotate [X] degrees left',
        'ru': 'повернуть на [X] градусов влево',
        'fr': 'tourner de [X] degrés vers la gauche'
    },
    flip: {
        'ja': '[DIRECTION]に宙返りする',
        'ja-Hira': '[DIRECTION]にちゅうがえりする',
        'en': 'flip in [DIRECTION]',
        'fr': 'flip vers [DIRECTION]'
    },
    go: {
        'ja': 'x:[X] y:[Y] z:[Z] に [SPEED]cm/s で飛ぶ',
        'ja-Hira': 'x:[X] y:[Y] z:[Z] に 1びょうで [SPEED] センチのはやさでとぶ',
        'en': 'fly to x:[X] y:[Y] z:[Z] in [SPEED]cm/s',
        'fr': 'voler à x:[X] y:[Y] z:[Z] à [SPEED]cm/s'
    },
    curve: {
        'ja': 'x:[X1] y:[Y1] z:[Z1] から x:[X2] y:[Y2] z:[Z2] に [SPEED]cm/s でカーブしながら飛ぶ',
        'ja-hira': 'x:[X2] y:[Y2] z:[Z2] から x:[X2] y:[Y2] z:[Z2] に 1びょうで [SPEED] センチのはやさでカーブしながらとぶ',
        'en': 'fly in curve from x:[X1] y:[Y1] z:[Z1] to x:[X2] y:[Y2] z:[Z2] in [SPEED]cm/s',
        'fr': 'voler en courbe de x:[X1] y:[Y1] z:[Z1] à x:[X2] y:[Y2] z:[Z2] à [SPEED]cm/s'
    },
    enable_mission_pad: {
        'ja': 'ミッションパッドを使う',
        'ja-Hira': 'ミッションパッドをつかう',
        'en': 'enable Mission Pad',
        'fr': 'activer le "Mission Pad"'
    },
    edu_go: {
        'ja': '[MID]を検出していたら、ミッションパッドを基準に x:[X] y:[Y] z:[Z] に [SPEED]cm/s で飛ぶ',
        'ja-Hira': '[MID]がみつかっていたら、ミッションパッドからみて x:[X] y:[Y] z:[Z] に 1びょうで [SPEED] センチのはやさでとぶ',
        'en': 'when [MID] detected, fly to x:[X] y:[Y] z:[Z] based on the Mission Pad at [SPEED]cm/s',
        'fr': 'détecter [MID], ensuite voler à x:[X] y:[Y] z:[Z] à partir du Mission Pad à [SPEED]cm/s'
    },
    edu_curve: {
        'ja': '[MID]を検出していたら、ミッションパッドを基準に x:[X1] y:[Y1] z:[Z1] から x:[X2] y:[Y2] z:[Z2] に[SPEED]cm/s でカーブしながら飛ぶ',
        'ja-hira': '[MID]がみつかっていたら、ミッションパッドからみて x:[X2] y:[Y2] z:[Z2] から x:[X2] y:[Y2] z:[Z2] に 1びょうで [SPEED] センチのはやさでカーブしながらとぶ',
        'en': 'when [MID] detected, fly in curve from x:[X1] y:[Y1] z:[Z1] to x:[X2] y:[Y2] z:[Z2] based on the Mission Pad at [SPEED]cm/s',
        'fr': 'détecter [MID], ensuite voler en courbe de x:[X] y:[Y] z:[Z] à x:[X] y:[Y] z:[Z] à partir du Mission Pad à [SPEED] cm/s'
    },
    edu_jump: {
        'ja': '[MID1]と[MID2]を検出していたら、1つ目のミッションパッドを基準に x:[X] y:[Y] z:[Z] に飛んだあと、2つ目のミッションパッドの上まで[SPEED]cm/sで飛び[YAW]度に向く',
        'ja-hira': '[MID1]と[MID2]がみつかったら、1つめのミッションパッドからみて x:[X] y:[Y] z:[Z] にとんだあと2つめのミッションパッドのうえまで 1びょうで [SPEED] センチのはやさでとび、[YAW]どにむく',
        'en': 'when [MID1] [MID2] detected, fly to x:[X] y:[Y] z:[Z] based on first mission pad then fly on second mission pad at [SPEED] cm/s and rotate [YAW] degrees',
        'fr': 'détecter [MID1] et [MID2], ensuite voler à x:[X] y:[Y] z:[Z] à partir du premier Mission Pad, faire une rotation de [YAW] degrés, et voler au deuxième Mission Pad à [SPEED] cm/s'
    },
    clearQueue: {
        'ja': '実行待ちのコマンドをクリアする',
        'ja-Hira': 'うごくのをまっているコマンドをなくす',
        'en': 'clear command queue',
        'fr': 'effacer la séquence de commandes'
    },
    pitch: {
        'ja': 'ピッチ',
        'ja-Hira': 'ピッチ',
        'en': 'pitch',
        'ru': 'наклон',
        'fr': 'tangage'
    },
    roll: {
        'ja': 'ロール',
        'ja-Hira': 'ロール',
        'en': 'roll',
        'ru': 'крен',
        'fr': 'roulis'
    },
    yaw: {
        'ja': 'ヨー',
        'ja-Hira': 'ヨー',
        'en': 'yaw',
        'ru': 'вращение вокруг оси Z',
        'fr': 'lacet'
    },
    vgx: {
        'ja': 'x方向の速度',
        'ja-Hira': 'xほうこうのはやさ',
        'en': 'speed x',
        'ru': 'скорость x',
        'fr': 'vitesse sur l\'axe X'
    },
    vgy: {
        'ja': 'y方向の速度',
        'ja-Hira': 'yほうこうのはやさ',
        'en': 'speed y',
        'ru': 'скорость y',
        'fr': 'vitesse sur l\'axe Y'
    },
    vgz: {
        'ja': 'z方向の速度',
        'ja-Hira': 'zほうこうのはやさ',
        'en': 'speed z',
        'ru': 'скорость z',
        'fr': 'vitesse sur l\'axe Z'
    },
    tof: {
        'ja': '地面からの高度',
        'ja-Hira': 'じめんからのたかさ',
        'en': 'height from ground',
        'ru': 'высота от земли',
        'fr': 'hauteur du sol'
    },
    height: {
        'ja': '離陸した場所からの高度',
        'ja-Hira': 'りりくしたばしょからのたかさ',
        'en': 'height from takeoff point',
        'ru': 'высота от точки взлёта',
        'fr': 'hauteur du point de décollage'
    },
    bat: {
        'ja': 'バッテリー残量',
        'ja-Hira': 'バッテリーざんりょう',
        'en': 'battery remaining',
        'ru': 'заряд батареи',
        'fr': 'niveau de la batterie'
    },
    baro: {
        'ja': '気圧計による高さ',
        'ja-Hira': 'きあつけいによるたかさ',
        'en': 'height by barometer',
        'ru': 'высота по барометру',
        'fr': 'altitude (baromètre)'
    },
    time: {
        'ja': '飛行時間',
        'ja-Hira': 'ひこうじかん',
        'en': 'flying time',
        'ru': 'время полёта',
        'fr': 'durée du vol'
    },
    agx: {
        'ja': 'x方向の加速度',
        'ja-Hira': 'xほうこうのかそくど',
        'en': 'acceleration x',
        'ru': 'ускорение x',
        'fr': 'accélération sur l\'axe X'
    },
    agy: {
        'ja': 'y方向の加速度',
        'ja-Hira': 'yほうこうのかそくど',
        'en': 'acceleration y',
        'ru': 'ускорение y',
        'fr': 'accélération sur l\'axe Y'
    },
    agz: {
        'ja': 'z方向の加速度',
        'ja-Hira': 'zほうこうのかそくど',
        'en': 'acceleration z',
        'ru': 'ускорение z',
        'fr': 'accélération sur l\'axe Z'
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

        this.telloProcessor = new TelloProcessor();
        this.telloProcessor.initialize();

        this.state = {};
        this.getState();
    }


    _getText (key) {
        return message[key][this.locale] || message[key]['en'];
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        const currentLocale = formatMessage.setup().locale;
        if (Object.keys(message).filter((key) => {return currentLocale in message[key]}).length > 0) {
            this.locale = currentLocale;
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
                    text: this._getText('takeoff'),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'land',
                    text: this._getText('land'),
                    blockType: BlockType.COMMAND
                },
                '---',
                {
                    opcode: 'up',
                    text: this._getText('up'),
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
                    text: this._getText('down'),
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
                    text: this._getText('left'),
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
                    text: this._getText('right'),
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
                    text: this._getText('forward'),
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
                    text: this._getText('back'),
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
                    text: this._getText('cw'),
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
                    text: this._getText('ccw'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'flip',
                    text: this._getText('flip'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.STRING,
                            defaultValue: 'f',
                            menu: 'DIRECTION'
                        }
                    }
                },
                '---',
                {
                    opcode: 'go',
                    text: this._getText('go'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Z: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                    }
                },
                {
                    opcode: 'curve',
                    text: this._getText('curve'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Y1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Z1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        X2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Y2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Z2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                '---',
                {
                    opcode: 'enable_mission_pad',
                    text: this._getText('enable_mission_pad'),
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: 'edu_go',
                    text: '(EDU) ' + this._getText('edu_go'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Z: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        MID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'm1',
                            menu: 'MID'
                        }
                    }
                },
                {
                    opcode: 'edu_curve',
                    text: '(EDU) ' + this._getText('edu_curve'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Y1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Z1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        X2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Y2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Z2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        MID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'm1',
                            menu: 'MID'
                        }
                    }
                },
                {
                    opcode: 'edu_jump',
                    text: '(EDU) ' + this._getText('edu_jump'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        Z: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        YAW: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        MID1: {
                            type: ArgumentType.STRING,
                            defaultValue: 'm1',
                            menu: 'MID'
                        },
                        MID2: {
                            type: ArgumentType.STRING,
                            defaultValue: 'm1',
                            menu: 'MID'
                        }
                    }
                },
                '---',
                {
                    opcode: 'clearQueue',
                    text: this._getText('clearQueue'),
                    blockType: BlockType.COMMAND
                },
                '---',
                {
                    opcode: 'pitch',
                    text: this._getText('pitch'),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'roll',
                    text: this._getText('roll'),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'yaw',
                    text: this._getText('yaw'),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'vgx',
                    text: this._getText('vgx'),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'vgy',
                    text: this._getText('vgy'),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'vgz',
                    text: this._getText('vgz'),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'tof',
                    text: this._getText('tof'),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'height',
                    text: this._getText('height'),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'bat',
                    text: this._getText('bat'),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'baro',
                    text: this._getText('baro'),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'time',
                    text: this._getText('time'),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'agx',
                    text: this._getText('agx'),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'agy',
                    text: this._getText('agy'),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'agz',
                    text: this._getText('agz'),
                    blockType: BlockType.REPORTER
                }
            ],
            menus: {
                DIRECTION: {
                    acceptReporters: true,
                    items: [
                        {
                            text: (() => {
                                const msg = {
                                    'ja': '前',
                                    'ja-Hira': 'まえ',
                                    'en': 'forward',
                                    'fr': 'avant'
                                };
                                return msg[this.locale] || msg['en'];
                            })(),
                            value: 'f'
                        },
                        {
                            text: (() => {
                                const msg = {
                                    'ja': '後ろ',
                                    'ja-Hira': 'うしろ',
                                    'en': 'back',
                                    'fr': 'arrière'
                                };
                                return msg[this.locale] || msg['en'];
                            })(),
                            value: 'b'
                        },
                        {
                            text: (() => {
                                const msg = {
                                    'ja': '左',
                                    'ja-Hira': 'ひだり',
                                    'en': 'left',
                                    'fr': 'gauche'
                                };
                                return msg[this.locale] || msg['en'];
                            })(),
                            value: 'l'
                        },
                        {
                            text: (() => {
                                const msg = {
                                    'ja': '右',
                                    'ja-Hira': 'みぎ',
                                    'en': 'right',
                                    'fr': 'droite'
                                };
                                return msg[this.locale] || msg['en'];
                            })(),
                            value: 'r'
                        }
                    ]
                },
                MID: {
                    acceptReporters: true,
                    items: [
                        {
                            text: 'm1',
                            value: 'm1'
                        },
                        {
                            text: 'm2',
                            value: 'm2'
                        },
                        {
                            text: 'm3',
                            value: 'm3'
                        },
                        {
                            text: 'm4',
                            value: 'm4'
                        },
                        {
                            text: 'm5',
                            value: 'm5'
                        },
                        {
                            text: 'm6',
                            value: 'm6'
                        },
                        {
                            text: 'm7',
                            value: 'm7'
                        },
                        {
                            text: 'm8',
                            value: 'm8'
                        },
                        {
                            text: (() => {
                                const msg = {
                                    'ja': 'ランダム',
                                    'ja-Hira': 'ランダム',
                                    'en': 'random',
                                    'fr': 'aléatoire'
                                };
                                return msg[this.locale] || msg['en'];
                            })(),
                            value: 'm-1'
                        },
                        {
                            text: (() => {
                                const msg = {
                                    'ja': '最も近い',
                                    'ja-Hira': 'もっともちかい',
                                    'en': 'nearest',
                                    'fr': 'le plus proche'
                                };
                                return msg[this.locale] || msg['en'];
                            })(),
                            value: 'm-2'
                        }
                    ]
                }
            }
        };
    }

    getState () {
        setInterval(() => {
            const state = this.telloProcessor.state();
            this.state = state;
        }, 100);
    }

    takeoff () {
        this.telloProcessor.request('takeoff');
    }

    land () {
        this.telloProcessor.request('land');
    }

    up (args) {
        this.telloProcessor.request(`up ${Cast.toString(args.X)}`);
    }

    down (args) {
        this.telloProcessor.request(`down ${Cast.toString(args.X)}`);
    }

    left (args) {
        this.telloProcessor.request(`left ${Cast.toString(args.X)}`);
    }

    right (args) {
        this.telloProcessor.request(`right ${Cast.toString(args.X)}`);
    }

    forward (args) {
        this.telloProcessor.request(`forward ${Cast.toString(args.X)}`);
    }

    back (args) {
        this.telloProcessor.request(`back ${Cast.toString(args.X)}`);
    }

    cw (args) {
        this.telloProcessor.request(`cw ${Cast.toString(args.X)}`);
    }

    ccw (args) {
        this.telloProcessor.request(`ccw ${Cast.toString(args.X)}`);
    }

    flip (args) {
        this.telloProcessor.request(`flip ${args.DIRECTION}`);
    }

    go (args) {
        this.telloProcessor.request(`go ${Cast.toString(args.X)} ${Cast.toString(args.Y)} ${Cast.toString(args.Z)} ${Cast.toString(args.SPEED)}`);
    }

    curve (args) {
        this.telloProcessor.request(`curve ${Cast.toString(args.X1)} ${Cast.toString(args.Y1)} ${Cast.toString(args.Z1)} ${Cast.toString(args.X2)} ${Cast.toString(args.Y2)} ${Cast.toString(args.Z2)} ${Cast.toString(args.SPEED)}`);
    }

    enable_mission_pad () {
        this.telloProcessor.request(`mon`);
        this.telloProcessor.request(`mdirection 2`);
    }

    edu_go (args) {
        this.telloProcessor.request(`go ${Cast.toString(args.X)} ${Cast.toString(args.Y)} ${Cast.toString(args.Z)} ${Cast.toString(args.SPEED)} ${args.MID}`);
    }

    edu_curve (args) {
        this.telloProcessor.request(`curve ${Cast.toString(args.X1)} ${Cast.toString(args.Y1)} ${Cast.toString(args.Z1)} ${Cast.toString(args.X2)} ${Cast.toString(args.Y2)} ${Cast.toString(args.Z2)} ${Cast.toString(args.SPEED)} ${args.MID}`);
    }

    edu_jump (args) {
        this.telloProcessor.request(`jump ${Cast.toString(args.X)} ${Cast.toString(args.Y)} ${Cast.toString(args.Z)} ${Cast.toString(args.SPEED)} ${Cast.toString(args.YAW)} ${args.MID1} ${args.MID2}`);
    }

    clearQueue () {
        this.telloProcessor.resetQueue();
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
