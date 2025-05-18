import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

const pageConfig: PageConfig = {
  // Title for your status page
  title: "WavyCat's Status Page",
  // Links shown at the header of your status page, could set `highlight` to `true`
  links: [
    { link: 'https://github.com/wavy-cat', label: 'GitHub' },
    { link: 'https://wavycat.ru', label: 'Website', highlight: true },
  ],
  // [OPTIONAL] Group your monitors
  // If not specified, all monitors will be shown in a single list
  // If specified, monitors will be grouped and ordered, not-listed monitors will be invisble (but still monitored)
  // group: {
  //   '🌐 Public (example group name)': ['foo_monitor', 'bar_monitor', 'more monitor ids...'],
  //   '🔐 Private': ['test_tcp_monitor'],
  // },
}

const userAgent = 'Mozilla/5.0 (compatible; wavycatUptimeBot; +https://uptime.wavycat.ru)'

const workerConfig: WorkerConfig = {
  // Write KV at most every 6 minutes unless the status changed
  kvWriteCooldownMinutes: 6,
  // Enable HTTP Basic auth for status page & API by uncommenting the line below, format `<USERNAME>:<PASSWORD>`
  // passwordProtection: 'username:password',
  // Define all your monitors here
  monitors: [
    // Example HTTP Monitor
    // {
    //   // `id` should be unique, history will be kept if the `id` remains constant
    //   id: 'foo_monitor',
    //   // `name` is used at status page and callback message
    //   name: 'My API Monitor',
    //   // `method` should be a valid HTTP Method
    //   method: 'POST',
    //   // `target` is a valid URL
    //   target: 'https://example.com',
    //   // [OPTIONAL] `tooltip` is ONLY used at status page to show a tooltip
    //   tooltip: 'This is a tooltip for this monitor',
    //   // [OPTIONAL] `statusPageLink` is ONLY used for clickable link at status page
    //   statusPageLink: 'https://example.com',
    //   // [OPTIONAL] `hideLatencyChart` will hide status page latency chart if set to true
    //   hideLatencyChart: false,
    //   // [OPTIONAL] `expectedCodes` is an array of acceptable HTTP response codes, if not specified, default to 2xx
    //   expectedCodes: [200],
    //   // [OPTIONAL] `timeout` in millisecond, if not specified, default to 10000
    //   timeout: 10000,
    //   // [OPTIONAL] headers to be sent
    //   headers: {
    //     'User-Agent': 'Uptimeflare',
    //     Authorization: 'Bearer YOUR_TOKEN_HERE',
    //   },
    //   // [OPTIONAL] body to be sent
    //   body: 'Hello, world!',
    //   // [OPTIONAL] if specified, the response must contains the keyword to be considered as operational.
    //   responseKeyword: 'success',
    //   // [OPTIONAL] if specified, the response must NOT contains the keyword to be considered as operational.
    //   responseForbiddenKeyword: 'bad gateway',
    //   // [OPTIONAL] if specified, will call the check proxy to check the monitor, mainly for geo-specific checks
    //   // refer to docs https://github.com/lyc8503/UptimeFlare/wiki/Check-proxy-setup before setting this value
    //   // currently supports `worker://` and `http(s)://` proxies
    //   checkProxy: 'https://xxx.example.com OR worker://weur',
    //   // [OPTIONAL] if true, the check will fallback to local if the specified proxy is down
    //   checkProxyFallback: true,
    // },
    // Example TCP Monitor
    // {
    //   id: 'test_tcp_monitor',
    //   name: 'Example TCP Monitor',
    //   // `method` should be `TCP_PING` for tcp monitors
    //   method: 'TCP_PING',
    //   // `target` should be `host:port` for tcp monitors
    //   target: '1.2.3.4:22',
    //   tooltip: 'My production server SSH',
    //   statusPageLink: 'https://example.com',
    //   timeout: 5000,
    // },
    {
      id: 'web',
      name: 'Website',
      method: 'GET',
      target: 'https://www.wavycat.ru',
      statusPageLink: 'https://www.wavycat.ru',
      expectedCodes: [200],
      timeout: 3000,
      headers: {
        'User-Agent': userAgent,
      },
    },
    {
      id: 'totemlib-docs',
      name: 'TotemLib Documentation',
      method: 'GET',
      target: 'https://totem-lib.wavycat.ru/overview.html',
      statusPageLink: 'https://totem-lib.wavycat.ru',
      expectedCodes: [200],
      timeout: 3000,
      headers: {
        'User-Agent': userAgent,
      },
      responseKeyword: 'wavy-totem-lib',
    },
    {
      id: 'ca-assets',
      name: 'Cat Activity Assets',
      method: 'GET',
      target: 'https://cat-activity.wavycat.ru/Latte/go.png',
      tooltip: 'Server with Cat Activity plugin assets',
      statusPageLink: 'https://github.com/wavy-cat/Cat-Activity',
      expectedCodes: [200],
      timeout: 10000,
      headers: {
        'User-Agent': userAgent,
      },
      checkProxy: 'worker://enam',
    },
    {
      id: 'petpet',
      name: 'PetPet',
      method: 'GET',
      target: 'https://pet.wavycat.ru/ping',
      statusPageLink: 'https://pet.wavycat.ru/',
      expectedCodes: [200],
      timeout: 5000,
      headers: {
        'User-Agent': userAgent,
      },
      checkProxy: 'worker://weur',
    },
    {
      id: 'codeland',
      name: 'CodeLand',
      method: 'GET',
      target: 'https://code.wavycat.ru/',
      tooltip: 'Private Forgejo instance',
      expectedCodes: [200],
      timeout: 10000,
      headers: {
        'User-Agent': userAgent,
      },
      hideLatencyChart: true,
    },
  ],
  notification: {
    // // [Optional] apprise API server URL
    // // if not specified, no notification will be sent
    // appriseApiServer: 'https://apprise.example.com/notify',
    // // [Optional] recipient URL for apprise, refer to https://github.com/caronc/apprise
    // // if not specified, no notification will be sent
    // recipientUrl: 'tgram://bottoken/ChatID',
    // // [Optional] timezone used in notification messages, default to "Etc/GMT"
    // timeZone: 'Asia/Shanghai',
    // // [Optional] grace period in minutes before sending a notification
    // // notification will be sent only if the monitor is down for N continuous checks after the initial failure
    // // if not specified, notification will be sent immediately
    // gracePeriod: 5,
    // // [Optional] disable notification for monitors with specified ids
    // skipNotificationIds: ['foo_monitor', 'bar_monitor'],
  },
  callbacks: {
    onStatusChange: async (
      env: any,
      monitor: any,
      isUp: boolean,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      let embed

      switch (isUp) {
        case false:
          embed = {
            title: `${monitor.name} is down!`,
            color: 15158332,
            fields: [
              {
                name: 'Reason',
                value: reason,
                inline: true,
              },
            ],
          }
          break
        case true:
          embed = {
            title: `${monitor.name} is up!`,
            color: 3066993,
            fields: [
              {
                name: 'Downtime',
                value: formatDurationSimple(timeIncidentStart, timeNow),
                inline: true,
              },
            ],
          }
          break
      }

      embed.fields.push({
        name: 'Location',
        value: monitor.checkProxy ? monitor.checkProxy.replace("worker://", "") : await getColo(),
        inline: true,
      })

      await fetch(env.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': userAgent,
        },
        body: JSON.stringify({ embeds: [embed] }),
      })
    },
    onIncident: async (
      env: any,
      monitor: any,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // This callback will be called EVERY 1 MINUTE if there's an ongoing incident for any monitor
      // Write any Typescript code here
    },
  },
}

