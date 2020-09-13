function generateKey(name) {
  let string = name.toUpperCase();
  let key = '';
  for (let i=0; i < 5; i++) {
    string += `${(Math.floor(Math.random() * 9))}`;
  }
  for (let i = string.length; i >=0 ;i--) {
    key+= (string[Math.floor(Math.random() * i)]);
  }
  return key.slice(0,5);
}
module.exports = generateKey;