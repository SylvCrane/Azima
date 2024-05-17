import React, { useState } from 'react';
import "../../css/flipcard.css"

const FlipCard = ({ frontText, backText }) => {
  const [flipped, setFlipped] = useState(false);

  const flipCard = () => {
    setFlipped(!flipped);
  };

  return (
    <div className={`flip-card ${flipped ? 'flipped' : ''}`} onClick={flipCard}>
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <h3 className="font-color">{frontText}</h3>
        </div>
        <div className="flip-card-back">
          <p className="font-color">{backText}</p>
        </div>
      </div>
    </div>
  );
};

export const FlipCards = () => {
  const cards = [
    { front: 'How many virtual tours can I create with Azima?', back: 'Unlimited, as long as you are a registered memeber!' },
    { front: 'What type of photos do I need to create a 360° tour on Azima', back: 'Azima requires 360° photos with a 2:1 aspect ratio.' },
    { front: 'What type of camera do I need to capture a 360° photo for a 360° tour?', back: 'We recommend a single shot 360° camera. Any 360° cameras works well. Azima is compatible with any 360° photo output.' },
    { front: 'How many photos are needed to create a 360° virtual tour?', back: 'You only need one photo to get started.' },
    { front: 'How can we share Azima tours to clients or friends?', back: 'Currently, Azima does not offer a feature for sharing tours directly, providing only an option to share them publicly on our website. However, future plans include implementing a sharing feature that will enable users to effortlessly share their tours outside of our website.' },
    { front: 'Can I view these virtual tours in a VR headset?', back: 'Yes, currently Azima has a VR application compatiable with Meta Quest 2 headsets.' },
  ];

  return (
    <div className="flip-card-grid">
      {cards.map((card, index) => (
        <FlipCard key={index} frontText={card.front} backText={card.back} />
      ))}
    </div>
  );
};