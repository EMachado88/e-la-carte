export const state = () => ({
  mealsLists: {}
})

export const mutations = {
  setMeals (state, { month, meals }) {
    state.mealsLists = {
      ...state.mealsLists,
      [month]: meals
    }
  }
}
