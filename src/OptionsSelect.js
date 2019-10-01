import React from 'react';


import {map} from "lodash"


class OptionSelect extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  clickOption(opt, e) {
    this.props.onClick(this.props.name, opt, e.currentTarget.checked)
  }

  renderOption = (opt) => {
    var name = opt;
    var value = opt;

    if(typeof opt ==  "object") {
      name = opt[0]
      value = opt[1]
    }
    const checked = this.props.selected.includes(value)
    return <label key={value} className={`options__label ${checked && 'options__label--checked'}`}><input type='checkbox' checked={checked} name={`${this.props.title}[${value}]`} onChange={(e) => this.clickOption(value,e) }/>{name}</label>
  }

  render() {
    return(
      <React.Fragment>
      <div className='options__title'>{this.props.title}</div>
      {map(this.props.options,this.renderOption)}
      </React.Fragment>
      )
  }

}

export default OptionSelect;
