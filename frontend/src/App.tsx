import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PromptVersionsPage } from './pages/PromptVersionsPage';
import { SemanticSearchPage } from './pages/SemanticSearchPage';
import { WorkspaceRolesPage } from './pages/WorkspaceRolesPage';
import { EvaluationSecurityPage } from './pages/EvaluationSecurityPage';
import { QualityGatePage } from './pages/QualityGatePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Landing & Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Main App Screens from Project Report */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/prompts" element={<PromptVersionsPage />} />
              <Route path="/semantic-search" element={<SemanticSearchPage />} />
              <Route path="/workspace" element={<WorkspaceRolesPage />} />
              <Route path="/evaluations" element={<EvaluationSecurityPage />} />
              <Route path="/gate" element={<QualityGatePage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/audit" element={<AuditLogsPage />} />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
