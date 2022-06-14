<template>
  <div class="pa-2">
    <ShiftHandover></ShiftHandover>
    <Form class="mt-4" title="CR Table" icon="mdi-calendar" elevation="0" fill outlined>
      <CRTable all-domains :query="{startTime:new Date().toISOString()}" :read-only="true"></CRTable>
    </Form>
<!--    <Form class="mt-4" title="Shift Calendar" icon="mdi-calendar" elevation="0" fill>-->
<!--      <ShiftCalendar :all-domains="true" width="99.9%"></ShiftCalendar>-->
<!--    </Form>-->

  </div>

</template>

<script>
import ShiftCheck from "~/components/main/shiftCheck";
import ShiftCalendar from "~/components/main/shiftCalendar";
import CRTable from "~/components/main/crTable";
import ShiftHandover from "@/components/main/shiftHandover";
export default {
  name: 'Main',
  components: {ShiftHandover, CRTable, ShiftCalendar, ShiftCheck},
  mounted() {

  }
}
</script>
