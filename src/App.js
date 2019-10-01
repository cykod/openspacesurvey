import React from 'react';
import './App.css';


import OptionsSelect from "./OptionsSelect.js"
import MultiBarChart from "./MultiBarChart.js"
import DemoPieChart from "./DemoPieChart.js"
import TextWordCloud from "./TextWordCloud.js"

import { filter, each, pickBy, isEqual, map, sort, compact, sortBy } from "lodash"

import bringingOrKeeping  from './data/bringing_or_keeping.json';
import keepingCommunityCharacter from "./data/keeping_community_character.json"
import satisfiedForGroups from "./data/satisfied_for_groups"
import managingAndMaintaining from "./data/managing_and_maintaining"
import preserveAdditionalLand from "./data/preserve_additional_land"
import interconnectedTrailSystem from "./data/interconnected_trail_system"
import participate from "./data/participate"
import openSpaceRegularlyUse from  "./data/open_space_regularly_use"
import playgroundsFieldRegularlyUse from "./data/playgrounds_fields_regularly_use"
import prioritize from "./data/prioritize"


import improvements from "./data/improvements" 
import important5Years from "./data/important_5_years"

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      resident: ["Yes"],
      district: ["All"],
      household: ["All"],
      children: ["All"],
      seniors: ["All"]
    }

    this.filterOptions = this.buildFilterOptions()
  }

  buildFilterOptions() {
    return {
      resident: ['All','Yes','No'],
      district: ['All','District 1','District 2','District 3','District 4','District 5','District 6'],
      household:['All', "1",'2','3','4',['5+','5']],
      children: ['All','0','1','2','3','4',['5+','5']],
      seniors:  ['All','0','1','2',['3+','3']]
    }
  }

  componentDidMount() {

  }

  clickOption = (name, option, checked) => {
    var value = [...this.state[name]]

    if(checked) {
      if(option === "All") {
        value = ["All"]
      } else {
        value = filter(value,(v) => v !== "All")
        value.push(option)
      }
    } else {
      if(option === "All") {
        value = filter(this.filterOptions[name], (v) => v !== "All")
      } else {
        value = filter(value,(v) => v !== option)
        if(value.length === 0) { value = ['All']}
      }
    }

    this.setState({ [name]: value })
  }


  filterRowsByPivots(data,showPivot) {
    var filtered = data;

    const pivots = Object.keys(this.filterOptions)

    each(pivots, (pivot) => {
      if(!isEqual(this.state[pivot],['All'])) {
        filtered = filter(filtered, (row) => this.state[pivot].includes("" + row[pivot]))
      }
    })
    return map(filtered, (row) => { return pickBy(row, (_value, key) => (!showPivot && !pivots.includes(key)) || (showPivot && showPivot == key))})
  }

  filterMultiData(data,portion="all",showPivot=false) {
    const filtered = this.filterRowsByPivots(data,showPivot);

    var series = Object.keys(filtered[0] || {})
    var values = {}

    var output = {}
    each(series,(name) => {
      output[name] = {}
    })
    
    each(filtered, (row) => {
      each(series, (name) => {
        var val = row[name]
        if(val == "0 (No Opinion)") {
          val = "No Opinion"
        }
        if(val !== null && val !== false && val !== "null") {
          values[val] = true;
          output[name][val] = (output[name][val] || 0) + 1
        }
      })
    })

    var outputArr =  map(series, (name) => {
      return { name: name, ...output[name]}
    })

    var valueKeys = Object.keys(values)
    valueKeys.sort()

    if(portion != 'all') {
      const cutoff = Math.floor(series.length/2)
      if(portion == "first") {
        series = series.slice(0, cutoff)
        outputArr = outputArr.slice(0, cutoff)
      } else {
        series = series.slice(cutoff)
        outputArr = outputArr.slice(cutoff)
      }
    }

    return {
      data: outputArr,
      series: series,
      values: valueKeys,
      total: filtered.length
    }
  }

  filterWordCloudData(data) {
    const filtered = this.filterRowsByPivots(data);
    return map(filtered,(row) => row['question']);
  }

  pieChartData(field) {
    const filteredData = this.filterMultiData(bringingOrKeeping,"all",field)
    const outputData = filter(map(filteredData.data[0], 
                                  (v,k) => { return k != 'name' ? { name: k, value: v } : null }),
                              (r) => r !== null)
    return sortBy(outputData, (row) => row.name )
  }

  render() {
    return <div>
      <div className='options'>
        <OptionsSelect name='resident' title="Amesbury Resident" options={this.filterOptions.resident} selected={this.state.resident} onClick={this.clickOption} />
        <OptionsSelect name='district' title="District"  options={this.filterOptions.district} selected={this.state.district} onClick={this.clickOption} />
        <OptionsSelect name='household' title="Size of household" options={this.filterOptions.household} selected={this.state.household} onClick={this.clickOption} />
        <OptionsSelect name='children' title="Children in household" options={this.filterOptions.children} selected={this.state.children} onClick={this.clickOption} />
        <OptionsSelect name='seniors' title="Seniors in household" options={this.filterOptions.seniors} selected={this.state.seniors} onClick={this.clickOption} />
      </div>
      <div className='demographics'>
        <DemoPieChart  data={this.pieChartData('district')} title="District" />
        <DemoPieChart  data={this.pieChartData('household')} title="Household Size" />
        <DemoPieChart  data={this.pieChartData('children')} title="Children in Household" />
        <DemoPieChart  data={this.pieChartData('seniors')} title="Seniors in Household" />
      </div>
      <div className='charts'>`
        <MultiBarChart  data={this.filterMultiData(bringingOrKeeping)} title="How important were the following Open Space and Recreational Resources in bringing you to or keeping youu in Amesbury?" />
        <MultiBarChart  data={this.filterMultiData(keepingCommunityCharacter)} title="How important do you rate the following to maintaining Amesbury's community character?" />
        <MultiBarChart  data={this.filterMultiData(satisfiedForGroups)} title="How satisfied are you with Amesbury's recreational options for the following groups?"/>
        <MultiBarChart  data={this.filterMultiData(managingAndMaintaining,"first")} title="How is Amesbury doing in managing and maintaining its Open Space and Recreation Resources?" />
        <MultiBarChart  data={this.filterMultiData(managingAndMaintaining,"second")}  />


        <MultiBarChart  data={this.filterMultiData(preserveAdditionalLand)} title="How important is it for Amesbury to preserve additional land for:" />


        <MultiBarChart  data={this.filterMultiData(interconnectedTrailSystem)} title="Would you like to see the City have an inter-connected trail system (bike paths, sidewalks, and biking/walking trails)?" />

        <MultiBarChart  data={this.filterMultiData(participate)} title="Please identify the recreational activities in which you and your household currently participate or would like to participate. Check all that apply (and ignore the rest)." />

        <MultiBarChart  data={this.filterMultiData(openSpaceRegularlyUse)} title="Which places in Amesbury do members of your household regularly use for things like walking, hiking, biking and boating? (Check all that apply, ignore the rest)" />

        <MultiBarChart  data={this.filterMultiData(playgroundsFieldRegularlyUse)} title="What playgrounds or athletic facilities in Amesbury do members of your household regularly use? (Check all that apply)" />

        <MultiBarChart  data={this.filterMultiData(prioritize)} title='Where should Amesbury prioritize its resources (planning, maintenance, improvement, expansion)? (Please choose your top 4)'/>
        

        <TextWordCloud words={this.filterWordCloudData(improvements)} title="What improvement(s) do you suggest for ANY open space, park or recreational facilities in Amesbury?" />

        <TextWordCloud words={this.filterWordCloudData(important5Years)} title= 'What are the most important open space or recreation actions the City should take in the next 5 years? For example, should the City acquire a specific piece of property? Save a particular existing resource? Initiate a particular program? Develop a site? Concentrate on maintenance?, etc.' />

      </div>
    </div>
  }

}

export default App;
