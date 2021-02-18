const magic = (file: string): { result: string[]; score: number } => {
  const [setting, ...rest] = file.split("\n");

  const [numberOfPizzas, twos, threes, fours] = setting
    .trim()
    .split(" ")
    .map((item) => parseInt(item, 10));
  // console.log({ numberOfPizzas, twos, threes, fours });

  const pizzas = rest.filter(Boolean);
  // console.log({ pizzas });

  if (numberOfPizzas !== pizzas.length) {
    console.error("💥 Pizza fehlt/zu viel");
    Deno.exit(1);
  }

  // build result
  const result = [[2], [2, 1, 4], [3, 0, 2, 3]];
  // magic...

  // calc score
  let score = 0;
  result.slice(1).forEach(([_teamSize, ...pizzaIds]) => {
    const uniqueIngredients = new Set();

    pizzaIds.forEach((pizzaId) => {
      pizzas[pizzaId]
        .slice(1)
        .split(" ")
        .filter(Boolean)
        .forEach((ingredient) => {
          uniqueIngredients.add(ingredient);
        });
    });

    const deliveryScore = Math.pow(uniqueIngredients.size, 2);
    // console.log({ deliveryScore });

    score += deliveryScore;
  });

  return { result: result.map((row) => row.join(" ")), score };
};

export default magic;
