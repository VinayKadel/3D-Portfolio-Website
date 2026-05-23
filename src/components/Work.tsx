import { useEffect, useRef, useState, useCallback } from "react";
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

// Mobile: render real cards + one clone of the first card at the end
const mobileSlides = [...projects, projects[0]];

const Work = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);           // desktop rail
  const mobileRailRef = useRef<HTMLDivElement>(null);     // mobile transform rail

  const [isMobile, setIsMobile] = useState(false);

  // Mobile infinite carousel state
  const [mobileIndex, setMobileIndex] = useState(0);     // 0..projects.length (last = clone)
  const [isAnimating, setIsAnimating] = useState(true);  // false during instant jump
  const [isInterrupted, setIsInterrupted] = useState(false);

  // Touch tracking
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // ── Responsive detection ──────────────────────────────────
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ── Desktop GSAP (unchanged) ──────────────────────────────
  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    const rail = railRef.current;
    if (!section || !rail) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
      const getStartX = () => window.innerWidth;
      const getEndX = () => (window.innerWidth - rail.scrollWidth) / 2;
      gsap.fromTo(rail, { x: getStartX }, {
        x: getEndX,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${rail.scrollWidth + window.innerWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => { mm.revert(); };
  }, [isMobile]);

  // ── Mobile auto-play ──────────────────────────────────────
  useEffect(() => {
    if (!isMobile || isInterrupted) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setMobileIndex(prev => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [isMobile, isInterrupted]);

  // ── Infinite loop: after landing on the clone, snap to real index 0 ──
  useEffect(() => {
    if (!isMobile) return;
    if (mobileIndex === projects.length) {
      // Wait for the slide transition to finish (450ms), then instantly reset
      const t = setTimeout(() => {
        setIsAnimating(false);          // disable CSS transition
        setMobileIndex(0);              // jump to real first card
        // Re-enable transition on next frame so the next auto-slide is smooth
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setIsAnimating(true));
        });
      }, 450);
      return () => clearTimeout(t);
    }
  }, [mobileIndex, isMobile]);

  // Real dot index — always maps clone (index 4) back to 0
  const activeDotIndex = mobileIndex % projects.length;

  // ── Mobile touch handlers ─────────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsInterrupted(true);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) < 30) return; // too small — ignore

    if (delta > 0) {
      // Swipe left → next
      setIsAnimating(true);
      setMobileIndex(prev => prev + 1);
    } else {
      // Swipe right → previous (wrap around)
      setIsAnimating(true);
      setMobileIndex(prev => {
        if (prev === 0) return projects.length - 1;
        return prev - 1;
      });
    }
  }, []);

  // ── Card render helper (shared between mobile and desktop) ──
  const renderCard = (project: typeof projects[0], i: number, keyPrefix = "") => (
    <div className="work-card-wrap" key={`${keyPrefix}${i}`}>
      <div className="work-pin">
        <div className="work-pin-tag" style={{ backgroundColor: project.color }}>
          <span className="pin-abbr">{project.abbr}</span>
          <div className="pin-hole" />
          <span className="pin-date">{project.date}</span>
        </div>
        <div className="work-pin-stem" />
      </div>

      <div
        className="work-card"
        style={{ "--card-accent": project.color } as React.CSSProperties}
        onClick={() => project.link && window.open(project.link, "_blank")}
      >
        <div className="card-abbr-hero" style={{ color: project.color }}>
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

        <div className="card-body">
          <p className="card-service-label">PROJECT</p>
          <h3 className="card-title">{project.title}</h3>
          <p className="card-sub">{project.label} - {project.category}</p>
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
  );

  return (
    <div className="work-section" id="work" ref={sectionRef}>
      <div className="work-heading">
        <p className="work-label">SELECTED WORK</p>
        <h2>My <span>Projects</span></h2>
      </div>

      <div className="work-rod" />

      {isMobile ? (
        /* ── MOBILE: transform-based infinite carousel ── */
        <>
          <div className="work-mobile-viewport">
            <div
              className="work-mobile-rail"
              ref={mobileRailRef}
              style={{
                transform: `translateX(calc(-${mobileIndex} * (85vw + 16px)))`,
                transition: isAnimating ? "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {mobileSlides.map((project, i) =>
                renderCard(project, i, "mob-")
              )}
            </div>
          </div>

          {/* Navigation dots */}
          <div className="work-dots">
            {projects.map((_, i) => (
              <div
                key={i}
                className={`work-dot ${i === activeDotIndex ? "active" : ""}`}
                style={i === activeDotIndex
                  ? { backgroundColor: projects[activeDotIndex].color }
                  : undefined
                }
                onClick={() => {
                  setIsInterrupted(true);
                  setIsAnimating(true);
                  setMobileIndex(i);
                }}
              />
            ))}
          </div>
        </>
      ) : (
        /* ── DESKTOP: existing GSAP rail (untouched) ── */
        <div
          className="work-rail"
          ref={railRef}
        >
          {projects.map((project, i) => renderCard(project, i, "desk-"))}
          <div className="work-rail-spacer" />
        </div>
      )}
    </div>
  );
};

export default Work;