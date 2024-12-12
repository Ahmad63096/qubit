import React from 'react'
import { ArrowClick, BenefitsOfHavingLiveChat } from './Svg';
import homeicon from '../assets/img/homeicon.png';
import chater from '../assets/img/avatar-2.jpg';
import powerby from '../assets/img/footerlogo.png';
function Home({ handleNext, closeElement,title }) {
  return (
    <>
      <div className="header-two">
        <button style={{ visibility: 'hidden' }}>Go to Chat</button>
        <span className="title" style={{ visibility: 'hidden' }}><i className="fa-solid fa-message"></i></span>
        <button onClick={closeElement}>
          <i className="fa-regular fa-window-minimize"></i>
        </button>
      </div>
      <ul className="messages-two">
        <div className='home-icon-wrap'>
          <img className='home-icon' src={homeicon} alt="" />
        </div>
        <h1>Chat with us!</h1>
        <li>
          <div className='first-list'>
            <img src={chater} alt="" />
            <span className='online-icon'></span>
            <span>
              <p>{title}</p>
              <p>Hello there!</p>
            </span>
          </div>
          <button className='chat-button' onClick={handleNext}>Chat now
            <ArrowClick />
          </button>
        </li>
        <a href="https://www.devpandas.co/services" target='_blank' rel="noopener noreferrer">
          <li>🎓 Services
            <BenefitsOfHavingLiveChat />
          </li>
        </a>
        <a href="https://www.devpandas.co/resources" target='_blank' rel="noopener noreferrer">
          <li>🎉 Resources
            <BenefitsOfHavingLiveChat />
          </li>
        </a>
        <a href="https://www.devpandas.co/contact" target='_blank' rel="noopener noreferrer">
          <li>
            💬 Contact us
            <BenefitsOfHavingLiveChat />
          </li>
        </a>
      </ul>
      <div className="footer-two">
        <button>
          <i className="fa-solid fa-house"></i>
          <span>Home</span>
        </button>
        <button onClick={handleNext}>
          <i className="fa-regular fa-comments"></i>
          <span>Chat</span>
        </button>
      </div>
      <p className='copyright'>Powered by <img src={powerby} alt="" /> </p>
    </>
  )
}

export default Home