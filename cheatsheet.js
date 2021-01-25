const bip39 = require('bip39');
const crypto = require("crypto");
const prompt = require('prompt');
const fs = require('fs');

const wordToHash = (word, salt) => {
    return crypto.createHmac('sha256', salt)
    .update(word)
    .digest('hex');
};

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
            label: w,
            hash: wordToHash(w, result.salt)
        };
    });
    const minLen = findMinLen(transformed.map(w => w.hash));
    const minified = transformed.map(w => (w.hash = w.hash.slice(0, minLen), w));
    const labelsorted = minified.map(w => [w.label, w.hash].join(': ')).join(' | ');
    minified.sort((a, b) => a.hash.localeCompare(b.hash));
    const hashsorted = minified.map(w => [w.hash, w.label].join(': ')).join(' | ');
    console.log('Encrypted using: ' + result.salt);
    fs.writeFileSync('./labelsorted.txt', labelsorted);
    fs.writeFileSync('./hashsorted.txt', hashsorted);
});

