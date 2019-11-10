<template>
  <v-app dark>
    <v-app-bar
      fixed
      app
    >
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
      absolute
      app
    >
      <span class="d-flex">
        <v-icon x-small class="mr-1">mdi-copyright</v-icon> 2019 emachado. All rights reserved.
      </span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        }
      ],
      title: 'eALACARTE'
    }
  }
}
</script>

<style lang="scss">
footer {
  font-size: 12px;
}
</style>
