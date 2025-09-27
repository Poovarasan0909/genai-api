import credentialHtml from './credentialFormPage.html';

export async function credentialRouters(url: URL, request: Request, env: any, corsHeaders: any) {

        const content = await env?.CREDENTIALS_KV?.get("GOOGLE_SHEET_ID");
        const renderedHtml = credentialHtml.replace("{{content}}", content || "")
                                          .replace("{{env.GOOGLE_CLIENT_EMAIL}}", env.GOOGLE_CLIENT_EMAIL || "");
      if(request.method === "GET") {
        return new Response(
          renderedHtml,
          { headers: { ...corsHeaders, "Content-Type": "text/html" } }
        );
    } else if(request.method === "POST") {
        const data = await request.json();
            const sheetId = await data.google_sheet_id;
            env.CREDENTIALS_KV.put("GOOGLE_SHEET_ID", sheetId);
            await kvPut(env, "GOOGLE_SHEET_ID", sheetId);
            const storedValue = await kvGet(env, "GOOGLE_SHEET_ID");
            return new Response(`Received sheet ID: ${sheetId}`, { status: 200, headers: { ...corsHeaders, "Content-Type": "text/plain" } });
    }
}

export async function kvPut(env: any, key: string, value: string) {

  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const namespaceId = env.CLOUDFLARE_CREDENTIALS_NAMESPACE_ID;
  const apiToken = env.CLOUDFLARE_API_TOKEN;

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'text/plain'
    },
    body: value
  });

  if (!response.ok) {
      throw new Error(`Failed to write KV: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}

export async function kvGet(env: any, key: string) {
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const namespaceId = env.CLOUDFLARE_CREDENTIALS_NAMESPACE_ID;
  const apiToken = env.CLOUDFLARE_API_TOKEN;
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${key}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiToken}`
    }
  })
  if (!response.ok) {
    throw new Error(`Failed to read KV: ${response.status} ${response.statusText}`);
  }
  return await response.text();
}