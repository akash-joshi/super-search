const { parse } = require("url");

const heroes = require("../superhero.json");

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = async (req, res) => {
  const { query } = parse(req.url, true);

  const { hero = "", regex = undefined } = query;

  console.log(req.headers);

  const superheroes = heroes.filter(
    (hero) => hero.biography.alignment === "good"
  );

  res.end(JSON.stringify(shuffle(superheroes).slice(0, 20)));
};
