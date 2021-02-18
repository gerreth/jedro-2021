import magic from "./magic.ts";

const skeletton = (file: string): { result: string[]; score: number } => {
  const [setting, ...rest] = file.split("\n");

  let [numberOfPizzas, twos, threes, fours] = setting
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
  const result = magic(pizzas, numberOfPizzas, twos, threes, fours);

  // fail falsy result
  if (result[0].length !== 1 || result[0][0] !== result.length - 1) {
    console.error("💥 Zahl der gesamten Lieferungen falsch");
    Deno.exit(1);
  }

  result.slice(1).forEach((delivery) => {
    if (
      ![2, 3, 4].includes(delivery[0]) ||
      delivery[0] !== delivery.length - 1
    ) {
      console.error("💥 Teamgröße oder Anzahl Pizzen falsch");
      Deno.exit(1);
    }
  });

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

export default skeletton;
