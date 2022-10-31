<template>
  <ItemSelector v-if="$store.getters['services/user/user'].username !== undefined" v-model="domain" title="Domain" items="domain" :refresh-btn="false" small ></ItemSelector>
</template>

<script>

export default {
  name: "DomainSelector",
  props: {},
  data: () => {
    return {
      value : "",
      domain: "",
    }
  },
  computed: {
    userDomain: function () {
      return (this.$store.getters["services/user/user"].domain !== undefined) ? this.$store.getters["services/user/user"].domain.id : ""
    }
  },
  watch: {
    userDomain: {
      handler : function (value) {
        if (value !== null) {
          this.domain = value
        }
      },
      immediate : true
    },
    domain : {
      handler : function () {
        this.$emit('input', this.domain)
      },
    }
  },
  mounted() {

  },
  methods: {}
}
</script>

<style scoped>
</style>
