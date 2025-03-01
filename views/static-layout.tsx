import { useEffect, useState } from "react";
import Pusher from "pusher-js";

export function RenderStaticLayout({ html }) {
  const [newHtml, setNewHtml] = useState();

  function hydrateHtml(html) {
    setNewHtml(html);
  }

  useEffect(() => {
    let host = window.location.host;
    let isDev = host.includes("localhost");
    let splitHost = host.split(".");
    let pageName;

    if (
      (isDev && splitHost.length === 2) ||
      (!isDev && splitHost.length === 3)
    ) {
      pageName = splitHost[0];
      if (pageName && process.env.NEXT_PUBLIC_PUSHER_APP_KEY) {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
          cluster: "mt1"
        });
        const channel = pusher.subscribe(pageName);
        channel.bind("hydrate-html", hydrateHtml);
        console.log(channel);
      } else {
        console.warn('Missing Pusher app key in environment variables');
      }
    }
  }, []);

  return (
    <main dangerouslySetInnerHTML={{ __html: newHtml || html }}></main>
  );
}