<template>
  <div>
    <img v-lazy="url+'&imgalias/phoenix'"/>
  </div>
</template>
<script>
export default {
  props: [
    'url'
  ],
  data () {
    return {
    }
  },
  activated () {
  },
  methods: {
  }
}
</script>