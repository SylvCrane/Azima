import React, { useRef, useState } from "react";
import "../../css/style.css";
import "../../css/help.css";

export const Help = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const nameRef = useRef();
  const emailRef = useRef();
  const messageRef = useRef();

  const handleSave = async (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const message = messageRef.current.value;

    try {
      const response = await fetch("http://localhost:8082/api/help", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setAlertMessage("Message sent successfully!");
      } else {
        setAlertMessage("Failed to send the message.");
      }

      // Reset the form fields
      nameRef.current.value = "";
      emailRef.current.value = "";
      messageRef.current.value = "";
    } catch (error) {
      console.error("Error sending message: ", error);
      setAlertMessage("Failed to send the message.");
    }
  };

  return (
    <div className="container">
      <br></br>
      <center><h3>NEED TO GET IN TOUCH?</h3></center>
      <center><h1>Contact Azima</h1></center><br/>
      <div className="help-message">
        <p>Have a question that needs to be answered? <br/>Fill out the form below and the Azima team will get back to you as soon as we can!</p>
      </div>
      <br></br>
      <div className="help-form" onSubmit={handleSave}>
        <b><label htmlFor="name">Your Name:</label></b>
        <input type="text" name="name" id="name" placeholder='Enter Name' ref={nameRef} />

        <b><label htmlFor="email">Your Email:</label></b>
        <input type="email" name="email" id="email" placeholder='Enter Email' ref={emailRef} />

        <b><label htmlFor="message">Your Message:</label></b>
        <textarea id="message" name="message" placeholder='Enter Message Here' ref={messageRef} />
        <br></br>
        <button type='submit'><b>Send Message</b></button>
      </div>
      {alertMessage && <p>{alertMessage}</p>}
    </div>
  );
};
