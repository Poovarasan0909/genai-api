import credentialHtml from './credentialFormPage.html';

export async function credentialRouters(url: URL, request: Request, env: any, corsHeaders: any) {

         const content = await env?.CREDENTIALS_KV?.get("GOOGLE_SHEET_ID");
        console.log("Credentials content:", content);
        const renderedHtml = credentialHtml.replace("{{content}}", content || "")
                                          .replace("{{env.GOOGLE_CLIENT_EMAIL}}", env.GOOGLE_CLIENT_EMAIL || "");
      if(request.method === "GET") {
        return new Response(
          renderedHtml,
          { headers: { ...corsHeaders, "Content-Type": "text/html" } }
        );
    } else if(request.method === "POST") {
        const data = await request.json();
        console.log("Received data:", data);
            const sheetId = await data.google_sheet_id;
            env.CREDENTIALS_KV.put("GOOGLE_SHEET_ID", sheetId);
            return new Response(`Received sheet ID: ${sheetId}`, { status: 200, headers: { ...corsHeaders, "Content-Type": "text/plain" } });
    }
}