// You can define multiple maintenances here
// During maintenance, an alert will be shown at status page
// Also, related downtime notifications will be skipped (if any)
// Of course, you can leave it empty if you don't need this feature
// const maintenances: MaintenanceConfig[] = []
const maintenances: MaintenanceConfig[] = [
  // {
  //   // [Optional] Monitor IDs to be affected by this maintenance
  //   monitors: ['foo_monitor', 'bar_monitor'],
  //   // [Optional] default to "Scheduled Maintenance" if not specified
  //   title: 'Test Maintenance',
  //   // Description of the maintenance, will be shown at status page
  //   body: 'This is a test maintenance, server software upgrade',
  //   // Start time of the maintenance, in UNIX timestamp or ISO 8601 format
  //   start: '2025-04-27T00:00:00+08:00',
  //   // [Optional] end time of the maintenance, in UNIX timestamp or ISO 8601 format
  //   // if not specified, the maintenance will be considered as on-going
  //   end: '2025-04-30T00:00:00+08:00',
  //   // [Optional] color of the maintenance alert at status page, default to "yellow"
  //   color: 'blue',
  // },
]

// Don't forget this, otherwise compilation fails.
export { pageConfig, workerConfig, maintenances }

function formatDurationSimple(start: number, now: number): string {
  const totalSeconds = now - start

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return (
    [hours ? `${hours}h` : '', minutes ? `${minutes}m` : '', seconds ? `${seconds}s` : '']
      .filter(Boolean)
      .join(' ') || '0s'
  )
}

async function getColo(): Promise<string> {
  try {
    const response = await fetch('https://www.wavycat.ru/cdn-cgi/trace');
    if (!response.ok) return `Error: ${response.statusText}`
    const text = await response.text();

    // Ищем строку, начинающуюся с "colo="
    const coloMatch = text.split('\n')
      .find(line => line.startsWith('colo='));

    if (!coloMatch) return "Error: colo not found";

    // Возвращаем значение после "colo="
    return coloMatch.substring(5);
  } catch (error) {
    console.error('Error while retrieving colocation data:', error);
    return "Error";
  }
}
