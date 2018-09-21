<template>
  <div class="footer">
   <p>{{time}} © vue by monkey</p>
  </div>
</template>
<script>
export default {
  name: 'vfooter',
  data () {
    return {
    }
  },
  computed: {
    time: function () {
      return new Date().getFullYear()
    }
  },
  methods: {
  }
}
</script>

<style lang="stylus" scoped>
.footer
  line-height 40px
  text-align center
</style>
