import React, { useState } from 'react';
import Navbar from './components/Header/Navbar';
import StickyAnnouncementBar from './components/Header/StickyAnnouncementBar';
import HeroSlider from './components/Home/HeroSlider';
import PrincipalMessage from './components/Home/PrincipalMessage';
import AboutCollege from './components/Home/AboutCollege';
import LatestUpdatesCarousel from './components/Home/LatestUpdatesCarousel';
import CampusMap from './components/Home/CampusMap';
import QuickStats from './components/Home/QuickStats';
import Footer from './components/Footer/Footer';
import OpeningLogoAnimation from './components/Common/OpeningLogoAnimation';

import InnerPage from './components/Pages/InnerPage';
import PageTransition from './components/Common/PageTransition';

// Modals
import OnlineAdmissionModal from './components/Admission/OnlineAdmissionModal';
import AdmissionCriteriaModal from './components/Admission/AdmissionCriteriaModal';
import PrincipalMessageModal from './components/Home/PrincipalMessageModal';
import FacultyModal from './components/Faculty/FacultyModal';
import ProgramsModal from './components/Academic/ProgramsModal';
import AdminModal from './components/Admin/AdminModal';
import NoticeDetailModal from './components/Home/NoticeDetailModal';
import TrackStatusModal from './components/Admission/TrackStatusModal';
import CollegeInfoModal from './components/Home/CollegeInfoModal';
import { apiFetch } from './utils/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [admissionOpen, setAdmissionOpen] = useState(false);
  const [admissionStream, setAdmissionStream] = useState('ARTS');
  const [admissionMajor, setAdmissionMajor] = useState('');
  
  const [trackOpen, setTrackOpen] = useState(false);
  const [trackAppNo, setTrackAppNo] = useState('');

  const [criteriaOpen, setCriteriaOpen] = useState(false);
  const [principalModalOpen, setPrincipalModalOpen] = useState(false);
  const [facultyOpen, setFacultyOpen] = useState(false);
  const [programsModalOpen, setProgramsModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    const rawPath = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
    const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '').replace(/\/+$/, '');
    const isAdminRoute =
      rawPath === 'adminspace' ||
      rawPath.endsWith('/adminspace') ||
      rawPath.startsWith('adminspace/') ||
      hash === 'adminspace' ||
      hash.startsWith('adminspace') ||
      rawPath === 'admin' ||
      rawPath.endsWith('/admin') ||
      rawPath.startsWith('admin/') ||
      hash === 'admin' ||
      hash.startsWith('admin');

    // ONLY initialize admin as open if the current browser URL is actually the /adminspace route
    if (isAdminRoute) {
      try {
        sessionStorage.setItem('cche_admin_open', 'true');
      } catch {}
      return true;
    }

    // Refreshing from the home page ('/') or any public page must NEVER redirect/open admin
    try {
      sessionStorage.removeItem('cche_admin_open');
    } catch {}
    return false;
  });
  const [selectedNotice, setSelectedNotice] = useState(null);

  // College Info Modal topic state
  const [infoTopic, setInfoTopic] = useState(null);

  // Online admissions live status (synchronized in real time with backend & /admin)
  const [admissionsActive, setAdmissionsActive] = useState(false);
  const [admissionsNotice, setAdmissionsNotice] = useState('');

  const syncAdmissionStatus = React.useCallback(async () => {
    try {
      const res = await apiFetch('/api/admissions/status');
      if (res && res.ok) {
        const data = await res.json();
        if (data && data.success) {
          setAdmissionsActive(Boolean(data.admissions_open));
          if (data.notice) setAdmissionsNotice(data.notice);
        }
      }
    } catch (e) {
      console.warn('Admission status sync notice:', e.message);
    }
  }, []);

  React.useEffect(() => {
    syncAdmissionStatus();

    const handleFocus = () => syncAdmissionStatus();
    window.addEventListener('focus', handleFocus);

    const handleStatusSync = (e) => {
      if (e.detail) {
        if (typeof e.detail.open === 'boolean') setAdmissionsActive(e.detail.open);
        if (e.detail.notice) setAdmissionsNotice(e.detail.notice);
      }
      syncAdmissionStatus();
    };
    window.addEventListener('admissions-status-changed', handleStatusSync);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('admissions-status-changed', handleStatusSync);
    };
  }, [syncAdmissionStatus]);

  const handleOpenAdmin = (tab = null) => {
    setAdminOpen(true);
    try {
      sessionStorage.setItem('cche_admin_open', 'true');
      if (tab) sessionStorage.setItem('cche_admin_tab', tab);
    } catch {}
    if (!window.location.pathname.toLowerCase().endsWith('/adminspace')) {
      window.history.pushState(null, '', '/adminspace');
    }
  };

  const handleCloseAdmin = () => {
    setAdminOpen(false);
    try {
      sessionStorage.removeItem('cche_admin_open');
    } catch {}
    if (
      window.location.pathname.toLowerCase().endsWith('/adminspace') ||
      window.location.pathname.toLowerCase().endsWith('/admin') ||
      window.location.hash === '#adminspace' ||
      window.location.hash.startsWith('#adminspace') ||
      window.location.hash === '#admin' ||
      window.location.hash.startsWith('#admin')
    ) {
      window.history.replaceState(null, '', '/');
    }
  };

  React.useEffect(() => {
    const checkRoute = () => {
      const rawPath = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
      const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '').replace(/\/+$/, '');
      const path = rawPath || hash;

      const isAdminRoute =
        rawPath === 'adminspace' ||
        rawPath.endsWith('/adminspace') ||
        rawPath.startsWith('adminspace/') ||
        hash === 'adminspace' ||
        hash.startsWith('adminspace') ||
        rawPath === 'admin' ||
        rawPath.endsWith('/admin') ||
        rawPath.startsWith('admin/') ||
        hash === 'admin' ||
        hash.startsWith('admin');

      if (isAdminRoute) {
        setAdminOpen(true);
        try {
          sessionStorage.setItem('cche_admin_open', 'true');
        } catch {}
      } else {
        setAdminOpen(false);
        try {
          sessionStorage.removeItem('cche_admin_open');
        } catch {}

        if (!path || path === 'home') {
          setCurrentPage('home');
        } else if (path === 'college-profile-1' || path === 'profile') {
          setCurrentPage('profile');
        } else if (path === 'sponsorship-and-management') {
          setCurrentPage('sponsorship-and-management');
        } else if (path === 'governing-body') {
          setCurrentPage('governing-body');
        } else if (path === 'college-administration') {
          setCurrentPage('college-administration');
        } else if (path === 'dep' || path === 'faculty' || path === 'departments') {
          setCurrentPage('department-english');
          window.history.replaceState(null, '', '/department/english');
        } else if (path === 'mous' || path === 'mou') {
          setCurrentPage('mous');
        } else if (path === 'internal-quality-assurance-cell-iqac' || path === 'iqac') {
          setCurrentPage('iqac');
        } else if (path === 'college-rules-and-regulations' || path === 'rules') {
          setCurrentPage('rules');
        } else if (path === 'criteria') {
          setCurrentPage('criteria');
        } else if (path === 'programs-and-courses' || path === 'programs' || path === 'courses' || path === 'course' || path === 'programmes' || path === 'programme' || path === 'subjects') {
          setCurrentPage('programs');
        } else if (path === 'academic-calendar') {
          setCurrentPage('academic-calendar');
        } else if (path === 'notice' || path === 'notices') {
          setCurrentPage('notice');
        } else if (path === 'under-graduate-exam-routine-2023' || path === 'exam-routine') {
          setCurrentPage('under-graduate-exam-routine-2023');
        } else if (path === 'committees-and-in-charges' || path === 'committees' || path === 'list-of-committees') {
          setCurrentPage('committees-and-in-charges');
        } else if (
          path === 'students-council-eu' ||
          path === 'student-council-eu' ||
          path === 'students-council' ||
          path === 'student-council' ||
          path === 'students-council-and-eu' ||
          path === 'student-council-and-eu' ||
          path === 'eu' ||
          path === 'evangelical-union' ||
          path === 'student-services' ||
          path === 'students-services'
        ) {
          setCurrentPage('students-council-eu');
        } else if (path === 'cche-scheme-for-economically-weak-students' || path === 'welfare-scheme') {
          setCurrentPage('cche-scheme-for-economically-weak-students');
        } else if (path === 'student-awards' || path === 'students-awards') {
          setCurrentPage('student-awards');
        } else if (path === 'teachers-award' || path === 'teacher-awards') {
          setCurrentPage('teachers-award');
        } else if (path === 'principal-message' || path === 'principals-message') {
          setCurrentPage('principal-message');
        } else if (path === 'scholarship' || path === 'scholarships') {
          setCurrentPage('scholarship');
        } else if (path === 'arts-block' || path === 'kohima-campus') {
          setCurrentPage('arts-block');
        } else if (path === 'science-section' || path === 'thegaba-campus') {
          setCurrentPage('science-section');
        } else if (path === 'gallery') {
          setCurrentPage('gallery');
        } else if (path === 'contact' || path === 'contact-us') {
          setCurrentPage('contact');
        } else if (
          path.startsWith('department/') ||
          path.startsWith('department-') ||
          path.startsWith('stream/arts/') ||
          path.startsWith('stream/science/') ||
          path.startsWith('stream/')
        ) {
          const parts = path.split('/');
          const lastPart = parts[parts.length - 1].replace(/^department-/, '');
          setCurrentPage(`department-${lastPart}`);
        } else if ([
          'english', 'history', 'political-science', 'sociology',
          'education', 'economics', 'tenyidie', 'botany',
          'zoology', 'chemistry', 'mathematics'
        ].includes(path)) {
          setCurrentPage(`department-${path}`);
        }
      }
    };
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const handleOpenAdmission = (stream = 'ARTS', major = '') => {
    setAdmissionStream(stream);
    setAdmissionMajor(major);
    setAdmissionOpen(true);
  };

  const handleOpenTrackStatus = (appNo = '') => {
    setTrackAppNo(appNo);
    setTrackOpen(true);
  };

  const handleOpenTopic = (topic) => {
    handleNavigate(topic);
  };

  const handleNavigate = (target) => {
    if (target === 'adminspace' || target === 'admin') {
      handleOpenAdmin();
      return;
    }
    if (adminOpen) {
      handleCloseAdmin();
    }
    const normalizedTarget =
      ['course', 'courses', 'programmes', 'programme', 'subjects', 'programs-and-courses'].includes(target)
        ? 'programs'
        : target;

    if (normalizedTarget === 'home') {
      setCurrentPage('home');
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (normalizedTarget === 'about') {
      setCurrentPage('home');
      window.history.pushState(null, '', '/');
      setTimeout(() => {
        const el = document.getElementById('about-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (normalizedTarget === 'updates') {
      setCurrentPage('home');
      window.history.pushState(null, '', '/');
      setTimeout(() => {
        const el = document.getElementById('updates-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (normalizedTarget === 'campus-location' || normalizedTarget === 'map') {
      setCurrentPage('home');
      window.history.pushState(null, '', '/');
      setTimeout(() => {
        const el = document.getElementById('campus-location');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (normalizedTarget.startsWith('department-')) {
      const dSlug = normalizedTarget.replace(/^department-/, '');
      setCurrentPage(normalizedTarget);
      window.history.pushState(null, '', `/department/${dSlug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (normalizedTarget === 'faculty' || normalizedTarget === 'dep') {
      setCurrentPage('department-english');
      window.history.pushState(null, '', '/department/english');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentPage(normalizedTarget);
      const urlSlug =
        normalizedTarget === 'profile'
          ? '/college-profile-1'
          : normalizedTarget === 'programs'
          ? '/programs-and-courses'
          : '/' + normalizedTarget;
      window.history.pushState(null, '', urlSlug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  const isPrintModalActive = trackOpen || admissionOpen || adminOpen;

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc] text-gray-800 font-sans selection:bg-[#4a6b28] selection:text-white w-full overflow-x-clip">
      {/* Opening Logo Cinematic Intro Animation */}
      <OpeningLogoAnimation />

      {/* Website Body Layout (Suppressed during modal printing so only 1-page document prints) */}
      <div className={`site-layout-wrapper flex-1 flex flex-col w-full ${isPrintModalActive ? 'print:hidden' : ''}`}>
        {/* Sticky Top Institutional Announcement & Notification Bar */}
        <StickyAnnouncementBar
          onOpenAdmission={() => handleOpenAdmission('ARTS')}
          onNavigate={handleNavigate}
          onOpenTrackStatus={handleOpenTrackStatus}
          admissionsActive={admissionsActive}
        />

        {/* Main Navigation Bar with Consolidated Mega Menus */}
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenAdmission={() => handleOpenAdmission('ARTS')}
          onOpenTrackStatus={handleOpenTrackStatus}
          onOpenPrincipalMessage={() => handleNavigate('principal-message')}
          onOpenCriteria={() => handleNavigate('criteria')}
          onOpenPrograms={() => handleNavigate('programs')}
          onOpenFaculty={() => handleNavigate('faculty')}
          onOpenTopic={handleOpenTopic}
          onOpenAdmin={handleOpenAdmin}
          admissionsActive={admissionsActive}
        />

        {/* Main Content */}
        <main className="flex-1 w-full">
          <PageTransition pageKey={currentPage}>
            {currentPage === 'home' ? (
              <>
                {/* 1. Hero Slider (Grand Collegiate Showcase with Integrated Quick-Access Dock) */}
                <HeroSlider
                  onOpenAdmission={() => handleOpenAdmission('ARTS')}
                  onNavigate={handleNavigate}
                />

                {/* 2. Key Institutional Metrics Strip (Estd. 2004, UGC, 10:1 Ratio, Batches) */}
                <QuickStats />

                {/* 3. Office of the Principal Message Section */}
                <PrincipalMessage
                  onOpenFullMessage={() => handleNavigate('principal-message')}
                  onNavigate={handleNavigate}
                />

                {/* 4. About College Section & Dual Campus Infrastructure Showcase */}
                <AboutCollege
                  onNavigate={handleNavigate}
                  onOpenAdmission={() => handleOpenAdmission('ARTS')}
                />

                {/* 5. Latest Updates & Events Carousel */}
                <LatestUpdatesCarousel
                  onSelectNotice={(notice) => setSelectedNotice(notice)}
                  onViewMore={() => handleNavigate('notice')}
                  onViewEvents={() => handleNavigate('events')}
                />

                {/* 6. Campus Location & Interactive Google Maps */}
                <CampusMap />
              </>
            ) : (
              <InnerPage
                pageId={currentPage}
                onNavigate={handleNavigate}
                onOpenAdmission={handleOpenAdmission}
                onOpenAdmin={handleOpenAdmin}
              />
            )}
          </PageTransition>
        </main>

        {/* 4-Column Footer */}
        <Footer
          onOpenAdmission={() => handleOpenAdmission('ARTS')}
          onOpenAdmin={handleOpenAdmin}
          onOpenTopic={handleOpenTopic}
          onNavigate={handleNavigate}
        />
      </div>

      {/* Modals & Dialogs */}
      <OnlineAdmissionModal
        isOpen={admissionOpen}
        onClose={() => setAdmissionOpen(false)}
        initialStream={admissionStream}
        initialMajor={admissionMajor}
        onOpenTrackStatus={handleOpenTrackStatus}
        admissionsOpen={admissionsActive}
        admissionsNotice={admissionsNotice}
      />

      <TrackStatusModal
        isOpen={trackOpen}
        onClose={() => setTrackOpen(false)}
        initialAppNo={trackAppNo}
      />

      <AdmissionCriteriaModal
        isOpen={criteriaOpen}
        onClose={() => setCriteriaOpen(false)}
        onOpenAdmission={() => handleOpenAdmission('ARTS')}
      />

      <PrincipalMessageModal
        isOpen={principalModalOpen}
        onClose={() => setPrincipalModalOpen(false)}
      />

      <FacultyModal
        isOpen={facultyOpen}
        onClose={() => setFacultyOpen(false)}
      />

      <ProgramsModal
        isOpen={programsModalOpen}
        onClose={() => setProgramsModalOpen(false)}
        onOpenAdmission={() => handleOpenAdmission('ARTS')}
      />

      {/* Dynamic Topic Modal for all nav links (Rules, IQAC, Profile, Admin, Committees, Library, etc.) */}
      <CollegeInfoModal
        isOpen={Boolean(infoTopic)}
        onClose={() => setInfoTopic(null)}
        topic={infoTopic || 'rules'}
        onOpenAdmission={() => handleOpenAdmission('ARTS')}
      />

      <AdminModal
        isOpen={adminOpen}
        onClose={handleCloseAdmin}
        onStatusChange={(status) => setAdmissionsActive(status)}
      />

      <NoticeDetailModal
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
      />
    </div>
  );
}
