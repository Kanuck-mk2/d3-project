// app/page.tsx
import ChordGraph from '../component/ChordGraph';
import { motion } from 'framer-motion';

const data: number[][] = [
  [11975, 5871, 8916, 2868],
  [1951, 10048, 2060, 6171],
  [8010, 16145, 8090, 8045],
  [1013, 990, 940, 6907, 5563],
  
];

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8 text-sky-400">D3 Chord Graph</h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <ChordGraph data={data} />
      </motion.div>
    </div>
  );
};

export default Home;
