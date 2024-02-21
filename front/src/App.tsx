import './App.css'
import ClipPage from './components/Pages/ClipPage';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SearchPage from './components/Pages/SearchPage';
import { TwitchVideoEditor } from './components/Pages/VideoEditor/TwitchVideoEditor';
import MainTemplate from './components/Templates/MainTemplate';
import { TosPage } from './components/Pages/InfoPages/TosPage';
import { PrivacyPage } from './components/Pages/InfoPages/PrivacyPage';

const router = createBrowserRouter([
  {
    path: '/',
    element:
      <MainTemplate>
        <SearchPage />
      </MainTemplate>
  },
  {
    path: '/clips/:channelId',
    element:
      <MainTemplate withHeader>
        <ClipPage />
      </MainTemplate>
  },
  {
    path: '/editor/:clipId',
    element:
      <MainTemplate withHeader>
        <TwitchVideoEditor />
      </MainTemplate>
  },
  {
    path: '/tos',
    element: 
      <MainTemplate withHeader>
        <TosPage />
      </MainTemplate>
  },
  {
    path: '/privacy',
    element: 
      <MainTemplate withHeader>
        <PrivacyPage />
      </MainTemplate>
  },
]);

const App = () => (
  <RouterProvider router={router}/>
)

export default App
