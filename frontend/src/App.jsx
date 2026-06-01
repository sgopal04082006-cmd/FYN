import Home from './pages/Home'
import Detailed from './pages/Detailed'
import Login from './auth/Login'
import Signup from './auth/Signup'
import ForgotPassword from './auth/ForgotPassword'
import RoleSelect from './auth/RoleSelect'
import Input from './owner/Input'
import Dashboard from './owner/Dashboard'
import EditHouse from './owner/Edit'
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/home" element={<Home />} />
        <Route path="/owner/dashboard" element={<Dashboard />} />
        <Route path="/owner/add" element={<Input />} />
        <Route path="/owner/edit/:id" element={<EditHouse />} />
        <Route path="/login" element={<Navigate to="/login/tenant" replace />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/signup" element={<Navigate to="/signup/tenant" replace />} />
        <Route path="/signup/:role" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/:id" element={<Detailed />} />
      </Routes>
    </>
  )
}

export default App
