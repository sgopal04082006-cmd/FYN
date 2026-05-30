import Home from './pages/Home'
import Detailed from './pages/Detailed'
import Login from './auth/Login'
import Signup from './auth/Signup'
import ForgotPassword from './auth/ForgotPassword'
import RoleSelect from './auth/RoleSelect'
import Input from './owner/Input'
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/home" element={<Home />} />
        <Route path="/owner/add" element={<Input />} />
        <Route path="/login" element={<Navigate to="/login/tenant" replace />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/:id" element={<Detailed />} />
      </Routes>
    </>
  )
}

export default App
