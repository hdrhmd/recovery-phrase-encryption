const bip39 = require('bip39');

const phrase = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon ";
const words = bip39.wordlists.english;
phrase.split(' ').filter(w => words.indexOf(w) === -1).forEach(v => console.log(v));;
console.log('-');
words.filter(w => bip39.validateMnemonic(phrase + w)).forEach(v => console.log(v));



