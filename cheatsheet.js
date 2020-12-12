const bip39 = require('bip39');
const crypto = require("crypto");
const prompt = require('prompt');
const fs = require('fs');

const wordToHash = (word, salt) => {
    return crypto.createHmac('sha256', salt)
    .update(word)
    .digest('hex');
};

const indexToOct = (index) => {
    return index.toString('8') * 1 + 1111;
}

const findMinLen = (hashs) => {
    for (let i=1; i<=64; i++) {
        const hashSubStrs = hashs.map(h => h.slice(0, i));
        const uniqueHashes = [...new Set(hashSubStrs)];
        if (hashs.length === uniqueHashes.length) {
            return i;
        }
    }
    throw 'Hash not unique even at 64 length.';
}

prompt.start();

prompt.get(['salt'], (err, result) => {
    if (err) throw 'Error getting salt from user.';
    const words = bip39.wordlists.english;
    const transformed = words.map((w, i) => {
        return {
            index: ('000' + i).slice(-4),
            label: w,
            octal: indexToOct(i),
            hash: wordToHash(w, result.salt)
        };
    });
    const minLen = findMinLen(transformed.map(w => w.hash));
    const minified = transformed.map(w => (w.hash = w.hash.slice(0, minLen), w));
    const stringified = minified.map(w => [w.index, w.octal, w.hash, w.label].join(' ')).join('\n');
    console.log('Encrypted using: ' + result.salt);
    fs.writeFileSync('./output.txt', stringified);
});

