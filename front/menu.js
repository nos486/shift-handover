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
        new Header({text: 'Reporter', value: 'reporterName', isReadOnly: true}),
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
          ],slot:"status"
        }),
        new Header({text: 'Start Time', value: 'startTime', type: Date, defaultAmount: null, slot: "startTime"}),
        new Header({text: 'End Time', value: 'endTime', type: Date, defaultAmount: null, slot: "endTime"}),
        new Header({
          text: 'Outage Start',
          value: 'outageStartTime',
          type: Date, defaultAmount: null,
          slot: "outageStartTime",
          isCreateOnly: true
        }),
        new Header({
          text: 'Outage End',
          value: 'outageEndTime',
          type: Date,
          defaultAmount: null,
          slot: "outageEndTime",
          isCreateOnly: true
        }),
        new Header({text: 'Outage', value: 'outage', slot: "outage", type: "second"}),

        new Header({text: 'Affected', value: 'affectedDomainsNames', slot: "affectedDomainsNames", isReadOnly: true}),
        new Header({
          text: 'AffectedDomains',
          value: 'affectedDomains',
          isCreateOnly: true,
          type: "select",
          defaultAmount: [],
          items: "domain",
          isMultiple: true
        }),
        new Header({text: 'Services', value: 'affectedServicesNames', slot: "affectedServicesNames", isReadOnly: true}),
        new Header({
          text: 'AffectedServices',
          value: 'affectedServices',
          isCreateOnly: true,
          type: "select",
          defaultAmount: [],
          items: "service",
          isMultiple: true
        }),
        new Header({text: 'Domain', value: 'domainName', slot: "domainName", isReadOnly: true}),
        new Header({
          text: 'Domain',
          value: 'domain',
          type: "select",
          items: "domain",
          isCreateOnly: true,
          isUpdateOnly: true
        }),
        new Header({text: 'Created At', value: 'createdAt', type: Date, slot: "createdAt", isHidden: true})
      ]
    }),
    new Menu({
      value: 'changes',
      icon: 'mdi-archive-refresh',
      title: 'Change Requests',
      to: '/changes'
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
            new Header({
              text: 'Manager',
              value: 'manager',
              type: "select",
              items: "user",
              itemKey: "username",
              searchOn: "username",
              isCreateOnly: true,
              isUpdateOnly: true
            }),
            new Header({text: 'Manager', value: 'managerName', isReadOnly: true})
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
              isCreateOnly: true,
              isUpdateOnly: true
            }),
            new Header({text: 'Domain', value: 'domainName', slot: "domainName", isReadOnly: true}),
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
            new Header({text: 'Password', value: 'password', isCreateOnly: true,
              isUpdateOnly: true}),
            new Header({text: 'Gender', value: 'gender',
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
            new Header({text: 'Domain', value: 'domainName', isReadOnly: true}),
            new Header({
              text: 'Domain',
              value: 'domain',
              type: "select",
              items: "domain",
              isCreateOnly: true,
              isUpdateOnly: true
            }),
          ]
        }),
      ]
    }),
  ]
})

