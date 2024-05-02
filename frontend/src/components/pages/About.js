import React from "react";
import "../../css/about.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const About = () => {

    const navigate = useNavigate();


    const data = [
    {
        question: "What is Azima?",
        answer: 
        "Azima is a web platform that allows you to create and host 360° virtual tours!" +
        " Azima started as a collaboration with MJ Home and Jayden Digital to address their desire for " + 
        "virtual property tours in New Zealand due to COVID-19 and geographical limitations." +
        " Azima has since evolved to become its own entity, allowing users to create or view 360° virtual tours " + 
        "for various purposes." +
        " Our upcoming VR app will allow tours to be experienced using Meta Quest 2 headsets, allowing users to have a more immersive experience when viewing their tours."
    },
    {
        question: "How do I use Azima?",
        answer: 
        "To get started on creating your tour, you will need to register or login to use our editor application. " +
        "After completing this step, a more thorough guideline on how to create a tour is available on our ",
        linkText: "home page.",
        linkAction: () => navigate("/home")
    },
    {
        question: "Who is behind Azima?",
        answer: "Four University students - Brandyn Cronin, Maxinne Santico, Navjot Sandhu and Jiayan Ying. We began Azima for our Research and Development project during our final year studying Computer and Information Sciences at Auckland University of Technology. "
    },
    {
        question: "What is Azima's purpose?",
        answer: 
        "Azima's purpose is to help businesses that are seeking a solution to host virtual tours, providing an innovative platform that enhances their marketing and customer engagement strategies. " + 
        "By providing an easy and accessible solution for 360° virtual tours, Azima helps businesses overcome challenges related to physical location constraints and enhances accessibility. " + 
        "This is particularly valuable for real estate, hospitality, retail and event management industries where a visual experience can play an important role in decision making processes. "
    },
  ];

  const [selected, setSelected] = useState(null);

  const toggle = (index) => {
    if (selected === index)
     {
    // Deselect if it's already selected
      setSelected(null); 
    } else {
        // Select the clicked item
      setSelected(index); 
    }
  };

  return (
    <div className="container">

      <div className="header-content">
        <h1>About Us & Frequently Asked Questions</h1><br/>
        <p>Need assistance with Azima? Simply click on the '+' beside any question to learn more. </p>
      </div>

      <div className="about">
        {/* div for the questions */}
        <div className="boxes">
          {data.map((item, index) => (
            <div className="item" key={index}>
              {/* Lets the user click on the question titles */}
              <div className="title" onClick={() => toggle(index)}>
                <h2> {item.question}</h2>
                <span>{selected === index ? <b>-</b> : <b>+</b>}</span>
              </div>
              {/* answer for the questions shown */}
              <div className={selected === index ? 'content show' : 'content'}>
                {item.answer}
                {item.linkText && (
                  <span className="link-text" onClick={(e) => {
                      e.stopPropagation(); // Prevent the toggle action when clicking the link
                      item.linkAction(); }}>
                    {item.linkText}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p> Do not see your Question here? Head over to our <a href ="/help"><u>Help Page</u></a> to send any enquiry! </p>
      <br/><br/>
    </div>
  );
}