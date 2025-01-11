## Vercel (Hosting Platform) 

**Purpose:** Used for deploying and hosting the website (frontend and backend).  

### **Setup:**
- **vercel.json** is used to configure routes for API endpoints and define runtime versions.  
- The **public/** directory contains static files like **index.html**, **style.css**, and **app.js**.  
- The **api/** directory contains serverless functions (e.g., **messages.js** for AI API requests).

### **Important Commands:**

`vercel --prod` - Deploy the project to production  
`vercel dev` - Run the site locally for development  
`vercel logs --prod` - View runtime logs for debugging  

## GitHub (Source Code Management)  
**Purpose:** Used to store and version control the website code.  

### **Setup:**
- Your local project is connected to a remote GitHub repository.
- git push origin main updates the repository.

### **Useful Commands:**

`git init` - Initialize a new Git repository  
`git add .` - Add all changes  
`git commit -m "message"` - Commit the changes  
`git push origin main` - Push changes to GitHub  

## Cursor (AI-Powered Code Editor)  

**Purpose:** Assisted in generating and fixing code through prompts.  

### **Examples of Usage:**

- Generating initial serverless function code.
- Creating or fixing configurations (e.g., vercel.json or package.json).
- Fixing runtime errors like missing environment variables.

## PostgreSQL (Database)  

**Purpose:** Used to store and retrieve persistent data (e.g., user interactions).  

### **Setup:**  
- Supabase provided a hosted PostgreSQL database.
- The API connects to the database using credentials stored in .env.

**Key Connection String:**

`postgresql://<username>:<password>@<host>:5432/<database>`  

### **Useful Commands:**

`psql "postgresql://<username>:<password>@<host>:5432/<database>"` - Connect to the database via CLI  

## OpenAI API

**Purpose:** Used to generate AI responses via the GPT-4 or GPT-3.5 Turbo models.  

### **Setup:**  

- The OpenAI API key is stored in .env as OPENAI_API_KEY.
- Important API Call Example (in messages.js):

```
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: userMessage }]
});
```
