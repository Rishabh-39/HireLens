import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/public/LandingPage';
import { CandidateLoginPage } from './pages/public/CandidateLoginPage';
import { CandidateSignupPage } from './pages/public/CandidateSignupPage';
import { HrLoginPage } from './pages/public/HrLoginPage';
import { HrSignupPage } from './pages/public/HrSignupPage';
import { NotFoundPage } from './pages/public/NotFoundPage';
import { ProtectedRoute } from './routes/ProtectedRoute';

import { CandidateDashboardPage } from './pages/candidate/CandidateDashboardPage';
import { CandidateProfilePage } from './pages/candidate/CandidateProfilePage';
import { ResumeUploadPage } from './pages/candidate/ResumeUploadPage';
import { CareerFeedPage } from './pages/candidate/CareerFeedPage';
import { MyFeedbackPage } from './pages/candidate/MyFeedbackPage';
import { HrMessagesPage } from './pages/candidate/HrMessagesPage';

import { HrDashboardPage } from './pages/hr/HrDashboardPage';
import { HrCandidateListPage } from './pages/hr/HrCandidateListPage';
import { HrCandidateDetailPage } from './pages/hr/HrCandidateDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<CandidateLoginPage />} />
        <Route path="/signup" element={<CandidateSignupPage />} />
        <Route path="/hr/login" element={<HrLoginPage />} />
        <Route path="/hr/signup" element={<HrSignupPage />} />

        {/* Candidate (protected) */}
        <Route element={<ProtectedRoute allow="CANDIDATE" />}>
          <Route path="/dashboard" element={<CandidateDashboardPage />} />
          <Route path="/dashboard/profile" element={<CandidateProfilePage />} />
          <Route path="/dashboard/resume" element={<ResumeUploadPage />} />
          <Route path="/dashboard/feed" element={<CareerFeedPage />} />
          <Route path="/dashboard/feedback" element={<MyFeedbackPage />} />
          <Route path="/dashboard/messages" element={<HrMessagesPage />} />
        </Route>

        {/* HR (protected) */}
        <Route element={<ProtectedRoute allow="HR" />}>
          <Route path="/hr/dashboard" element={<HrDashboardPage />} />
          <Route path="/hr/candidates" element={<HrCandidateListPage />} />
          <Route path="/hr/candidates/:id" element={<HrCandidateDetailPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
