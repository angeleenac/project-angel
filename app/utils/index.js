const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const randomOtpNumber = () => {
  let random1 = randomNumber(0, 9);
  let random2 = randomNumber(0, 9);
  let random3 = randomNumber(0, 9);
  let random4 = randomNumber(0, 9);
  let random5 = randomNumber(0, 9);
  let random6 = randomNumber(0, 9);
  let random =
    String(random1) +
    String(random2) +
    String(random3) +
    String(random4) +
    String(random5) +
    String(random6);

  return random;
};

module.exports = {
  randomNumber,
  randomOtpNumber,
};
