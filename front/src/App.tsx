import './App.css'
import ClipPage from './components/Pages/ClipPage';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SearchPage from './components/Pages/SearchPage';
import { TwitchVideoEditor } from './components/Pages/VideoEditor/TwitchVideoEditor';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SearchPage />,
  },
  {
    path: '/clips/:channelId',
    element: <ClipPage />
  },
  {
    path: '/editor/:clipId',
    element: <TwitchVideoEditor />
  }
]);

const App = () => (
  <RouterProvider router={router}/>
)

export default App
