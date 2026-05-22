import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdArrowOutward } from "react-icons/md";
import "./styles/Work.css";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    abbr: "AAH",
    title: "AAHAR AI",
    label: "FULL STACK PWA",
    category: "AI Nutrition Platform",
    tools: ["React 19", "TypeScript", "Vite", "Express 5", "MongoDB", "Gemini AI", "Redux", "Zod", "JWT"],
    image: "/images/aahar-ai.webp",
    link: "https://aahar-ai-one.vercel.app/",
    color: "#5eead4",
    date: "01-24-03",
  },
  {
    abbr: "ZUL",
    title: "ZULEY",
    label: "E-COMMERCE",
    category: "Full Stack Platform",
    tools: ["React 19", "TypeScript", "Node.js", "Express", "MongoDB", "PhonePe", "GSAP", "Cloudinary"],
    image: "/images/zuley.webp",
    link: "https://zuley.in",
    color: "#f97316",
    date: "02-24-06",
  },
  {
    abbr: "SNT",
    title: "SONITRACK",
    label: "HABIT TRACKER",
    category: "Full Stack PWA",
    tools: ["Next.js", "TypeScript", "Prisma", "NextAuth", "IndexedDB", "Web Push", "Tailwind"],
    image: "/images/sonitrack.webp",
    link: "http://sonitrack.vercel.app/",
    color: "#a78bfa",
    date: "03-24-09",
  },
  {
    abbr: "OPS",
    title: "OPERATIONS",
    label: "INTERNAL SAAS",
    category: "Role-Based Platform",
    tools: ["MERN Stack", "Next.js", "TypeScript", "Socket.io", "Cal.com", "GitHub Actions", "CRM"],
    image: "/images/operations.webp",
    link: null,
    color: "#facc15",
    date: "04-25-01",
  },
];

const Work = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize to detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Desktop GSAP Animation
  useEffect(() => {
    if (isMobile) return; // Don't run GSAP on mobile

    const section = sectionRef.current;
    const rail = railRef.current;
    if (!section || !rail) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      // Start entirely offscreen to the right
      const getStartX = () => window.innerWidth;
      
      // Center the rail exactly in the viewport when finished
      const getEndX = () => (window.innerWidth - rail.scrollWidth) / 2;

      gsap.fromTo(
        rail,
        { x: getStartX },
        {
          x: getEndX,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${rail.scrollWidth + window.innerWidth}`,
            pin: true,
            scrub: 1, // Smooth scrub
            invalidateOnRefresh: true,
          },
        }
      );
    });

    return () => {
      mm.revert(); // Automatically cleans up GSAP/ScrollTrigger instances
    };
  }, [isMobile]);

  // Mobile Auto-Play Carousel
  useEffect(() => {
    if (!isMobile || isInterrupted) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % projects.length;
        const rail = railRef.current;
        if (rail && rail.children[0]) {
          const firstCard = rail.children[0] as HTMLElement;
          const cardWidth = firstCard.offsetWidth + 16; // width + gap
          rail.scrollTo({
            left: next * cardWidth,
            behavior: "smooth"
          });
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isMobile, isInterrupted]);

  const handleMobileScroll = () => {
    if (!isMobile || !railRef.current) return;
    const rail = railRef.current;
    if (!rail.children[0]) return;
    
    const firstCard = rail.children[0] as HTMLElement;
    const cardWidth = firstCard.offsetWidth + 16; // width + gap
    const newIndex = Math.round(rail.scrollLeft / cardWidth);
    
    const clampedIndex = Math.max(0, Math.min(newIndex, projects.length - 1));
    if (clampedIndex !== activeIndex) {
      setActiveIndex(clampedIndex);
    }
  };

  return (
    <div className="work-section" id="work" ref={sectionRef}>
      {/* Section heading */}
      <div className="work-heading">
        <p className="work-label">SELECTED WORK</p>
        <h2>
          My <span>Projects</span>
        </h2>
      </div>

      {/* Horizontal rod */}
      <div className="work-rod" />

      {/* Card rail */}
      <div 
        className="work-rail" 
        ref={railRef}
        onScroll={handleMobileScroll}
        onTouchStart={() => setIsInterrupted(true)}
        onMouseDown={() => setIsInterrupted(true)}
      >
        {projects.map((project, i) => (
          <div className="work-card-wrap" key={i}>

            {/* Pin hanging above the rod */}
            <div className="work-pin">
              <div
                className="work-pin-tag"
                style={{ backgroundColor: project.color }}
              >
                <span className="pin-abbr">{project.abbr}</span>
                <div className="pin-hole" />
                <span className="pin-date">{project.date}</span>
              </div>
              <div className="work-pin-stem" />
            </div>

            {/* Card */}
            <div
              className="work-card"
              style={{ "--card-accent": project.color } as React.CSSProperties}
              onClick={() => project.link && window.open(project.link, "_blank")}
            >
              {/* Typographic hero — big project abbreviation + screenshot */}
              <div
                className="card-abbr-hero"
                style={{ color: project.color }}
              >
                {project.title}
                <div className="card-image-strip">
                  <img src={project.image} alt={project.title} draggable={false} />
                  {project.link ? (
                    <div className="card-image-overlay">
                      <span className="card-open-btn"><MdArrowOutward /></span>
                    </div>
                  ) : (
                    <div className="card-nda-badge">NDA</div>
                  )}
                </div>
              </div>

              {/* Info panel */}
              <div className="card-body">
                <p className="card-service-label">PROJECT</p>
                <h3 className="card-title">{project.title}</h3>
                <p className="card-sub">{project.label} — {project.category}</p>

                {/* Tool grid with border lines like reference */}
                <div className="card-tools-grid">
                  {project.tools.map((t, ti) => (
                    <span className="card-tool-item" key={ti}>
                      <span className="tool-tick">↗</span>{t}
                    </span>
                  ))}
                </div>

                <div className="card-footer-bar">
                  {project.link ? (
                    <span className="card-cta">View Live ↗</span>
                  ) : (
                    <span className="card-no-link">Private · NDA</span>
                  )}
                  <span
                    className="card-abbr-badge"
                    style={{ color: project.color, borderColor: project.color }}
                  >
                    {project.abbr}
                  </span>
                </div>
              </div>
            </div>

          </div>
        ))}

        {/* Trailing spacer for desktop only */}
        {!isMobile && <div className="work-rail-spacer" />}
      </div>

      {/* Mobile Navigation Dots */}
      {isMobile && (
        <div className="work-dots">
          {projects.map((_, i) => (
            <div 
              key={i} 
              className={`work-dot ${i === activeIndex ? "active" : ""}`}
              onClick={() => {
                setIsInterrupted(true);
                if (railRef.current && railRef.current.children[0]) {
                  const firstCard = railRef.current.children[0] as HTMLElement;
                  const cardWidth = firstCard.offsetWidth + 16;
                  railRef.current.scrollTo({ left: i * cardWidth, behavior: "smooth" });
                }
              }}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default Work;