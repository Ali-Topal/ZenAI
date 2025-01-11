# ZenAI Website Deployment and Maintenance Guide

## **1. Project Setup Overview**
This project uses the following tools:
- **Vercel**: For hosting and deploying the site.
- **GitHub**: For source control and storing the codebase.
- **Supabase (PostgreSQL)**: For the database backend.
- **OpenAI API**: For AI-powered responses.


## **2. Useful Commands**

### **Vercel (Deployment and Logs)**

**vercel --prod**: Deploy the site to production  
**vercel dev**: Run the website locally for testing  
**vercel logs --prod**: View runtime logs for debugging  

---

### **Git Commands**

**git init**: Initialize a Git repository  
**git remote add origin <repository-URL>**: Add the GitHub repository URL  
**git add .**: Stage changes  
**git commit -m "message"**: Commit the staged changes  
**git push origin main**: Push changes to GitHub  
**git pull origin main**: Pull the latest changes from GitHub  

---

### **Environment Variables**

The following .env file variables are required:

OPENAI_API_KEY= \<your-openai-api-key\>  
DATABASE_URL= \<your-supabase-postgresql-url\>

---

### **Adding a Custom Domain to Vercel**

- Go to your Vercel dashboard.  
- Select your project and navigate to the Domains section.  
- Add your custom domain (e.g., zenai.technology).  
- Configure DNS records as instructed by Vercel.  

---

### **Modifying the Serverless Functions**

API functions are located in the api/ directory.  
To modify the messages.js:  
Edit the AI prompt or database query as needed.  
Example OpenAI call:  
```
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "system", content: "Custom AI instructions." }]
});
```
---

### **Database Management**

- Use TablePlus or psql to connect to the database:

psql "postgresql://<username>:<password>@<host>:5432/<database>"

---

### **Useful Queries**

SELECT * FROM user_responses;  -- View stored responses  
DELETE FROM user_responses WHERE id = 1;  -- Delete a record  

---
