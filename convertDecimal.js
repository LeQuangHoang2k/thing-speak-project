
  // 38 53 55 N
  // 77 2 16 W
  var src = [10.818377, 106.666664]

function convertToDMS(src) {
    function toDMS(n) {
      n = Math.abs(n)

      var d = Math.floor(n)
      n = n - d
      n *= 60

      var m = Math.floor(n)
      n = n - m

      n *= 60

      // Should this be round? Or rounded by special rules?
      var s = Math.floor(n)

      return '' + d + ' ' + m + ' ' + s
    }

    var dir0 = src[0] > 0 ? '"N' : '"S'

    var dir1 = src[1] > 0 ? '"E' : '"W'

    var demo1 = toDMS(src[0]) + dir0
    var demo2 = toDMS(src[1]) + dir1

    demo1 = demo1.replace(' ', '°').replace(' ', "'")

    demo2 = demo2.replace(' ', '°').replace(' ', "'")

    console.log('🚀 ~ file: data.js ~ line 379 ~ convertToDMS ~ demo1', demo1)
    console.log('🚀 ~ file: data.js ~ line 380 ~ convertToDMS ~ demo2', demo2)
  }

  convertToDMS(src)