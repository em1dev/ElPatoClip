import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import MainTemplate from './components/Templates/MainTemplate/index.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MainTemplate>
    <App />
  </MainTemplate>
)
