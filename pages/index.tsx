import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import sdk from "@farcaster/frame-sdk";

import Spinner from "../components/spinner";
import { defaultMarkup, getPageData } from "../lib/data";
import { EditorLayout } from "../views/editor";
import { FixedCenterLayout } from "../views/fixed-center";
import { RenderStaticLayout } from "../views/static-layout";
import { Welcome } from "../views/welcome";

export default function IndexPage() {
  const [pageData, setPageData] = useState<any>();
  const [error, setError] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    sdk.actions.ready();
  }, []);

  const savePage = async (html: string) => {
    try {
      const response = await fetch('/api/save-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save page');
      }
      
      // Update local state after successful save
      setPageData(prev => ({
        ...prev,
        html
      }));
      
      return true;
    } catch (error) {
      console.error('Save error:', error);
      return false;
    }
  };

  useEffect(() => {
    let href = window.location.href;
    let linkToken = router.query.edit;

    if (linkToken) {
      document.cookie = `linkToken=${linkToken}`;
      window.location.href = "/";
    }

    if (!pageData) {
      getPageData(href)
        .then(data => {
          if (!data) {
            setPageData(null);
            return;
          }
          if (data.errorCode) {
            let { errorCode, stack, message } = data;
            setError({ errorCode, stack, message });
            return;
          }
          let { html, allowEdit, editLink } = data;
          setPageData({ html, allowEdit, editLink });
          return;
        })
        .catch(e => {
          setError({ message: e.message, stack: e.stack });
        });
    }
  }, [pageData, router.query.edit]);

  if (error) {
    return (
      <FixedCenterLayout>
        <div>
          {error.errorCode && <h1>HTTP Status: {error.errorCode}</h1>}
          <h2>{error.message}</h2>
          <img src="https://media.giphy.com/media/953Nn3kYUbGxO/giphy.gif" alt="Error gif" />
          {error.stack && (
            <div>
              <code>{JSON.stringify(error.stack)}</code>
            </div>
          )}
          <style jsx>{`
            div {
              text-align: center;
            }
            code {
              color: red;
            }
            img {
              max-width: 100%;
            }
          `}</style>
        </div>
      </FixedCenterLayout>
    );
  }

  if (typeof pageData === "undefined") {
    return (
      <FixedCenterLayout>
        <Spinner delay={300} />
      </FixedCenterLayout>
    );
  }

  if (pageData && pageData.html === null) {
    return (
      <EditorLayout
        html={defaultMarkup}
        onSave={savePage}
      />
    );
  }

  if (pageData && pageData.html && pageData.allowEdit) {
    return (
      <EditorLayout
        html={pageData.html}
        onSave={savePage}
      />
    );
  }

  if (pageData && pageData.html && !pageData.allowEdit) {
    return <RenderStaticLayout html={pageData.html} />;
  }

  return <Welcome />;
}
