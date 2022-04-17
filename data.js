$(document).ready(async () => {
  // logic
  const res1 = await $.get(
    'https://api.thingspeak.com/channels/1657193/fields/1.json',
  )

  const res2 = await $.get(
    'https://api.thingspeak.com/channels/1657193/fields/2.json',
  )

  const res3 = await $.get(
    'https://api.thingspeak.com/channels/1657193/fields/3.json',
  )

  const res4 = await $.get(
    'https://api.thingspeak.com/channels/1657193/fields/4.json',
  )

  const res5 = await $.get(
    'https://api.thingspeak.com/channels/1657193/fields/5.json',
  )

  const res6 = await $.get(
    'https://api.thingspeak.com/channels/1657193/fields/6.json',
  )

  // console.log('🚀 ~ file: data.js ~ line 26 ~ $ ~ res6.feeds', res6.feeds)

  const formatDate = (feeds) => {
    feeds.map((a) => {
      var { created_at } = a
      created_at = created_at.replace(/[A-Z]/g, ` `)
      date = new Date(created_at)
      var newDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60 * 1000,
      )

      var day = created_at.substring(8, 10)
      var month = created_at.substring(5, 7)
      var year = created_at.substring(0, 4)

      var hour = newDate.getHours().toString()
      var minute =
        newDate.getMinutes().toString().length < 2
          ? '0' + newDate.getMinutes()
          : newDate.getMinutes()

      a.created_at = `${day}-${month}-${year} ${hour}:${minute}`
      delete a['entry_id']

      return a
    })
  }

  const fixNullFirstRecord = (feeds) => {
    if (feeds[0].field1 === null || feeds[0].field1 === '')
      return (feeds[0].field1 = '0')
    if (feeds[0].field2 === null || feeds[0].field2 === '')
      return (feeds[0].field2 = '0')
    if (feeds[0].field3 === null || feeds[0].field3 === '')
      return (feeds[0].field3 = '0')
    if (feeds[0].field4 === null || feeds[0].field4 === '')
      return (feeds[0].field4 = '0')

    if (
      feeds[0].field5 === null ||
      feeds[0].field5 === '' ||
      feeds[0].field5 === 'nan'
    )
      return (feeds[0].field5 = 'error')

    if (
      feeds[0].field6 === null ||
      feeds[0].field6 === '' ||
      feeds[0].field6 === 'nan'
    )
      return (feeds[0].field6 = 'error')
  }

  const fillFields = (feeds) => {
    // alert(1)
    for (let i = 0; i < feeds.length; i++) {
      if (i === 0) continue
      if (feeds[i].field1 === null || feeds[i].field1 === '')
        feeds[i].field1 = feeds[i - 1].field1
      if (feeds[i].field2 === null || feeds[i].field2 === '')
        feeds[i].field2 = feeds[i - 1].field2
      if (feeds[i].field3 === null || feeds[i].field3 === '')
        feeds[i].field3 = feeds[i - 1].field3
      if (feeds[i].field4 === null || feeds[i].field4 === '')
        feeds[i].field4 = feeds[i - 1].field4
      if (feeds[i].field5 === null || feeds[i].field5 === '')
        feeds[i].field5 = feeds[i - 1].field5
      if (feeds[i].field6 === null || feeds[i].field6 === '')
        feeds[i].field6 = feeds[i - 1].field6
    }
  }

  const removeSameJson = (feeds) => {
    const jsonObject = feeds.map(JSON.stringify)
    const uniqueSet = new Set(jsonObject)
    return Array.from(uniqueSet).map(JSON.parse)
  }

  const sortDateByAsc = (feeds) => {
    feeds.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return feeds
  }

  const consistentJson = (feeds) => {
    var temp = []
    for (let i = 0; i < feeds.length; i++) {
      const filterByDate = feeds.filter(
        (e) => e.created_at === feeds[i].created_at,
      )

      var a = []
      for (let j = 0; j < filterByDate.length; j++) {
        if (j === 0) {
          a.push(filterByDate[j])
          continue
        }

        if (
          Object.keys(filterByDate[j])[1] ===
          Object.keys(filterByDate[j - 1])[1]
        ) {
          filterByDate[j - 1][`${Object.keys(filterByDate[j - 1])[1]}`] =
            filterByDate[j][`${Object.keys(filterByDate[j])[1]}`]

          continue
        }

        a.push(filterByDate[j])
      }

      if (a.length > 0) {
        if (a[1]) {
          a[0][`${Object.keys(a[1])[1]}`] = a[1][`${Object.keys(a[1])[1]}`]
        }

        if (a[2]) {
          a[0][`${Object.keys(a[2])[1]}`] = a[2][`${Object.keys(a[2])[1]}`]
        }

        if (a[3]) {
          a[0][`${Object.keys(a[3])[1]}`] = a[3][`${Object.keys(a[3])[1]}`]
        }

        if (a[4]) {
          a[0][`${Object.keys(a[4])[1]}`] = a[4][`${Object.keys(a[4])[1]}`]
        }

        if (a[5]) {
          a[0][`${Object.keys(a[5])[1]}`] = a[5][`${Object.keys(a[5])[1]}`]
        }
      }

      if (a[0]) temp.push(a[0])
    }

    // console.log('🚀 ~ file: data.js ~ line 90 ~ consistentJson ~ temp', temp)
    return temp
  }

  // mess code
  formatDate(res1.feeds)
  formatDate(res2.feeds)
  formatDate(res3.feeds)
  formatDate(res4.feeds)
  formatDate(res5.feeds)
  formatDate(res6.feeds)

  fixNullFirstRecord(res1.feeds)
  fixNullFirstRecord(res2.feeds)
  fixNullFirstRecord(res3.feeds)
  fixNullFirstRecord(res4.feeds)
  fixNullFirstRecord(res5.feeds)
  fixNullFirstRecord(res6.feeds)

  fillFields(res1.feeds)
  fillFields(res2.feeds)
  fillFields(res3.feeds)
  fillFields(res4.feeds)
  fillFields(res5.feeds)
  fillFields(res6.feeds)

  const final1 = removeSameJson(res1.feeds)
  const final2 = removeSameJson(res2.feeds)
  const final3 = removeSameJson(res3.feeds)
  const final4 = removeSameJson(res4.feeds)
  const final5 = removeSameJson(res5.feeds)
  const final6 = removeSameJson(res6.feeds)

  var mergeData = [
    ...final1,
    ...final2,
    ...final3,
    ...final4,
    ...final5,
    ...final6,
  ]
  const consistentMerge = consistentJson(mergeData)
  const uniqueMerge = removeSameJson(consistentMerge)

  //UI
  const pm25 = final1[final1.length - 1].field1
  const pm10 = final2[final2.length - 1].field2
  const temperture = final3[final3.length - 1].field3
  const airHumidity = final4[final4.length - 1].field4
  const latitude = final5[final5.length - 1].field5
  const longitude = final6[final6.length - 1].field6

  document.getElementById('pm25').innerHTML = pm25
  document.getElementById('pm10').innerHTML = pm10
  document.getElementById('temperature').innerHTML = temperture
  document.getElementById('pressure').innerHTML = airHumidity

  $('#data').html(``)
  $.each(uniqueMerge, (index, value) => {
    var { created_at, field1, field2, field3, field4, field5, field6 } = value

    var html = `<tr>
                    <td>${created_at}</td>
                    <td>${field1 ? field1 : ''}</td>
                    <td>${field2 ? field2 : ''}</td>
                    <td>${field3 ? field3 : ''}</td>
                    <td>${field4 ? field4 : ''}</td>
                    <td>${field5 ? field5 : 'error'}</td>
                    <td>${field6 ? field6 : 'error'}</td>
                    <td>
                      <a href='https://www.google.com/maps/place/${field5}+${field6}'>
                        https://www.google.com/maps/place/${field5}+${field6}
                      </a>
                    </td>
                </tr>`
    $('#data').prepend(html)
  })

  const pm25s = uniqueMerge.map((a) => Number(a.field1))
  const pm10s = uniqueMerge.map((a) => Number(a.field2))
  const temperatures = uniqueMerge.map((a) => Number(a.field3))
  const airHumidities = uniqueMerge.map((a) => Number(a.field4))
  const dates = uniqueMerge.map((a) => a.created_at)

  await new Chart('mutilplelinesChart', {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        { label: 'PM2.5', data: pm25s, borderColor: 'red', fill: false },
        {
          label: 'PM10',
          data: pm10s,
          borderColor: 'green',
          fill: false,
        },
        {
          label: 'Tempurature',
          data: temperatures,
          borderColor: 'blue',
          fill: false,
        },
        {
          label: 'Air Humidity',
          data: airHumidities,
          borderColor: 'pink',
          fill: false,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: 'Multiple lines chart',
      },
      // labels: ['PM2.5', 'PM10', 'Temperature', 'Pressure'],
      // legend: {
      //   display: true,
      //   legendText: ['PM2.5', 'PM10', 'Temperature', 'Pressure'],
      // },
    },
  })

  // #############################################################
  var xValues = ['PM2.5', 'PM10', 'Temperature', 'Air Humidity']
  var yValues = [pm25, pm10, temperture, airHumidity]
  var barColors = [
    'red',
    'green',
    'blue',
    'pink',
    // "#1e7145"
  ]

  await new Chart('doughnutChart', {
    type: 'doughnut',
    data: {
      labels: xValues,
      datasets: [
        {
          backgroundColor: barColors,
          data: yValues,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: 'Doughnut chart',
      },
    },
  })

  //print
  console.log('API 1: ')
  console.log('🚀 ~ file: data.js ~ line 20 ~ $ ~ res1.feeds', res1.feeds)
  console.log('API 2: ')
  console.log('🚀 ~ file: data.js ~ line 22 ~ $ ~ res2.feeds', res2.feeds)
  console.log('API 3: ')
  console.log('🚀 ~ file: data.js ~ line 24 ~ $ ~ res3.feeds', res3.feeds)
  console.log('API 4: ')
  console.log('🚀 ~ file: data.js ~ line 26 ~ $ ~ res4.feeds', res4.feeds)
  console.log('API 5: ')
  console.log('🚀 ~ file: data.js ~ line 26 ~ $ ~ res5.feeds', res5.feeds)
  console.log('API 6: ')
  console.log('🚀 ~ file: data.js ~ line 26 ~ $ ~ res6.feeds', res6.feeds)

  console.log('🚀 ~ file: data.js ~ line 354~ $ ~ final1', final1)
  console.log('🚀 ~ file: data.js ~ line 35 ~ $ ~ final2', final2)
  console.log('🚀 ~ file: data.js ~ line 35 ~ $ ~ final3', final3)
  console.log('🚀 ~ file: data.js ~ line 35 ~ $ ~ final4', final4)
  console.log('🚀 ~ file: data.js ~ line 35 ~ $ ~ final5', final5)
  console.log('🚀 ~ file: data.js ~ line 35 ~ $ ~ final6', final6)

  console.log('🚀 ~ file: data.js ~ line 125 ~ $ ~ mergeData', mergeData)
  // console.log('🚀 ~ file: data.js ~ line 147 ~ $ ~ ascArr', ascArr)
  console.log(
    '🚀 ~ file: data.js ~ line 145 ~ $ ~ consistentMerge',
    consistentMerge,
  )
  console.log('🚀 ~ file: data.js ~ line 145 ~ $ ~ uniqueMerge', uniqueMerge)

  var src = [10.818377, 106.666664]

  // 38 53 55 N
  // 77 2 16 W

  function convertToDMS(src) {
    function toDMS(n) {
      // The sign doesn't matter
      n = Math.abs(n)

      // Get the degrees
      var d = Math.floor(n)
      // Strip off the answer we already have
      n = n - d
      // And then put the minutes before the '.'
      n *= 60

      // Get the minutes
      var m = Math.floor(n)
      // Remove them from the answer
      n = n - m
      // Put the seconds before the '.'
      n *= 60

      // Get the seconds
      // Should this be round? Or rounded by special rules?
      var s = Math.floor(n)

      // Put it together.
      return '' + d + ' ' + m + ' ' + s
    }

    var dir0 = src[0] > 0 ? '"N' : '"S'

    var dir1 = src[1] > 0 ? '"E' : '"W'

    // console.log(toDMS(src[0]) + dir0)
    // console.log(toDMS(src[1]) + dir1)

    var demo1 = toDMS(src[0]) + dir0
    var demo2 = toDMS(src[1]) + dir1

    demo1 = demo1.replace(' ', '°').replace(' ', "'")

    demo2 = demo2.replace(' ', '°').replace(' ', "'")

    console.log('🚀 ~ file: data.js ~ line 379 ~ convertToDMS ~ demo1', demo1)
    console.log('🚀 ~ file: data.js ~ line 380 ~ convertToDMS ~ demo2', demo2)
  }

  convertToDMS(src)
})
