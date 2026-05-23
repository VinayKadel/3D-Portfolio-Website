import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/About.css";

gsap.registerPlugin(ScrollTrigger);

const codeLines = [
  { tokens: [{ t: "export", c: "kw" }, { t: " const ", c: "plain" }, { t: "AboutMe", c: "fn" }, { t: " = () => {", c: "plain" }] },
  { tokens: [] },
  { tokens: [{ t: "  ", c: "plain" }, { t: "// who i am", c: "comment" }] },
  { tokens: [{ t: "  name", c: "prop" }, { t: ": ", c: "plain" }, { t: '"Vinay Kadel"', c: "str" }, { t: ",", c: "plain" }] },
  { tokens: [{ t: "  role", c: "prop" }, { t: ": ", c: "plain" }, { t: '"Full Stack Engineer"', c: "str" }, { t: ",", c: "plain" }] },
  { tokens: [{ t: "  based", c: "prop" }, { t: ": ", c: "plain" }, { t: '"Udaipur, India 🇮🇳"', c: "str" }, { t: ",", c: "plain" }] },
  { tokens: [] },
  { tokens: [{ t: "  ", c: "plain" }, { t: "// what i build", c: "comment" }] },
  { tokens: [{ t: "  stack", c: "prop" }, { t: ": [", c: "plain" }, { t: '"React"', c: "str" }, { t: ", ", c: "plain" }, { t: '"Next.js"', c: "str" }, { t: ", ", c: "plain" }, { t: '"TypeScript"', c: "str" }, { t: "],", c: "plain" }] },
  { tokens: [{ t: "  aiStack", c: "prop" }, { t: ": [", c: "plain" }, { t: '"Gemini AI"', c: "str" }, { t: ", ", c: "plain" }, { t: '"LLMs"', c: "str" }, { t: "],", c: "plain" }] },
  { tokens: [] },
  { tokens: [{ t: "  ", c: "plain" }, { t: "// numbers that matter", c: "comment" }] },
  { tokens: [{ t: "  appsShipped", c: "prop" }, { t: ": ", c: "plain" }, { t: "20", c: "num" }, { t: ", ", c: "plain" }, { t: "// production-grade", c: "comment" }] },
  { tokens: [{ t: "  teamLed", c: "prop" }, { t: ": ", c: "plain" }, { t: "true", c: "bool" }, { t: ",", c: "plain" }] },
  { tokens: [{ t: "  clientWork", c: "prop" }, { t: ": ", c: "plain" }, { t: "true", c: "bool" }, { t: ", ", c: "plain" }, { t: "// idea → production", c: "comment" }] },
  { tokens: [] },
  { tokens: [{ t: "  intern", c: "prop" }, { t: ": ", c: "plain" }, { t: '"Creative Upaay, Udaipur"', c: "str" }, { t: ",", c: "plain" }] },
  { tokens: [{ t: "  degree", c: "prop" }, { t: ": ", c: "plain" }, { t: '"B.Tech AI & DS, CTAE"', c: "str" }, { t: ",", c: "plain" }] },
  { tokens: [] },
  { tokens: [{ t: "}", c: "plain" }] },
];

const MAX_TYPED_LENGTH = 48;

