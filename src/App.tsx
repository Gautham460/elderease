import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useServiceStore } from './store/serviceStore';
import { useHealthStore } from './store/healthStore';
import { useReminderStore } from './store/reminderStore';
import { useContactStore } from './store/contactStore';

// Pages
import { WelcomePage } from './pages/WelcomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { HealthPage } from './pages/HealthPage';
import { MedicationsPage } from './pages/MedicationsPage';
import { ContactsPage } from './pages/ContactsPage';
import { ReportsPage } from './pages/ReportsPage';
import { HealthcarePage } from './pages/HealthcarePage';
import { HomeAssistancePage } from './pages/HomeAssistancePage';
import { MedicalInfoPage } from './pages/MedicalInfoPage';
import { CaregiverDashboard } from './pages/CaregiverDashboard';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { AdminDashboard } from './pages/AdminDashboard';

// Components
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SOSButton } from './components/sos/SOSButton';

// Styles
import './App.css';
import './index.css';

function App() {
  const { isAuthenticated, user } = useAuthStore();
  const { fetchHealthcareData } = useServiceStore();
  const { fetchHealthData } = useHealthStore();
  const { fetchReminderData } = useReminderStore();
  const { fetchContactData } = useContactStore();

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchHealthcareData(user.id);
      fetchHealthData(user.id);
      fetchReminderData(user.id);
      fetchContactData(user.id);
    }
  }, [isAuthenticated, user?.id, fetchHealthcareData, fetchHealthData, fetchReminderData, fetchContactData]);

  return (
    <BrowserRouter>
      {isAuthenticated && <SOSButton />}
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/welcome" 
          element={<WelcomePage />} 
        />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} 
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === 'admin' ? <AdminDashboard /> : user?.role === 'caregiver' ? <CaregiverDashboard /> : <DashboardPage />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              {<AdminDashboard />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/health"
          element={
            <ProtectedRoute>
              <HealthPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medications"
          element={
            <ProtectedRoute>
              <MedicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <ContactsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/healthcare"
          element={
            <ProtectedRoute>
              <HealthcarePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home-assistance"
          element={
            <ProtectedRoute>
              <HomeAssistancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medical-info"
          element={
            <ProtectedRoute>
              <MedicalInfoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AiAssistantPage />
            </ProtectedRoute>
          }
        />

        {/* Default Route - redirects to welcome page */}
        <Route 
          path="/" 
          element={<Navigate to="/welcome" />} 
        />
        
        {/* 404 Route */}
        <Route 
          path="*" 
          element={<Navigate to="/welcome" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
