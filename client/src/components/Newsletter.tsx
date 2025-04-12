import React from 'react';

const Newsletter: React.FC = () => {
  return (
    <section className="bg-primary text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <a 
          href="https://www.instagram.com/zazitrumunsko/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex flex-col items-center group"
        >
          <h2 className="font-display text-3xl font-bold mb-6">Follow Me on Instagram</h2>
          <div className="text-8xl mb-4 transform group-hover:scale-110 transition-transform duration-200">
            <i className="fab fa-instagram"></i>
          </div>
          <p className="text-lg">@zazitrumunsko</p>
        </a>
      </div>
    </section>
  );
};

export default Newsletter;