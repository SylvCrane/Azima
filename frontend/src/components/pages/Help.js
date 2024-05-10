import React, { useState } from "react";
import "../../css/style.css";
import "../../css/help.css";
//import { useNavigate } from "react-router-dom";

export const Help = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Variable for email pattern regex
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  // Vairiable to user import useNavigate 
  //const navigate = useNavigate();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    console.log(name, email, message);

    // First check is email address entered is a valid email address
    if(!emailRegex.test(email)) {
      setAlertMessage("Invalid email address");
      return;
  }

    fetch("http://localhost:8082/api/help", {
        method: "POST",
        crossDomain: true, 
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            name: name,
            email: email,
            message: message,
        }),
    })

    .then((res) => res.json())
    .then((data) => {
      console.log(data, "help");
            
      if (data.status === "ok") {
          setAlertMessage("Message has been sent. The Azima team will get back to you when we can!");
      } 
      else {
          setAlertMessage("Could not send email. Please check your email or try again later.");
      }
    });
  }

  return (
    <div className="container">
      <br></br>
      <center><h3>NEED TO GET IN TOUCH?</h3></center>
      <center><h1>Contact Azima</h1></center><br/>
      <div className="help-message">
        <p>Have a question that needs to be answered? <br/>Fill out the form below and the Azima team will get back to you as soon as we can!</p>
      </div>
      <br></br>
      <form className="help-form" onSubmit={handleSendMessage}>
        <b><label htmlFor="name-label">Your Name:</label></b>
        <input value={name} onChange={(e) => setName(e.target.value)} id="name" placeholder="Enter name" required/>

        <b><label htmlFor="email">Your Email:</label></b>
        <input value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Enter email" required/>

        <b><label htmlFor="message">Your Message:</label></b>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} id="message" placeholder="Enter message" required/>
        <br></br>

        <button type='submit'><b>Send Message</b></button><br></br>
        { alertMessage && (
            <div className="alert">{ alertMessage }</div>
        )} <br/>
      </form>
    </div>
  );
};
