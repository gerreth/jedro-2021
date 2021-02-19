const magic = (
  pizzas: string[],
  numberOfPizzas: number,
  twos: number,
  threes: number,
  fours: number
): Array<number[]> => {
  const pizzaById = pizzas.reduce<{
    [key: string]: {
      totalIngredients: number;
      uniqueIngredients: number;
      ingredients: string[];
      isDelivered: boolean;
    };
  }>((acc, pizza, idx) => {
    const [totalIngredients, ...ingredients] = pizza.split(" ").filter(Boolean);

    acc[idx.toString()] = {
      uniqueIngredients: new Set(ingredients).size,
      totalIngredients: parseInt(totalIngredients),
      ingredients,
      isDelivered: false,
    };

    return acc;
  }, {});

  const sortedPizzas = Object.entries(pizzaById).sort(
    (pizzaA, pizzaB) =>
      pizzaB[1].uniqueIngredients - pizzaA[1].uniqueIngredients
  );

  let result: Array<number[]> = [];

  while (numberOfPizzas > 1) {
    console.log({ numberOfPizzas });

    const four = 4;
    if (numberOfPizzas >= four && fours) {
      fours--;
      numberOfPizzas -= four;

      const delivery = [four];
      for (let index = 0; index < four; index++) {
        delivery.push(parseInt(sortedPizzas.shift()![0]));
      }

      result.push(delivery);

      continue;
    }

    const three = 3;
    if (numberOfPizzas >= three && threes) {
      threes--;
      numberOfPizzas -= three;

      const delivery = [three];
      for (let index = 0; index < three; index++) {
        delivery.push(parseInt(sortedPizzas.shift()![0]));
      }

      result.push(delivery);

      continue;
    }

    const two = 2;
    if (numberOfPizzas >= two && twos) {
      twos--;
      numberOfPizzas -= two;

      const delivery = [two];
      for (let index = 0; index < two; index++) {
        delivery.push(parseInt(sortedPizzas.shift()![0]));
      }

      result.push(delivery);

      continue;
    }

    break;
  }

  // add number of deliveries
  result.unshift([result.length]);

  return result;
};

export default magic;
