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

  const cutUnitBySec = async (res1) => {
    res1.feeds.forEach((e) => {
      var start = 0
      var end = e.created_at.length - 4

      e.created_at = e.created_at.substring(start, end)
    })
    console.log('🚀 ~ file: data.js ~ line 27 ~ $ ~ res1Cut', res1)
  }

  await cutUnitBySec(res1)
  await cutUnitBySec(res2)
  await cutUnitBySec(res3)
  await cutUnitBySec(res4)

  // return

  // const removeInvalidValue = async (res1) => {
  //   res1.feeds.filter(
  //     (item) =>
  //       item.field1 !== '0' && item.field1 !== null && item.field1 !== '',
  //   )

  //   return res1
  // }

  // const final1 = removeInvalidValue(res1)
  // const final2 = removeInvalidValue(res2)
  // const final3 = removeInvalidValue(res3)
  // const final4 = removeInvalidValue(res4)

  const final1 = res1.feeds.filter(
    (item) => item.field1 !== '0' && item.field1 !== null && item.field1 !== '',
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

  var mergeData = final1.concat(final2)
  mergeData = mergeData.concat(final3)
  mergeData = mergeData.concat(final4)

  console.log('🚀 ~ file: data.js ~ line 53 ~ $ ~ mergeData', mergeData)
  // console.log(
  //   '🚀 ~ file: data.js ~ line 62 ~ $ ~ mergeData.[mergeData.length-1].entry_id',
  //   mergeData[mergeData.length - 1].entry_id,
  // )

  const xxx = async (mergeData) => {
    const temp = []

    // const filter = await mergeData.filter((x) => x.created_at)
    // console.log('🚀 ~ file: data.js ~ line 97 ~ xxx ~ filter', filter)

    const filterByDateAsc = mergeData.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    )

    // console.log("🚀 ~ file: data.js ~ line 104 ~ xxx ~ filterByDate", filterByDate)

    for (let i = filterByDateAsc.length - 1; i >= 0; i--) {
      const filterByDate = filterByDateAsc.filter(
        (e) => e.created_at === filterByDateAsc[i].created_at,
      )

      if (filterByDate.length > 0) {
        if (filterByDate[1]) {
          filterByDate[0][`${Object.keys(filterByDate[1])[2]}`] =
            filterByDate[1][`${Object.keys(filterByDate[1])[2]}`]
        }

        if (filterByDate[2]) {
          filterByDate[0][`${Object.keys(filterByDate[2])[2]}`] =
            filterByDate[2][`${Object.keys(filterByDate[2])[2]}`]
        }

        if (filterByDate[3]) {
          filterByDate[0][`${Object.keys(filterByDate[3])[2]}`] =
            filterByDate[3][`${Object.keys(filterByDate[3])[2]}`]
        }
      }

      if (filterByDate[0]) temp.push(filterByDate[0])
    }

    // remove duplicate json
    const jsonObject = temp.map(JSON.stringify)

    console.log(jsonObject)

    const uniqueSet = new Set(jsonObject)
    const uniqueArray = Array.from(uniqueSet).map(JSON.parse)

    console.log(uniqueArray)
    // remove duplicate json

    return uniqueArray
  }
  const temp = await xxx(mergeData)
  console.log('🚀 ~ file: data.js ~ line 163 ~ $ ~ temp', temp)

  const mergeDataByDate = temp.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  )
  console.log(
    '🚀 ~ file: data.js ~ line 58 ~ $ ~ mergeDataByDate',
    mergeDataByDate,
  )

  $('#data').html(``)
  $.each(mergeDataByDate, function (index, value) {
    var { created_at, field1, field2, field3, field4 } = value
    created_at = created_at.replace(/[A-Z]/g, ` `)
    date = new Date(created_at)
    var newDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60 * 1000,
    )

    newDate = `${date.getDay()}-${date.getMonth()}-${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}`

    var html = `<tr>
                    <td>${newDate}</td>
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
