const { parse } = require("url");

const heroes = require("./superhero.json");

function similarity(s1, s2) {

  var longer = s1;

  var shorter = s2;

  if (s1.length < s2.length) {

    longer = s2;

    shorter = s1;

  }

  var longerLength = longer.length;

  if (longerLength == 0) {

    return 1.0;

  }

  return (

    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)

  );

}

function editDistance(s1, s2) {

  s1 = s1.toLowerCase();

  s2 = s2.toLowerCase();

  var costs = new Array();

  for (var i = 0; i <= s1.length; i++) {

    var lastValue = i;

    for (var j = 0; j <= s2.length; j++) {

      if (i == 0) costs[j] = j;

      else {

        if (j > 0) {

          var newValue = costs[j - 1];

          if (s1.charAt(i - 1) != s2.charAt(j - 1))

            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;

          costs[j - 1] = lastValue;

          lastValue = newValue;

        }

      }

    }

    if (i > 0) costs[s2.length] = lastValue;

  }

  return costs[s2.length];

}

module.exports = async (req, res) => {

  const { query } = parse(req.url, true);

  const { hero = "", regex = undefined } = query;

  console.log(req.headers);

  if (regex) {

    const testRegex = RegExp(regex.toString());

    let regexHeroes = heroes.filter((hero) => testRegex.test(hero.name));

    if (

      req.headers["x-rapidapi-subscription"] &&

      req.headers["x-rapidapi-subscription"] == "BASIC"

    ) {

      regexHeroes = regexHeroes.slice(0, 5);

    }

    res.end(JSON.stringify(regexHeroes));

  } else {

    let foundData;

    heroes.map((elem) => {

      if (

        (similarity(hero, elem.name) >= 0.8 ||

          similarity(hero, elem.biography.fullName) >= 0.8) &&

        !foundData

      ) {

        foundData = elem;

      }

    });

    foundData ? res.end(JSON.stringify(foundData)) : res.end("Hero Not Found");

  }

};
