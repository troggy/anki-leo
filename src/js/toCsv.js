import extractWordData from './extractWordData.js';

const encloseInDoubleQuotes = string => {
  if (string === "" || string == null) return "";
  return '"' + string + '"';
};

const wordToCSV = (rawWord, wordSetsMap) => {
  const { 
    word, translations, image, transcription, 
    context, sound, groups, clozefiedContext
  } = extractWordData(rawWord, wordSetsMap);
  return [
    word,
    translations,
    image,
    transcription,
    context,
    sound,
    groups,
    clozefiedContext
  ]
    .map(encloseInDoubleQuotes)
    .join(";");
};

const toCsv = (words, wordSetsMap) => {
  return words.map(w => wordToCSV(w, wordSetsMap)).join("\n");
};

export default toCsv;