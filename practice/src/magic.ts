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
    };
  }>((acc, pizza, idx) => {
    const [totalIngredients, ...ingredients] = pizza.split(" ").filter(Boolean);

    acc[idx.toString()] = {
      uniqueIngredients: new Set(ingredients).size,
      totalIngredients: parseInt(totalIngredients),
      ingredients,
    };

    return acc;
  }, {});

  let result: Array<number[]> = [];

  while (numberOfPizzas > 1) {
    if (numberOfPizzas > 4) {
      fours--;
      numberOfPizzas -= 4;

      const delivery = [4];
      for (let index = 0; index < 4; index++) {
        const bestPizza = Object.entries(pizzaById).sort(
          (pizzaA, pizzaB) =>
            pizzaB[1].uniqueIngredients - pizzaA[1].uniqueIngredients
        )[0];

        delete pizzaById[bestPizza[0]];

        delivery.push(parseInt(bestPizza[0]));
      }

      result.push(delivery);
    }
  }

  // add number of deliveries
  result.unshift([result.length]);

  return result;
};

export default magic;
