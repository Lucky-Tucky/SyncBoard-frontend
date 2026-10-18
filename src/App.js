import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './component/Auth/Login';
import AuthGuard from './component/AuthGuard/AuthGuard';
import Dashboard from './component/DashBoard/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/auth" element={<Login />} />
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route element={<AuthGuard />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;

