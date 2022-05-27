<template>
  <div>
    <ShiftCheck ></ShiftCheck>

    <div class="d-flex flex-column pa-4">
      <div class="title mb-2">
        <v-icon>mdi-calendar</v-icon>
        {{ $store.getters["services/user/user"].domainName }} Shift Calendar
      </div>
      <ShiftCalendar></ShiftCalendar>
    </div>
  </div>
</template>

<script>

import ShiftCheck from "~/components/main/shiftCheck";
import ShiftCalendar from "~/components/main/shiftCalendar";
export default {
  name: "Shift",
  components: {ShiftCalendar, ShiftCheck},
  data: () => {
    return {
    }
  },
}

</script>

<style scoped>

</style>
