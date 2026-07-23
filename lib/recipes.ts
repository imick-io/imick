export const COURSES = [
  "Breakfast",
  "Lunch",
  "Mains",
  "Dessert",
  "Snacks",
] as const

export type Course = (typeof COURSES)[number]

export const RECIPE_TAGS = [
  "Healthy",
  "Light Lunch",
  "Weekday",
  "Weekend",
  "Guests",
  "Meal Prep",
  "Freezer-Friendly",
  "Vacuum Seal",
  "Quick",
  "Make Ahead",
  "High Protein",
  "Comfort Food",
  "Special Occasion",
] as const

export type RecipeTag = (typeof RECIPE_TAGS)[number]

export type Ingredient = {
  item: string
  grams?: number
  note?: string
}

export type Step = {
  text: string
  // Ingredient `item` names added at this step, for the consolidated view.
  uses?: string[]
}

export type Recipe = {
  slug: string
  name: string
  intro: string
  course: Course
  primary: string
  tags: RecipeTag[]
  minutes: number
  servings: number
  image: string
  imageAlt: string
  ingredients: Ingredient[]
  steps: Step[]
}

const RECIPES: Recipe[] = [
  {
    slug: "overnight-oats",
    name: "Overnight Oats",
    intro: "Five minutes tonight, breakfast for four days. Mix, chill, done.",
    course: "Breakfast",
    primary: "Oats",
    tags: ["Meal Prep", "Healthy", "Quick", "Make Ahead"],
    minutes: 5,
    servings: 1,
    image: "/assets/recipes/overnight-oats.jpg",
    imageAlt: "Glass jars of overnight oats topped with strawberries",
    ingredients: [
      { item: "Rolled oats", grams: 50 },
      { item: "Milk", grams: 120 },
      { item: "Greek yogurt", grams: 60 },
      { item: "Chia seeds", grams: 10 },
      { item: "Honey", grams: 15 },
      { item: "Frozen berries", grams: 80 },
    ],
    steps: [
      {
        text: "Mix oats, chia, milk, yogurt, and honey in a jar.",
        uses: ["Rolled oats", "Chia seeds", "Milk", "Greek yogurt", "Honey"],
      },
      { text: "Top with frozen berries.", uses: ["Frozen berries"] },
      { text: "Refrigerate overnight. Keeps 4 days." },
    ],
  },
  {
    slug: "shakshuka",
    name: "Shakshuka",
    intro: "Eggs poached in spiced tomato sauce. One pan, big weekend energy.",
    course: "Breakfast",
    primary: "Eggs",
    tags: ["Weekend", "Guests", "Healthy"],
    minutes: 30,
    servings: 2,
    image: "/assets/recipes/shakshuka.jpg",
    imageAlt: "Shakshuka pan with poached eggs in tomato sauce and parsley",
    ingredients: [
      { item: "Canned tomatoes", grams: 400 },
      { item: "Eggs", grams: 200, note: "4 large" },
      { item: "Onion", grams: 120 },
      { item: "Red pepper", grams: 150 },
      { item: "Olive oil", grams: 20 },
      { item: "Cumin + paprika", grams: 4 },
      { item: "Feta", grams: 50 },
    ],
    steps: [
      {
        text: "Soften onion and pepper in oil, 8 min.",
        uses: ["Onion", "Red pepper", "Olive oil"],
      },
      {
        text: "Add spices, then tomatoes. Simmer 10 min.",
        uses: ["Cumin + paprika", "Canned tomatoes"],
      },
      { text: "Make wells, crack in eggs, cover 6 min.", uses: ["Eggs"] },
      { text: "Finish with feta. Serve with bread.", uses: ["Feta"] },
    ],
  },
  {
    slug: "yogurt-power-bowl",
    name: "Greek Yogurt Power Bowl",
    intro: "Thirty grams of protein before your coffee is done brewing.",
    course: "Breakfast",
    primary: "Yogurt",
    tags: ["Quick", "Healthy", "High Protein", "Weekday"],
    minutes: 5,
    servings: 1,
    image: "/assets/recipes/yogurt-power-bowl.jpg",
    imageAlt: "Bowl of yogurt and oats topped with berries and kiwi",
    ingredients: [
      { item: "Greek yogurt 2%", grams: 250 },
      { item: "Granola", grams: 40 },
      { item: "Banana", grams: 100 },
      { item: "Peanut butter", grams: 20 },
      { item: "Honey", grams: 10 },
    ],
    steps: [
      {
        text: "Layer yogurt, sliced banana, and granola.",
        uses: ["Greek yogurt 2%", "Banana", "Granola"],
      },
      { text: "Drizzle peanut butter and honey.", uses: ["Peanut butter", "Honey"] },
    ],
  },
  {
    slug: "freezer-breakfast-burritos",
    name: "Freezer Breakfast Burritos",
    intro: "A batch of eight, wrapped and frozen. Weekday breakfast in 4 minutes.",
    course: "Breakfast",
    primary: "Eggs",
    tags: ["Meal Prep", "Freezer-Friendly", "Make Ahead", "Quick"],
    minutes: 45,
    servings: 8,
    image: "/assets/recipes/freezer-breakfast-burritos.jpg",
    imageAlt: "Grilled breakfast burrito cut in half showing the filling",
    ingredients: [
      { item: "Eggs", grams: 600, note: "12 large" },
      { item: "Tortillas", grams: 480, note: "8 large" },
      { item: "Breakfast sausage", grams: 400 },
      { item: "Cheddar", grams: 200 },
      { item: "Potatoes, diced", grams: 400 },
      { item: "Salsa", grams: 160 },
    ],
    steps: [
      {
        text: "Brown sausage, crisp potatoes, soft-scramble eggs.",
        uses: ["Breakfast sausage", "Potatoes, diced", "Eggs"],
      },
      {
        text: "Fill tortillas with cheddar and salsa, roll tight, wrap in foil.",
        uses: ["Tortillas", "Cheddar", "Salsa"],
      },
      { text: "Freeze flat. Reheat 90 sec microwave + 3 min pan." },
    ],
  },
  {
    slug: "chicken-souvlaki-bowls",
    name: "Chicken Souvlaki Bowls",
    intro: "Marinated chicken, rice, and yogurt sauce. Four lunches, one sear.",
    course: "Lunch",
    primary: "Chicken breast",
    tags: ["Meal Prep", "High Protein", "Healthy", "Weekday"],
    minutes: 35,
    servings: 4,
    image: "/assets/recipes/chicken-souvlaki-bowls.jpg",
    imageAlt: "Platter of grilled meat skewers with roasted vegetables",
    ingredients: [
      { item: "Chicken breast", grams: 700 },
      { item: "Rice, uncooked", grams: 300 },
      { item: "Cucumber", grams: 200 },
      { item: "Cherry tomatoes", grams: 250 },
      { item: "Greek yogurt", grams: 200 },
      { item: "Lemon + oregano marinade", grams: 60 },
    ],
    steps: [
      {
        text: "Marinate cubed chicken 20 min, then sear hard.",
        uses: ["Chicken breast", "Lemon + oregano marinade"],
      },
      {
        text: "Cook rice. Chop vegetables.",
        uses: ["Rice, uncooked", "Cucumber", "Cherry tomatoes"],
      },
      {
        text: "Portion into 4 containers, yogurt sauce on the side.",
        uses: ["Greek yogurt"],
      },
      { text: "Keeps 4 days refrigerated." },
    ],
  },
  {
    slug: "red-lentil-soup",
    name: "Red Lentil Soup",
    intro: "The freezer staple. Six portions of lunch from one pot and one blender pass.",
    course: "Lunch",
    primary: "Lentils",
    tags: ["Freezer-Friendly", "Healthy", "Light Lunch", "Make Ahead"],
    minutes: 40,
    servings: 6,
    image: "/assets/recipes/red-lentil-soup.jpg",
    imageAlt: "Bowl of red lentil soup topped with herbs and chili flakes",
    ingredients: [
      { item: "Red lentils", grams: 300 },
      { item: "Onion", grams: 150 },
      { item: "Carrot", grams: 150 },
      { item: "Canned tomatoes", grams: 200 },
      { item: "Stock", grams: 1200 },
      { item: "Cumin", grams: 4 },
      { item: "Lemon juice", grams: 30 },
    ],
    steps: [
      {
        text: "Sweat onion and carrot, bloom cumin.",
        uses: ["Onion", "Carrot", "Cumin"],
      },
      {
        text: "Add lentils, tomatoes, stock. Simmer 25 min.",
        uses: ["Red lentils", "Canned tomatoes", "Stock"],
      },
      { text: "Blend half, finish with lemon.", uses: ["Lemon juice"] },
      { text: "Freezes flat in bags for 3 months." },
    ],
  },
  {
    slug: "tuna-crunch-wrap",
    name: "Tuna Crunch Wrap",
    intro: "Ten minutes, one pan, real crunch. The weekday lunch that never fails.",
    course: "Lunch",
    primary: "Tuna",
    tags: ["Quick", "Light Lunch", "Weekday", "High Protein"],
    minutes: 10,
    servings: 1,
    image: "/assets/recipes/tuna-crunch-wrap.jpg",
    imageAlt: "Toasted wrap halves filled with slaw and herbs on a board",
    ingredients: [
      { item: "Canned tuna, drained", grams: 120 },
      { item: "Tortilla", grams: 60 },
      { item: "Greek yogurt", grams: 40 },
      { item: "Dijon", grams: 8 },
      { item: "Celery, minced", grams: 40 },
      { item: "Lettuce", grams: 30 },
    ],
    steps: [
      {
        text: "Mix tuna, yogurt, dijon, celery.",
        uses: ["Canned tuna, drained", "Greek yogurt", "Dijon", "Celery, minced"],
      },
      {
        text: "Fill tortilla with lettuce and tuna salad.",
        uses: ["Tortilla", "Lettuce"],
      },
      { text: "Fold and toast seam-side down, 2 min per side." },
    ],
  },
  {
    slug: "halloumi-grain-bowl",
    name: "Halloumi Grain Bowl",
    intro: "Seared halloumi over lemony couscous. Meatless without feeling like a compromise.",
    course: "Lunch",
    primary: "Halloumi",
    tags: ["Light Lunch", "Healthy", "Weekday"],
    minutes: 20,
    servings: 2,
    image: "/assets/recipes/halloumi-grain-bowl.jpg",
    imageAlt: "Colorful grain bowl with seared cubes, vegetables, and greens",
    ingredients: [
      { item: "Halloumi", grams: 225 },
      { item: "Couscous, uncooked", grams: 150 },
      { item: "Cucumber", grams: 150 },
      { item: "Cherry tomatoes", grams: 200 },
      { item: "Olive oil", grams: 25 },
      { item: "Lemon juice", grams: 20 },
      { item: "Mint", note: "small handful" },
    ],
    steps: [
      { text: "Steep couscous in boiling water, 5 min.", uses: ["Couscous, uncooked"] },
      { text: "Sear halloumi slices until golden.", uses: ["Halloumi"] },
      {
        text: "Toss everything with oil, lemon, mint.",
        uses: ["Cucumber", "Cherry tomatoes", "Olive oil", "Lemon juice", "Mint"],
      },
    ],
  },
  {
    slug: "chicken-parmigiana",
    name: "Chicken Parmigiana",
    intro: "Crispy cutlets under marinara and mozzarella. The guest dinner that always lands.",
    course: "Mains",
    primary: "Chicken breast",
    tags: ["Guests", "Comfort Food", "Weekend", "Freezer-Friendly"],
    minutes: 50,
    servings: 4,
    image: "/assets/recipes/chicken-parmigiana.jpg",
    imageAlt: "Chicken parmigiana with melted mozzarella and broccoli on a plate",
    ingredients: [
      { item: "Chicken breast, butterflied", grams: 800 },
      { item: "Breadcrumbs", grams: 120 },
      { item: "Parmesan", grams: 60 },
      { item: "Eggs", grams: 100, note: "2 large" },
      { item: "Marinara", grams: 400 },
      { item: "Mozzarella", grams: 200 },
      { item: "Flour", grams: 60 },
    ],
    steps: [
      {
        text: "Bread cutlets: flour, egg, crumbs + parmesan.",
        uses: [
          "Chicken breast, butterflied",
          "Flour",
          "Eggs",
          "Breadcrumbs",
          "Parmesan",
        ],
      },
      { text: "Shallow-fry until golden, 3 min per side." },
      {
        text: "Top with marinara and mozzarella, broil 5 min.",
        uses: ["Marinara", "Mozzarella"],
      },
      { text: "Breaded raw cutlets freeze well between parchment." },
    ],
  },
  {
    slug: "weeknight-stir-fry",
    name: "Weeknight Chicken Stir-Fry",
    intro: "Velveted chicken, charred broccoli, glossy sauce. Faster than delivery.",
    course: "Mains",
    primary: "Chicken thigh",
    tags: ["Quick", "Weekday", "Healthy", "High Protein"],
    minutes: 20,
    servings: 2,
    image: "/assets/recipes/weeknight-stir-fry.jpg",
    imageAlt: "Stir-fried rice dish in a dark pan with herbs and lemon wedges",
    ingredients: [
      { item: "Chicken thigh, sliced", grams: 400 },
      { item: "Broccoli", grams: 250 },
      { item: "Soy sauce", grams: 30 },
      { item: "Oyster sauce", grams: 25 },
      { item: "Garlic + ginger", grams: 15 },
      { item: "Cooked rice", grams: 400 },
      { item: "Cornstarch", grams: 8 },
    ],
    steps: [
      {
        text: "Velvet chicken with cornstarch and a spoon of soy.",
        uses: ["Chicken thigh, sliced", "Cornstarch", "Soy sauce"],
      },
      {
        text: "Sear chicken hard, remove. Stir-fry broccoli.",
        uses: ["Broccoli"],
      },
      {
        text: "Return chicken with sauces, toss 1 min.",
        uses: ["Oyster sauce", "Garlic + ginger"],
      },
      { text: "Serve over rice.", uses: ["Cooked rice"] },
    ],
  },
  {
    slug: "slow-beef-ragu",
    name: "Slow Beef Ragu",
    intro: "Three hours in the oven, eight portions out. Better the next day, perfect from the freezer.",
    course: "Mains",
    primary: "Beef chuck",
    tags: ["Guests", "Make Ahead", "Freezer-Friendly", "Comfort Food", "Weekend"],
    minutes: 210,
    servings: 8,
    image: "/assets/recipes/slow-beef-ragu.jpg",
    imageAlt: "Bowl of penne in slow-cooked meat ragu with parmesan and pepper",
    ingredients: [
      { item: "Beef chuck", grams: 1200 },
      { item: "Canned tomatoes", grams: 800 },
      { item: "Onion", grams: 200 },
      { item: "Carrot", grams: 150 },
      { item: "Red wine", grams: 250 },
      { item: "Tomato paste", grams: 60 },
      { item: "Pappardelle, per serving", grams: 90 },
    ],
    steps: [
      { text: "Sear beef in chunks, set aside.", uses: ["Beef chuck"] },
      {
        text: "Soften vegetables, add paste, deglaze with wine.",
        uses: ["Onion", "Carrot", "Tomato paste", "Red wine"],
      },
      {
        text: "Return beef with tomatoes. Oven 160°C, 3 hours.",
        uses: ["Canned tomatoes"],
      },
      { text: "Shred, reduce, season. Better the next day." },
      {
        text: "Boil pappardelle, toss with sauce to serve.",
        uses: ["Pappardelle, per serving"],
      },
      { text: "Freeze in 2-portion bags for 3 months." },
    ],
  },
  {
    slug: "smash-burgers",
    name: "Smash Burgers",
    intro: "Crispy-edged double patties. The reason friends keep coming back.",
    course: "Mains",
    primary: "Ground beef",
    tags: ["Guests", "Weekend", "Comfort Food", "Quick"],
    minutes: 25,
    servings: 4,
    image: "/assets/recipes/smash-burgers.jpg",
    imageAlt: "Double smash burger with cheese, lettuce, pickles, and sauce",
    ingredients: [
      { item: "Ground beef 20%", grams: 800 },
      { item: "Burger buns", grams: 320, note: "4 buns" },
      { item: "American cheese", grams: 80 },
      { item: "Onion, shaved", grams: 100 },
      { item: "Burger sauce", grams: 80 },
      { item: "Pickles", grams: 60 },
    ],
    steps: [
      {
        text: "Roll 100 g beef balls, season outside only.",
        uses: ["Ground beef 20%"],
      },
      { text: "Smash on ripping-hot griddle, 90 sec." },
      {
        text: "Flip, cheese, stack two patties per bun.",
        uses: ["American cheese", "Burger buns"],
      },
      {
        text: "Sauce, pickles, shaved onion. Serve immediately.",
        uses: ["Burger sauce", "Pickles", "Onion, shaved"],
      },
    ],
  },
  {
    slug: "teriyaki-salmon",
    name: "Teriyaki Salmon + Rice",
    intro: "Crispy skin, three-ingredient glaze, twenty minutes total.",
    course: "Mains",
    primary: "Salmon",
    tags: ["Quick", "Healthy", "Weekday", "High Protein"],
    minutes: 20,
    servings: 2,
    image: "/assets/recipes/teriyaki-salmon.jpg",
    imageAlt: "Seared salmon fillet over greens with a dark glaze",
    ingredients: [
      { item: "Salmon fillets", grams: 350 },
      { item: "Soy sauce", grams: 40 },
      { item: "Mirin", grams: 30 },
      { item: "Sugar", grams: 15 },
      { item: "Cooked rice", grams: 400 },
      { item: "Broccolini", grams: 200 },
    ],
    steps: [
      {
        text: "Reduce soy, mirin, sugar to a glaze.",
        uses: ["Soy sauce", "Mirin", "Sugar"],
      },
      {
        text: "Pan-sear salmon skin-side down, 6 min.",
        uses: ["Salmon fillets"],
      },
      { text: "Flip 1 min, glaze off-heat." },
      {
        text: "Serve on rice with steamed broccolini.",
        uses: ["Cooked rice", "Broccolini"],
      },
    ],
  },
  {
    slug: "pulled-pork",
    name: "Overnight Pulled Pork",
    intro: "Eight hours low and slow, then vacuum-sealed portions for months of instant dinners.",
    course: "Mains",
    primary: "Pork shoulder",
    tags: ["Guests", "Make Ahead", "Freezer-Friendly", "Vacuum Seal", "Special Occasion"],
    minutes: 480,
    servings: 10,
    image: "/assets/recipes/pulled-pork.jpg",
    imageAlt: "Barbecue pork on a wooden board with fries, tomatoes, and sauce",
    ingredients: [
      { item: "Pork shoulder", grams: 2500 },
      { item: "Brown sugar rub", grams: 80 },
      { item: "Smoked paprika", grams: 15 },
      { item: "Salt", grams: 30 },
      { item: "Apple cider vinegar", grams: 60 },
      { item: "BBQ sauce", grams: 250 },
    ],
    steps: [
      {
        text: "Rub pork the night before.",
        uses: ["Pork shoulder", "Brown sugar rub", "Smoked paprika", "Salt"],
      },
      { text: "Oven 120°C, 8 hours, until probe-tender." },
      {
        text: "Shred, mix in juices, vinegar, sauce.",
        uses: ["Apple cider vinegar", "BBQ sauce"],
      },
      {
        text: "Vacuum-seal 300 g portions. Reheat in the bag, 15 min simmering water.",
      },
    ],
  },
  {
    slug: "turkey-meatballs",
    name: "Turkey Meatballs",
    intro: "Forty-gram meatballs roasted hot and frozen in sauce. Portion, thaw, dinner.",
    course: "Mains",
    primary: "Ground turkey",
    tags: ["Meal Prep", "Freezer-Friendly", "Vacuum Seal", "High Protein"],
    minutes: 35,
    servings: 6,
    image: "/assets/recipes/turkey-meatballs.jpg",
    imageAlt: "Plate of browned meatballs over arugula with a fork",
    ingredients: [
      { item: "Ground turkey", grams: 900 },
      { item: "Breadcrumbs", grams: 80 },
      { item: "Egg", grams: 50, note: "1 large" },
      { item: "Parmesan", grams: 40 },
      { item: "Marinara", grams: 600 },
      { item: "Garlic", grams: 10 },
    ],
    steps: [
      {
        text: "Mix gently, roll 40 g meatballs.",
        uses: ["Ground turkey", "Breadcrumbs", "Egg", "Parmesan", "Garlic"],
      },
      { text: "Roast at 220°C, 12 min." },
      { text: "Simmer in marinara 10 min.", uses: ["Marinara"] },
      { text: "Freeze in sauce, 4-meatball portions." },
    ],
  },
  {
    slug: "cacio-e-pepe",
    name: "Cacio e Pepe",
    intro: "Four ingredients, fifteen minutes, restaurant pasta. Technique is everything.",
    course: "Mains",
    primary: "Pasta",
    tags: ["Quick", "Comfort Food", "Weekday"],
    minutes: 15,
    servings: 2,
    image: "/assets/recipes/cacio-e-pepe.jpg",
    imageAlt: "Plate of spaghetti tossed with cheese and black pepper",
    ingredients: [
      { item: "Spaghetti", grams: 200 },
      { item: "Pecorino, finely grated", grams: 100 },
      { item: "Black pepper, toasted", grams: 4 },
      { item: "Pasta water", grams: 120 },
    ],
    steps: [
      { text: "Cook pasta in shallow, barely-salted water.", uses: ["Spaghetti"] },
      {
        text: "Make a pecorino paste with cold pasta water.",
        uses: ["Pecorino, finely grated", "Pasta water"],
      },
      {
        text: "Toss pasta off-heat with paste and pepper until glossy.",
        uses: ["Black pepper, toasted"],
      },
    ],
  },
  {
    slug: "skillet-cookie",
    name: "Chocolate Chip Skillet Cookie",
    intro: "Brown butter, one skillet, spoons at the table. Dessert for a crowd with zero plating.",
    course: "Dessert",
    primary: "Chocolate",
    tags: ["Guests", "Comfort Food", "Special Occasion"],
    minutes: 35,
    servings: 6,
    image: "/assets/recipes/skillet-cookie.jpg",
    imageAlt: "Stack of gooey chocolate dessert squares drizzled with melted chocolate",
    ingredients: [
      { item: "Butter, browned", grams: 170 },
      { item: "Brown sugar", grams: 160 },
      { item: "White sugar", grams: 60 },
      { item: "Egg", grams: 50, note: "1 large" },
      { item: "Flour", grams: 220 },
      { item: "Dark chocolate, chopped", grams: 180 },
      { item: "Flaky salt", note: "to finish" },
    ],
    steps: [
      {
        text: "Brown butter, cool 10 min, whisk in sugars and egg.",
        uses: ["Butter, browned", "Brown sugar", "White sugar", "Egg"],
      },
      {
        text: "Fold in flour and chocolate.",
        uses: ["Flour", "Dark chocolate, chopped"],
      },
      { text: "Bake in the skillet at 180°C, 18 min. Center stays gooey." },
      {
        text: "Flaky salt, ice cream on top, spoons at the table.",
        uses: ["Flaky salt"],
      },
    ],
  },
  {
    slug: "banana-bread",
    name: "Banana Bread",
    intro: "The fate of every forgotten banana. Slices freeze and toast straight from frozen.",
    course: "Dessert",
    primary: "Banana",
    tags: ["Make Ahead", "Freezer-Friendly", "Weekend"],
    minutes: 70,
    servings: 8,
    image: "/assets/recipes/banana-bread.jpg",
    imageAlt: "Loaf of banana bread in a parchment-lined tin on a wooden board",
    ingredients: [
      { item: "Very ripe bananas", grams: 300 },
      { item: "Flour", grams: 240 },
      { item: "Butter, melted", grams: 110 },
      { item: "Brown sugar", grams: 150 },
      { item: "Eggs", grams: 100, note: "2 large" },
      { item: "Baking soda", grams: 5 },
      { item: "Walnuts", grams: 80 },
    ],
    steps: [
      {
        text: "Mash bananas, whisk with butter, sugar, eggs.",
        uses: ["Very ripe bananas", "Butter, melted", "Brown sugar", "Eggs"],
      },
      {
        text: "Fold in dry ingredients and walnuts.",
        uses: ["Flour", "Baking soda", "Walnuts"],
      },
      { text: "Bake at 175°C, 55 min." },
      { text: "Slices freeze individually, toast from frozen." },
    ],
  },
  {
    slug: "basque-cheesecake",
    name: "Basque Cheesecake",
    intro: "Burnt on purpose, jiggly in the middle, made the day before. The easiest showstopper.",
    course: "Dessert",
    primary: "Cream cheese",
    tags: ["Special Occasion", "Guests", "Make Ahead"],
    minutes: 60,
    servings: 10,
    image: "/assets/recipes/basque-cheesecake.jpg",
    imageAlt: "Slice of cheesecake with berries on a dark plate",
    ingredients: [
      { item: "Cream cheese", grams: 900 },
      { item: "Sugar", grams: 250 },
      { item: "Eggs", grams: 300, note: "6 large" },
      { item: "Heavy cream", grams: 400 },
      { item: "Flour", grams: 25 },
    ],
    steps: [
      {
        text: "Blend everything until just smooth.",
        uses: ["Cream cheese", "Sugar", "Eggs", "Heavy cream", "Flour"],
      },
      { text: "Pour into a parchment-lined pan, edges rough." },
      { text: "Bake at 230°C, 45 min. Burnt top, jiggly center." },
      { text: "Chill overnight. Make it the day before." },
    ],
  },
  {
    slug: "protein-granola-bars",
    name: "Protein Granola Bars",
    intro: "No-bake bars that beat anything in a wrapper. Twelve snacks from one pan.",
    course: "Snacks",
    primary: "Oats",
    tags: ["Meal Prep", "High Protein", "Make Ahead", "Healthy"],
    minutes: 25,
    servings: 12,
    image: "/assets/recipes/protein-granola-bars.jpg",
    imageAlt: "Stacked chocolate protein bars with cacao nibs",
    ingredients: [
      { item: "Rolled oats", grams: 250 },
      { item: "Peanut butter", grams: 200 },
      { item: "Honey", grams: 120 },
      { item: "Whey protein", grams: 90 },
      { item: "Dark chocolate chips", grams: 80 },
    ],
    steps: [
      {
        text: "Warm peanut butter and honey until pourable.",
        uses: ["Peanut butter", "Honey"],
      },
      {
        text: "Mix everything, press hard into a lined pan.",
        uses: ["Rolled oats", "Whey protein", "Dark chocolate chips"],
      },
      { text: "Chill 2 hours, cut into 12 bars." },
      { text: "Keeps 2 weeks refrigerated." },
    ],
  },
  {
    slug: "hummus",
    name: "Hummus From Scratch",
    intro: "Two full minutes of blending is the whole secret. Silky, not grainy.",
    course: "Snacks",
    primary: "Chickpeas",
    tags: ["Healthy", "Make Ahead", "Guests"],
    minutes: 20,
    servings: 6,
    image: "/assets/recipes/hummus.jpg",
    imageAlt: "Plate of swirled hummus topped with olive oil and chickpeas",
    ingredients: [
      { item: "Cooked chickpeas", grams: 400 },
      { item: "Tahini", grams: 120 },
      { item: "Lemon juice", grams: 45 },
      { item: "Ice water", grams: 60 },
      { item: "Garlic", grams: 5 },
      { item: "Cumin", grams: 2 },
      { item: "Olive oil", note: "to finish" },
    ],
    steps: [
      {
        text: "Blend tahini, lemon, garlic first until whipped.",
        uses: ["Tahini", "Lemon juice", "Garlic"],
      },
      {
        text: "Add chickpeas, cumin, then ice water while blending.",
        uses: ["Cooked chickpeas", "Cumin", "Ice water"],
      },
      { text: "Blend 2 full minutes for smoothness." },
      { text: "Pool of olive oil on top. Keeps 5 days.", uses: ["Olive oil"] },
    ],
  },
]

export function getAllRecipes(): Recipe[] {
  return RECIPES
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return RECIPES.find((r) => r.slug === slug)
}

export function getRelatedRecipes(recipe: Recipe, limit = 3): Recipe[] {
  return RECIPES.filter((r) => r.slug !== recipe.slug)
    .map((r) => {
      let score = 0
      if (r.primary === recipe.primary) score += 3
      if (r.course === recipe.course) score += 1
      score += r.tags.filter((t) => recipe.tags.includes(t)).length
      return { r, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ r }) => r)
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}

export function formatMinutesISO(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `PT${h > 0 ? `${h}H` : ""}${m > 0 ? `${m}M` : ""}`
}
