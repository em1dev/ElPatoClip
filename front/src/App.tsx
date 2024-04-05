import ClipPage from './components/Pages/ClipPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SearchPage from './components/Pages/SearchPage';
import MainTemplate from './components/Templates/MainTemplate';
import { TosPage } from './components/Pages/InfoPages/TosPage';
import { PrivacyPage } from './components/Pages/InfoPages/PrivacyPage';
import { VideoEditorPage } from './components/Pages/VideoEditorPage';
import { LoginPage } from './components/Pages/LoginPage';
import { UserProvider } from './authContext';
import { AccountPage } from './components/Pages/AccountPage';
import { AuthPage } from './components/Pages/AuthPage';

const Template = ({ children, withHeader = true }: { children: React.ReactNode, withHeader?: boolean }) => (
  <UserProvider>
    <MainTemplate withHeader={withHeader}>
      {children}
    </MainTemplate>
  </UserProvider>
);

const router = createBrowserRouter([
  {
    path: '/',
    element:
      <Template>
        <SearchPage />
      </Template>
  },
  {
    path: '/account',
    element:
      <Template>
        <AccountPage />
      </Template>
  },
  {
    path: '/login',
    element: 
      <Template withHeader={false} >
        <LoginPage />
      </Template>
  },
  {
    path: '/:action/:authService',
    element:
      <Template withHeader={false} >
        <AuthPage />
      </Template>
  },
  {
    path: '/clips/:channelId',
    element:
      <Template>
        <ClipPage />
      </Template>
  },
  {
    path: '/editor/:clipId',
    element: 
      <UserProvider>
        <VideoEditorPage />
      </UserProvider>
  },
  {
    path: '/tos',
    element: 
      <Template>
        <TosPage />
      </Template>
  },
  {
    path: '/privacy',
    element: 
      <Template>
        <PrivacyPage />
      </Template>
  },
]);

const App = () => (
  <RouterProvider router={router} />
);

export default App;
