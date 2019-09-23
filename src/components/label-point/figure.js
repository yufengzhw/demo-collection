const tagColor = ['#1710c0', '#0b9df0', '#00fea8', '#f5f811', '#f09a09', '#fe0300', '#000000']
const selectColor = '#000000'
const noiseColor = '#B0B5BE'

export const SELECT_TAG = 100

export function getfigureOptions (data) {
  // data: [x, y, z, tag1, tag2]; if selected, tag1 = SELECT_TAG
  return {
    visualMap: [{
      show: false,
      type: 'piecewise',
      splitNumber: 6,
      pieces: [
        { min: 4.5 },
        { min: 3.5, max: 4.5 },
        { min: 2.5, max: 3.5 },
        { min: 1.5, max: 2.5 },
        { min: 0.5, max: 1.5 },
        { min: -0.5, max: 0.5 }
      ],
      dimension: 'tag1',
      inRange: {
        color: tagColor
      },
      outOfRange: {
        color: [noiseColor]
      }
    }],
    xAxis3D: {
      name: 'x',
      type: 'value'
    },
    yAxis3D: {
      name: 'y',
      type: 'value'
    },
    zAxis3D: {
      name: 'z',
      type: 'value'
    },
    grid3D: {
      viewControl: {
        projection: 'orthographic'
      }
    },
    series: [{
      type: 'scatter3D',
      dimensions: ['x', 'y', 'z', 'tag1', 'tag2'],
      data: data,
      symbolSize: 12,
      emphasis: {
        itemStyle: {
          color: selectColor
        }
      }
    }]
  }
}
