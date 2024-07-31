'use client'


import React, { useState } from 'react';
import ChordGraph from '../component/ChordGraph';

const Home: React.FC = () => {
  const [data, setData] = useState<number[][]>([
    [11975, 5871, 8916, 2868],
    [1951, 10048, 2060, 6171],
    [8010, 16145, 8090, 8045],
    [1013, 990, 940, 6907, 5563],
  ]);

  // Example function to modify data
  const updateData = () => {
    setData([
      [12000, 6000, 9000, 3000],
      [2000, 11000, 2500, 6500],
      [8200, 16200, 8200, 8100],
      [1200, 1000, 1000, 7000, 5700],
    ]);
  };

  return (
    <div className="bg-black flex flex-col items-center justify-center text-center min-h-screen py-2">
      <h1 className="text-4xl text-center font-bold mb-8 text-sky-400">D3 Chord Graph</h1>
      <ChordGraph data={data} />
      <button onClick={updateData} className=" flex justify-center items-centermt-4 p-2 bg-blue-500 text-white rounded">
        Update Data
      </button>
    </div>
  );
};

export default Home;
