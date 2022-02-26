function randomCreatePassword(srt, lenth) {
    let result = '';
    const possible = srt;
    for (let i = 0; i < lenth; i++) {
        result += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return result;
}

export function randomReturnPassword(previousResult) {
    let result = '';
    const possible = [
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        'abcdefghijklmnopqrstuvwxyz',
        '0123456789',
        '!@#$%^&*()_+~',
    ];
    const toto = previousResult.replaceAll(',', '');

    for (let i = 0; i <= 3; i++)
        result += randomCreatePassword(possible[toto[i]], 3);
    return result;
}

export function randomInt() {
    let randomNum;
    const randomIndexArray = [];
    for (let i = 0; i < 4; i++) {
        randomNum = Math.floor(Math.random() * 4);
        if (randomIndexArray.indexOf(randomNum.toString()) === -1) {
            randomIndexArray.push(randomNum.toString());
        } else {
            i--;
        }
    }
    return randomIndexArray.toString();
}
