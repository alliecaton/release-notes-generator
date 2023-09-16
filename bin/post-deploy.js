import fetch from 'node-fetch'

const generateBullets = (array) => {
  return array.map((line) => {
    return {
      type: 'rich_text_list',
      elements: [
        {
          type: 'rich_text_section',
          elements: [
            {
              type: 'text',
              text: line.replace('- ', ''),
              style: {
                bold: true,
              },
            },
          ],
        },
      ],
      style: 'bullet',
      indent: 0,
    }
  })
}

export default async function postDeploy(data) {
  const { repo, tagName, releaseTitle, fileBody } = data

  const formattedBody = fileBody.replace(/<!--[\s\S]*?-->/g, '')
  const contentArray = formattedBody.split('\n').filter((line) => line !== '')

  let blocksFormatted = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${tagName} - ${repo.displayTitle}* - ${releaseTitle}\n`,
      },
    },
  ]

  const updatesIndex = contentArray.indexOf('**Updates/Additions**')
  const technicalIndex = contentArray.indexOf('**Technical**')

  const updatesSection = contentArray.slice(
    updatesIndex + 1,
    technicalIndex || contentArray.length
  )
  const technicalSection = contentArray.slice(
    technicalIndex + 1,
    contentArray.length
  )

  let technicalBullets = null
  let updatesBullets = null

  if (updatesSection.length) {
    updatesBullets = generateBullets(updatesSection)

    blocksFormatted.push(
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Updates/Additions\n`,
        },
      },
      {
        type: 'rich_text',
        block_id: 'erY',
        elements: updatesBullets,
      }
    )
  }

  if (technicalSection?.length) {
    technicalBullets = generateBullets(technicalSection)

    blocksFormatted.push(
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Technical\n`,
        },
      },
      {
        type: 'rich_text',
        block_id: 'erYs',
        elements: technicalBullets,
      }
    )
  }

  // Post to engi-releases
  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.SLACK_TOKEN,
    },
    body: JSON.stringify({
      channel: 'D02AK9DDY4E', // process.env.SLACK_RELEASES_CHANNEL,
      blocks: blocksFormatted,
    }),
  })

  const today = new Date()
  let mm = today.getMonth() + 1
  let dd = today.getDate()

  if (dd < 10) dd = '0' + dd
  if (mm < 10) mm = '0' + mm

  const formattedToday = mm + '/' + dd + '/' + today.getFullYear()

  // Post to engi-deployments
  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.SLACK_TOKEN,
    },
    body: JSON.stringify({
      channel: 'D02AK9DDY4E', // process.env.SLACK_DEPLOYMENTS_CHANNEL,
      blocks: [
        { type: 'section', text: { type: 'plain_text', text: formattedToday } },
        {
          type: 'rich_text',
          block_id: 'erY',
          elements: [
            {
              type: 'rich_text_list',
              elements: [
                {
                  type: 'rich_text_section',
                  elements: [
                    {
                      type: 'text',
                      text: `${repo.displayTitle} - `,
                      style: {
                        bold: true,
                      },
                    },
                    {
                      type: 'text',
                      text: `${releaseTitle}`,
                    },
                  ],
                },
              ],
              style: 'bullet',
              indent: 0,
            },
          ],
        },
      ],
    }),
  })
}
