import React from 'react';
import ReactDOM from 'react-dom/client';

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Layout from './pages/Layout';
import VideoUpload from './pages/VideoUpload';
import NotFound from './pages/NotFound';
import VideoFrames from './pages/VideoFrames';
import VideoDetect from './pages/VideoDetect';
import VideoRender from './pages/VideoRender';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="upload" element={<VideoUpload />} />
      <Route path="extract" element={<VideoFrames />} />
      <Route path="detect" element={<VideoDetect />} />
      <Route path="render" element={<VideoRender />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
</BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
