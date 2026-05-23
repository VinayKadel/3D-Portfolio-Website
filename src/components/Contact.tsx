import { MdArrowOutward } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a
                href="https://linkedin.com/in/vinaykadel"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                LinkedIn - vinaykadel
              </a>
            </p>
            <h4>Education</h4>
            <p>
              B.Tech Artificial Intelligence & Data Science, CTAE Udaipur (MPUAT) - 2022-2026
            </p>

          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/VinayKadel"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>
            <a
              href="https://linkedin.com/in/vinaykadel"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
            <a
              href="https://www.instagram.com/vinay_kadel/"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
