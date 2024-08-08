import React from 'react';
import ChordGraph from '../component/ChordGraph' // Make sure to adjust the path accordingly
import SankeyDiagram from '../component/Sankey'; // Make sure to adjust the path accordingly

const App: React.FC = () => {
  const chordData = [
    [11975, 5871, 8916, 2868],
    [1951, 10048, 2060, 6171],
    [8010, 16145, 8090, 8045],
    [1013, 990, 940, 6907],
  ];

  const sankeyData = {
    nodes: [
      { name: "A" },
      { name: "B" },
      { name: "C" },
      { name: "D" },
      { name: "E" }
    ],
    links: [
      { source: 0, target: 1, value: 10 },
      { source: 1, target: 2, value: 5 },
      { source: 1, target: 3, value: 15 },
      { source: 2, target: 4, value: 5 },
      { source: 3, target: 4, value: 10 }
    ]
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mb-8">Data Visualizations</h1>
      <div className="mb-12">
        <h2 className="text-center text-xl font-semibold mb-4">Chord Graph</h2>
        <ChordGraph data={chordData} />
      </div>
      <div>
        <h2 className="text-center text-xl font-semibold mb-4">Sankey Diagram</h2>
        <SankeyDiagram data={sankeyData} />
      </div>
    </div>
  );
};

export default App;
