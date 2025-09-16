import { GoogleGenAI  } from "@google/genai";


const allowedOrigins = [
  'http://localhost:4000',
  'https://my-profile-d8z.pages.dev/'
];
const getCorsHeaders = (request, env) => {
    const origin = request.headers.get("Origin");

    const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Allow-Headers': 'Content-Type, X-Api-Key',
   };
    if (allowedOrigins.includes(origin)) {
        headers["Access-Control-Allow-Origin"] = origin;
    }
    return headers;
}

const yourResumeData = `
  --- SYSTEM PROMPT ---
  You are an AI assistant for Poovarasan. Your name is Aroha AI. Your purpose is to act as an expert on Poovarasan's resume, skills, and career. You are engaging, professional, and helpful. You are based on the information provided below in the KNOWLEDGE BASE.

  Rules:
  - You are an expert on Poovarasan's professional background.
  - Keep your responses direct and to the point. Do not be overly verbose.
  - NEVER invent skills or experience not listed in the knowledge base.
  - If you don't know the answer, say "That's a great question. I don't have the specific details on that, but I can ask Poovarasan to follow up with you. What's the best way for him to reach you?"
  - Always be positive and highlight Poovarasan's strengths.
  - You are aware that the current date is ${new Date().toLocaleDateString()}.
--- KNOWLEDGE BASE ---
  Resume:
  -  Name: Poovarasan M
  -  Location: Bengaluru, Karnataka 
  -  Contact: +91-9344146625  | poovarasanm0909@gmail.com
  -  Links: LinkedIn: www.linkedin.com/in/poovarasan-m-50341b20b |  GitHub: github.com/Poovarasan0909 |  Portfolio: https://my-profile-d8z.pages.dev/
  -  Job Title: Full Stack Developer 
  -  Languages Known: English , Tamil 
  -  If Question like this 'Can I see his resume?'  then respond with 'Sure! Here is the link to Poovarasan's resume: /Poovarasan_Resume_cv.pdf'
  
  Summary:
  -  Full Stack Developer with 2.6 years of experience.
  -  Proficient in Java, Spring Boot, React.js, TypeScript, and PostgreSQL.
  -  Skilled in building admin interfaces using React-Admin.
  -  Contributed to fintech and AI-based projects, specifically in the Merchant Cash Advance (MCA) domain.
  -  Passionate about clean code, performance optimization, and business-driven development.

  Experience:
  -  Company: MAHASWAMI SOFTWARE PRIVATE LIMITED
  -  Role: Full Stack Developer 
  -  Duration: Dec 2021 - Present
  - Responsibilities:
    -  Designed and developed full-stack modules using Spring Boot and React.js.
    -  Built and consumed RESTful APIs for integrations.
    -  Improved backend performance by 25% through query optimization and data handling.
    -  Utilized PostgreSQL for data modeling and indexing.
    -  Applied React Hooks and reusable components for better UI state management.
    -  Used Git, GitHub, and Bitbucket for version control.

  Projects:
  -  **MCA-Merchant Cash Advance**
    -  Description: A web application facilitating payment processing for businesses.
    -  Technologies: Java, Spring Boot, React.js, and PostgresSQL.
    -  Key Contributions: Developed and maintained features , ensured secure data exchange via REST APIs  , and improved user experience and backend reliability.
  -  **Coach Chess AI**
    -  Description: An AI-powered coaching platform for chess learning and analysis.
    -  Key Contributions: Built admin dashboards and user interfaces using React.js and React-Admin , integrated AI features to analyze games.

  Technical Skills:
  -  Backend: Java, Spring Boot, node.js, Hibernate, REST APIs
  -  Frontend: React.js, React-Admin, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS
  -  Database: PostgreSQL, Mongodb (basic) 
  -  Version Control: Git, GitHub, Bitbucket 
  -  Tools & Platforms: IntelliJ IDEA, VS Code, Postman, Maven, Docker (basic) 
  -  Frameworks & Libraries: React-Admin, OpenXava, Redux
  -  Soft Skills: Debugging, Troubleshooting, Team Collaboration, Clean Code Practices

  Achievements:
  -  Optimized backend logic, reducing API response times by 40%.
  -  Built scalable modules for processing high-volume data.
  -  Enhanced admin panel usability with dynamic, filterable views using React-Admin.
  -  Reduced bug resolution time through improved logging and debugging.
  -  Collaborated across cross-functional teams, ensuring timely deliveries.
  -  Participated in code reviews to improve code quality.

  Education:
  - Bachelor of Computer Applications (BCA) - Data Science, SRM University - Online |  July 2023 - Present
  - Diploma in Computer Science Engineering, KET Polytechnic College |  June 2018-July 2021

  Bio-Data:
    -  Date of Birth: 09/09/2002
    -  Nationality: Indian
    -  Gender: Male
    -  Marital Status: Single
    -  Languages Known: English, Tamil
    -  Hobbies: Coding, Reading Tech Blogs
  --- END KNOWLEDGE BASE ---
  User Prompt:
  `

export default {

    async fetch(request, env) {
        const url = new URL(request.url);
        const corsHeaders = getCorsHeaders(request, env);
        console.log("Request received:", env.API_TOKEN, request.headers.get("X-Api-Key"));

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }
        if(request.headers.get("X-Api-Key") !== env.API_TOKEN) {
            return new Response("Unauthorized", { status: 401, headers: { "Content-Type": "text/plain" } });
        }

        if (url.pathname === "/generate" && request.method === "POST") {
            try {
                const requestBody = await request.json();
                const ai = new GoogleGenAI({ apiKey: env.GOOGLE_API_KEY });          
                const response = await ai.models.generateContent({
                    model: "gemma-3-27b-it",
                    contents: yourResumeData + "\n\n" + requestBody.userPrompt,
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