interface Streets {
  [key: string]: {
    intersectionStart: number;
    intersectionEnd: number;
    travelDuration: number;
  };
}

interface Magic {
  numOfIntersections: number;
  intersectionsById: {
    [key: number]: {
      numOfIncomingStreets: number;
      settings: {
        streetName: string;
        greenForSeconds: number;
        remainingGreenForSeconds: number;
        currentlyGreen: boolean;
      }[];
    };
  };
}

type CarRoutes = Array<{
  routeLength: number;
  route: Array<{ name: string; remainingLength: number }>;
}>;

const magic = (streets: Streets, carRoutes: CarRoutes): Magic => {
  const streetScores: { [key: string]: number } = {};

  Object.keys(streets).forEach((street) => {
    streetScores[street] = 1;
  });

  carRoutes.forEach((route) => {
    route.route.forEach((route) => {
      streetScores[route.name] = streetScores[route.name] + 1;
    });
  });

  const intersectionsById: {
    [key: string]: {
      numOfIncomingStreets: number;
      settings: {
        streetName: string;
        greenForSeconds: number;
        remainingGreenForSeconds: number;
        currentlyGreen: boolean;
      }[];
    };
  } = {};

  Object.entries(streetScores)
    .sort((a, b) => b[1] - a[1])
    .sort((a, b) => streets[b[0]].travelDuration - streets[a[0]].travelDuration)
    .forEach(([key, score]) => {
      if (intersectionsById[streets[key].intersectionEnd] === undefined) {
        intersectionsById[streets[key].intersectionEnd] = {
          numOfIncomingStreets: 1,
          settings: [
            {
              streetName: key,
              greenForSeconds: score,
              remainingGreenForSeconds: score,
              currentlyGreen: true,
            },
          ],
        };
      } else {
        intersectionsById[streets[key].intersectionEnd].numOfIncomingStreets =
          intersectionsById[streets[key].intersectionEnd].numOfIncomingStreets +
          1;

        intersectionsById[streets[key].intersectionEnd].settings.push({
          streetName: key,
          greenForSeconds: score,
          remainingGreenForSeconds: score,
          currentlyGreen: false,
        });
      }
    });

  return {
    numOfIntersections: Object.keys(intersectionsById).length,
    intersectionsById,
  };
};

export default magic;
