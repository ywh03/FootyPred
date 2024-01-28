function convertLeagueNameToFull (leagueName) {
    const words = leagueName.split("-");
    let processedWords = [];
    for (const word of words) {
        const processedWord = word[0].toUpperCase() + word.substring(1);
        processedWords.push(processedWord);
    }
    return processedWords.join(" ");
}

export {convertLeagueNameToFull};