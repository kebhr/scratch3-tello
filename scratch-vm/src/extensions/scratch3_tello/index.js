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
        'fr': 'décollage',
        'de': 'abheben',
        'bg': 'излитане',
        'zh-tw': '起飛',
        'it': 'decollo',
        'lv': 'pacelties',
        'ua': 'зліт',
    },
    land: {
        'ja': '着陸する',
        'ja-Hira': 'ちゃくりくする',
        'en': 'land',
        'ru': 'посадка',
        'fr': 'atterrissage',
        'de': 'landen',
        'bg': 'приземяване',
        'zh-tw': '降落',
        'it': 'atterraggio',
        'lv': 'nolaisties',
        'ua': 'посадити',
    },
    up: {
        'ja': '上に [X]cm 上がる',
        'ja-Hira': 'うえに [X] センチあがる',
        'en': 'up [X] cm',
        'ru': 'вверх [X] см',
        'fr': 'montée de [X] cm',
        'de': '[X] cm höher',
        'bg': 'издигане [X] см',
        'zh-tw': '向上 [X] 公分',
        'it': 'alzarsi di [X] cm',
        'lv': 'uz augšu [X] cm',
        'ua': 'вгору [X] см',
    },
    down: {
        'ja': '下に [X]cm 下がる',
        'ja-Hira': 'したに [X] センチさがる',
        'en': 'down [X] cm',
        'ru': 'вниз [X] см',
        'fr': 'descente de [X] cm',
        'de': '[X] cm tiefer',
        'bg': 'спускане [X] см',
        'zh-tw': '向下 [X] 公分',
        'it': 'abbasarsi di [X] cm',
        'lv': 'uz leju [X] cm',
        'ua': 'вниз [X] см',
    },
    left: {
        'ja': '左に [X]cm 動く',
        'ja-Hira': 'ひだりに [X] センチうごく',
        'en': 'move left [X] cm',
        'ru': 'влево [X] см',
        'fr': 'voler à gauche [X] cm',
        'de': '[X] cm nach links',
        'bg': 'наляво [X] см',
        'zh-tw': '向左 [X] 公分',
        'it': 'muovi a sinistra di [X] cm',
        'lv': 'pa kreisi [X] cm',
        'ua': 'ліворуч [X] см',
        
    },
    right: {
        'ja': '右に [X]cm 動く',
        'ja-Hira': 'みぎに [X] センチうごく',
        'en': 'move right [X] cm',
        'ru': 'вправо [X] см',
        'fr': 'voler à droite [X] cm',
        'de': '[X] cm nach rechts',
        'bg': 'надясно [X] см',
        'zh-tw': '向右 [X] 公分',
        'it': 'muovi a destra di [X] cm',
        'lv': 'pa labi [X] cm',
        'ua': 'праворуч [X] см',
    },
    forward: {
        'ja': '前に [X]cm 進む',
        'ja-Hira': 'まえに [X] センチすすむ',
        'en': 'move forward [X] cm',
        'ru': 'вперёд [X] см',
        'fr': 'voler vers l\'avant [X] cm',
        'de': '[X] cm nach vorne',
        'bg': 'напред [X] см',
        'zh-tw': '前進 [X] 公分',
        'it': 'muovi in avanti di [X] cm',
        'lv': 'uz priekšu [X] cm',
        'ua': 'вперед [X] см',
    },
    back: {
        'ja': '後ろに [X]cm 下がる',
        'ja-Hira': 'うしろに [X] センチさがる',
        'en': 'move back [X] cm',
        'ru': 'назад [X] см',
        'fr': 'voler vers l\'arrière [X] cm',
        'de': '[X] cm nach hinten',
        'bg': 'назад [X] см',
        'zh-tw': '後退 [X] 公分',
        'it': 'muovi indietro di [X] cm',
        'lv': 'atpakaļ [X] cm',
        'ua': 'назад [X] см',
    },
    cw: {
        'ja': '[X] 度右に回る',
        'ja-Hira': '[X] どみぎにまわる',
        'en': 'rotate [X] degrees right',
        'ru': 'повернуть на [X] градусов вправо',
        'fr': 'tourner de [X] degrés vers la droite',
        'de': 'drehe [X] Grad nach rechts',
        'bg': 'завъртане [X] градуса надясно',
        'zh-tw': '向右轉 [X] 度',
        'it': 'ruota di [X] gradi a destra',
        'lv': 'pagriezties [X] grādus pa labi',
        'ua': 'повернути на [X] градусів праворуч',
    },
    ccw: {
        'ja': '[X] 度左に回る',
        'ja-Hira': '[X] どひだりにまわる',
        'en': 'rotate [X] degrees left',
        'ru': 'повернуть на [X] градусов влево',
        'fr': 'tourner de [X] degrés vers la gauche',
        'de': 'drehe [X] Grad nach links',
        'bg': 'завъртане [X] градуса наляво',
        'zh-tw': '向左轉 [X] 度',
        'it': 'ruota di [X] gradi a sinistra',
        'lv': 'pagriezties [X] grādus pa kreisi',
        'ua': 'повернути на [X] градусів ліворуч',
    },
    flip: {
        'ja': '[DIRECTION]に宙返りする',
        'ja-Hira': '[DIRECTION]にちゅうがえりする',
        'en': 'flip in [DIRECTION]',
        'ru': 'сальто [DIRECTION]',
        'fr': 'flip vers [DIRECTION]',
        'de': 'Flip nach [DIRECTION]',
        'bg': 'лупинг на [DIRECTION]',
        'zh-tw': '向 [DIRECTION] 方翻轉',
        'it': 'capovolgi verso [DIRECTION]',
        'lv': 'apmest kūleni',
        'ua': 'фліп всередину [DIRECTION]',
    },
    go: {
        'ja': 'x:[X] y:[Y] z:[Z] に [SPEED]cm/s で飛ぶ',
        'ja-Hira': 'x:[X] y:[Y] z:[Z] に 1びょうで [SPEED] センチのはやさでとぶ',
        'en': 'fly to x:[X] y:[Y] z:[Z] in [SPEED]cm/s',
        'ru': 'лететь в x:[X] y:[Y] z:[Z] со скоростью [SPEED]см/с',
        'fr': 'voler à x:[X] y:[Y] z:[Z] à [SPEED]cm/s',
        'de': 'fliege zu x:[X] y:[Y] z:[Z] mit [SPEED]cm/s',
        'bg': 'лети до x:[X] y:[Y] z:[Z] с [SPEED] сm/сек',
        'zh-tw': '飛往 x:[X] y:[Y] z:[Z] 以速度 [SPEED] 公分/秒',
        'it': 'vola a x:[X] y:[Y] z:[Z] in [SPEED]cm/s',
        'lv': 'lidot uz x:[X] y:[Y] z:[Z] ar ātrumu [SPEED]cm/s',
        'ua': 'полетіти до x:[X] y:[Y] z:[Z] зі швидкістю [SPEED]cм/с',
    },
    curve: {
        'ja': 'x:[X1] y:[Y1] z:[Z1] から x:[X2] y:[Y2] z:[Z2] に [SPEED]cm/s でカーブしながら飛ぶ',
        'ja-Hira': 'x:[X2] y:[Y2] z:[Z2] から x:[X2] y:[Y2] z:[Z2] に 1びょうで [SPEED] センチのはやさでカーブしながらとぶ',
        'en': 'fly in curve from x:[X1] y:[Y1] z:[Z1] to x:[X2] y:[Y2] z:[Z2] in [SPEED]cm/s',
        'ru': 'лететь по кривой из x:[X1] y:[Y1] z:[Z1] в x:[X2] y:[Y2] z:[Z2] со скоростью [SPEED]см/с',
        'fr': 'voler en courbe de x:[X1] y:[Y1] z:[Z1] à x:[X2] y:[Y2] z:[Z2] à [SPEED]cm/s',
        'de': 'fliege in einer Kurve von x:[X1] y:[Y1] z:[Z1] nach x:[X2] y:[Y2] z:[Z2] mit [SPEED]cm/s',
        'bg': 'лети от x:[X1] y:[Y1] z:[Z1] до x:[X2] y:[Y2] z:[Z2] с [SPEED] см/сек',
        'zh-tw': '曲線飛行從 x:[X1] y:[Y1] z:[Z1] 到 x:[X2] y:[Y2] z:[Z2] 以速度 [SPEED] 公分/秒',
        'it': 'vola da x:[X1] y:[Y1] z:[Z1] a x:[X2] y:[Y2] z:[Z2] in [SPEED]cm/s',
        'lv': 'lidot ar līkumu no x:[X1] y:[Y1] z:[Z1] līdz x:[X2] y:[Y2] z:[Z2] ar ātrumu [SPEED]cm/s',
        'ua': 'політ у кривій з x:[X1] y:[Y1] z:[Z1] до x:[X2] y:[Y2] z:[Z2] зі швидкістю [SPEED] см/с'
    },
    enableMissionPad: {
        'ja': 'ミッションパッドを使う',
        'ja-Hira': 'ミッションパッドをつかう',
        'en': 'enable Mission Pad',
        'ru': 'активировать "Mission Pad"',
        'fr': 'activer le "Mission Pad"',
        'de': 'aktiviere das Mission Pad',
        'bg': 'активиране на Mission Pad',
        'zh-tw': '啟動挑戰卡',
        'it' : 'attiva la "Mission Pad"',
        'lv': 'iespējot "Mission Pad"',
        'ua': 'увімкнути "Mission Pad"',
    },
    eduGo: {
        'ja': '[MID]を検出していたら、ミッションパッドを基準に x:[X] y:[Y] z:[Z] に [SPEED]cm/s で飛ぶ',
        'ja-Hira': '[MID]がみつかっていたら、ミッションパッドからみて x:[X] y:[Y] z:[Z] に 1びょうで [SPEED] センチのはやさでとぶ',
        'en': 'when [MID] detected, fly to x:[X] y:[Y] z:[Z] based on the Mission Pad at [SPEED]cm/s',
        'ru': 'когда [MID] обнаружен, лететь в x:[X] y:[Y] z:[Z] основываясь на "Mission Pad" со скоростью [SPEED]см/с',
        'fr': 'détecter [MID], ensuite voler à x:[X] y:[Y] z:[Z] à partir du Mission Pad à [SPEED]cm/s',
        'de': 'wenn [MID] wahrgenommen wird, fliege nach x:[X] y:[Y] z:[Z] basierend auf dem Mission Pad mit [SPEED]cm/s',
        'bg': 'когато [MID] е засечен, лети от x:[X] y:[Y] z:[Z] според Mission Pad с [SPEED] см/сек',
        'zh-tw': '偵測到 [MID] 挑戰卡, 從挑戰卡飛行到 x:[X] y:[Y] z:[Z] 用 [SPEED]公分/秒 速度',
        'it': 'quando viene rilevato [MID], vola a x:[X] y:[Y] z:[Z] in base alla "Mission Pad" a [SPEED]cm/s',
        'lv': 'kad konstatēts [MID], lidot uz x:[X] y:[Y] z:[Z] atbilstoši "Mission Pad", ar ātrumu [SPEED]cm/s',
        'ua': 'коли виявлено [MID], полетіти до x:[X] y:[Y] z:[Z] на основі "Mission Pad" зі швидкістю [SPEED] см/с',
    },
    eduCurve: {
        'ja': '[MID]を検出していたら、ミッションパッドを基準に x:[X1] y:[Y1] z:[Z1] から x:[X2] y:[Y2] z:[Z2] に[SPEED]cm/s でカーブしながら飛ぶ',
        'ja-Hira': '[MID]がみつかっていたら、ミッションパッドからみて x:[X1] y:[Y1] z:[Z1] から x:[X2] y:[Y2] z:[Z2] に 1びょうで [SPEED] センチのはやさでカーブしながらとぶ',
        'en': 'when [MID] detected, fly in curve from x:[X1] y:[Y1] z:[Z1] to x:[X2] y:[Y2] z:[Z2] based on the Mission Pad at [SPEED]cm/s',
        'ru': 'когда [MID] обнаружен, лететь по кривой из x:[X1] y:[Y1] z:[Z1] в x:[X2] y:[Y2] z:[Z2] основываясь на "Mission Pad" со скоростью [SPEED]см/с',
        'fr': 'détecter [MID], ensuite voler en courbe de x:[X1] y:[Y1] z:[Z1] à x:[X2] y:[Y2] z:[Z2] à partir du Mission Pad à [SPEED] cm/s',
        'de': 'wenn [MID] wahrgenommen wird, fliege in einer Kurve von x:[X1] y:[Y1] z:[Z1] nach x:[X2] y:[Y2] z:[Z2] basierend auf dem Mission Pad mit [SPEED]cm/s',
        'bg': 'когато [MID] е засечен, лети със завой от x:[X1] y:[Y1] z:[Z1] до x:[X2] y:[Y2] z:[Z2] според Mission Pad с [SPEED] см/сек',
        'zh-tw': '偵測到 [MID] 挑戰卡, 以弧線飛行從 x:[X1] y:[Y1] z:[Z1] 到 x:[X2] y:[Y2] z:[Z2] 用 [SPEED]公分/秒 速度',
        'it': 'quando viene rilevato [MID], vola da x:[X1] y:[Y1] z:[Z1] a x:[X2] y:[Y2] z:[Z2] in base alla "Mission Pad" a [SPEED]cm/s',
        'lv': 'kad konstatēts [MID], lidot ar līkumu no x:[X1] y:[Y1] z:[Z1] līdz x:[X2] y:[Y2] z:[Z2] atbilstoši "Mission Pad", ar ātrumu [SPEED]cm/s',
        'ua': 'якщо виявлено [MID], політ у кривій з x:[X1] y:[Y1] z:[Z1] до x:[X2] y:[Y2] z:[Z2] на основі "Mission Pad" зі швидкістю [SPEED] см/с',
    },
    eduJump: {
        'ja': '[MID1]と[MID2]を検出していたら、1つ目のミッションパッドを基準に x:[X] y:[Y] z:[Z] に飛んだあと、2つ目のミッションパッドの上まで[SPEED]cm/sで飛び[YAW]度に向く',
        'ja-Hira': '[MID1]と[MID2]がみつかったら、1つめのミッションパッドからみて x:[X] y:[Y] z:[Z] にとんだあと2つめのミッションパッドのうえまで 1びょうで [SPEED] センチのはやさでとび、[YAW]どにむく',
        'en': 'when [MID1] [MID2] detected, fly to x:[X] y:[Y] z:[Z] based on first mission pad then fly on second mission pad at [SPEED] cm/s and rotate [YAW] degrees',
        'ru': 'когда [MID1] [MID2] обнаружены, лететь из x:[X] y:[Y] z:[Z] на основе первой "Mission Pad", а затем лететь ко второй "Mission Pad" со скоростью [SPEED] см/с и повернуть на [YAW] градусов',
        'fr': 'détecter [MID1] et [MID2], ensuite voler à x:[X] y:[Y] z:[Z] à partir du premier Mission Pad, faire une rotation de [YAW] degrés, et voler au deuxième Mission Pad à [SPEED] cm/s',
        'de': 'wenn [MID1] [MID2] wahrgenommen wird, fliege nach x:[X] y:[Y] z:[Z] basierend auf dem ersten Mission Pad, fliege dann zum zweiten Mission Pad mit [SPEED] cm/s und drehe dich um [YAW] Grad',
        'bg': 'когато [MID1] [MID2] е засечен, лети до x:[X] y:[Y] z:[Z] според първи Mission Pad, след това според втори Mission Pad с [SPEED] см/сек и се завърти [YAW] градуса',
        'zh-tw': '偵測到 [MID1] [MID2] , 從第一個挑戰卡用 [SPEED] 公分/秒 速度及旋轉 [YAW] 角度飛往 x:[X] y:[Y] z:[Z] 第二個挑戰卡',
        'it': 'quando viene rilevato [MID1] e [MID2], vola a x:[X] y:[Y] z:[Z] in base alla prima "Mission Pad", fai una rotazione di [YAW] gradi e quindi vola alla seconda "Mission Pad" a [SPEED] cm /s',
        'lv': 'kad konstatēts [MID1] [MID2], lidot uz x:[X] y:[Y] z:[Z] atbilstoši pirmajam "Mission Pad", tad lidot uz otro "Mission Pad" ar ātrumu [SPEED]cm/s un pagriezties [YAW] grādus',
        'ua': 'якщо виявлено [MID1] та [MID2], політ до x:[X] y:[Y] z:[Z] на основі першої "Mission Pad", а потім перехід на другу "Mission Pad" зі швидкістю [SPEED] см/с та обертання на [YAW] градусів',
    },
    clearQueue: {
        'ja': '実行待ちのコマンドをクリアする',
        'ja-Hira': 'うごくのをまっているコマンドをなくす',
        'en': 'clear command queue',
        'ru': 'очистить очередь команд',
        'fr': 'effacer la séquence de commandes',
        'de': 'lösche die Befehlsreihe',
        'bg': 'изтриване на командите',
        'zh-tw': '清除命令佇列',
        'it' : 'elimina la sequenza di comandi',
        'lv': 'notīrīt komandu rindu',
        'ua': 'очистити чергу команд',
    },
    pitch: {
        'ja': 'ピッチ',
        'ja-Hira': 'ピッチ',
        'en': 'pitch',
        'ru': 'наклон',
        'fr': 'tangage',
        'de': 'falle',
        'bg': 'накланяне',
        'zh-tw': '俯仰',
        'it' : 'lancio',
        'lv': 'slīpums',
        'ua': 'тангаж',
    },
    roll: {
        'ja': 'ロール',
        'ja-Hira': 'ロール',
        'en': 'roll',
        'ru': 'крен',
        'fr': 'roulis',
        'de': 'rolle',
        'bg': 'завъртане',
        'zh-tw': '翻滾',
        'it' : 'rotolare',
        'lv': 'rotācija',
        'ua': 'крен',
    },
    yaw: {
        'ja': 'ヨー',
        'ja-Hira': 'ヨー',
        'en': 'yaw',
        'ru': 'вращение вокруг оси Z',
        'fr': 'lacet',
        'de': 'schwanken',
        'bg': 'завъртане',
        'zh-tw': '偏擺',
        'it': 'imbardata',
        'lv': 'pagrieziens',
        'ua': 'рискання',
    },
    vgx: {
        'ja': 'x方向の速度',
        'ja-Hira': 'xほうこうのはやさ',
        'en': 'speed x',
        'ru': 'скорость x',
        'fr': 'vitesse sur l\'axe X',
        'de': 'Geschwindigkeit x',
        'bg': 'скорост x',
        'zh-tw': 'x方向的速度',
        'it' : 'velocità sull\'asse x',
        'lv': 'x ātrums',
        'ua': 'швидкість x',
    },
    vgy: {
        'ja': 'y方向の速度',
        'ja-Hira': 'yほうこうのはやさ',
        'en': 'speed y',
        'ru': 'скорость y',
        'fr': 'vitesse sur l\'axe Y',
        'de': 'Geschwindigkeit y',
        'bg': 'скорост y',
        'zh-tw': 'y方向的速度',
        'it' : 'velocità sull\'asse y',
        'lv': 'y ātrums',
        'ua': 'швидкість y',
    },
    vgz: {
        'ja': 'z方向の速度',
        'ja-Hira': 'zほうこうのはやさ',
        'en': 'speed z',
        'ru': 'скорость z',
        'fr': 'vitesse sur l\'axe Z',
        'de': 'Geschwindigkeit z',
        'bg': 'скорост z',
        'zh-tw': 'z方向的速度',
        'it' : 'velocità sull\'asse z',
        'lv': 'z ātrums',
        'ua': 'швидкість z',
    },
    tof: {
        'ja': '地面からの高度',
        'ja-Hira': 'じめんからのたかさ',
        'en': 'height from ground',
        'ru': 'высота от земли',
        'fr': 'hauteur du sol',
        'de': 'Höhe vom Boden',
        'bg': 'височина от земята',
        'zh-tw': '距離地面高度',
        'it': 'altezza dal suolo',
        'lv': 'augstums no zemes',
        'ua': 'висота від землі',
    },
    height: {
        'ja': '離陸した場所からの高度',
        'ja-Hira': 'りりくしたばしょからのたかさ',
        'en': 'height from takeoff point',
        'ru': 'высота от точки взлёта',
        'fr': 'hauteur du point de décollage',
        'de': 'Höhe vom Startpunkt',
        'bg': 'височина от точката на излитане',
        'zh-tw': '距離起飛點的高度',
        'it': 'altezza dal punto di decollo',
        'lv': 'augstums no pacelšanās punkta',
        'ua': 'висота від точки зльоту',
    },
    bat: {
        'ja': 'バッテリー残量',
        'ja-Hira': 'バッテリーざんりょう',
        'en': 'battery remaining',
        'ru': 'заряд батареи',
        'fr': 'niveau de la batterie',
        'de': 'übrige Batterieladung',
        'bg': 'заряд на батерията',
        'zh-tw': '剩餘電量',
        'it' : 'livello della batteria',
        'lv': 'atlikusi baterija',
        'ua': 'заряд батареї',
    },
    baro: {
        'ja': '気圧計による高さ',
        'ja-Hira': 'きあつけいによるたかさ',
        'en': 'height by barometer',
        'ru': 'высота по барометру',
        'fr': 'altitude (baromètre)',
        'de': 'Höhe gemessen am Luftdruck',
        'bg': 'височина според барометър',
        'zh-tw': '氣壓計偵測高度',
        'it' : 'altitudine barometrica',
        'lv': 'augstums pēc barometra',
        'ua': 'висота за барометром',
    },
    time: {
        'ja': '飛行時間',
        'ja-Hira': 'ひこうじかん',
        'en': 'flying time',
        'ru': 'время полёта',
        'fr': 'durée du vol',
        'de': 'Flugzeit',
        'bg': 'време на полета',
        'zh-tw': '飛行時間',
        'it' : 'tempo di volo',
        'lv': 'lidojuma laiks',
        'ua': 'час польоту',
    },
    agx: {
        'ja': 'x方向の加速度',
        'ja-Hira': 'xほうこうのかそくど',
        'en': 'acceleration x',
        'ru': 'ускорение x',
        'fr': 'accélération sur l\'axe X',
        'de': 'Beschleunigung x',
        'bg': 'ускорение x',
        'zh-tw': 'x方向的加速度',
        'it' : 'accelerazione sull\'asse x',
        'lv': 'paātrinājums x',
        'ua': 'прискорення по осі x',
    },
    agy: {
        'ja': 'y方向の加速度',
        'ja-Hira': 'yほうこうのかそくど',
        'en': 'acceleration y',
        'ru': 'ускорение y',
        'fr': 'accélération sur l\'axe Y',
        'de': 'Beschleunigung y',
        'bg': 'ускорение y',
        'zh-tw': 'y方向的加速度',
        'it' : 'accelerazione sull\'asse y',
        'lv': 'paātrinājums y',
        'ua': 'прискорення по осі y',
    },
    agz: {
        'ja': 'z方向の加速度',
        'ja-Hira': 'zほうこうのかそくど',
        'en': 'acceleration z',
        'ru': 'ускорение z',
        'fr': 'accélération sur l\'axe Z',
        'de': 'Beschleunigung z',
        'bg': 'ускорение z',
        'zh-tw': 'z方向的加速度',
        'it' : 'accelerazione sull\'asse z',
        'lv': 'paātrinājums z',
        'ua': 'прискорення по осі z',
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
                    opcode: 'enableMissionPad',
                    text: this._getText('enableMissionPad'),
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: 'eduGo',
                    text: '(EDU) ' + this._getText('eduGo'),
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
                    opcode: 'eduCurve',
                    text: '(EDU) ' + this._getText('eduCurve'),
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
                    opcode: 'eduJump',
                    text: '(EDU) ' + this._getText('eduJump'),
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
                                    'ru': 'вперёд',
                                    'fr': 'avant',
                                    'de': 'vorwärts',
                                    'bg': 'напред',
                                    'zh-tw': '前',
                                    'it' : 'avanti',
                                    'lv': 'uz priekšu',
                                    'ua': 'вперед',
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
                                    'ru': 'назад',
                                    'fr': 'arrière',
                                    'de': 'zurück',
                                    'bg': 'назад',
                                    'zh-tw': '後',
                                    'it' : 'indietro',
                                    'lv': 'atpakaļ',
                                    'ua': 'назад',
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
                                    'ru': 'влево',
                                    'fr': 'gauche',
                                    'de': 'links',
                                    'bg': 'наляво',
                                    'zh-tw': '左',
                                    'it' : 'sinistra',
                                    'lv': 'pa kreisi',
                                    'ua': 'ліворуч',
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
                                    'ru': 'вправо',
                                    'fr': 'droite',
                                    'de': 'rechts',
                                    'bg': 'надясно',
                                    'zh-tw': '右',
                                    'it' : 'destra',
                                    'lv': 'pa labi',
                                    'ua': 'праворуч',
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
                                    'ru': 'случайно',
                                    'fr': 'aléatoire',
                                    'de': 'beliebig',
                                    'bg': 'случаен',
                                    'zh-tw': '亂數',
                                    'it' : 'casuale',
                                    'lv': 'nejaušs',
                                    'ua': 'випадковий',
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
                                    'ru': 'ближайший',
                                    'fr': 'le plus proche',
                                    'de': 'am nahesten',
                                    'bg': 'най-близък',
                                    'zh-tw': '最近的',
                                    'it' : 'il più vicino',
                                    'lv': 'tuvākais',
                                    'ua': 'найближчий',
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

    enableMissionPad () {
        this.telloProcessor.request(`mon`);
        this.telloProcessor.request(`mdirection 2`);
    }

    eduGo (args) {
        this.telloProcessor.request(`go ${Cast.toString(args.X)} ${Cast.toString(args.Y)} ${Cast.toString(args.Z)} ${Cast.toString(args.SPEED)} ${args.MID}`);
    }

    eduCurve (args) {
        this.telloProcessor.request(`curve ${Cast.toString(args.X1)} ${Cast.toString(args.Y1)} ${Cast.toString(args.Z1)} ${Cast.toString(args.X2)} ${Cast.toString(args.Y2)} ${Cast.toString(args.Z2)} ${Cast.toString(args.SPEED)} ${args.MID}`);
    }

    eduJump (args) {
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
