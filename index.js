import { GoogleGenAI  } from "@google/genai";
const corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:4000',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};
export default {

    async fetch(request, env) {
        const url = new URL(request.url);
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        if (url.pathname === "/generate" && request.method === "POST") {
            try {
                const requestBody = await request.json();
                console.log("Generating content using Google GenAI...", requestBody);
                const ai = new GoogleGenAI({ apiKey: env.GOOGLE_API_KEY });
                const response = await ai.models.generateContent({
                    model: "gemma-3-27b-it",
                    contents: requestBody.userPrompt,
                });

                return new Response(
                    JSON.stringify({ result: response.text }),
                    { headers: {...corsHeaders, "Content-Type": "application/json" } }
                );
            } catch (error) {
                return new Response(
                    JSON.stringify({ error: error.message }),
                    { headers: { "Content-Type": "application/json" } }
                );
            }
        }
        
        if(url.pathname === "/") {
            return new Response("Welcome to the GenAI API", { status: 200, headers: {...corsHeaders, "Content-Type": "text/plain" } });
        }
        return new Response("Not Found", { status: 404 });
    }
}   