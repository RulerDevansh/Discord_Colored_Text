import FontColor from './components/FontColor';
import BackGroundColor from './components/BackGroundColor';
import TextArea from './components/TextArea';
import {Text} from '@mantine/core';


export default function App() {
  return (
    <div className='App h-screen pt-20 bg-gradient-to-r from-cyan-50 via-amber-100 to-fuchsia-200'>
      <Text

        size="xl"
        fs="italic"
        ta="center"
        fw={900}
        variant="gradient"
        gradient={{ from: 'violet', to: 'rgba(0, 0, 0, 1)', deg: 0 }}>
          Discord Colored Text Generator
      </Text>
      <div className='container mx-auto mt-10 flex justify-evenly items-center h-2/3'>
        <div className="Font w-1/3 h-[100%]">
          <FontColor />
        </div>
        <div className="Background w-1/3 h-[100%] ">
          <BackGroundColor />
        </div>
        <div className="TextArea w-1/3 h-[100%]">
          <TextArea />
        </div>
      </div>
      <footer className='fixed bottom-0 w-full'>
        <div className="flex justify-evenly items-center h-8 sm:h-16 text-red-600">
          <p>&copy; Made by Devansh Srivastava</p>
        </div>
      </footer>
    </div>
  );
}