/** Very lightweight live syntax colouring for the typed text */
const colourise = (text: string) => {
  if (!text) return null;
  if (text.startsWith("//")) return <span className="tok tok-comment">{text}</span>;
  // Try to detect   key: "value"  pattern
  const kvMatch = text.match(/^(\s*)([\w]+)(\s*:\s*)(".*"|[\w.]+)(,?)(.*)$/);
  if (kvMatch) {
    const [, indent, key, sep, val, comma, rest] = kvMatch;
    const valClass = /^"/.test(val) ? "str" : /^\d+$/.test(val) ? "num" : /^(true|false)$/.test(val) ? "bool" : "plain";
    return (
      <>
        <span className="tok tok-plain">{indent}</span>
        <span className="tok tok-prop">{key}</span>
        <span className="tok tok-plain">{sep}</span>
        <span className={`tok tok-${valClass}`}>{val}</span>
        <span className="tok tok-plain">{comma}</span>
        {rest && <span className="tok tok-plain">{rest}</span>}
      </>
    );
  }
  return <span className="tok tok-plain">{text}</span>;
};

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const rightRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const [typedText, setTypedText] = useState("");
  const [isEditorActive, setIsEditorActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showHint, setShowHint] = useState(true);

  /* ── GSAP scroll animations ── */
  useEffect(() => {
    const lines = linesRef.current.filter(Boolean) as HTMLDivElement[];
    gsap.set(lines, { opacity: 0, x: -8 });
    gsap.set(rightRef.current, { opacity: 1 });

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => {
        setIsVisible(true);
        gsap.to(lines, { opacity: 1, x: 0, duration: 0.28, stagger: 0.04, ease: "power2.out" });
        gsap.from(".about-stat", { opacity: 0, y: 16, duration: 0.4, stagger: 0.08, ease: "power3.out", delay: 0.3 });
        gsap.from(".about-pill", { opacity: 0, scale: 0.85, duration: 0.28, stagger: 0.03, ease: "back.out(1.4)", delay: 0.5 });
      },
    });

    return () => { trigger.kill(); };
  }, []);

  /* ── Global keydown listener — fires when editor section is visible ── */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isVisible) return;

    // Any printable key activates the editor and hides the hint
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault(); // prevent Space from scrolling the page
      setIsEditorActive(true);
      setShowHint(false);
      setTypedText(prev => {
        if (prev.length >= MAX_TYPED_LENGTH) return prev;
        return prev + e.key;
      });
      return;
    }

    if (e.key === "Backspace") {
      setTypedText(prev => prev.slice(0, -1));
      return;
    }

    if (e.key === "Escape") {
      setTypedText("");
      setIsEditorActive(false);
      return;
    }
  }, [isVisible]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  /* ── Click on cursor line to focus the editor ── */
  const handleEditorClick = () => {
    setIsEditorActive(true);
    setShowHint(false);
  };

  /* ── Blur on click outside ── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
        setIsEditorActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderLine = (line: typeof codeLines[0], i: number) => (
    <div
      key={i}
      ref={(el) => { linesRef.current[i] = el; }}
      className="code-line"
    >
      <span className="line-num">{i + 1}</span>
      <span className="line-content">
        {line.tokens.length === 0
          ? <>&nbsp;</>
          : line.tokens.map((tok, ti) => (
            <span key={ti} className={`tok tok-${tok.c}`}>{tok.t}</span>
          ))}
      </span>
    </div>
  );

  const lineNumber = codeLines.length + 1;

  return (
    <div className="about-section" id="about" ref={sectionRef}>
      <div className="about-right" ref={rightRef}>

        {/* Bio */}
        <div className="about-bio">
          <p className="about-eyebrow">ABOUT ME</p>
          <h2 className="about-headline">
            I build things that<br />
            <span className="about-accent">actually ship.</span>
          </h2>
          <p className="about-para">
            Final-year B.Tech (AI &amp; DS) at CTAE, Udaipur. Full-stack engineer who has
            taken 20+ products from idea to production - solo. Currently interning at
            Creative Upaay as the sole developer on a large-scale internal ops platform.
            Clean architecture. Real performance. Systems that scale in the wild.
          </p>
        </div>

        {/* IDE Editor */}
        <div
          className={`about-editor ${isEditorActive ? "editor-focused" : ""}`}
          ref={editorRef}
          onClick={handleEditorClick}
        >
          <div className="editor-chrome">
            <span className="traffic red" />
            <span className="traffic yellow" />
            <span className="traffic green" />
            <span className="editor-tab">AboutMe.tsx</span>
            {isEditorActive && (
              <span className="editor-mode-badge">INSERT</span>
            )}
          </div>

          <div className="editor-body">
            {codeLines.map((line, i) => renderLine(line, i))}

            {/* Interactive cursor line */}
            <div
              className={`code-cursor-line ${isEditorActive ? "active-line" : ""}`}
              title="Click or start typing"
            >
              <span className="line-num">{lineNumber}</span>
              <span className="line-content typed-content">
                {typedText ? colourise(typedText) : null}
                <span className={`code-cursor ${isEditorActive ? "cursor-active" : ""}`} />
              </span>

              {/* Floating hint — shown before user ever types */}
              {showHint && isVisible && !typedText && (
                <span className="editor-type-hint">start typing…</span>
              )}
            </div>
          </div>

          <div className="editor-statusbar">
            <span className="status-dot" />
            <span>main*</span>
            <span className="status-sep">|</span>
            <span>Ln {lineNumber}, Col {typedText.length + 1}</span>
            <span className="status-sep">|</span>
            <span>{typedText.length}/{MAX_TYPED_LENGTH}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
