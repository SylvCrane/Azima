import React, { useRef, useState } from "react";
import "../../css/help.css";

export const Help = () => {
  const [status, setStatus] = useState("");
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
        setStatus("Message sent successfully!");
      } else {
        setStatus("Failed to send the message.");
      }

      // Reset the form fields
      nameRef.current.value = "";
      emailRef.current.value = "";
      messageRef.current.value = "";
    } catch (error) {
      console.error("Error sending message: ", error);
      setStatus("Failed to send the message.");
    }
  };

  return (
    <div>

      <center><h3>NEED TO GET IN TOUCH?</h3></center>
      <center><h1>Contact Azima</h1></center>
      <div className="description">
        <p>Have a question that needs to be answered? Simply fill out the form below and the Azima team will get back to you as soon as we can!</p>
      </div>
      <form onSubmit={handleSave}>
        <b><label htmlFor="name">Name:</label></b>
        <input type="text" name="name" id="name" placeholder='Enter Name' ref={nameRef} />

        <b><label htmlFor="email">Email:</label></b>
        <input type="email" name="email" id="email" placeholder='Enter Email' ref={emailRef} />

        <b><label htmlFor="message">Message:</label></b>
        <textarea name='message' id="message" cols="40" rows="10" placeholder='Enter Message Here' ref={messageRef} />

        <button type='submit'><b>Send Message</b></button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};
