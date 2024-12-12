import React, { useEffect } from 'react';

function Contact() {
  useEffect(() => {
    // Dynamically create a link element to load Bootstrap CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';
    document.head.appendChild(link);

    document.body.style.backgroundColor = `#111`;

    return () => {
      document.body.style.backgroundColor = '';
      document.head.removeChild(link);
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display:'flex', justifyContent:'center'}}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6" style={{ padding: '20px', backgroundColor: '#111', color: '#fff' }}>
            <p>Complete the form, and our team will reach out to discuss how we can create custom software solutions to meet your business needs.</p>
          </div>
          <div className="col-md-6"></div>
        </div>
        <div className="row" style={{ padding: '20px', backgroundColor: '#111', color: '#fff' }}>
          <div className="col-md-12">
            <form className="contact-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <input type="text" placeholder="Your name?" style={inputStyle} required />
              <input type="email" placeholder="Your email?" style={inputStyle} required />
              <input type="text" placeholder="Phone number?" style={inputStyle} required />
              <select style={inputStyle}>
                <option value="What services are you interested in?">What services are you interested in?</option>
                <option value="Custom Software Development">Custom Software Development</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="Web Development">Web Development</option>
                <option value="Technical Support">Technical Support</option>
                <option value="UX/UI Design">UX/UI Design</option>
                <option value="Cloud Solutions">Cloud Solutions</option>
                <option value="IT Consulting">IT Consulting</option>
                {/* Add more options as needed */}
              </select>
              <select style={inputStyle}>
                <option value="Your Industry">Your Industry</option>
                <option value="Technology">Technology</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="Logistics">Logistics</option>
                <option value="Other">Other</option>
                {/* Add more options as needed */}
              </select>
              <select style={inputStyle}>
                <option value="Estimated Project Budget">Estimated Project Budget</option>
                <option value="Less than $10,000">Less than $10,000</option>
                <option value="$10,000 - $50,000">$10,000 - $50,000</option>
                <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                <option value="$100,000 - $500,000">$100,000 - $500,000</option>
                <option value="500,000+">500,000+</option>
              </select>
              <select style={inputStyle}>
                {/* Add more options as needed */}
                <option value="How did you hear about us?">How did you hear about us?</option>
                <option value="Google Search"> Google Search</option>
                <option value="Referral, Social Media">Referral, Social Media</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Other">Other</option>
                <option value="UX/UI Design">UX/UI Design</option>
                <option value="Cloud Solutions">Cloud Solutions</option>
                <option value="IT Consulting">IT Consulting</option>
              </select>
              <select style={inputStyle}>
                <option value="Advertisement">Preferred Contact Method</option>
                <option value="Other">Email</option>
                <option value="UX/UI Design">Phone</option>
                <option value="Cloud Solutions">Call</option>
                <option value="IT Consulting">Vedio Call</option>
                {/* Add more options as needed */}
              </select>
              <textarea placeholder="Write your message here" style={{ ...inputStyle, gridColumn: 'span 2', height: '100px' }}></textarea>
              <div>
                <button className='btn btn-primary'>Get in Touch</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '14px 10px',
  backgroundColor: '#111',
  color: '#fff',
  border: '1px solid #444',
  borderRadius: '4px',
  height: '70px',
  fontSize: '24px',
  lineHeight: '24px'
};

export default Contact;
