<template>
  <div class="pa-2">
    <Form title="Shift Calendar" icon="mdi-calendar" elevation="0" outlined>
      <ShiftCalendar :all-domains="true"></ShiftCalendar>
    </Form>
    <Form class="mt-4" title="Shift Calendar" icon="mdi-calendar" elevation="0" outlined>

    </Form>
  </div>

</template>

<script>
import ShiftCheck from "~/components/main/shiftCheck";
import ShiftCalendar from "~/components/main/shiftCalendar";
export default {
  name: 'Main',
  components: {ShiftCalendar, ShiftCheck},
  mounted() {

  }
}
</script>
