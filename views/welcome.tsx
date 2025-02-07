import Head from "next/head";
import { useState } from "react";
import Div100vh from "react-div-100vh";

import Button from "../components/button";
import Input from "../components/input";
import TopBar from "../components/top-bar";

interface PageExists {
  name: string;
}

type SearchState = "SEARCHING" | "ERROR" | "NETWORK_ERROR" | "";

export function Welcome() {
  const [pageToSearch, setPageToSearch] = useState("");
  const [pageExists, setPageExists] = useState<PageExists | null>(null);
  const [searchState, setSearchState] = useState<SearchState>("");
  const [errorMessage, setErrorMessage] = useState<string>();

  async function checkIfPageExists(e: React.FormEvent) {
    e.preventDefault();
    if (pageToSearch) {
      setSearchState("SEARCHING");
      try {
        let res = await fetch(`/api/get-page?page=${pageToSearch}`);
        window.location.href = `https://${pageToSearch}.freecast.xyz`;
      } catch (e) {
        console.log(e.message);
        setErrorMessage(e instanceof Error ? e.message : String(e));
        setSearchState("NETWORK_ERROR");
        return;
      }
    }
  }

  function pageSearchInputHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (searchState) {
      setSearchState("");
      setPageExists(null);
    }
    setPageToSearch(e.target.value.toLowerCase());
  }

  function renderButton() {
    switch (searchState) {
      case "SEARCHING":
        return (
          <Button disabled fontSize={24}>
            ⏳
          </Button>
        );
      case "ERROR":
        return (
          <Button bg="rgba(255, 68, 68, 0.1)" disabled fontSize={24}>
            →
          </Button>
        );
      case "NETWORK_ERROR":
        return (
          <Button bg="rgba(255, 68, 68, 0.1)" onClick={checkIfPageExists} fontSize={24}>
            ❌
          </Button>
        );
      default:
        return (
          <Button onClick={checkIfPageExists} fontSize={24}>
            →
          </Button>
        );
    }
  }

  return (
    <Div100vh>
      <Head>
        <title>Static Fun</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <TopBar grayScale={Boolean(pageExists)} />
      <div className="welcome-container">
        <form className="form" onSubmit={checkIfPageExists}>
          <Input
            required
            autoFocus
            color="#fff"
            value={pageToSearch}
            onChange={pageSearchInputHandler}
            height={53}
            bg={null}
            borderColor={searchState === "ERROR" ? "#ff4444" : "rgba(255, 255, 255, 0.3)"}
            placeholder="my-fun-page"
            width={180}
            style={{ maxWidth: "40vw" }}
          />
          <span className="suffix">.freecast.xyz</span>
          {renderButton()}
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {pageExists && (
          <p className="page-exists">
            🚨
            <a href={`https://${pageExists.name}`}>{pageExists.name}</a> taken!
            Try another one.
          </p>
        )}
      </div>
      <style jsx>{`
        .welcome-container {
          display: flex;
          height: calc(100% - 50px);
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0a0a0f;
          color: rgba(255, 255, 255, 0.9);
        }
        .form {
          display: flex;
          align-items: center;
          text-align: center;
          white-space: nowrap;
          min-height: 50px;
          margin-bottom: 20px;
        }
        .form .suffix {
          font-family: "JetBrains Mono", "Courier New", monospace;
          font-weight: normal;
          font-size: 18px;
          margin-left: 4px;
          margin-right: 8px;
          color: rgba(255, 255, 255, 0.75);
        }
        .page-exists,
        .error-message {
          color: #ff4444;
          margin-top: 8px;
          font-family: "JetBrains Mono", "Courier New", monospace;
          text-transform: uppercase;
          text-shadow: 0 0 10px rgba(255, 68, 68, 0.3);
        }
        .page-exists a {
          color: #ff4444;
        }
      `}</style>
    </Div100vh>
  );
}
