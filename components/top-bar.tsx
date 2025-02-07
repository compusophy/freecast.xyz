import GitHub from "./github";

export default function TopBar({ grayScale }: { grayScale?: boolean }) {
  return (
    <div className="top-bar-container">
      <div className="logo-and-info">
        <a href="https://freecast.xyz">
          <h2>
            <span className="logo-text">[*.</span>
            <span className="logo-text">freecast</span>
            <span className="logo-accent">.xyz]</span>
          </h2>
        </a>
      </div>
      <div className="view-source">
        <a href="https://github.com/compusophy/freecast" target="_blank">
          <p>[SOURCE]</p>
          <div>
            <GitHub />
          </div>
        </a>
      </div>
      <style jsx>{`
        .top-bar-container {
          width: 100%;
          height: 50px;
          background: #0a0a0f;
          color: rgba(255, 255, 255, 0.9);
          font-weight: normal;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }
        .logo-and-info {
          display: flex;
          align-items: center;
        }
        .logo-and-info a {
          text-decoration: none;
        }
        .logo-text {
          font-family: "JetBrains Mono", "Courier New", monospace;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.95);
        }
        .logo-text:nth-child(2) {
          color: #fff;
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
        }
        .logo-accent {
          font-family: "JetBrains Mono", "Courier New", monospace;
          color: #fff;
        }
        .view-source {
          border-left: 1px solid rgba(255, 255, 255, 0.15);
        }
        .view-source a {
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        .view-source p {
          font-family: "JetBrains Mono", "Courier New", monospace;
          font-size: 14px;
          opacity: 0.9;
          color: #fff;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }
        .view-source * {
          margin-left: 8px;
        }
        @media (max-width: 600px) {
          .view-source p {
            font-size: 12px;
          }
        }
      `}</style>
      <style jsx>{`
        .top-bar-container {
          filter: ${grayScale ? "grayscale(1)" : "none"};
        }
      `}</style>
    </div>
  );
}
