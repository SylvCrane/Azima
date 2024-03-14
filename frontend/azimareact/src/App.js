import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';


import Main from './components/main';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path = '/' element={<Main />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
