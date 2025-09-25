import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.css'; 
import UserContext from './context/UserContext.jsx';
import CaptainContext from './context/CaptainContext.jsx';
import 'remixicon/fonts/remixicon.css';
import SocketProvider from './context/SocketContex.jsx';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CaptainContext>
     <UserContext>
      <SocketProvider>
       <BrowserRouter>
      <App />
    </BrowserRouter>
    </SocketProvider>
     </UserContext>
    </CaptainContext>
  </React.StrictMode>
);
