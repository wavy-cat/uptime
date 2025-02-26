const pageConfig = {
  // Title for your status page
  title: 'WavyCat\'s Status Page',
  // Links shown at the header of your status page, could set `highlight` to `true`
  links: [
    { link: 'https://github.com/wavy-cat', label: 'GitHub' },
    { link: 'https://wavycat.ru', label: 'Website', highlight: true },
    //{ link: 'https://blog.lyc8503.net/', label: 'Blog' },
    //{ link: 'mailto:me@lyc8503.net', label: 'Email Me', highlight: true },
  ],
}

const workerConfig = {
  // Write KV at most every 6 minutes unless the status changed
  kvWriteCooldownMinutes: 6,
  // Enable HTTP Basic auth for status page & API by uncommenting the line below, format `<USERNAME>:<PASSWORD>`
  // passwordProtection: 'username:password',
  // Define all your monitors here
  monitors: [
    // Example HTTP Monitor
    {
      // `id` should be unique, history will be kept if the `id` remains constant
      id: 'web',
      // `name` is used at status page and callback message
      name: 'Website',
      // `method` should be a valid HTTP Method
      method: 'GET',
      // `target` is a valid URL
      target: 'https://www.wavycat.ru',
      // [OPTIONAL] `tooltip` is ONLY used at status page to show a tooltip
      // tooltip: 'This is a tooltip for this monitor',
      // [OPTIONAL] `statusPageLink` is ONLY used for clickable link at status page
      statusPageLink: 'https://www.wavycat.ru',
      // [OPTIONAL] `expectedCodes` is an array of acceptable HTTP response codes, if not specified, default to 2xx
      expectedCodes: [200],
      // [OPTIONAL] `timeout` in millisecond, if not specified, default to 10000
      timeout: 3000,
      // [OPTIONAL] headers to be sent
      // headers: {
      //   'User-Agent': 'Uptimeflare',
      //   Authorization: 'Bearer YOUR_TOKEN_HERE',
      // },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; wavycatUptimeBot; +https://wavycat.ru)',
      },
      // [OPTIONAL] body to be sent
      // body: 'Hello, world!',
      // [OPTIONAL] if specified, the response must contains the keyword to be considered as operational.
      // responseKeyword: 'weather',
      // [OPTIONAL] if specified, the check will run in your specified region,
      // refer to docs https://github.com/lyc8503/UptimeFlare/wiki/Geo-specific-checks-setup before setting this value
      // checkLocationWorkerRoute: 'https://xxx.example.com',
    },
    {
      id: 'ca-assets',
      name: 'Cat Activity Assets',
      method: 'GET',
      target: 'https://cat-activity.wavycat.ru/',
      tooltip: 'Server with Cat Activity plugin assets',
      statusPageLink: 'https://github.com/wavy-cat/Cat-Activity',
      expectedCodes: [200],
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; wavycatUptimeBot; +https://wavycat.ru)',
      },
    },
    {
      id: 'totemlib-docs',
      name: 'wavy-totem-lib Docs',
      method: 'GET',
      target: 'https://totem-lib.wavycat.ru/overview.html',
      statusPageLink: 'https://totem-lib.wavycat.ru',
      expectedCodes: [200],
      timeout: 3000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; wavycatUptimeBot; +https://wavycat.ru)',
      },
      responseKeyword: 'wavy-totem-lib',
    },
    {
      id: 'codeland',
      name: 'CodeLand',
      method: 'GET',
      target: 'https://code.wavycat.ru/',
      tooltip: 'Private Git hosting',
      expectedCodes: [200],
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; wavycatUptimeBot; +https://wavycat.ru)',
      },
    },
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
  ],
  notification: {
    // [Optional] apprise API server URL
    // if not specified, no notification will be sent
    // appriseApiServer: "https://apprise.example.com/notify",
    // [Optional] recipient URL for apprise, refer to https://github.com/caronc/apprise
    // if not specified, no notification will be sent
    // recipientUrl: "tgram://bottoken/ChatID",
    // [Optional] timezone used in notification messages, default to "Etc/GMT"
    // timeZone: "Asia/Shanghai",
    // [Optional] grace period in minutes before sending a notification
    // notification will be sent only if the monitor is down for N continuous checks after the initial failure
    // if not specified, notification will be sent immediately
    // gracePeriod: 5,
  },
  callbacks: {
    onStatusChange: async (
      env: any,
      monitor: any,
      isUp: boolean,
      timeIncidentStart: number,
      timeNow: number,
      reason: string,
    ) => {
      let text: string

      switch (isUp) {
        case false:
          text = `🔴 <b><a href="${monitor.target}">${monitor.name}</a> is down.</b>\nReason: ${reason}.`
          break
        case true:
          const downtime = formatDurationSimple(timeIncidentStart, timeNow)
          text = `🟢 <b><a href="${monitor.target}">${monitor.name}</a> is up!</b>\nDowntime: ${downtime}.`
          break
      }

      await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: env.CHAT_ID,
            text: text,
            parse_mode: 'HTML',
            link_preview_options: {
              is_disabled: true,
            },
          }),
        },
      )
    },
    onIncident: async (
      env: any,
      monitor: any,
      timeIncidentStart: number,
      timeNow: number,
      reason: string,
    ) => {
      // This callback will be called EVERY 1 MINUTE if there's an ongoing incident for any monitor
      // Write any Typescript code here
    },
  },
}

// Don't forget this, otherwise compilation fails.
export { pageConfig, workerConfig }

function formatDurationSimple(start: number, now: number): string {
  const totalSeconds = now - start

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [
    hours ? `${hours}h` : '',
    minutes ? `${minutes}m` : '',
    seconds ? `${seconds}s` : '',
  ].filter(Boolean).join(' ') || '0s'
}
