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
      }, 10000);
      setCurrentTimeInterval(interval);

      return () => {
        clearInterval(interval);
      };
    }
  }, [lastSaved]);

  function renderButton() {
    switch (saveState) {
      case "SAVING":
        return (
          <Button
            bg="#CDAE8F"
            width={80}
            height={36}
            fontSize={24}
            disabled
            isLoading
          >
            ⏳
          </Button>
        );
      case "ERROR":
        return (
          <Button
            bg="#000000"
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
          <Button bg="#0085FF" width={80} height={36} fontSize={24} disabled>
            🎉
          </Button>
        );
      default:
        return (
          <Button
            fontFamily="Menlo, monospace"
            width={80}
            height={36}
            bg="#FF0080"
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
      return `Last saved ${ms((currentTime || Date.now()) - lastSaved, {
        long: true
      })} ago`;
    } else {
      return null;
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
          background: #2bbaf8;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .save-bar-container p {
          font-family: Menlo, monospace;
          font-size: 14px;
          color: white;
          font-weight: bold;
          cursor: pointer;
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
