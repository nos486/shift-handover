import {Menu} from "@/js/Menu";
import {Header} from "@/js/Header";

export default new Menu({
  value: "app", title: "APP", items: [
    new Menu({
      value: 'main',
      icon: 'mdi-chart-bubble',
      title: 'Main',
      to: '/main'
    }),
    new Menu({
      value: 'shift',
      icon: 'mdi-apps',
      title: 'Shift',
      to: '/shift',
      editable: false,
      headers: [
        new Header({text: 'ID', value: 'id', isHidden: true}),
        new Header({text: 'Date', value: 'date', type: Date, defaultAmount: null, slot: "date"}),
        new Header({
          text: 'Shift', value: 'isDay', type: "select",
          defaultAmount: true,
          items: [
            {
              name: "Day",
              value: true
            },
            {
              name: "Night",
              value: false
            },
          ], slot: "isDay"
        }),
        new Header({
          text: 'Operator',
          value: 'operator',
          type: "select",
          items: "user",
          itemKey: "username",
          slot : "operator",
          isReadOnly : true
        }),
        new Header({
          text: 'Handover To',
          value: 'handoverTo',
          type: "select",
          items: "user",
          slot : "handoverTo",
          isReadOnly : true
        }),
        new Header({
          text: 'Domain',
          value: 'domain',
          slot : "domain",
          isReadOnly : true
        }),
      ]
    }),
    new Menu({
      value: 'event',
      icon: 'mdi-calendar-text',
      title: 'Special Events',
      to: '/events',
      headers: [
        new Header({text: 'ID', value: 'id', isHidden: true}),
        new Header({text: 'Title', sortable: false, value: 'title', isFilterable: true, slot: "title"}),
        new Header({text: 'RCA', value: 'rca', type: 'textarea'}),
        new Header({
          text: 'Severity',
          value: 'severity',
          type: "select",
          defaultAmount: "none",
          items: [
            {
              name: "CRITICAL",
              value: "critical"
            },
            {
              name: "MAJOR",
              value: "major"
            },
            {
              name: "MINER",
              value: "miner"
            },
            {
              name: "NONE",
              value: "none"
            }
          ],
          isCreateOnly: true
        }),
        new Header({text: 'Reporter', value: 'reporter', isReadOnly: true,slot:"reporter"}),
        new Header({text: 'Reporter Domain', value: 'reporterDomain', isReadOnly: true, slot:"reporterDomain"}),
        new Header({
          text: 'Status',
          value: 'status',
          type: "select",
          defaultAmount: "close",
          items: [
            {
              name: "CLOSE",
              value: "close"
            },
            {
              name: "OPEN",
              value: "open"
            }
          ], slot: "status"
        }),
        new Header({text: 'Start Time', value: 'startTime', type: "DateTime", defaultAmount: null, slot: "startTime"}),
        new Header({text: 'End Time', value: 'endTime', type: "DateTime", defaultAmount: null, slot: "endTime"}),
        new Header({
          text: 'Outage Start',
          value: 'outageStartTime',
          type: "DateTime", defaultAmount: null,
          slot: "outageStartTime",
          isCreateOnly: true
        }),
        new Header({
          text: 'Outage End',
          value: 'outageEndTime',
          type: "DateTime",
          defaultAmount: null,
          slot: "outageEndTime",
          isCreateOnly: true
        }),
        new Header({text: 'Outage', value: 'outage', slot: "outage",isReadOnly:true, type: "second"}),

        // new Header({
        //   text: 'AffectedDomains',
        //   value: 'affectedDomains',
        //   type: "select",
        //   defaultAmount: [],
        //   items: "domain",
        //   isMultiple: true
        // }),
        new Header({
          text: 'AffectedServices',
          value: 'affectedServices',
          type: "select",
          defaultAmount: [],
          items: "service",
          isMultiple: true,
          slot: "affectedServices"
        }),
        new Header({
          text: 'Domain',
          value: 'domain',
          type: "select",
          items: "domain",
          slot : "domain",
          IOKey : "id",
        }),
        new Header({text: 'Created At', value: 'createdAt', type: "DateTime", slot: "createdAt", isHidden: true})
      ]
    }),
    new Menu({
      value: 'cr',
      icon: 'mdi-archive-refresh',
      title: 'Change Requests',
      to: '/cr',
      group : ["CBS"],
      headers: [
        new Header({text: 'ID', value: 'id', isHidden: true}),
        new Header({text: 'Order ID', value: 'orderId'}),
        new Header({text: 'Title', value: 'title'}),
        new Header({
          text: 'Domain',
          value: 'domain',
          type: "select",
          items: "domain",
          slot : "domain",
          IOKey : "id",
        }),
        new Header({text: 'Start Time', value: 'startTime', type: "DateTime", defaultAmount: null, slot: "startTime"}),
        new Header({text: 'End Time', value: 'endTime', type: "DateTime", defaultAmount: null, slot: "endTime"}),
        new Header({
          text: 'Outage Start',
          value: 'outageStartTime',
          type: "DateTime", defaultAmount: null,
          slot: "outageStartTime",
          isCreateOnly: true
        }),
        new Header({
          text: 'Outage End',
          value: 'outageEndTime',
          type: "DateTime",
          defaultAmount: null,
          slot: "outageEndTime",
          isCreateOnly: true
        }),
        new Header({text: 'Outage', value: 'outage', slot: "outage",isReadOnly:true}),
        new Header({text: 'Reporter', value: 'reporter', isReadOnly: true,slot:"reporter"}),
        new Header({
          text: 'Status',
          value: 'status',
          type: "select",
          defaultAmount: "ongoing",
          items: [
            {
              name: "ONGOING",
              value: "ongoing"
            },
            {
              name: "COMPLETE",
              value: "complete"
            },
            {
              name: "OPEN",
              value: "open"
            },
            {
              name: "CANCEL",
              value: "cancel"
            }
          ], slot: "status"
        }),
      ]
    }),
    new Menu({
      value: 'settings',
      icon: 'mdi-cog',
      title: 'Settings',
      to: '/settings',
      items: [
        new Menu({
          value: 'domain',
          icon: 'mdi-domain',
          title: 'Domains',
          to: '/domain',
          headers: [
            new Header({text: 'ID', value: 'id', isHidden: true}),
            new Header({text: 'Name', value: 'name', isFilterable: true}),
          ]
        }),
        new Menu({
          value: 'service',
          icon: 'mdi-apps',
          title: 'Services',
          to: '/service',
          headers: [
            new Header({text: 'ID', value: 'id', isHidden: true}),
            new Header({text: 'Name', value: 'name', isFilterable: true}),
            new Header({
              text: 'Domain',
              value: 'domain',
              type: "select",
              items: "domain",
              slot : "domain"
            }),
          ]
        }),
        new Menu({
          value: 'user',
          icon: 'mdi-account',
          title: 'Users',
          to: '/user',
          headers: [
            new Header({text: 'ID', value: 'id', isHidden: true}),
            new Header({text: 'UserName', value: 'username'}),
            new Header({text: 'Email', value: 'email'}),
            new Header({
              text: 'Password', value: 'password', isCreateOnly: true,
              isUpdateOnly: true
            }),
            new Header({
              text: 'Gender', value: 'gender',
              type: "select",
              defaultAmount: "none",
              items: [
                {
                  name: "NONE",
                  value: "none"
                },
                {
                  name: "MALE",
                  value: "male"
                },
                {
                  name: "FEMALE",
                  value: "female"
                }
              ]
            }),
            new Header({text: 'FirstName', value: 'firstName'}),
            new Header({text: 'LastName', value: 'lastName'}),
            new Header({text: 'Number', value: 'phoneNumber'}),
            new Header({
              text: 'Role',
              value: 'role',
              type: "select",
              defaultAmount: "user",
              items: [
                {
                  name: "USER",
                  value: "user"
                },
                {
                  name: "ADMIN",
                  value: "admin"
                }
              ]
            }),
            new Header({
              text: 'Domain',
              value: 'domain',
              type: "select",
              items: "domain",
              slot : "domain"
            }),
          ]
        }),
      ]
    }),
    new Menu({
      value: 'tools',
      icon: 'mdi-cogs',
      title: 'Tools',
      to: '/tools',
      items: [
        new Menu({
          value: 'csvAlarmParser',
          icon: 'mdi-file-chart',
          title: 'Alarm Parser',
          to: '/csvAlarmParser'
        }),
        new Menu({
          value: 'cabParser',
          icon: 'mdi-file-excel',
          title: 'CAB Parser',
          to: '/cabParser'
        })
      ]
    })
  ]
})

