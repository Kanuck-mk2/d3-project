'use client'

import React, { useState } from 'react';
import ChordGraph from '../component/ChordGraph';

const defaultData: number[][] = [
  [11975, 971, 8916, 2868],
  [1951, 10048, 2060, 6171],
  [8010, 16145, 8090, 8045],
  [1013, 990, 940, 6907, 5563],
];

const updatedData: number[][] = [
  [12700, 6000, 4000, 9000],
  [2000, 11000, 7500, 6500],
  [8200, 12200, 8255, 8100],
  [7200, 1000, 1240, 3000, 5700],
];

const Home: React.FC = () => {
  const [data, setData] = useState<number[][]>(defaultData);
  const [isDefault, setIsDefault] = useState(true);

  
  const toggleData = () => {
    setData(isDefault ? updatedData : defaultData);
    setIsDefault(!isDefault);
  };

  return (
    <div className="bg-black flex flex-col items-center justify-center text-center min-h-screen py-2">
      <h1 className="text-4xl  font-bold mb-8 text-sky-400 flex justify-center items-center h-full w-full">D3 Chord Graph</h1>
      <ChordGraph data={data} />
      <button onClick={toggleData} className="mt-4 p-2 bg-white-500 text-black rounded">
        {isDefault ? 'Switch to Updated Data' : 'Switch to Default Data'}
      </button>
    </div>
  );
};

export default Home;
