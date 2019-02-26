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

const wordPicture = word => {
  if (!word.user_translates) return "";
  const translation = word.user_translates.find(translation =>!!translation.picture_url);
  return translation ? `http:${translation.picture_url}` : "";
};

const clozefy = (word, string) => string.replace(wordRegExp(word), "{{c1::$&}}");

const extractWordData = (word, wordSetsMap) => {
  const translations = word.user_translates
    .map(t => sanitizeString(t.translate_value))
    .join(", ");
  const wordValue = sanitizeString(word.word_value);
  const context = sanitizeString(word.context);
  const highlightedContext = highlightWord(wordValue, context);
  const clozefiedContext = clozefy(wordValue, context);
  const image = `<img src='${wordPicture(word)}'>`;
  const sound = `[sound:${word.sound_url}]`;
  const groups = (word.groups || []).map(group => wordSetsMap[group]).join(" ");

  return {
    word: wordValue,
    translations,
    image,
    transcription: word.transcription,
    context: highlightedContext,
    sound,
    groups,
    clozefiedContext
  };
};

export default extractWordData;