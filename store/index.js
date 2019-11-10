export const state = () => ({
  fetchedMeals: false
})

export const mutations = {
  setFetchedMeals (state, meals) {
    state.fetchedMeals = meals
  }
}
