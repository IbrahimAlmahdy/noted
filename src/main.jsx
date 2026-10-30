import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './notes.css'
import App from './NotesApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
