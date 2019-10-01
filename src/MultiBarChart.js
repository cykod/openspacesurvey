import React from 'react';

import {map, truncate, reduce, each, sortBy, filter} from "lodash"

import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer, LabelList
} from 'recharts';


import { FaSignal, FaLayerGroup, FaPercent,  } from 'react-icons/fa';



const TiltedAxisTick = (props) => {

    const { x, y, stroke, payload } = props;

    var parts = payload.value.split("(")

    var str = payload.value
    var str2 = ""

    if(parts.length > 1) {
      str = parts[0]
      str2 = `(${parts[1]}`
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={0} 
          y={0} 
          dy={16} 
          width={80}
          textAnchor="start" 
          fontSize="12"
          fill="#666" 
          transform="rotate(25)">
            {str}
        </text>
         <text 
          x={-2} 
          y={10} 
          dy={16} 
          width={80}
          fontSize="12"
          textAnchor="start" 
          fill="#666" 
          transform="rotate(25)">
            {truncate(str2,25)}
        </text>
      </g>
    );

};


class MultiBarChart extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      display:'bar',
      noOpinion: true
    }

    this.fill = this.calculateFill();
    //this.fill = ["#d6d6a9", "#b0bc7f", "#85a35a", "#558b39","#0e731b"
    //["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"]
  }

  calculateFill() {
    if(this.props.data.values.length < 5) {
      return ['#66c2a4','#2ca25f','#006d2c','#CCCCCC']
    } else {
      return ['#ccece6','#99d8c9','#66c2a4','#2ca25f','#006d2c',"#CCCCCC"]
    }
  }

  componentDidMount() {

  }

  showExtra() {
    if(this.props.data.values.length == 1) {
      const singleAnswerList = map(filter(this.props.data.data, (row) => row[true] == 1 ),(row) =>row.name.trim())

      if(singleAnswerList.length > 0) {
        return <div className='chart__single-answers'>
          Answers with 1 response: {singleAnswerList.join(", ")}
        </div>
      }
    }
  }

  displayData = () => {
    var outputData = this.props.data.data;

    if(!this.state.noOpinion) {
      outputData = map(outputData, (row) => {
        var result = { ...row }
        delete result['No Opinion']

        return result;
      })
    }


    if(this.props.data.values.length == 1) {
      var sorted =  sortBy(outputData, (row) => -row[true] )
      sorted = filter(sorted, (row) => row[true] > 1)
      
      if(this.state.display == "percent") {
        return map(sorted, (row) => {
          return { name: row.name, [true]: Math.round((row[true]||0) * 1000 / this.props.data.total) / 10 }
        })  
      } else {
        return sorted;
      }
    } else if(this.state.display == "percent") {
      return map(outputData, (row) => {
        const total = reduce(this.props.data.values, (sum, value) => {
          return sum + (row[value] || 0) 
        }, 0)

        var output = { name: row.name }
        each(this.props.data.values, (value) => {
          if(row[value]>0) { 
            output[value] = Math.round((row[value]||0) * 1000 / total) / 10
          }
        });
        return output;
      })
    } else {
      return outputData
    }
  }

  setDisplay = (display) => {
    this.setState({
      display: display
    })
  }

  toggleNoOpinion = () => {
    this.setState({
      noOpinion: !this.state.noOpinion
    })
  }

  hasNoOpinion() {
    return this.props.data.values.includes("No Opinion")
  }

  renderChartOptions() {
    const { display } = this.state;
      return <div className='chart__options'>
        <button className={display == 'bar' ? 'chart__option--selected' : undefined} title="Bar chart of participant responses" onClick={() => this.setDisplay('bar')}><FaSignal/></button>
        { (this.props.data.values.length > 1) &&  <button title="Stacked view of each response grouped by option" className={display == 'stack' ? 'chart__option--selected' : undefined} onClick={() => this.setDisplay('stack')}><FaLayerGroup/></button> }
        <button title="Percent of respondents to the question who selected a specific option" onClick={() => this.setDisplay('percent')} className={display == 'percent' ? 'chart__option--selected' : undefined }><FaPercent/></button>
        { this.hasNoOpinion() && <button className={this.state.noOpinion ? 'chart__option--selected' : undefined} onClick={this.toggleNoOpinion}>No Opinion</button> }
      </div>
  }

  render() {
    const stackId = this.state.display == 'bar' ? null : 'stack' 
    const showPercent = this.state.display == 'percent'
    return(
      <div className='chart'>
        {this.props.title && <div className='chart__title'>{this.props.title} ({this.props.data.total} Responses)</div>}
        {this.renderChartOptions()}
        <div className='chart__wrapper'>
        <div className='chart__chart'>
        <ResponsiveContainer width="99%" height={600}>
         <BarChart
          data={this.displayData()}
          margin={{
            top: 5, right: 120, left: 20, bottom: 120,
          } }
        >
          <CartesianGrid strokeDasharray="3 3" />
          {this.props.data.series.length > 1 && <XAxis dataKey="name" width={50} tick={<TiltedAxisTick display={this.state.display}/>}  interval={0} />}
          <YAxis />
          <Tooltip />
          {this.props.data.values.length > 1 && <Legend verticalAlign="top" align="right" height={36} />}
          {map(this.props.data.values, (value,index) => <Bar stackId={stackId} dataKey={value} key={value} fill={this.fill[index]} ><LabelList dataKey={value} fontSize={this.props.data.series.length > 11 ? "11" : "13"} position="center" content={(v) => v.value ? (showPercent ? `${v.value}%` : v.value) : '' } /> </Bar>)}
        </BarChart>
        </ResponsiveContainer>
        </div>
        {this.showExtra()}
        </div>
      </div>
      )
  }
}

export default MultiBarChart;
