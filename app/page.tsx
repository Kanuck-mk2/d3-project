// app/page.tsx
import ChordGraph from '../component/ChordGraph';

const data: number[][] = [
  [11975, 5871, 8916, 2868],
  [1951, 10048, 2060, 6171],
  [8010, 16145, 8090, 8045],
  [1013, 990, 940, 6907, 5563, 9565],
];

const Home: React.FC = () => {
  return (
    <div className=" bg-black flex flex-col items-center justify-center text-center min-h-screen py-2">
      <h1 className="text-4xl text-center font-bold mb-8 text-sky-400">D3 Chord Graph</h1>
      <div>
        <ChordGraph data={data} />
      </div>
    </div>
  );
};

export default Home;
