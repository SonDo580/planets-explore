const fs = require("fs");
const { parse } = require("csv-parse");

const habitablePlanets = [];

const isHabitable = (planet) => {
  const { koi_disposition, koi_insol, koi_prad } = planet;

  const dispositionCondition = koi_disposition === "CONFIRMED";
  const insolationCondition = koi_insol > 0.36 && koi_insol < 1.11;
  const radiusCondition = koi_prad < 1.6;

  return dispositionCondition && insolationCondition && radiusCondition;
};

fs.createReadStream("./kepler_data.csv")
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", (planet) => {
    if (isHabitable(planet)) {
      habitablePlanets.push(planet);
    }
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("end", () => {
    const habitablePlanetNames = habitablePlanets.map(
      (planet) => planet.kepler_name
    );

    console.log(`${habitablePlanets.length} habitable planets found!`);
    console.log(habitablePlanetNames);
  });
