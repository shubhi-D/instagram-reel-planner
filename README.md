Absolutely — here is a **more polished, concise, professional, industry-standard README**.
No fluff. Clear sections. Clean hierarchy. Reads like something you'd see on a serious open-source repo or a portfolio project.

You can directly paste this into GitHub.

---

# **ReelCraft by Shubhi**

### *AI-Powered Instagram Reel Ideation Assistant*

ReelCraft is a production-grade, full-stack AI application that generates high-quality Instagram Reel ideas, hooks, captions, and hashtags.
Built with **Next.js**, **FastAPI**, **Supabase**, and **Google Gemini**, the project demonstrates modern full-stack engineering and practical AI integration.

---

## 📽 **Demo (Coming Soon)**

> *(Add a GIF, Loom link, or short demo clip here)*

---

##  **Features**

### 🔹 AI-Generated Reel Content

* 5 reel ideas per request
* Hooks, captions, long descriptions, and hashtags
* Consistent, structured JSON output
* Powered by **Google Gemini 1.5 Flash / Pro**

### 🔹 Idea Management

* Save generated ideas
* View stored ideas in a dedicated dashboard
* Delete ideas with instant UI refresh
* Stored persistently in **Supabase PostgreSQL**

### 🔹 Modern Full-Stack Implementation

* **Next.js App Router** (frontend)
* **FastAPI** (backend)
* **Supabase ORM layer**
* **Google AI SDK**
* Strong error handling, async architecture, typed responses

---

## 🧠 **AI Model Information**

ReelCraft uses:

**Google Gemini API**

* Model: `gemini-1.5-flash` (default)
* Optional high-quality: `gemini-1.5-pro`

**Why Gemini?**

* Generous free tier
* Strong natural language generation for content/marketing
* Clean structured output (critical for this app)
* No credit card needed to get started
* Stable performance and developer-friendly SDK

**How it’s used in backend:**

* Backend sends a structured JSON prompt
* Gemini responds with a strict JSON array
* Backend validates + returns consistent data to frontend
* No prompt leakage or hallucinated formatting

---

## 🏗 **Architecture Overview**

```
client (Next.js)
   │
   ├── fetch("/api/generate-ideas")
   ▼
backend (FastAPI)
   │
   ├── Google Gemini API call
   ├── Validate JSON response
   ├── Save / delete ideas in Supabase
   ▼
database (Supabase PostgreSQL)
```

---

## 📁 **Project Structure**

```
/backend
  ├── app
  │     ├── main.py
  │     ├── routes/
  │     ├── services/
  │     ├── database/
  └── requirements.txt

/frontend
  ├── app/
  ├── components/
  ├── lib/
  └── package.json
```

---

## ⚙️ **Local Setup**

### **Backend**

```sh
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Runs on:
👉 [http://localhost:8000](http://localhost:8000)

---

### **Frontend**

```sh
cd frontend
npm install
npm run dev
```

Runs on:
👉 [http://localhost:3000](http://localhost:3000)

---

## **Environment Variables**

### **Backend `.env`**

```
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-1.5-flash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### **Frontend `.env`**

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📡 **API Endpoints**

### Generate Ideas

`POST /api/generate-ideas`

### Save Idea

`POST /api/save-idea`

### Get Saved Ideas

`GET /api/get-saved-ideas`

### Delete Idea

`DELETE /api/delete-idea/{id}`

---

## **Deployment Targets**

### Frontend

* Vercel
* Netlify

### Backend

* Railway
* Render
* VPS (Docker recommended)

### Database

* Supabase Cloud

---

## **Contributing**

1. Create a feature branch
2. Add descriptive commits
3. Open a PR with a clear description

---

##  **Author**

**Shubhi**
AI, Full-Stack & DevOps Engineer
*"Building practical tools with AI."*

