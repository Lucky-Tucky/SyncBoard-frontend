import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './component/Auth/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login"></Navigate>}></Route>
      <Route path='/login' Component={Login}></Route>
    </Routes>
  );
}

export default App;
