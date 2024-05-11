import React, { useState } from "react";
import "../../css/style.css";
import "../../css/help.css";
//import { useNavigate } from "react-router-dom";

export const Help = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Variable for email pattern regex
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  // Vairiable to user import useNavigate 
  //const navigate = useNavigate();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    console.log(name, email, subject, message);

    // First check is email address entered is a valid email address
    if(!emailRegex.test(email)) {
      setAlertMessage("Invalid email address.");
      return;
    }

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setAlertMessage("Cannot be left empty.");
      return; // Don't proceed with saving if required fields are empty or only contain whitespace
    }

    // Prepare request options for the fetch call
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        subject: subject,
        message: message,
      }),
    };

    // Fetch call to send the help message to the server
    fetch("http://localhost:8082/api/help", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "ok") {
          setAlertMessage("Message has been sent. The Azima team will get back to you when we can!");
          setName("");  // Clear the form fields
          setEmail("");
          setSubject("");
          setMessage("");
        } else {
          throw new Error(data.message || "Could not send email. Please try again later.");
        }
      })
      .catch((error) => {
        setAlertMessage(error.message || "An error occurred while sending the message.");
      });
  };

  return (
    <div className="container">
      <br></br>
      <center><h3>NEED TO GET IN TOUCH?</h3></center>
      <center><h1>Contact Azima</h1></center>
      <div className="help-message">
        <p>Have a question that needs to be answered?<br/> Fill out the form below and the Azima team will get back to you as soon as we can!</p>
      </div>
      <br></br>
      <form className="help-form" onSubmit={handleSendMessage}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="subject">Subject:</label>
        <input type="text" id="subject" placeholder="Enter subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />

        <label htmlFor="message">Message:</label>
        <textarea id="message" placeholder="Enter message" value={message} onChange={(e) => setMessage(e.target.value)} required />
        <button type="submit">Send Message</button>
        <br/>
        {alertMessage && (
            <div className="alert">{alertMessage}</div>
        )}
      </form>
    </div>
  );
};