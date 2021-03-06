<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-container>
      <h1 class="title text-center">Monthly Lunches</h1>
      <v-row>
        <v-col cols="12" sm="6" class="my-2">
          <v-date-picker
            ref="picker"
            v-model="date"
            :picker-date.sync="pickerDate"
            full-width
          ></v-date-picker>
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <div
            v-if="!monthGenerated"
            class="d-flex flex-column align-center"
          >
            <p>No meals yet this month</p>
            <v-btn
              color="primary"
              class="mt-3"
              :loading="generating"
              @click.end="generateMealsList"
            >
              Generate monthly meals
            </v-btn>
          </div>
          <div class="d-flex flex-column lunch" v-else-if="lunch && lunch.main && lunch.side && lunch.dessert">
            <v-btn
              color="primary"
              class="mt-3"
              :loading="generating"
              @click.end="generateMealsList"
            >
              Regenerate monthly meals
            </v-btn>
            <v-row>
              <v-col
                cols="9"
                class="d-flex flex-column justify-space-between"
              >
                <p class="title">Main</p>
                <p>{{ lunch.main.strMeal }}</p>
              </v-col>
              <v-col>
                <img
                  :src="lunch.main.strMealThumb"
                  :alt="lunch.main.strMeal"
                >
              </v-col>
            </v-row>
            <hr>
            <v-row>
              <v-col
                cols="9"
                class="d-flex flex-column justify-space-between"
              >
                <p class="title">Side</p>
                <p>{{ lunch.side.strMeal }}</p>
              </v-col>
              <v-col>
                <img
                  :src="lunch.side.strMealThumb"
                  :alt="lunch.side.strMeal"
                >
              </v-col>
            </v-row>
            <hr>
            <v-row>
              <v-col
                cols="9"
                class="d-flex flex-column justify-space-between"
              >
                <p class="title">Dessert</p>
                <p>{{ lunch.dessert.strMeal }}</p>
              </v-col>
              <v-col>
                <img
                  :src="lunch.dessert.strMealThumb"
                  :alt="lunch.dessert.strMeal"
                >
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    pickerDate: null,
    daysInMonth: 0,
    generating: false
  }),
  computed: {
    mealsLists () {
      return this.$store.state.localStorage.mealsLists
    },
    lunch () {
      return this.mealsLists[this.pickerDate][new Date(this.date).getDate() - 1]
    },
    monthGenerated () {
      return !!this.mealsLists[this.pickerDate]
    }
  },
  watch: {
    pickerDate (val) {
      this.date = `${this.pickerDate}-${new Date(this.date).getDate()}`

      const dateArray = val.split('-')
      this.daysInMonth = new Date(dateArray[0], dateArray[1], 0).getDate()

    },
  },
  methods: {
    async generateMealsList () {
      this.generating = true

      const month = this.pickerDate
      const allMeals = this.$store.state.fetchedMeals ? this.$store.state.fetchedMeals : await this.getMeals()
      const daysInMonth = this.daysInMonth

      // Generates a random unique meal
      const generateMeal = () => {
        const meal = {
          main: allMeals.mains[Math.floor(Math.random() * allMeals.mains.length)],
          side: allMeals.sides[Math.floor(Math.random() * allMeals.sides.length)],
          dessert: allMeals.desserts[Math.floor(Math.random() * allMeals.desserts.length)]
        }

        if (this.mealsLists[month]) {
          // Check if the meal has already
          // been chosen for some other day
          for (const savedMeal of this.mealsLists[month]) {
            // If it has
            if (savedMeal.main === meal.main && savedMeal.side === meal.side && savedMeal.dessert === meal.dessert) {
              // Generate a new meal
              generateMeal()
            }
          }
        }

        return meal
      }

      const meals = []
      for (let index = 0; index < daysInMonth; index++) {
        meals.push(generateMeal())
      }

      this.$store.commit('localStorage/setMeals', { month, meals })

      this.generating = false
    },
    async getMeals () {
      // Get main dishes
      const mains = []
      const mainCategories = [
        'Beef',
        'Chicken',
        'Lamb',
        'Pasta',
        'Pork',
        'Seafood',
        'Vegan',
        'Vegetarian',
        'Goat'
      ]

      for (const category of mainCategories) {
        const response = await this.$axios.$get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)

        for (const meal of response.meals) {
          mains.push(meal)
        }
      }

      // Get Sides
      let response = await this.$axios.$get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=Side`)
      const sides = response.meals

      // Get Desserts
      response = await this.$axios.$get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert`)
      const desserts = response.meals

      this.$store.commit('setFetchedMeals', { mains, sides, desserts })

      return { mains, sides, desserts }
    }
  }
}
</script>

<style lang="scss">
.lunch {
  img {
    max-width: 100%;
    border-radius: 4px;
  }
}
</style>
