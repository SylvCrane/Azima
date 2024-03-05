import { Route, Routes } from "react-router-dom";
import "./css/style.css";
import { Navbar } from "./NavBar";
import { Home } from './pages/Home';
import { Tours } from './pages/Tours';
import { Editor}  from './pages/Editor';
import { About } from './pages/About';
import { Account } from './pages/accounts/Account';
import { SignUp } from "./pages/accounts/SignUp";
import { Login } from "./pages/accounts/Login";

function App() {
    return (
        <div className="App">
            <Navbar /> 
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/tours" element={<Tours />} />
                    <Route path="/about" element={<About />} />
                    {/*{userLoggedIn && <Route path="/editor" element={<Editor />} />} {/* Editor will only be rendered if user is logged in*/}
                    <Route path="/editor" element={<Editor />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/account/signup" element={<SignUp />} />
                    <Route path="/account/login" element={<Login />} />
                </Routes>
        </div>
    );
}

export default App;