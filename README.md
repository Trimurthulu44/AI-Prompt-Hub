# AI PROMPT HUB — Enterprise Multi-Tenant Prompt Governance Platform

[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java 21](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://openjdk.org/projects/jdk/21/)
[![React 19](https://img.shields.io/badge/React-18%20%2F%2019-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-teal.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-336791.svg)](https://github.com/pgvector/pgvector)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://www.docker.com/)

A full-stack, API-first enterprise prompt governance platform that manages prompts behind generative AI applications as controlled engineering assets. Built strictly according to the mini project documentation, architecture diagrams, and user interface screenshots.

---

## 📸 Exact UI Implementation Showcase (Appendix 2)

| Screenshot Fig | Section / Module | UI Route | Key Features |
|---|---|---|---|
| **Fig 9.1** | **Home Page** | `/` | Hero with petrol `#164e63` background, amber CTA "Start your workspace", 4 feature cards (*Version Control*, *Auto Evaluation*, *Security Tests*, *Quality Gates*), 10-step lifecycle, tech stack & pricing. |
| **Fig 9.2** | **Login / Registration** | `/login` | Split screen: Left teal panel with `{ }` circle badge & tagline; Right card with Work email, Password, Workspace slug (`acme-corp`), Sign In & Register modal. |
| **Fig 9.3** | **Prompt Versions & Lineage** | `/prompts` | Subheader (`customer-support-system \| Support Bot \| Production`), version history list (v1–v4 with status pills: Approved, Submitted, Failed, Rolled Back), Monaco editor with side-by-side diff mode, *Run Checks* and *Rollback*. |
| **Fig 9.4** | **Semantic Search & Deduplication** | `/semantic-search` | Cosine similarity ranking over 384-d embeddings (`billing-assistant-v3 0.91 [Likely duplicate]`, `refund-escalation-bot 0.84 [Related]`, `support-faq-answerer 0.72 [Versions]`, `code-review-helper 0.31 [Unrelated]`). |
| **Fig 9.5** | **Workspace, API Keys & Roles** | `/workspace` | `Workspace: acme-corp`. Left: Applications (*Support Chatbot Production*, *Docs Assistant Staging*, *Code Helper Dev*) with masked keys and rotation. Right: Team roles (*Priya S. Admin*, *Arun P. Developer*, *Meera K. Developer*, *Ravi T. Viewer*). |
| **Fig 9.6** | **Evaluation, Security & Regression** | `/evaluations` | 4 KPI cards (Quality score `0.89`, Regression delta `+0.03`, Security probes failed `1 / 20`, Avg tokens `412`). Criterion weights: Correctness `0.40`, Relevance `0.20`, Instruction following `0.25`, Format `0.15`. 5 security probes. |
| **Fig 9.7** | **Quality Gate Decision** | `/gate` | `DEPLOYMENT BLOCKED` banner, Reason: Security probes failed (*role override*), Action: Add explicit role boundary instruction in prompt v5. Equation 2.4 threshold checks and recent runs list. |
| **Fig 9.8** | **Analytics Dashboard** | `/analytics` | 30-day trending charts: Quality score (`0.89`), Avg tokens per reply (`412`), Cost per 1K calls in Rs (`₹26`), Latency in ms (`790ms`). |

---

## 🏗️ Architecture & Mathematics

### 1. Semantic Similarity (Equation 2.1)
$$\operatorname{sim}(p_i, p_j) = \frac{e_i \cdot e_j}{\|e_i\| \|e_j\|}$$
Prompts exceeding similarity threshold $\delta$ are flagged as potential duplicates.

### 2. Weighted LLM-as-a-Judge Score (Equation 2.2)
$$S(v) = \frac{1}{|D|} \sum_{d \in D} \sum_k w_k \cdot j_k(v, d), \quad \sum w_k = 1$$
- Correctness ($w_1 = 0.40$)
- Relevance ($w_2 = 0.20$)
- Instruction Following ($w_3 = 0.25$)
- Format ($w_4 = 0.15$)

### 3. Regression Delta (Equation 2.3)
$$\Delta = S(v_{\text{new}}) - S(v_{\text{base}})$$

### 4. Quality Gate Decision Rule (Equation 2.4)
$$G(v) = \begin{cases} 1 & \text{if } S(v) \ge \tau_q \land \Delta \ge -\epsilon \land R_{\text{sec}}(v) \le \tau_s \land C(v) \le \tau_c \\ 0 & \text{otherwise} \end{cases}$$

---

## 🚀 Running the Application

### Option A: Complete Docker Compose (Recommended for Production)
```bash
cd docker
docker compose up --build
```
This starts:
- **Frontend**: http://localhost:3000
- **Spring Boot Backend**: http://localhost:8080
- **Swagger OpenAPI Docs**: http://localhost:8080/swagger-ui.html
- **FastAPI AI Microservice**: http://localhost:8000
- **PostgreSQL with pgvector**: port 5432
- **Redis Queue**: port 6379

### Option B: Local Development
1. **Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   Open http://localhost:3000 in your browser.

2. **Backend**:
   ```bash
   cd backend
   ..\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
   ```
   Runs with H2 in-memory PostgreSQL compatibility mode and automatically seeds all Acme Corp workspace accounts, prompts, versions, and security tests.

3. **AI Service**:
   ```bash
   cd ai-service
   pip install -r requirements.txt
   uvicorn ai_service:app --host 0.0.0.0 --port 8000
   ```

4. **CI/CD Quality Gate Script (Appendix 1 [6])**:
   ```bash
   export PROMPT_HUB_URL="http://localhost:8080"
   export PROMPT_HUB_API_KEY="aph_live_d71k9a82c41c21"
   python sdk/ci_gate.py customer-support-system prompts/support_system.txt
   ```

---

## 🔑 Pre-seeded Demo Credentials

| Role | Name | Email | Password | Workspace |
|---|---|---|---|---|
| **Admin** | Priya S. | `priya@acme-corp.com` | `password123` | `acme-corp` |
| **Developer** | Arun P. | `arun@acme-corp.com` | `password123` | `acme-corp` |
| **Developer** | Meera K. | `meera@acme-corp.com` | `password123` | `acme-corp` |
| **Viewer** | Ravi T. | `ravi@acme-corp.com` | `password123` | `acme-corp` |
| **Default Dev** | Developer User | `dev@acme-corp.com` | `password123` | `acme-corp` |
