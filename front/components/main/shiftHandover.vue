<template>
  <Form title="Shift Handover" icon="mdi-calendar" elevation="0"
        outlined :loading="loading">


    <div v-if="shift !== null" class="d-flex flex-column">
      <div class="mb-4">
        <v-banner v-if="! shift.isEnd && shift.operator.id !== $store.getters['services/user/user'].id" color="red"
                  icon="mdi-account-multiple-check" dark rounded single-line>
          The last shift ({{ (shift.isDay) ? 'day' : 'night' }} shift on
          {{ new Date(shift.date).toLocaleDateString() }}) is not ended yet. The current shift operator is
          {{ shift.operator.username }}.
        </v-banner>

        <v-banner
          v-if="shift.isEnd && shift.handoverTo.id !== $store.getters['services/user/user'].id && shift.operator.id !== $store.getters['services/user/user'].id"
          color="orange" icon="mdi-account-multiple-check" dark rounded single-line>
          The shift is ended, but it's not handover to you. {{ shift.operator.username }} handed the shift to
          {{ shift.handoverTo.username }}.
        </v-banner>

        <v-banner
          v-if="shift.isEnd && shift.operator.id === $store.getters['services/user/user'].id"
          color="green" icon="mdi-account-multiple-check" dark rounded single-line>
          This shift is ended.
        </v-banner>
      </div>

      <div class="d-flex align-center justify-space-between">
        <Chip icon="mdi-clipboard-text-clock" title="Date" color="blue">

            <div>
              {{new Date(shift.date).toLocaleDateString()}}
            </div>
            <div class="d-flex align-center">
              <v-icon small left>{{shift.isDay ? 'mdi-sun' : "mdi-weather-night"}}</v-icon>
              <div>{{ shift.isDay ? 'Day' : "Night" }}</div>
            </div>


        </Chip>
        <Chip icon="mdi-account" title="Operator" color="orange">
          <div class="text-uppercase">
            {{ shift.operator.username }}<br>{{ shift.operator.email }}
          </div>
        </Chip>
        <Chip v-if="shift.handoverTo" icon="mdi-account-switch-outline" title="Handover To" color="lime">
          {{ shift.handoverTo.username }}<br>{{ shift.handoverTo.email }}
        </Chip>
        <Chip icon="mdi-account-group" title="Team" :text="shift.domain.name" color="green"></Chip>
        <Chip v-if="shift.alarms !== undefined" icon="mdi-alert-circle" title="Alarms" color="red">
          <div>
            <v-chip v-if="shift.alarms.critical !== undefined" color="red" dark small title="critical">
              C&ensp;{{ shift.alarms.critical }}
            </v-chip>
            <v-chip class="ml-1" v-if="shift.alarms.major !== undefined" color="orange" dark small title="major">
              J&ensp;{{ shift.alarms.major }}
            </v-chip>
            <v-chip class="ml-1" v-if="shift.alarms.miner !== undefined" color="amber" dark small title="miner">
              M&ensp;{{ shift.alarms.miner }}
            </v-chip>
            <v-chip class="ml-1" v-if="shift.alarms.warning !== undefined" color="blue" dark small title="warning">
              W&ensp;{{ shift.alarms.warning }}
            </v-chip>
          </div>
        </Chip>

        <div>
          <ModalForm v-if="shift.operator.id === $store.getters['services/user/user'].id" ref="handOverModal"
                     v-model="handoverForm" :items="handoverHeader" title="Handover"
                     :icon="shift.isEnd ? 'mdi-check' : 'mdi-account-switch-outline'" :small-btn="false" save-text="Set"
                     @show="beforeOpenHandoverModel" @save="updateShift" :loading="loading">
            <template slot="button">
              <v-btn fab :color="$store.getters['app/baseColor']" dark elevation="0" title="Handover">
                <v-icon>mdi-account-switch-outline</v-icon>
              </v-btn>
            </template>
          </ModalForm>


          <v-btn v-if="shift.isEnd && shift.handoverTo.id === $store.getters['services/user/user'].id" fab color="green" dark elevation="0" title="Check" @click="acceptShift">
            <v-icon>mdi-account-multiple-check</v-icon>
          </v-btn>

        </div>
      </div>


    </div>
  </Form>

</template>
<script>
import {Header} from "@/js/Header";

export default {
  name: "shiftHandover",
  props: {
    width: {
      default: "100%"
    }
  },
  data: function () {
    return {
      loading: false,
      shift: null,
      handoverHeader: [
        new Header({
          text: 'User',
          value: 'user',
          type: "select",
          items: "user",
          itemKey: "username",
        }),
        new Header({
          text: 'Critical Alarm',
          value: 'critical',
          type: Number
        }),
        new Header({
          text: 'Major Alarm',
          value: 'major',
          type: Number
        }),
        new Header({
          text: 'Miner Alarm',
          value: 'miner',
          type: Number
        }),
        new Header({
          text: 'Warning Alarm',
          value: 'warning',
          type: Number
        }),
        new Header({
          text: 'Shift Is End',
          value: 'isEnd',
          type: Boolean
        })
      ],
      handoverForm: {}
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getShift()
  },
  methods: {
    getShift() {
      this.loading = true
      this.$store.dispatch("services/global/get", {
        pathName: "shift/last",
        header: {}
      }).then((res) => {
        this.shift = res
        this.handoverHeader[0].defaultQuery = {"domain": this.shift.domain.id}
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    beforeOpenHandoverModel() {
      this.handoverForm = {
        user: (this.shift.handoverTo !== undefined) ? this.shift.handoverTo.id : null,
        critical: this.shift.alarms.critical,
        major: this.shift.alarms.major,
        miner: this.shift.alarms.miner,
        warning: this.shift.alarms.warning,
        isEnd: this.shift.isEnd
      }
    },
    updateShift() {
      let data = {
        _id: this.shift.id,
        alarms: {
          critical: this.handoverForm.critical,
          major: this.handoverForm.major,
          miner: this.handoverForm.miner,
          warning: this.handoverForm.warning
        },
        isEnd: this.handoverForm.isEnd
      }

      if (this.handoverForm.user !== null) data["handoverTo"] = this.handoverForm.user

      this.loading = true
      // this.beforeAddToServer(this.editData)
      this.$store.dispatch("services/global/put", {
        pathName: "shift",
        ...data
      }).then((res) => {
        this.loading = false
        this.$store.commit("alert/success", "Shift update.")
        this.$refs.handOverModal.close()
        this.getShift()
      }).catch(() => {
        this.loading = false
      })
    },
    acceptShift(){
      this.loading = true
      this.$store.dispatch("services/global/post", {
        pathName: "shift/accept",
        _id : this.shift.id
      }).then((res) => {
        this.loading = false
        this.getShift()
        console.log(res)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
