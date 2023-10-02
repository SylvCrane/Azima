import  azima  from "../../../public/azima.svg"
import Image from 'next/image';
const Navbar = () =>{
    return (
        <nav>
            <div className="logo">
                <Image  src = {azima} height= {50}/>
            </div>
            <h1>Real Estate</h1>
            <h1>Tours</h1>
            <h1>Other Media</h1>
            <h1>Editor</h1>
            <h1>Contact</h1>
          
        </nav>
    );
    }
    export default Navbar;