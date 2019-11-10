export const state = () => ({
  /**
   * @TODO
   *
   * change the implementation
   * to be an object, ex.:
   *
   * mealsLists: {
   *  2019-11: [...Array(30)]
   * }
   */
  mealsLists: []
})

export const mutations = {
  setMeals (state, {month, meals}) {
    state.mealsLists[month] = meals
  }
}
