export const format = (str, params) => {
  if (!params) return str;
  const keys = Object.keys(params);
  for (let i = 0; i < keys.length; i++) {
    str = str.replace(new RegExp(`{${keys[i]}}`, 'gi'), params[keys[i]]);
  }
  return str;
};