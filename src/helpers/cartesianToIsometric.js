/**
 * @param {Number} x
 * @param {Number} y
*/
export function ConvertXCartesianToIsometric(x, y) {
    var tempX = x - y / 1.1;

    return tempX
}

/**
 * @param {Number} x
 * @param {Number} y
*/
export function ConvertYCartesianToIsometric(x, y) {
    var tempY = (x + y) / 2;

    return tempY
}