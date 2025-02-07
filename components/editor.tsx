import { useEffect, useRef, useState } from "react";

import EditLinkModal from "./edit-link-modal";
import SaveBar from "./save-bar";

interface EditorContainerProps {
  html: string;
  onSave: (html: string) => Promise<boolean>;
}

export default function EditorContainer({ html, onSave }: EditorContainerProps) {
  const [_html, setHtml] = useState(html || "");

  return (
    <div className="root-editor-container">
      <div className="editor-container">
        <Editor
          html={_html}
          setHtml={setHtml}
          onSave={onSave}
        />
      </div>
      <div className="output-container">
        <OutputContainer content={_html} />
      </div>

      <style jsx>{`
        .root-editor-container {
          display: flex;
          height: calc(100% - 50px);
          width: 100%;
          margin: 0;
        }
        .editor-container {
          height: 100%;
          width: 100%;
          flex: 1 0 50%;
          background: #0a0a0f;
          border-right: 1px solid rgba(255, 255, 255, 0.3);
        }
        .output-container {
          flex: 1 0 50%;
          height: 100%;
          width: 100%;
          -webkit-overflow-scrolling: touch;
          overflow-y: scroll;
          font-size: 0;
          background: #0a0a0f;
        }
        @media (max-width: 500px) {
          .root-editor-container {
            flex-direction: column;
          }
          .editor-container {
            flex: 1 0 50%;
            height: 50%;
            order: 1;
            border-right: none;
            border-top: 1px solid rgba(255, 255, 255, 0.3);
          }
          .output-container {
            flex: 1 0 50%;
            height: 50%;
            order: 0;
          }
        }
      `}</style>
    </div>
  );
}

interface EditorProps {
  html: string;
  setHtml: (html: string) => void;
  onSave: (html: string) => Promise<boolean>;
}

function Editor({ html, setHtml, onSave }: EditorProps) {
  const [saveState, setSaveState] = useState<'SAVING' | 'ERROR' | 'SUCCESS' | 'DEFAULT'>('DEFAULT');

  function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    console.log("Editor content changed:", e.target.value);
    setHtml(e.target.value);
    if (saveState === "SUCCESS") {
      setSaveState("DEFAULT");
    }
  }

  return (
    <div>
      <SaveBar
        html={html}
        saveState={saveState}
        setSaveState={setSaveState}
        onSave={onSave}
      />
      <textarea value={html} onChange={onChange} spellCheck={false} />
      <style jsx>{`
        div {
          width: 100%;
          height: 100%;
        }
        textarea {
          -webkit-appearance: none;
          width: 100%;
          height: calc(100% - 48px);
          background: #0a0a0f;
          color: rgba(255, 255, 255, 0.9);
          font-family: "JetBrains Mono", "Courier New", monospace;
          font-size: 16px;
          padding: 24px;
          border: none;
          border-radius: 0;
          resize: none;
          -webkit-touch-callout: none;
          -khtml-user-select: none;
          -webkit-tap-highlight-color: transparent;
          -webkit-overflow-scrolling: touch;
        }
        @media (max-width: 500px) {
          textarea {
            font-size: 12px;
          }
          div {
            z-index: 1000;
          }
        }
      `}</style>
    </div>
  );
}

interface OutputContainerProps {
  content: string;
}

function OutputContainer({ content }: OutputContainerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    updateIframe();
  }, [content]);

  function updateIframe() {
    const document = iframeRef.current?.contentDocument;
    if (document) {
      document.body.innerHTML = content || "";
    }
  }

  return (
    <iframe ref={iframeRef} title="html-output">
      <style jsx>{`
        iframe {
          height: 100%;
          width: 100%;
          border: none;
        }
      `}</style>
    </iframe>
  );
}
