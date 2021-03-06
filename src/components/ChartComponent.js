import React from 'react';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

const data = [
  {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
  {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
  {name: 'Page C', uv: -1000, pv: 9800, amt: 2290},
  {name: 'Page D', uv: 500, pv: 3908, amt: 2000},
  {name: 'Page E', uv: -2000, pv: 4800, amt: 2181},
  {name: 'Page F', uv: -250, pv: 3800, amt: 2500},
  {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

const gradientOffset = () => {
  const dataMax = Math.max(...data.map(i => i.uv));
  const dataMin = Math.min(...data.map(i => i.uv));

  if (dataMax <= 0) {
    return 0;
  } else if (dataMin >= 0) {
    return 1;
  } else {
    return dataMax / (dataMax - dataMin);
  }
};

const off = gradientOffset();

const SimpleAreaChart = React.createClass({
  render() {
    return (
      <AreaChart
        width={600} height={400} data={data}
        margin={{top: 10, right: 30, left: 0, bottom: 0}}
      >
        <XAxis dataKey="name"/>
        <YAxis/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Tooltip/>
        <defs>
          <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset={0} stopColor="green" stopOpacity={0.5}/>
            <stop offset={1} stopColor="red" stopOpacity={0.5}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="url(#splitColor)"/>
      </AreaChart>
    );
  },
});

export class ChartComponent extends React.Component {
  render() {
    return (<SimpleAreaChart/>);
  }
}
