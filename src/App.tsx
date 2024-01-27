import './App.css'
import { useFfmpeg } from './ffmpeg';
import VideoEditor from './components/VideoEditor';

function App() {
  const { editVideo, wasmLoaded } = useFfmpeg();

  
  if (!wasmLoaded) return (
    <div>Loading...</div>
  )

  return (
    <VideoEditor />
  )
}

export default App
