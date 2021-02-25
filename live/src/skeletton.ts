import magic from "./magic.ts";

interface Streets {
  [key: string]: {
    intersectionStart: number;
    intersectionEnd: number;
    travelDuration: number;
  };
}

const skeletton = (file: string): { result: string[]; score: number } => {
  const [setting, ...rest] = file.split("\n");

  const [
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

  const streetsByName: Streets = {};
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

  const carRoutes: Array<{
    routeLength: number;
    route: Array<{ name: string; remainingLength: number }>;
  }> = [];

  carPaths.forEach((path) => {
    const [routeLength, ...route] = path.split(" ").filter(Boolean);
    // filter too long routes
    if (parseInt(routeLength) > simulationDuration) return;
    if (
      route.reduce((acc, routeStep) => {
        acc += streetsByName[routeStep].travelDuration;
        return acc;
      }, 0) > simulationDuration
    )
      return;

    carRoutes.push({
      routeLength: parseInt(routeLength),
      route: route.map((routeStep) => ({
        name: routeStep,
        remainingLength: streetsByName[routeStep].travelDuration,
      })),
    });
  });
  // console.log(carRoutes);

  carRoutes.forEach((route) => {
    if (route.routeLength !== route.route.length) {
      console.error("💥 CarPath fehlt/zu viel");
      Deno.exit(1);
    }
  });

  // build result
  const result = magic(streetsByName, carRoutes);

  // fail falsy result

  type carId = number;

  // calc score
  let simulationCounter = 1;
  let score = 0;
  const intersectionStacks: { [key: number]: Array<carId> } = {};

  for (let index = 0; index < numOfIntersections; index++) {
    intersectionStacks[index] = [];
  }

  carRoutes.forEach((car, idx) => {
    intersectionStacks[streetsByName[car.route[0].name].intersectionEnd].push(
      idx
    );
  });

  // run simulation
  while (simulationCounter < simulationDuration) {
    carRoutes.forEach((car, idx) => {
      if (car.route.length === 0) {
        return;
      }

      // wenn es das erste Auto an einer kreuzung ist
      const currentIntersection = Object.entries(intersectionStacks).find(
        ([_key, intersectionStack]) => intersectionStack[0] === idx
      );

      if (currentIntersection) {
        if (
          result.intersectionsById[
            parseInt(currentIntersection[0])
          ].settings.find((setting) => setting.streetName === car.route[0].name)
            ?.currentlyGreen
        ) {
          // von kreuzung entfernen
          intersectionStacks[parseInt(currentIntersection[0])].splice(0, 1);

          // und auf straße oder zur nächsten kreuzung fahren
          if (car.route[0].remainingLength === 1) {
            if (car.route[1]) {
              intersectionStacks[
                streetsByName[car.route[1].name].intersectionEnd
              ].push(idx);

              carRoutes[idx].route.splice(0, 1);
            } else {
              score +=
                bonusPerCar + simulationDuration - (simulationCounter - 1);
              return;
            }
          } else {
            // ein schritt auf der straße weiterfahren
            carRoutes[idx].route[0].remainingLength--;
          }
        }
      } else {
        // wenn AN einer Kreuzung aber es NICHT das erste auto ist
        const atCurrentIntersection = Object.entries(
          intersectionStacks
        ).find(([_key, intersectionStack]) => intersectionStack.includes(idx));

        if (!atCurrentIntersection) {
          // erreicht es die nächste kreuzung?
          if (
            car.route[0].remainingLength === 1 &&
            car.route[1] !== undefined
          ) {
            intersectionStacks[
              streetsByName[car.route[1].name].intersectionEnd
            ].push(idx);

            carRoutes[idx].route.splice(0, 1);
          } else {
            // sonst einen schritt auf der straße weiterfahren
            carRoutes[idx].route[0].remainingLength--;
          }
        }
      }

      // currentlyGreen updaten!!!
      Object.values(result.intersectionsById).forEach((intersection, idx) => {
        if (intersection.settings.length > 1) {
          const greenIdx = result.intersectionsById[idx].settings.findIndex(
            (setting) => setting.currentlyGreen
          )!;

          if (
            result.intersectionsById[idx].settings[greenIdx]
              .remainingGreenForSeconds === 1
          ) {
            const { greenForSeconds } = result.intersectionsById[idx].settings[
              greenIdx
            ];

            // set to red
            result.intersectionsById[idx].settings[
              greenIdx
            ].currentlyGreen = false;

            // reset green countdown
            result.intersectionsById[idx].settings[
              greenIdx
            ].remainingGreenForSeconds = greenForSeconds;

            if (
              greenIdx ===
              result.intersectionsById[idx].settings.length - 1
            ) {
              result.intersectionsById[idx].settings[0].currentlyGreen = true;
            } else {
              result.intersectionsById[idx].settings[
                greenIdx + 1
              ].currentlyGreen = true;
            }
          } else {
            result.intersectionsById[idx].settings[greenIdx]
              .remainingGreenForSeconds--;
          }
        }
      });
    });

    simulationCounter++;
  }

  const strResult = [result.numOfIntersections.toString()];
  Object.entries(result.intersectionsById).forEach(([key, intersection]) => {
    strResult.push(key);
    strResult.push(intersection.numOfIncomingStreets.toString());

    intersection.settings.forEach((setting) => {
      strResult.push(setting.streetName + " " + setting.greenForSeconds);
    });
  });

  return { result: strResult, score };
};

export default skeletton;
