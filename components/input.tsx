const Input = function({ width, height, bg, color, borderColor, ...props }) {
  return (
    <div>
      <input type="text" {...props} spellCheck={false} />
      <style jsx>{`
        div {
          display: inline-block;
        }
        input {
          border-radius: 4px;
          font-family: "JetBrains Mono", "Courier New", monospace;
          font-size: 16px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
      <style jsx>{`
        input {
          ${bg ? "background: " + bg + ";" : ""}
          height: ${height || "48"}px;
          width: ${width || "286"}px;
          border-color: ${borderColor ? borderColor : "rgba(255, 255, 255, 0.2)"};
          ${color ? "color: " + color + ";" : ""}
        }
      `}</style>
    </div>
  );
};

export default Input;
