import React, { useState, useEffect } from "react";

const quotesData = [
  {
    quote: "Elegance is not standing out, but being remembered.",
    author: "Giorgio Armani",
  },
  { quote: "The joy of dressing is an art.", author: "John Galliano" },
  {
    quote: "Fashion is about dreaming and making other people dream.",
    author: "Donatella Versace",
  },
  {
    quote: "Change the world, one sequin at a time.",
    author: "Lady Gaga",
  },
  {
    quote: "I don't design clothes. I design dreams.",
    author: "Ralph Lauren",
  },
  {
    quote: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
  },
  {
    quote: "Clothing is a form of self-expression.",
    author: "Marc Jacobs",
  },
  {
    quote: "Fashion is an instant language.",
    author: "Miuccia Prada",
  },
];

export default function LandingPageQuotes() {
  const [randomQuote, setRandomQuote] = useState({ quote: "", author: "" });

  useEffect(() => {
    // Generate a random index to select a random quote
    const randomIndex = Math.floor(Math.random() * quotesData.length);
    setRandomQuote(quotesData[randomIndex]);
  }, []);

  return (
    <div className=''>
      <div className='text-center'>
        <p className='text-4xl quote-display'>{randomQuote.quote}</p>
        <p className='text-gray-600 mt-2'>{randomQuote.author}</p>
      </div>
    </div>
  );
}
