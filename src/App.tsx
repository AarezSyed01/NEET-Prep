import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useStore } from './store/useStore';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Practice from './pages/Practice';
import AIAssistant from './pages/AIAssistant';
import Syllabus from './pages/Syllabus';
import MockTests from './pages/MockTests';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

export default function App() {
  const { profile, logActiveDay, theme } = useStore();

  useEffect(() => {
    if (profile) {
      logActiveDay();
    }
  }, [profile, logActiveDay]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  if (!profile) {
    return <Onboarding />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="syllabus" element={<Syllabus />} />
          <Route path="practice" element={<Practice />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="mock-tests" element={<MockTests />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
