import * as moment from "moment";
import * as echarts from 'echarts';
const chartOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  },
//	dataZoom: [
//  {
//  type: 'inside',
//  realtime:false,
//  filterMode:'filter',
//},
//],
  // toolbox: {
  //   feature: {
  //     restore: {},
  //   }
  // },
  grid: {
    top: '10%',
    left: '15%',
    right: '5%'
  },
  xAxis: {
    type: 'category',
    data: [],
    scale: false,
    boundaryGap: false,

    axisLine: {
      onZero: true,
      lineStyle: {
        color: '#6A7089',
      },
    },
    axisLabel: {
      textStyle: {
        color: '#6A7089'
      },
      showMaxLabel: false,
      showMinLabel: false,
      formatter(value) {
        return moment(value).format('HH:mm:ss')
      }
    },
    // boundaryGap: [0, 0.1],
//   interval: 60*10*1000,
    // minInterval: 1,
    // maxInterval: 3600 * 1000,
    splitLine: {
      showMaxLine: false,
      show: false,
      lineStyle: {
        // 使用深浅的间隔色
        color: '#000',
        width: 1,
        type: 'dashed'
      },
    },
    splitNumber: 10,
    min: 'dataMin',
    max: function (value) {
      return value.max + 5;

    }
  },
  yAxis: {
    position:'left',
    type:'value',
    show: true,
    scale: false,
//  offset: 1,
    boundaryGap: ['20%', '20%'],
    splitLine: {
      show: false,
      lineStyle: {
        // 使用深浅的间隔色
        color: '#A9A8A8',
        width: 1,
        type: 'dashed'
      },
    },
    axisLine: {
      onZero: true,
      lineStyle: {
        color: '#6A7089',
      },
    },
    splitArea: {
      show: false,
    },
    axisLabel: {
      showMinLabel: false,
      showMaxLabel: false,
      //  	showMaxLabel:false,
      textStyle: {
        color: '#6A7089'
      },
    },
    splitNumber: 4,
    min: function (value) {
      return value.min - (value.max - value.min) * 0.8;
    },
    max: function (value) {
      return (value.max + (value.max - value.min) * 3);
    },
  },
};


const chartOptionKSeries = {
  tooltip: {
    trigger: 'item',
//  position: 'inside',
    axisPointer: {
      type: 'cross'
    },
    animation: false,
    formatter: function (params) {
    	if(params.value.length>1){
    		return params.name + '<br>' +
        '开盘:' + params.value[1] + '<br>' +
        '收盘:' + params.value[2] + '<br>' +
        '最低:' + params.value[3] + '<br>' +
        '最高:' + params.value[4]
    	
    	}else{
    			return (params.value).toFixed(4)
    	}
      
    }
  },
//dataZoom: [
//  {
//      type: 'inside',
//      realtime:false,
//      filterMode:'filter',
//  },
//],
  grid: {
    top: '10%',
    left: '5%',
    right: '7%'
  },
  legend: {
    data: ['支出', '收入', '支出', '收入']
  },
  xAxis: {
    type: 'category',
    data: [],
    scale: false,
    boundaryGap: false,
    axisLine: {
      onZero: true,
      lineStyle: {
        color: '#6A7089',
      },
    },
		axisLabel: {
      textStyle: {
        color: '#6A7089'
      },
      showMaxLabel: false,
      showMinLabel: false,
      interval: function(index,value){
        // var regExp1 = /时间/;
        var regExp2 = /\-/;
        // if(regExp1.test(value)){
        //   return false;
        // }
       if (regExp2.test(value)){
          return false;
        }else{
          return true;
        }
       
      },
        
    },
//  interval: 3600 * 1000,
    splitLine: {
      show: false,
      lineStyle: {
        // 使用深浅的间隔色
        color: '#A9A8A8',
        width: 1,
        type: 'dashed'
      },
    },
    // splitNumber: 6,
    interval: 3600 * 1000,
    min: 'dataMin',
    max: function (value) {
      return value.max;

    }
  },
  yAxis: {
    type: 'value',
    position:'left',
    boundaryGap: [0.01, 0.01],
    show: true,
    scale: true,
//  offset:10,
    splitArea: {
      show: false,
    },
    splitLine: {
      show: false
    },
    axisLine: {
      onZero: true,
      lineStyle: {
        color: '#6A7089',
      },
    },
    axisLabel: {
      showMinLabel: false,
      textStyle: {
        color: '#6A7089'
      },
    },
    min: function (value) {
      return value.min - (value.max - value.min) * 0.08;;
    },
    max: function (value) {
    	console.log(value.max)
      return value.max;
    },

  },
  series: [
    {
      type: 'k',
      data: [],
      animation: false,
      itemStyle: {
        //设置K线图样式
        normal: {
          color: '#F24040', // 阳线填充颜色
          color0: '#23BD88', // 阴线填充颜色
          lineStyle: {
            width: 0.5,
            color: '#F24040', // 阳线边框颜色
            color0: '#23BD88', // 阴线边框颜色
          },
        },
        emphasis: {
          // color: 各异,
          // color0: 各异
        },
      },
    },
  ]

};

const chartOptionLineSeries = [
  {
    symbolSize: 0,
    name: '当前价',
    type: 'line',
    data: [],
    itemStyle: {
      normal: {

        lineStyle: {
          width: 0.5,
          color: '#F81E1E',
          type: 'solid',
        },
      },
    },
    smooth: true,
    animation: false,
    // areaStyle: {
    //   normal: {
    //     //      color: 'rgba(241,174,63,0.3)',
    //     color: new echarts.graphic.LinearGradient(
    //       0, 0, 0, 1,
    //       [
    //         { offset: 0, color: '#F89F0B' },
    //         { offset: 0.5, color: '#F0C781' },
    //         { offset: 1, color: '#F7E7CC' }
    //       ]
    //     )
    //   },
    // },
  },
];

export default { chartOption, chartOptionKSeries, chartOptionLineSeries };