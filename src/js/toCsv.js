// eslint-disable-next-line no-useless-escape
const escapeRegExp = str => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

const wordRegExp = word => new RegExp("\\b" + escapeRegExp(word) + "\\b", "ig");

const highlightWord = (word, string) => string.replace(wordRegExp(word), "<b>$&</b>");

const sanitizeString = string => {
  if (!string) return "";
  return string
    .replace(/;/g, ".")
    .replace(/\r*\n/g, "<br>")
    .replace(/"/g, '""');
};

const encloseInDoubleQuotes = string => {
  if (string === "" || string == null) return "";
  return '"' + string + '"';
};

const wordPicture = word => {
  if (!word.user_translates) return "";
  const translation = word.user_translates.find(translation =>!!translation.picture_url);
  return translation ? `http:${translation.picture_url}` : "";
};

const clozefy = (word, string) => string.replace(wordRegExp(word), "{{c1::$&}}");

const wordToCSV = (word, wordSetsMap) => {
  const translations = word.user_translates
    .map(t => sanitizeString(t.translate_value))
    .join(", ");
  const wordValue = sanitizeString(word.word_value);
  const context = sanitizeString(word.context);
  const highlightedContext = highlightWord(wordValue, context);
  const clozefiedContext = clozefy(wordValue, context);
  const picture = `<img src='${wordPicture(word)}'>`;
  const sound = `[sound:${word.sound_url}]`;
  const groups = (word.groups || []).map(group => wordSetsMap[group]).join(" ");

  return [
    wordValue,
    translations,
    picture,
    word.transcription,
    highlightedContext,
    sound,
    groups,
    clozefiedContext
  ]
    .map(encloseInDoubleQuotes)
    .join(";");
};

const toCsv = (words, wordSetsMap) => {
  const mapper = word => wordToCSV(word, wordSetsMap);
  return words.map(mapper).join("\n");
};

export default toCsv;