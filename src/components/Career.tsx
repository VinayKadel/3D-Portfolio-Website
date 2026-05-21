import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Developer Intern</h4>
                <h5>Creative Upaay, Udaipur, Rajasthan</h5>
              </div>
              <h3>Feb 2026 – May 2026</h3>
            </div>
            <p>
              Served as sole developer on a role-based internal operations platform covering CRM, HRMS, finance, hiring, and project management built with Next.js, TypeScript, and MongoDB. Integrated Cal.com scheduling, Resend email workflows, and GitHub Actions CI/CD pipelines. Built real-time collaboration with Socket.io and client/partner portals with document upload and PDF/DOCX exports.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Developer</h4>
                <h5>Independent (Personal Projects)</h5>
              </div>
              <h3>2024 – Present</h3>
            </div>
            <p>
              Independently designed, built, and deployed four production-grade web applications spanning e-commerce, AI-powered nutrition, habit tracking, and internal SaaS tooling. Each project is fully deployed on Vercel with real users and live domains.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech Student</h4>
                <h5>CTAE (MPUAT), Udaipur</h5>
              </div>
              <h3>2022–26</h3>
            </div>
            <p>
              Pursuing a Bachelor of Technology in Artificial Intelligence and Data Science with a CGPA of 7.34. Developed strong foundations in machine learning, OOPs, Python, and data science alongside practical full-stack development skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
