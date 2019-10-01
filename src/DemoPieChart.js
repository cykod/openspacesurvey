import React from 'react';

import {map, truncate, reduce, each, sortBy, filter, compact} from "lodash"

import {
  PieChart, Pie, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer, LabelList
} from 'recharts';


class DemoPieChart  extends React.Component {

  constructor(props) {
    super(props)

    this.fill = ['#a1d99b','#74c476','#41ab5d','#238b45','#006d2c','#00441b']
  }

  customLabel = ({
          cx,
          cy,
          midAngle,
          innerRadius,
          outerRadius,
          value,
          index
        }) => {
          const RADIAN = Math.PI / 180;
          // eslint-disable-next-line
          const radius = 25 + innerRadius + (outerRadius - innerRadius);
          // eslint-disable-next-line
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          // eslint-disable-next-line
          const y = cy + radius * Math.sin(-midAngle * RADIAN);

          return (
            <text
              x={x}
              y={y}
              fill={this.fill[index]}
              textAnchor={x > cx ? "start" : "end"}
              dominantBaseline="central"
            >
              {this.props.data[index].name} ({value})
            </text>
          );
        }

  render() {
     return(
      <div className='demographics__chart'>
        {this.props.title && <div className='demographics__title'>{this.props.title}</div>}
        <div className='demographics__wrapper'>
        <div className='demographics__chart'>
        <ResponsiveContainer width="100%" height={400}>
         <PieChart title={this.props.title} >
          <Pie data={this.props.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={this.customLabel}
          animationDuration={400}  animationBegin={0}  >
           {map(this.props.data,(entry, index) => <Cell fill={this.fill[index]}/>)}
          </Pie>

        </PieChart>
        </ResponsiveContainer>
        </div>
        </div>
      </div>
      )
  }

}

export default DemoPieChart;


