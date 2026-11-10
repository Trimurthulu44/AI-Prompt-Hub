import React from 'react';
import { Link } from 'react-router-dom';
import { BrowserChrome } from '../components/BrowserChrome';

export const LandingPage: React.FC = () => {
  const featureCards = [
    {
      title: 'Version Control',
      desc: 'v1, v2, v3 lineage and rollback',
      icon: '🔄'
    },
    {
      title: 'Auto Evaluation',
      desc: 'Golden datasets + LLM-as-a-Judge',
      icon: '⚖️'
    },
    {
      title: 'Security Tests',
      desc: 'Injection, leakage and PII probes',
      icon: '🛡️'
    },
    {
      title: 'Quality Gates',
      desc: 'Allow or block CI/CD deployment',
      icon: '🚦'
    }
  ];

  const modulesList = [
    "1. Organization Management", "2. Workspace Management", "3. User Management", "4. Role Management",
    "5. Prompt Management", "6. Prompt Versioning", "7. Prompt Analyzer", "8. AI Optimizer",
    "9. Semantic Search", "10. Duplicate Detection", "11. Golden Dataset", "12. LLM Evaluation",
    "13. Security Testing", "14. Regression Testing", "15. Quality Gate", "16. Analytics Dashboard",
    "17. Audit Logs", "18. API Key Management", "19. SDK Integration", "20. CI/CD Integration"
  ];

  const workflowSteps = [
    { step: 1, title: 'Create Prompt', desc: 'Define system prompt in workspace project' },
    { step: 2, title: 'Version Control', desc: 'Immutable v1, v2 lineage with change instructions' },
    { step: 3, title: 'Semantic Search', desc: 'Dense Sentence Transformer 384-d vector deduplication' },
    { step: 4, title: 'Analyze & Optimize', desc: 'LLM candidate generator with guardrail injection' },
    { step: 5, title: 'Golden Dataset Run', desc: '50 repeatable test cases scored by LLM-as-a-Judge' },
    { step: 6, title: 'Security Probes', desc: '5 OWASP probes: injection, leakage, PII, role override' },
    { step: 7, title: 'Regression Testing', desc: 'Evaluate delta against baseline: Δ = S(new) - S(base)' },
    { step: 8, title: 'Quality Gate Rule', desc: 'Equation 2.4: G(v) binary allow/block decision' },
    { step: 9, title: 'Production Deploy', desc: 'Automated CI/CD webhook and SDK deployment' },
    { step: 10, title: 'Monitor & Feedback', desc: 'Token usage, cost in Rs, latency and quality analytics' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      {/* Visual Browser Mock matching Fig 9.1 */}
      <div className="max-w-6xl mx-auto pt-6 px-4">
        <BrowserChrome url="ai-prompt-hub.app">
          {/* Hero Section (Matching Screenshot Fig 9.1 exactly) */}
          <div className="bg-[#164e63] text-white pt-20 pb-24 px-8 text-center relative overflow-hidden">
            {/* Background subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f3d47]/40 to-[#0b2b32] pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
                Govern Every Prompt Change.
              </h1>

              <p className="text-cyan-100 text-sm sm:text-base mb-8 max-w-xl mx-auto font-light leading-relaxed">
                Version, evaluate, security-test and gate your prompts through one secure API.
              </p>

              <div>
                <Link
                  to="/login"
                  className="inline-block bg-[#f59e0b] hover:bg-amber-600 text-slate-950 font-semibold px-8 py-3 rounded-md text-sm shadow-lg hover:shadow-xl transition duration-150 ease-in-out"
                >
                  Start your workspace
                </Link>
              </div>
            </div>
          </div>

          {/* 4 Feature Cards Row (Matching Screenshot Fig 9.1 exactly) */}
          <div className="bg-[#f8fafc] py-14 px-8 border-b border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {featureCards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition text-center flex flex-col items-center justify-center min-h-[160px]"
                >
                  <div className="text-2xl mb-3">{card.icon}</div>
                  <h3 className="font-bold text-slate-800 text-base mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </BrowserChrome>
      </div>

      {/* Extended SaaS Product Details */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-100 px-3 py-1 rounded-full">
            Engineering Governance Platform
          </span>
          <h2 className="text-3xl font-bold mt-3 text-slate-900">
            Engineered for Mission-Critical Enterprise AI
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-2">
            Placed directly underneath your existing generative AI applications, chatbots, and CI/CD pipelines without disrupting end users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 text-base mb-2">LLM-as-a-Judge Scoring</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Weighted rubric scoring across Correctness (0.40), Relevance (0.20), Instruction Following (0.25), and Format (0.15) aggregated over 50 golden test cases:
            </p>
            <div className="bg-slate-50 p-2.5 rounded font-mono text-xs text-slate-700">
              S(v) = (1/|D|) &sum; &sum; w_k &middot; j_k(v, d)
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 text-base mb-2">Mathematical Quality Gate</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Automated binary deployment decision ensuring quality score, regression delta, security probes, and token usage all satisfy project thresholds:
            </p>
            <div className="bg-slate-50 p-2.5 rounded font-mono text-xs text-slate-700">
              G(v) = 1 iff S(v)&ge;&tau;_q &and; &Delta;&ge;-&epsilon; &and; R_sec&le;&tau;_s &and; C(v)&le;&tau;_c
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 text-base mb-2">Semantic De-duplication</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              384-dimensional Sentence Transformer embeddings stored with pgvector. Find duplicate and related prompts before redundant authoring:
            </p>
            <div className="bg-slate-50 p-2.5 rounded font-mono text-xs text-slate-700">
              sim(p_i, p_j) = (e_i &middot; e_j) / (|e_i| |e_j|)
            </div>
          </div>
        </div>
      </section>

      {/* Continuous Prompt Lifecycle Workflow (Fig 5.1) */}
      <section id="workflow" className="py-16 bg-slate-100 border-y border-slate-200 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">
              The 10-Step Continuous Prompt Lifecycle
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              From Report Section 5.1 & Figure 5.1: A Continuous Governance Loop
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {workflowSteps.map((ws) => (
              <div key={ws.step} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-[#164e63] text-white flex items-center justify-center font-bold text-xs mb-2">
                  {ws.step}
                </div>
                <h4 className="font-semibold text-xs text-slate-800 mb-1">{ws.title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{ws.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 20 Modules Showcase */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">All 20 Implemented Core Modules</h2>
          <p className="text-xs text-slate-500 mt-1">
            Every module from the project report specification is built and functional.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {modulesList.map((mod, idx) => (
            <div key={idx} className="bg-white p-3 rounded border border-slate-200 text-xs font-medium text-slate-700 flex items-center space-x-2">
              <span className="text-emerald-500">✓</span>
              <span>{mod}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section id="about" className="py-16 bg-slate-900 text-slate-300 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white text-center mb-8">Platform Technology Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-xs">
            <div className="p-4 bg-slate-800 rounded border border-slate-700">
              <span className="font-bold text-cyan-400 block mb-1">Frontend</span>
              React 19, TypeScript, Vite, Tailwind CSS, Monaco Editor, Recharts
            </div>
            <div className="p-4 bg-slate-800 rounded border border-slate-700">
              <span className="font-bold text-cyan-400 block mb-1">Backend</span>
              Java 21, Spring Boot 3, Spring Security, Spring Data JPA, Hibernate
            </div>
            <div className="p-4 bg-slate-800 rounded border border-slate-700">
              <span className="font-bold text-cyan-400 block mb-1">AI Service</span>
              FastAPI, Python 3.11, Sentence Transformers (all-MiniLM-L6-v2)
            </div>
            <div className="p-4 bg-slate-800 rounded border border-slate-700">
              <span className="font-bold text-cyan-400 block mb-1">Data & Infra</span>
              PostgreSQL, pgvector, Redis, Docker, Docker Compose
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
