import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import ImageUpload from './components/ImageUpload';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<ImageUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
