async function getPageData(href): Promise<any> {
  const { host } = window.location;
  let isDev = host.includes('localhost');
  let splitHost = host.split('.');
  let page = '';

  if ((!isDev && splitHost.length === 3) || (isDev && splitHost.length === 2)) {
    page = splitHost[0];
    if (page === 'www') {
      return null;
    }
    let res = await fetch(`/api/get-page?page=${page}`);

    if (res.status === 200) {
      let { html, allowEdit, token } = await res.json();
      return { html: html || getDefaultMarkup(page), allowEdit, editLink: `${href}?edit=${token}` };
    }

    if (res.status === 404) {
      let { html, token } = await res.json();
      return { html: getDefaultMarkup(page), editLink: `${href}?edit=${token}` };
    }

    if (!res.ok && res.status !== 404) {
      let { stack, message } = await res.json();
      return { errorCode: res.status, stack, message };
    }
  }
}

function getDefaultMarkup(page: string) {
  // Create the Warpcast share URL with the current page URL encoded
  const shareText = encodeURIComponent(`check out my new page at ${page}.freecast.xyz`);
  const shareUrl = encodeURIComponent(`https://${page}.freecast.xyz`);
  const warpcastUrl = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${shareUrl}`;

  return `
<div class="container">
  <h1>[${page}.*]</h1>
  <p>
    This is a blank canvas waiting to be filled with your content. Edit this page to make it your own.
    The possibilities are endless - from personal blogs to project showcases, from art galleries to code snippets.
  </p>
  <a href="${warpcastUrl}" target="_blank" class="share-button">
    SHARE
  </a>
</div>

<style>
  * {
    margin: 0;
    padding: 0;
    font-family: "JetBrains Mono", "Courier New", monospace;
  }
  
  body {
    background: #0a0a0f;
    color: rgba(255, 255, 255, 0.9);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1.6;
  }

  .container {
    text-align: center;
    max-width: 600px;
    padding: 0 20px;
  }

  h1 {
    font-size: 32px;
    font-weight: normal;
    margin-bottom: 2rem;
    color: rgba(255, 255, 255, 0.9);
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 2rem;
    font-size: 14px;
  }

  .share-button {
    display: inline-block;
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    font-size: 14px;
    padding: 12px 24px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
  }

  .share-button:hover {
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
  }
</style>`;
}

export { getPageData, getDefaultMarkup };
