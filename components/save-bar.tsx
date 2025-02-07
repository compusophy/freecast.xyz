import { useState, useEffect } from "react";

import Button from "./button";
import ms from "ms";

interface SaveBarProps {
  html: string;
  saveState: 'SAVING' | 'ERROR' | 'SUCCESS' | 'DEFAULT';
  setSaveState: React.Dispatch<React.SetStateAction<'SAVING' | 'ERROR' | 'SUCCESS' | 'DEFAULT'>>;
  onSave: (html: string) => Promise<boolean>;
}

export default function SaveBar({
  html,
  saveState,
  setSaveState,
  onSave
}: SaveBarProps) {
  const [lastSaved, setLastSaved] = useState<number | undefined>(undefined);
  const [currentTime, setCurrentTime] = useState<number | undefined>(undefined);
  const [currentTimeInterval, setCurrentTimeInterval] = useState<NodeJS.Timeout | undefined>(undefined);

  async function savePage() {
    console.log("Saving page with HTML:", html);
    setSaveState("SAVING");
    try {
      const success = await onSave(html);
      if (success) {
        setSaveState("SUCCESS");
        setLastSaved(Date.now());
      } else {
        setSaveState("ERROR");
      }
    } catch (error) {
      console.error("Save error:", error);
      setSaveState("ERROR");
    }
  }

  useEffect(() => {
    if (lastSaved) {
      setCurrentTime(Date.now());
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 60000);
      setCurrentTimeInterval(interval);

      return () => {
        clearInterval(interval);
      };
    }
  }, [lastSaved]);

  function getMinutesAgo(timestamp: number): string {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes === 1) {
      return '1 MINUTE';
    }
    return `${minutes} MINUTES`;
  }

  function renderButton() {
    switch (saveState) {
      case "SAVING":
        return (
          <Button
            disabled
            fontSize={24}
            width={80}
            height={36}
          >
            ⏳
          </Button>
        );
      case "ERROR":
        return (
          <Button
            bg="rgba(255, 68, 68, 0.1)"
            width={80}
            height={36}
            fontSize={24}
            onClick={savePage}
          >
            ❌
          </Button>
        );
      case "SUCCESS":
        return (
          <Button 
            width={80} 
            height={36} 
            fontSize={24} 
            disabled
          >
            ✓
          </Button>
        );
      default:
        return (
          <Button
            width={80}
            height={36}
            fontSize={14}
            onClick={savePage}
          >
            SAVE
          </Button>
        );
    }
  }

  function renderLastSaved() {
    if (lastSaved) {
      return `LAST SAVE ${getMinutesAgo(lastSaved)} AGO`;
    } else {
      return 'LAST SAVE 0 MINUTES AGO';
    }
  }

  return (
    <div className="save-bar-container">
      <p className="last-saved">{renderLastSaved()}</p>
      <div className="edit-link-and-save">
        {renderButton()}
      </div>
      <style jsx>{`
        .save-bar-container {
          padding: 16px;
          height: 48px;
          background: #0a0a0f;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .save-bar-container p {
          font-family: "JetBrains Mono", "Courier New", monospace;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: normal;
        }
        .edit-link-and-save {
          display: flex;
          align-items: center;
        }
        .edit-link-and-save p {
          margin-right: 16px;
        }
        @media (max-width: 500px) {
          .last-saved {
            width: 120px;
          }
        }
      `}</style>
    </div>
  );
}
