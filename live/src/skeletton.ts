import magic from "./magic.ts";

const skeletton = (file: string): { result: string[]; score: number } => {
  const [setting, ...rest] = file.split("\n");

  let [
    simulationDuration,
    numOfIntersections,
    numOfStreets,
    numOfCars,
    bonusPerCar,
  ] = setting
    .trim()
    .split(" ")
    .map((item) => parseInt(item, 10));
  // console.log({
  //   simulationDuration,
  //   numOfIntersections,
  //   numOfStreets,
  //   numOfCars,
  //   bonusPerCar,
  // });

  const streets = rest.filter(Boolean).splice(0, numOfStreets);
  // console.log({ streets });

  if (numOfStreets !== streets.length) {
    console.error("💥 Straße fehlt/zu viel");
    Deno.exit(1);
  }

  const streetsByName: {
    [key: string]: {
      intersectionStart: number;
      intersectionEnd: number;
      travelDuration: number;
    };
  } = {};
  streets.forEach((street) => {
    const [
      intersectionStart,
      intersectionEnd,
      name,
      travelDuration,
    ] = street.split(" ").filter(Boolean);

    streetsByName[name] = {
      intersectionStart: parseInt(intersectionStart),
      intersectionEnd: parseInt(intersectionEnd),
      travelDuration: parseInt(travelDuration),
    };
  });

  const carPaths = rest.filter(Boolean).splice(numOfStreets, numOfCars);
  // console.log({ carPaths });

  if (numOfCars !== carPaths.length) {
    console.error("💥 CarPath fehlt/zu viel");
    Deno.exit(1);
  }

  const carRoutes: Array<{ routeLength: number; route: Array<string> }> = [];
  carPaths.forEach((path) => {
    const [routeLength, ...route] = path.split(" ").filter(Boolean);
    carRoutes.push({ routeLength: parseInt(routeLength), route });
  });
  // console.log(carRoutes);

  carRoutes.forEach((route) => {
    if (route.routeLength !== route.route.length) {
      console.error("💥 CarPath fehlt/zu viel");
      Deno.exit(1);
    }
  });

  // build result
  const result = magic();

  // fail falsy result

  // calc score
  let score = 0;

  return { result, score };
};

export default skeletton;
