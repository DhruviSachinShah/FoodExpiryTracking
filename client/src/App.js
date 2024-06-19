import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUp from './pages/SignUp/SignUp';
// import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Dishes from './pages/Dishes/Dishes';
import Recipes from './pages/Recipes/Recipes';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/sign-up" />}/>
          <Route path="/sign-up" element={<SignUp />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/home" element={<Home />}/>
          <Route path="/dishes/:ingredient" element={<Dishes />}/>
          <Route path="/recipes/:id" element={<Recipes />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
