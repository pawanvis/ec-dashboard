import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './globel.css';
import { AuthProvider } from './context/AuthContext'; // Create this context
import ProtectedRoute from './components/ProtectedRoute'; // Create this component

import Header from './layout/header';
import Sidebar from './layout/sidebar';
import Footer from './layout/footer';

import Applynow from './pages/applynow';
import Admissionsenquire from './pages/admissionsenquire';
import Blogedit from './pages/blogedit';
import Bloglist from './pages/bloglist';
import Blogpost from './pages/blogpost';
import Eventedit from './pages/eventedit';
import Eventlist from './pages/eventlist';
import Eventpost from './pages/eventpost';
import Requestinfo from './pages/requestinfo';
import Studentverification from './pages/studentverification';
import Studentverificationpost from './pages/studentverificationpost';
import Academicpartnerspost from './pages/academicpartnerspost';
import Academicpartnerslist from './pages/academicpartners';
import Dashboard from './pages/dashboard';
import Login from './auth/login';
import BlogUpdate from './pages/blog-update';
import EventUpdate from './pages/eventedit';
import Studentverificationupdate from './pages/studentverificationupdate';
import Brochure from './pages/brochure';
import Courseenquire from './pages/courseenquire';

// Layout wrapper to conditionally show layout
const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <div className="layout">
        <Header />
        <div className="main">{children}</div>
        <Footer />
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            
            {/* Protected Routes - Only accessible after login */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/apply-now" element={<Applynow />} />
              <Route path="/admissions-enquire" element={<Admissionsenquire />} />
              <Route path="/blog-edit/:id" element={<Blogedit />} />
              <Route path="/blog-list" element={<Bloglist />} />
              <Route path="/blog-update" element={<BlogUpdate />} />
              <Route path="/blog-post" element={<Blogpost />} />
              <Route path="/event-edit" element={<Eventedit />} />
              <Route path="/event-list" element={<Eventlist />} />
              <Route path="/event-update/:id" element={<EventUpdate />} />
              <Route path="/event-post" element={<Eventpost />} />
              <Route path="/request-info" element={<Requestinfo />} />
              <Route path="/student-verification-post" element={<Studentverificationpost />} />
              <Route path="/student-verification-list" element={<Studentverification />} />
              <Route path="/academic-partners-post" element={<Academicpartnerspost />} />
              <Route path="/academic-partners-list" element={<Academicpartnerslist />} />
              <Route path="/student-verification-update/:id" element={<Studentverificationupdate />} />
              <Route path="/brochure" element={<Brochure />} />
              <Route path="/course-enquire" element={<Courseenquire />} />
            </Route>
            
            {/* Redirect any unknown path to login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;