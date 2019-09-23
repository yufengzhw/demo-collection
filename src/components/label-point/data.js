import XLSX from 'xlsx'

export function genExampleData () {
  const data = []
  for (let i = 0; i < 100; i++) {
    // tag1 = 1, tag2 = 1
    let dataItem = [
      parseFloat((i * 2 + Math.random() * 10).toFixed(3)),
      parseFloat((2.5 + Math.random() * 0.5).toFixed(3)),
      parseFloat((5 + 0.35 * i + Math.random() * 0.05).toFixed(3))
    ]
    dataItem.tag1 = 1
    dataItem.tag2 = 1
    data.push(dataItem)

    // tag1 = 1, tag2 = 2
    dataItem = [
      parseFloat((i * 2 + Math.random() * 10).toFixed(3)),
      parseFloat((4.5 + Math.random() * 0.5).toFixed(3)),
      parseFloat((5 + 0.35 * i + Math.random() * 0.05).toFixed(3))
    ]
    dataItem.tag1 = 1
    dataItem.tag2 = 2
    data.push(dataItem)

    // tag1 = 2, tag2 = 1
    dataItem = [
      parseFloat((i * 2 + Math.random() * 10).toFixed(3)),
      parseFloat((6.5 + Math.random() * 0.5).toFixed(3)),
      parseFloat((15 + 0.35 * i + Math.random() * 0.05).toFixed(3))
    ]
    dataItem.tag1 = 2
    dataItem.tag2 = 1
    data.push(dataItem)

    // tag1 = 2, tag2 = 2
    dataItem = [
      parseFloat((i * 2 + Math.random() * 10).toFixed(3)),
      parseFloat((8.5 + Math.random() * 0.5).toFixed(3)),
      parseFloat((15 + 0.35 * i + Math.random() * 0.05).toFixed(3))
    ]
    dataItem.tag1 = 2
    dataItem.tag2 = 2
    data.push(dataItem)

    // noise, tag1 = tag2 = -1
    dataItem = [
      i > 0 ? parseFloat((Math.random() * 200).toFixed(3)) : 0,
      parseFloat((Math.random() * 10).toFixed(3)),
      parseFloat((Math.random() * 60).toFixed(3))
    ]
    dataItem.tag1 = -1
    dataItem.tag2 = -1
    data.push(dataItem)
  }
  data.sort((a, b) => a[0] - b[0])
  return data
}

export function preprocessData (data, timeRef) {
  const res = []
  data.forEach(item => {
    const dataItem = [
      parseFloat((item[0] - timeRef).toFixed(3)),
      item[1],
      item[2]
    ]
    dataItem.tag1 = item[3] ? item[3] : -1
    dataItem.tag2 = item[4] ? item[4] : -1
    res.push(dataItem)
  })
  return res
}

function genFileName (timeRef) {
  const date = new Date(timeRef * 1000)
  let m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  let h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  let minute = date.getMinutes()
  minute = minute < 10 ? ('0' + minute) : minute
  return `${m}_${d}_${h}_${minute}_label.xlsx`
}

export function saveData (data, timeRef) {
  if (data.length === 0) {
    return
  }
  data = data.map(item => [item[0] + timeRef, item[1], item[2], item.tag1, item.tag2])
  let ws = XLSX.utils.aoa_to_sheet(data)
  let wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'new_sheet')
  XLSX.writeFile(wb, genFileName(timeRef))
}
