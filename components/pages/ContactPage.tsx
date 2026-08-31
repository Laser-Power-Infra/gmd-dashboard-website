export default function ContactPage() {
  return (
    <div className="contact-page-container">
      {/* Top Section with Maps */}
      <section className="contact-maps-section">
        <div className="container">
          <div className="maps-grid">
            {/* Head Office */}
            <div className="map-card">
              <h2 className="map-heading">Head Office</h2>
              <p className="map-address">
                Adventz Infinity@ 5, BN Block, 19 Floor- North Wing, Saltlake, Sector-5, Kolkata- 700091
              </p>
              <div className="map-iframe-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.21234!2d88.433!3d22.572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02755ec48a822f%3A0x1cbcf20488fcf6f2!2sAdventz%20Infinity%405!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height={300}
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            {/* Factory Address */}
            <div className="map-card">
              <h2 className="map-heading">Factory Address</h2>
              <div className="factory-addresses">
                <div className="factory-col">
                  <p className="map-address">
                    Vidyasagar Industrial Park, Plot No. F1, Ruisanda, Rupnarayanpur, Jafala, Gole Bazar, Kharagpur, Paschim Medinipur, West Bengal, 721301
                  </p>
                  <div className="map-iframe-container">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.697072551465!2d87.32297131542618!3d22.32731854756306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1d43a6b8f8d227%3A0x6b8f8f8f8f8f8f8!2sVidyasagar%20Industrial%20Park!5e0!3m2!1sen!2sin!4v1"
                      width="100%"
                      height={200}
                      style={{ border: 0 }}
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
                <div className="factory-col">
                  <p className="map-address">
                    Vivekananda Industrial Estate, Balitikuri, Bakultala, Howrah- 711113, W.B. India
                  </p>
                  <div className="map-iframe-container">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.7460677579737!2d88.29177831543085!3d22.58855423807204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0279c6d3d9d7b9%3A0x8e8e8e8e8e8e8e8!2sVivekananda%20Industrial%20Estate!5e0!3m2!1sen!2sin!4v1"
                      width="100%"
                      height={200}
                      style={{ border: 0 }}
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section with Form */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-form-grid">
            {/* Left side: Info */}
            <div className="contact-info-col">
              <h4 className="contact-subtitle"><span className="line-accent"></span> GET IN TOUCH</h4>
              <h2 className="contact-title">Have Queries Before The Appointment?</h2>

              <div className="contact-info-item">
                <i className="fas fa-phone-alt contact-icon"></i>
                <div className="contact-info-text">
                  <p>+91 9147176248</p>
                </div>
              </div>

              <div className="contact-info-item">
                <i className="far fa-clock contact-icon"></i>
                <div className="contact-info-text">
                  <p><strong>Mon-Fri:</strong> 9.30am - 7.30pm</p>
                  <p><strong>Sat:</strong> 9.30am - 2.00pm</p>
                  <p><strong>Sunday Closed</strong></p>
                  <p style={{ marginTop: '10px' }}><strong>Service :</strong> 24 hrs. available.</p>
                </div>
              </div>

              <div className="scan-code-block">
                <h3 className="scan-code-title">SCAN CODE</h3>
                <div className="qr-code-placeholder">
                  {/* Using a placeholder for QR code, if actual exists we can replace it later */}
                  <div style={{ width: '150px', height: '150px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #333' }}>
                    <i className="fas fa-qrcode" style={{ fontSize: '4rem', color: '#333' }}></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Form */}
            <div className="contact-form-wrapper">
              <h2 className="form-heading">Don&apos;t Hesitate To Contact Us</h2>
              <form className="contact-form">
                <div className="form-group">
                  <input type="text" placeholder="Name*" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Email*" required />
                </div>
                <div className="form-group">
                  <input type="tel" placeholder="Your Phone*" required />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" rows={5}></textarea>
                </div>
                <button type="button" className="btn-submit-contact">SUBMIT</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
