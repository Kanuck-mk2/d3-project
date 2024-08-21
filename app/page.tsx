'use client';
import React, { useState } from 'react';
import ChordGraph from '../component/ChordGraph';
import SankeyDiagram from '../component/Sankey';

type ChordData = number[][];

interface SankeyNode {
  name: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export default function Home() {
  // Initialize state with the first dataset for the Chord graph
  const originalData: ChordData = [
    [11975, 5871, 8916, 2868],
    [1951, 10048, 2060, 6171],
    [8010, 16145, 8090, 8045],
    [1013, 990, 940, 6907],
  ];

  const secondData: ChordData = [
    [5000, 2000, 3000, 4000],
    [6000, 7000, 2030, 3000],
    [3000, 4700, 7000, 5000],
    [2000, 3040, 5000, 1000],
  ];

  const [chordData, setChordData] = useState<ChordData>(originalData);
  const [toggle, setToggle] = useState(false);

  const changeData = () => {
    setChordData(toggle ? originalData : secondData);
    setToggle(!toggle);
  };

  // Sankey data definition
  const sankeyData: SankeyData = {
    nodes: [
      { name: 'Solar' },
      { name: 'Nuclear' },
      { name: 'Coal' },
      { name: 'Tidal' },
      { name: 'Wind' },
      { name: 'Oil' },
      { name: 'Gas' },
      { name: 'Geothermal' },
      { name: 'I' },
      { name: 'J' },
      { name: 'K' },
      { name: 'L' },
    ],
    links: [
      { source: 'Nuclear', target: 'L', value: 10 },
      { source: 'Nuclear', target: 'K', value: 5 },
      { source: 'Wind', target: 'Oil', value: 15 },
      { source: 'Wind', target: 'Geothermal', value: 5 },
      { source: 'Nuclear', target: 'L', value: 15 },
      { source: 'Solar', target: 'Geothermal', value: 15 },
      
    ],
  };
  

  return (
    <div className="flex flex-col justify-center items-center container mx-auto p-1">
      <h1 className="text-center text-white text-2xl font-bold mb-8">
        Data Visualizations
      </h1>
      <div className=" justify-center items-center mb-12">
        <h2 className="text-center text-xl text-white font-semibold mb-4">
          Chord Graph
        </h2>
        <div className='w-[500px] h-[500px]'>
        <ChordGraph data={chordData} />
        </div>
        <div className="flex justify-center items-center">
          <button
            type="button"
            className="mt-4 p-4 bg-blue-500 text-black rounded hover:bg-sky-400"
            onClick={changeData}
          >
            Change Data
          </button>
        </div>
      </div>
      <div className=' flex flex-col justify-center items-center lg:flex sm:flex-auto w-[900px] h-[900px] '>
        <h2 className="text-center text-xl text-sky-400 font-semibold mb-4">
          Sankey Diagram
        </h2>
        <SankeyDiagram data={sankeyData} />
      </div>
    </div>
  );
}
