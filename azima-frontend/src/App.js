import { Route, Routes } from "react-router-dom";
import "./css/style.css";
import About from './pages/About';
import Editor from './pages/Editor';
import RealEstate from './pages/RealEstate';
import Tours from './pages/Tours';
import Contact from './pages/Contact';
import Account from './pages/accounts/Account';
import { Navbar } from "./NavBar";

function App() {
    return (
        <div className="App">
            <Navbar/> 
          
                <Routes>
                    {/* <Route path="/" element={} /> */}
                    <Route path="/about" element={<About />} />
                    <Route path="/realestate" element={<RealEstate />} />
                    <Route path="/tours" element={<Tours />} />
                    <Route path="/editor" element={<Editor />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/account" element={<Account />} />
                </Routes>
           
        </div>
    );
}

export default App;