import React from 'react';
import ReactWordcloud from 'react-wordcloud';

import wf from 'word-freq'
import sw from 'stopword'

import { reduce, map } from "lodash"

const options = {
  colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
  enableTooltip: true,
  deterministic: false,
  fontFamily: 'impact',
  fontSizes: [5, 60],
  fontStyle: 'normal',
  fontWeight: 'normal',
  padding: 1,
  rotations: 3,
  rotationAngles: [0, 90],
  scale: 'sqrt',
  spiral: 'archimedean',
  transitionDuration: 1000,
};

function wordDisplay(word,index) {
  return <div key={index} className="chart__word">{word}</div>
}

function TextWordCloud(props) {
  return (
    <div>
      <div className='chart__title'>{props.title}</div>
      <div className="chart__words">
        {map(props.words, wordDisplay)}
      </div>
    </div>
  );
}

export default TextWordCloud;