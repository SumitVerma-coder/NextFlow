# NextFlow

NextFlow is a Galaxy.ai-inspired visual workflow builder that allows authenticated users to create, configure, save, and execute AI workflows using a node-based canvas.

The application supports workflow creation, React Flow-based node editing, background execution with Trigger.dev, Gemini-powered AI nodes, crop-image workflow nodes, execution history, dark/light mode, and JSON import/export.

---

## 🚀 Features

- Clerk authentication
- Protected dashboard
- Multiple workflows per user
- Visual workflow builder using React Flow
- Bottom floating toolbar for adding nodes
- Editable node configuration panel
- Save and load workflows from PostgreSQL
- Workflow rename and delete
- Workflow execution using Trigger.dev
- Gemini AI node execution
- Crop image node with delayed execution
- Workflow run history
- Node-level execution status
- Final response rendering with Markdown support
- JSON import/export
- Dark mode and light mode toggle
- Collapsible history panel
- Dashboard navigation from workflow editor

---

## 🧱 Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Clerk
- Prisma ORM
- PostgreSQL / Neon
- React Flow
- Trigger.dev
- Gemini API
- Zustand
- Lucide React
- React Markdown

---

## 📁 Folder Structure

```txt
nextflow/
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── workflows/
│   │   ├── dashboard/
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── workflow/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── providers/
│   │   └── workflow/
│   │
│   ├── lib/
│   │   ├── dag.ts
│   │   ├── format-run-result.ts
│   │   ├── gemini.ts
│   │   ├── interpolate.ts
│   │   ├── node-executor.ts
│   │   ├── prisma.ts
│   │   ├── sample-workflow.ts
│   │   ├── sleep.ts
│   │   ├── workflow-executor.ts
│   │   ├── workflow-node-factory.ts
│   │   └── workflow-validation.ts
│   │
│   ├── store/
│   ├── trigger/
│   │   └── run-workflow.ts
│   └── types/
│
├── trigger.config.ts
├── package.json
└── README.md
```

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="your_neon_postgresql_url"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/sign-in

GEMINI_API_KEY="your_gemini_api_key"

TRIGGER_SECRET_KEY="your_trigger_secret_key"
```

---

### 4. Set up the database

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Optional: open Prisma Studio

```bash
npx prisma studio
```

---

### 5. Start the Next.js development server

```bash
npm run dev
```

The app will run at:

```txt
http://localhost:3000
```

---

### 6. Start Trigger.dev development server

In a separate terminal, run:

```bash
npx trigger.dev@latest dev
```

This is required for workflow execution during local development.

---

## 🧪 How to Test the Project

### Fast test workflow

Create a workflow with this structure:

```txt
Request Inputs → Gemini → Response
```

Configure the Gemini node with:

```txt
Model:
gemini-2.5-flash

System Prompt:
You are a helpful assistant. Keep the response short and clear.

Prompt:
Write a short motivational quote for a student preparing for interviews.
```

Click:

```txt
Save changes → Run
```

Expected result:

- History shows `RUNNING`
- Then changes to `SUCCESS`
- Final Response displays the generated Gemini output

---

### Crop workflow test

Create this workflow:

```txt
Request Inputs → Crop Image → Response
```

Expected result:

- Crop node waits around 30 seconds
- History updates from `RUNNING` to `SUCCESS`
- Final response shows crop output details

---

## 🧠 Workflow Execution Logic

NextFlow executes workflows as a directed acyclic graph.

Execution behavior:

- Nodes run only after their dependencies are completed
- Independent sibling nodes run in parallel
- Workflow status is stored in PostgreSQL
- Each node execution is stored as a `NodeRun`
- Overall workflow execution is stored as a `WorkflowRun`
- Final output is captured by the Response node

Example:

```txt
Request Inputs
 ├── Crop Image #1
 ├── Crop Image #2
 └── Gemini #1 → Gemini #2

Crop Image #1 ┐
Crop Image #2 ├── Final Gemini → Response
Gemini #2     ┘
```

---

## 🗄️ Database Models

The main Prisma models are:

```txt
Workflow
WorkflowRun
NodeRun
```

### Workflow

Stores workflow metadata, nodes, and edges.

### WorkflowRun

Stores each workflow execution.

### NodeRun

Stores individual node execution results, status, duration, input, output, and errors.

---

## 📦 Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Generates Prisma client, deploys migrations, and builds the Next.js app.

```bash
npm run start
```

Starts the production server.

```bash
npm run lint
```

Runs ESLint.

---

## 🚀 Deployment

The recommended deployment setup is:

```txt
Frontend / Next.js App: Vercel
Database: Neon PostgreSQL
Workflow Execution: Trigger.dev
Authentication: Clerk
```

---

## Deploy to Vercel

### 1. Push code to GitHub

```bash
git add .
git commit -m "Prepare project for deployment"
git push
```

---

### 2. Import project on Vercel

Go to Vercel and import the GitHub repository.

Use:

```txt
Framework Preset: Next.js
Build Command: npm run build
Install Command: npm install
Output Directory: .next
```

---

### 3. Add environment variables in Vercel

```env
DATABASE_URL="your_neon_postgresql_url"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/sign-in

GEMINI_API_KEY="your_gemini_api_key"

TRIGGER_SECRET_KEY="your_trigger_secret_key"
```

---

## Deploy Trigger.dev Tasks

Deploy Trigger.dev tasks using:

```bash
npx trigger.dev@latest deploy
```

Make sure your task file exists at:

```txt
src/trigger/run-workflow.ts
```

And your `trigger.config.ts` points to:

```ts
dirs: ["./src/trigger"]
```

---

## Trigger.dev Environment Variables

In Trigger.dev dashboard, add these environment variables:

```env
DATABASE_URL="your_neon_postgresql_url"
GEMINI_API_KEY="your_gemini_api_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
```

Without these, workflow runs may remain stuck in `RUNNING`.

---

## 🔐 Clerk Setup

In Clerk dashboard, add your production domain:

```txt
https://your-project.vercel.app
```

Add redirect URLs:

```txt
https://your-project.vercel.app/sign-in
https://your-project.vercel.app/sign-up
https://your-project.vercel.app/dashboard
```

Also keep local URLs for development:

```txt
http://localhost:3000/sign-in
http://localhost:3000/sign-up
http://localhost:3000/dashboard
```

---

## 🧩 Supported Nodes

### Request Inputs

Used to provide workflow input text and image URL.

### Crop Image

Simulates an image crop operation and waits at least 30 seconds before completing.

### Gemini

Uses Gemini API to generate AI output from prompts.

### Response

Captures and displays the final workflow response.

---

## 🌗 Theme Support

NextFlow includes dark mode and light mode support using `next-themes`.

Users can toggle the theme from the header.

---

## 📤 JSON Import / Export

Users can export a workflow as JSON and import it later.

This allows workflows to be shared, backed up, or restored.


## 👨‍💻 Author

Sumit Verma
