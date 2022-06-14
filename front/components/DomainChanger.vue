<template>
  <ItemSelector v-if="$store.getters['services/user/user'].username !== undefined" v-model="domain" title="Domain" items="domain" :refresh-btn="false" small></ItemSelector>
</template>

<script>
import user from "~/pages/settings/user";

export default {
  name: "DomainChanger",
  props: {},
  data: () => {
    return {
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
      handler : function (domain) {
        this.$store.commit("services/user/setDomain",domain)
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
