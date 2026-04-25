const NAV_LINKS = ["Exhibitions", "Artists", "Visit", "Shop"] as const;

export default function Nav() {
  return (
    <nav
      className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-5"
      style={{
        background: "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 100%)",
      }}
    >
      {/* Brand */}
      <span
        className="font-playfair uppercase text-white"
        style={{ fontSize: 13, fontWeight: 400, letterSpacing: "0.1em" }}
      >
        Inema Arts Centre
      </span>

      {/* Links */}
      <div className="flex items-center gap-7">
        {NAV_LINKS.map(label => (
          <a
            key={label}
            href="#"
            className="font-inter uppercase"
            style={{
              fontSize: 11,
              fontWeight: 300,
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.75)",
              textDecoration: "none",
            }}
          >
            {label}
          </a>
        ))}
        <a
          href="#"
          className="font-inter uppercase"
          style={{
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.12em",
            color: "#1BBFA0",
            textDecoration: "none",
          }}
        >
          Book ↗
        </a>
      </div>
    </nav>
  );
}
