$(document).ready(async () => {
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

  console.log('API 1: ', res1)
  console.log('API 2: ', res2)
  console.log('API 3: ', res3)
  console.log('API 4: ', res4)
  console.log('feeds: ', res4.feeds)

  const final1 = res1.feeds.filter(
    (item) => item.field1 !== '0' && item.field1 !== null && item.field2 !== '',
  )
  const final2 = res2.feeds.filter(
    (item) => item.field2 !== '0' && item.field2 !== null && item.field2 !== '',
  )
  const final3 = res3.feeds.filter(
    (item) => item.field3 !== '0' && item.field3 !== null && item.field3 !== '',
  )
  const final4 = res4.feeds.filter(
    (item) => item.field4 !== '0' && item.field4 !== null && item.field4 !== '',
  )

  const pm25 = final1[final1.length - 1].field1
  const pm10 = final2[final2.length - 1].field2
  const temperture = final3[final3.length - 1].field3
  const pressure = final4[final4.length - 1].field4

  console.log('🚀 ~ file: data.js ~ line 28 ~ $ ~ pm25', pm25)
  console.log('🚀 ~ file: data.js ~ line 41 ~ $ ~ pm10', pm10)
  console.log('🚀 ~ file: data.js ~ line 43 ~ $ ~ temperture', temperture)
  console.log('🚀 ~ file: data.js ~ line 45 ~ $ ~ pressure', pressure)

  document.getElementById('pm25').innerHTML = `${pm25}`
  document.getElementById('pm10').innerHTML = `${pm10}`
  document.getElementById('temperature').innerHTML = `${temperture}`
  document.getElementById('pressure').innerHTML = `${pressure}`

  const mergeData = [...final1, ...final2, ...final3, ...final4]
  console.log('🚀 ~ file: data.js ~ line 53 ~ $ ~ mergeData', mergeData)

  const mergeDataByDate = mergeData.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  )
  console.log('🚀 ~ file: data.js ~ line 58 ~ $ ~ mergeDataByDate', mergeDataByDate)

  $('#data').html(``)
  $.each(mergeData, function (index, value) {
    var { created_at, field1, field2, field3, field4 } = value
    created_at = created_at.replace(/[A-Z]/g, ` `)

    var html = `<tr>
                    <td>${created_at}</td>
                    <td>${field1 ? field1 : ''}</td>
                    <td>${field2 ? field2 : ''}</td>
                    <td>${field3 ? field3 : ''}</td>
                    <td>${field4 ? field4 : ''}</td>
                </tr>`
    $('#data').prepend(html)
  })

  // #################################################################

  const field1s = await final1.map((a) => Number(a.field1))
  const field2s = await final2.map((a) => Number(a.field2))
  const field3s = await final3.map((a) => Number(a.field3))
  const field4s = await final4.map((a) => Number(a.field4))
  const dates = await mergeData.map((a) => a.created_at.replace(/[A-Z]/g, ' '))

  console.log(`fields1: `, field1s)
  console.log(`fields2: `, field2s)
  console.log(`fields3: `, field3s)
  console.log(`fields4: `, field4s)
  console.log('🚀 ~ file: data.js ~ line 85 ~ $ ~ dates', dates)

  await new Chart('mutilplelinesChart', {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        { label: 'PM2.5', data: field1s, borderColor: 'red', fill: false },
        {
          label: 'PM10',
          data: field2s,
          borderColor: 'green',
          fill: false,
        },
        {
          label: 'Tempurature',
          data: field3s,
          borderColor: 'blue',
          fill: false,
        },
        {
          label: 'Pressure',
          data: field4s,
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
  var xValues = ['PM2.5', 'PM10', 'Temperature', 'Pressure']
  var yValues = [pm25, pm10, temperture, pressure]
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
})
