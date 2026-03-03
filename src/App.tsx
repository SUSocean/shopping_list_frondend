import { BrowserRouter, Routes, Route } from 'react-router';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ListPage from './pages/ListPage';

import { Toaster } from "@/components/ui/sonner"
function App() {


  return (
    
    <div className='min-h-screen flex items-center justify-center bg-background'>
    <div className='w-full max-w-2xl'>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/list/:list_id" element={<ListPage />} />
          </Routes>
        </BrowserRouter>
      </div>
          <Toaster />

    </div>
  )
}

export default App
