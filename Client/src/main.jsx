import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { App } from './App'
import ErrorBoundary from './components/common/error/error'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
    <App/>
    </ErrorBoundary>
  
  </React.StrictMode>,
)
