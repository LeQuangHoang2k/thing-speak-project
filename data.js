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

  // console.log('feeds: ', res4.feeds)

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
        newDate.getMinutes().length < 2
          ? '0' + newDate.getMinutes()
          : newDate.getMinutes()

      a.created_at = `${day}-${month}-${year} ${hour}:${minute}`
      delete a['entry_id']

      return a
    })
  }

  const fixNullFirstRecord = async (feeds) => {
    if (feeds[0].field1 === null || feeds[0].field1 === '')
      return (feeds[0].field1 = '0')
    if (feeds[0].field2 === null || feeds[0].field2 === '')
      return (feeds[0].field2 = '0')
    if (feeds[0].field3 === null || feeds[0].field3 === '')
      return (feeds[0].field3 = '0')
    if (feeds[0].field4 === null || feeds[0].field4 === '')
      return (feeds[0].field4 = '0')
  }

  const fillFields = async (feeds) => {
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
      }

      if (a[0]) temp.push(a[0])
    }

    // console.log('🚀 ~ file: data.js ~ line 90 ~ consistentJson ~ temp', temp)
    return temp
  }

  // mess code
  await formatDate(res1.feeds)
  await formatDate(res2.feeds)
  await formatDate(res3.feeds)
  await formatDate(res4.feeds)

  await fixNullFirstRecord(res1.feeds)
  await fixNullFirstRecord(res2.feeds)
  await fixNullFirstRecord(res3.feeds)
  await fixNullFirstRecord(res4.feeds)

  await fillFields(res1.feeds)
  await fillFields(res2.feeds)
  await fillFields(res3.feeds)
  await fillFields(res4.feeds)

  const final1 = await removeSameJson(res1.feeds)
  const final2 = await removeSameJson(res2.feeds)
  const final3 = await removeSameJson(res3.feeds)
  const final4 = await removeSameJson(res4.feeds)

  var mergeData = [...final1, ...final2, ...final3, ...final4]
  const consistentMerge = consistentJson(mergeData)
  const uniqueMerge = removeSameJson(consistentMerge)

  //UI
  document.getElementById('pm25').innerHTML = final1[final1.length - 1].field1
  document.getElementById('pm10').innerHTML = final2[final2.length - 1].field2
  document.getElementById('temperature').innerHTML =
    final3[final3.length - 1].field3
  document.getElementById('pressure').innerHTML =
    final4[final4.length - 1].field4

  //print
  console.log('API 1: ')
  console.log('🚀 ~ file: data.js ~ line 20 ~ $ ~ res1.feeds', res1.feeds)
  console.log('API 2: ')
  console.log('🚀 ~ file: data.js ~ line 22 ~ $ ~ res2.feeds', res2.feeds)
  console.log('API 3: ')
  console.log('🚀 ~ file: data.js ~ line 24 ~ $ ~ res3.feeds', res3.feeds)
  console.log('API 4: ')
  console.log('🚀 ~ file: data.js ~ line 26 ~ $ ~ res4.feeds', res4.feeds)

  console.log('🚀 ~ file: data.js ~ line 354~ $ ~ final1', final1)
  console.log('🚀 ~ file: data.js ~ line 35 ~ $ ~ final2', final2)
  console.log('🚀 ~ file: data.js ~ line 35 ~ $ ~ final3', final3)
  console.log('🚀 ~ file: data.js ~ line 35 ~ $ ~ final4', final4)

  console.log('🚀 ~ file: data.js ~ line 125 ~ $ ~ mergeData', mergeData)
  // console.log('🚀 ~ file: data.js ~ line 147 ~ $ ~ ascArr', ascArr)
  console.log('🚀 ~ file: data.js ~ line 145 ~ $ ~ consistentMerge', consistentMerge)
  console.log('🚀 ~ file: data.js ~ line 145 ~ $ ~ uniqueMerge', uniqueMerge)

  return

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

  // const final1 = res1.feeds.filter(
  //   (item) => item.field1 !== '0' && item.field1 !== null && item.field1 !== '',
  // )
  // const final2 = res2.feeds.filter(
  //   (item) => item.field2 !== '0' && item.field2 !== null && item.field2 !== '',
  // )
  // const final3 = res3.feeds.filter(
  //   (item) => item.field3 !== '0' && item.field3 !== null && item.field3 !== '',
  // )
  // const final4 = res4.feeds.filter(
  //   (item) => item.field4 !== '0' && item.field4 !== null && item.field4 !== '',
  // )

  // const pm25 = final1[final1.length - 1].field1
  // const pm10 = final2[final2.length - 1].field2
  // const temperture = final3[final3.length - 1].field3
  // const pressure = final4[final4.length - 1].field4

  console.log('🚀 ~ file: data.js ~ line 28 ~ $ ~ pm25', pm25)
  console.log('🚀 ~ file: data.js ~ line 41 ~ $ ~ pm10', pm10)
  console.log('🚀 ~ file: data.js ~ line 43 ~ $ ~ temperture', temperture)
  console.log('🚀 ~ file: data.js ~ line 45 ~ $ ~ pressure', pressure)

  document.getElementById('pm25').innerHTML = `${pm25}`
  document.getElementById('pm10').innerHTML = `${pm10}`
  document.getElementById('temperature').innerHTML = `${temperture}`
  document.getElementById('pressure').innerHTML = `${pressure}`

  console.log('🚀 ~ file: data.js ~ line 53 ~ $ ~ mergeData', mergeData)
  // console.log(
  //   '🚀 ~ file: data.js ~ line 62 ~ $ ~ mergeData.[mergeData.length-1].entry_id',
  //   mergeData[mergeData.length - 1].entry_id,
  // )

  const ra = async (mergeData) => {
    const temp = []

    // const filter = await mergeData.filter((x) => x.created_at)
    // console.log('🚀 ~ file: data.js ~ line 97 ~ xxx ~ filter', filter)

    const filterByDateAsc = mergeData.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
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
  const uniqueData = await removeSameJson(mergeData)
  console.log('🚀 ~ file: data.js ~ line 163 ~ $ ~ uniqueData', uniqueData)

  const formatDateByDate = uniqueData.map((a) => {
    var { created_at } = a
    created_at = created_at.replace(/[A-Z]/g, ` `)
    date = new Date(created_at)
    var newDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60 * 1000,
    )

    newDate = `${created_at.substring(8, 10)}-${created_at.substring(
      5,
      7,
    )}-${created_at.substring(0, 4)} ${newDate.getHours()}:${
      newDate.getMinutes().toString().length < 2
        ? '0' + newDate.getMinutes()
        : newDate.getMinutes()
    }`

    a.created_at = newDate

    return a
  })
  console.log(
    '🚀 ~ file: data.js ~ line 167 ~ formatDateByDate ~ formatDateByDate',
    formatDateByDate,
  )

  const dataDscByDate = uniqueData.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  )

  // console.log(
  //   '🚀 ~ file: data.js ~ line 58 ~ $ ~ mergeDataByDate',
  //   mergeDataByDate,
  // )

  // const dates = await mergeDataByDate.map((a) => {
  //   var { created_at } = a
  //   created_at = created_at.replace(/[A-Z]/g, ` `)
  //   date = new Date(created_at)
  //   var newDate = new Date(
  //     date.getTime() - date.getTimezoneOffset() * 60 * 1000,
  //   )

  //   newDate = `${created_at.substring(8, 10)}-${created_at.substring(
  //     5,
  //     7,
  //   )}-${created_at.substring(0, 4)} ${newDate.getHours()}:${
  //     newDate.getMinutes().toString().length < 2
  //       ? '0' + newDate.getMinutes()
  //       : newDate.getMinutes()
  //   }`

  //   return newDate
  // })

  $('#data').html(``)
  $.each(dataDscByDate, function (index, value) {
    var { created_at, field1, field2, field3, field4 } = value

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

  // const field1x = await res1.feeds.forEach((e,i) => {

  // });

  const field1s = await final1.map((a) => Number(a.field1))
  const field2s = await final2.map((a) => Number(a.field2))
  const field3s = await final3.map((a) => Number(a.field3))
  const field4s = await final4.map((a) => Number(a.field4))
  const dates = await dataDscByDate.map((a) => a.created_at)

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
