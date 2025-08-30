import { GoogleGenAI  } from "@google/genai";

export default {

    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/generate") {
            try {
                const ai = new GoogleGenAI({ apiKey: env.GOOGLE_API_KEY });
                const response = await ai.models.generateContent({
                    model: "gemma-3-27b-it",
                    contents: "Roses are red, violets are blue...",
                });
                console.log(response)

                return new Response(
                    JSON.stringify({ result: response.text }),
                    { headers: { "Content-Type": "application/json" } }
                );
            } catch (error) {
                return new Response(
                    JSON.stringify({ error: error.message }),
                    { headers: { "Content-Type": "application/json" } }
                );
            }
        }
        
        if(url.pathname === "/") {
            console.log(env.GOOGLE_API_KEY)
            return new Response("Welcome to the GenAI API", { status: 200 });
        }
        return new Response("Not Found", { status: 404 });
    }
}   