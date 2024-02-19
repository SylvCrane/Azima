import { Route, Routes, Navigate } from "react-router-dom";
import "./css/style.css";
import About from './pages/About';
import Editor from './pages/Editor';
import Tours from './pages/Tours';
import Account from './pages/accounts/Account';
import { Navbar } from "./NavBar";

function App() {
    return (
        <div className="App">
            <Navbar/> 
                <Routes>
                    <Route path="/" element={<Navigate to="/tours" />} />
                    <Route path="/tours" element={<Tours />} />
                    <Route path="/editor" element={<Editor />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/account" element={<Account />} />
                </Routes>
        </div>
    );
}

export default App;