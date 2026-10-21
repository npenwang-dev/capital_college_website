import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Users,
  Bell,
  Mail,
  ShieldCheck,
  Lock,
  LogOut,
  RefreshCw,
  PlusCircle,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Eye,
  GraduationCap,
  Key,
  Check,
  UserPlus,
  UserCheck,
  Settings,
  BarChart3,
  Download,
  FileSpreadsheet,
  TrendingUp,
  MapPin,
  Phone,
  BookOpen,
  Calendar,
  Layers,
  Award,
  HelpCircle,
  Database,
  Image,
  Sliders,
  Trash2,
  Edit3,
  ExternalLink,
  Globe,
  Printer,
  Filter,
  CheckSquare,
  FileText,
  Power,
  Activity,
  ChevronRight,
  Building,
  Landmark,
  Megaphone,
  Upload,
  FolderDown,
  FileCheck,
  MessageCircle,
  Share2,
  Sparkles,
  CheckCircle2,
  List,
  LayoutGrid
} from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { isNoticeNew } from '../../utils/noticeUtils';
import DeviceImageUpload from './DeviceImageUpload';
import DeviceDocumentUpload from './DeviceDocumentUpload';
import RecaptchaWidget from './RecaptchaWidget';
import { DEPARTMENTS, ARTS_DEPARTMENTS, SCIENCE_DEPARTMENTS } from '../../data/departmentData';
import PersonCard from '../Common/PersonCard';

import { INITIAL_SLIDES } from '../../data/initialHeroSlides';

// Default authentic gallery items
const INITIAL_GALLERY = [
  {
    id: 1,
    title: 'ECO Club Trekking Expedition to Pulie Badze',
    album: 'NSS & Community',
    image: 'https://capitalcollege.edu.in/wp-content/uploads/2026/05/WhatsApp-Image-2026-05-05-at-4.12.03-PM.jpeg',
    caption: 'Biodiversity conservation trek to the historic Pulie Badze sanctuary.'
  },
  {
    id: 2,
    title: 'Red Ribbon Club Voluntary Blood Group Testing Camp',
    album: 'Health & Social',
    image: 'https://capitalcollege.edu.in/wp-content/uploads/2026/05/WhatsApp-Image-2026-05-05-at-4.19.40-PM.jpeg',
    caption: 'Student health initiative under NSS Nodal Officer supervision.'
  },
  {
    id: 3,
    title: 'Trifecta College Fest Grand Finale',
    album: 'Trifecta Fest',
    image: 'https://capitalcollege.edu.in/wp-content/uploads/2025/10/Trifecta-2025.jpg',
    caption: 'Celebration of youth empowerment, literary debates and cultural shows.'
  },
  {
    id: 4,
    title: 'NSS Special Camp at Mezo Basa',
    album: 'NSS & Community',
    image: 'https://capitalcollege.edu.in/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-26-at-8.42.53-AM.jpeg',
    caption: 'Three-day rural community development and sanitation outreach drive.'
  },
  {
    id: 5,
    title: 'Anti-Ragging Awareness Week & Pledge Campaign',
    album: 'Campus Life',
    image: 'https://capitalcollege.edu.in/wp-content/uploads/2025/08/Anti-Ragging-500x500.jpg',
    caption: 'Zero-tolerance pledge for campus integrity and student safety.'
  },
  {
    id: 6,
    title: '18th Freshers Day with Faculty Mentors',
    album: 'Cultural Events',
    image: 'https://capitalcollege.edu.in/wp-content/uploads/2025/08/teachers-with-freshers-copy-500x500.jpg',
    caption: 'Faculty fraternity welcoming the incoming undergraduate students.'
  },
  {
    id: 7,
    title: 'Teachers Orientation on Transformative Pedagogy',
    album: 'Campus Life',
    image: 'https://capitalcollege.edu.in/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-22-at-10.59.40-AM-scaled.jpeg',
    caption: 'IQAC faculty enrichment session on NEP 2020 and student mentorship.'
  },
  {
    id: 8,
    title: 'Inter-House Volleyball & Football Tournaments',
    album: 'Sports & Fitness',
    image: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/sports.jpeg',
    caption: 'Students competing in the annual collegiate athletic championship.'
  }
];

// RBAC Permissions Mapping
const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ['dashboard', 'ticker', 'documents', 'admissions', 'news', 'hero', 'gallery', 'faculty', 'governing', 'courses', 'inquiries', 'users', 'settings', 'database'],
  ADMIN: ['dashboard', 'ticker', 'documents', 'admissions', 'news', 'hero', 'gallery', 'faculty', 'governing', 'courses', 'inquiries', 'users', 'settings', 'database'],
  ADMISSIONS_ADMIN: ['dashboard', 'documents', 'admissions', 'inquiries', 'settings'],
  NEWS_ADMIN: ['dashboard', 'ticker', 'news', 'hero', 'gallery'],
  MEDIA_ADMIN: ['dashboard', 'ticker', 'gallery', 'hero'],
  ACADEMICS_ADMIN: ['dashboard', 'documents', 'courses', 'faculty', 'governing']
};

export default function AdminModal({ isOpen, onClose, onStatusChange }) {
  // Authentication State
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('cche_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [loginCreds, setLoginCreds] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  // Register Custom Admin State
  const [registerData, setRegisterData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ADMIN'
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  // Reset Password on Login Screen
  const [showResetOnLogin, setShowResetOnLogin] = useState(false);
  const [resetData, setResetData] = useState({ username: '', newPassword: '', confirmPassword: '' });
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  // Active module in the admin dashboard (11 modules)
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return sessionStorage.getItem('cche_admin_tab') || 'dashboard';
    } catch {
      return 'dashboard';
    }
  });

  useEffect(() => {
    if (activeTab) {
      try {
        sessionStorage.setItem('cche_admin_tab', activeTab);
      } catch {}
    }
  }, [activeTab]);

  useEffect(() => {
    if (isOpen) {
      try {
        sessionStorage.setItem('cche_admin_open', 'true');
      } catch {}
      if (!window.location.pathname.toLowerCase().endsWith('/adminspace')) {
        window.history.replaceState(null, '', '/adminspace');
      }
    } else {
      try {
        sessionStorage.removeItem('cche_admin_open');
      } catch {}
    }
  }, [isOpen]);

  // Core Data States
  const [applications, setApplications] = useState([]);
  const [notices, setNotices] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [governingBody, setGoverningBody] = useState([]);
  const [courses, setCourses] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Top Alert Bar & Ticker State
  const [announcements, setAnnouncements] = useState([]);
  const [bannerSettings, setBannerSettings] = useState({
    top_banner_enabled: true,
    top_banner_speed: 5500,
    top_banner_show_notice_board: true
  });
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [announcementFormData, setAnnouncementFormData] = useState({
    tag: 'EXAM ROUTINE',
    text: '',
    action_label: 'VIEW ROUTINES →',
    action_type: 'page',
    action_page: 'exam-routine',
    action_href: '',
    secondary_label: 'NOTICE BOARD',
    secondary_href: '/notices',
    is_active: true,
    display_order: 1
  });
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);
  const [savingBannerSettings, setSavingBannerSettings] = useState(false);

  // Forms & PDF Documents Hub State
  const [documents, setDocuments] = useState([]);
  const [docCategoryFilter, setDocCategoryFilter] = useState('ALL');
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [documentFormData, setDocumentFormData] = useState({
    doc_key: '',
    title: '',
    category: 'Admission',
    file_name: '',
    file_data: '',
    description: ''
  });
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [quickDocSuccess, setQuickDocSuccess] = useState('');

  // Social Channels & Communication Links State
  const [socialLinks, setSocialLinks] = useState([]);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [editingSocialLink, setEditingSocialLink] = useState(null);
  const [socialFormData, setSocialFormData] = useState({
    platform: 'whatsapp',
    label: 'WhatsApp Helpline',
    url: 'https://wa.me/919436002789',
    is_active: true,
    display_order: 1
  });
  const [whatsAppQuickPhone, setWhatsAppQuickPhone] = useState('9436002789');
  const [savingSocialLink, setSavingSocialLink] = useState(false);

  // Governing Body Leadership Sub-Tab Filter
  const [governingSubTab, setGoverningSubTab] = useState('ALL'); // 'ALL' | 'MANAGEMENT' | 'ADMINISTRATION' | 'COUNCIL'

  // Online Admissions Monitoring & Control Center State
  const [admissionControl, setAdmissionControl] = useState({
    open: false,
    notice: 'Online admissions for FYUGP 4-Year B.A. & B.Sc. programmes are closed for now. Please download the official print form (PDF) or visit the college office at P.R. Hill, Kohima.',
    academic_year: '2024-25',
    stats: { total: 0, arts: 0, science: 0, pending: 0, under_review: 0, approved: 0, rejected: 0 }
  });
  const [showNoticeEditModal, setShowNoticeEditModal] = useState(false);
  const [editNoticeText, setEditNoticeText] = useState('');
  const [savingAdmissionStatus, setSavingAdmissionStatus] = useState(false);

  // Hero Slides & Gallery state (stored in local state with persistent defaults)
  const [heroSlides, setHeroSlides] = useState(() => {
    try {
      const saved = localStorage.getItem('cche_admin_slides');
      return saved ? JSON.parse(saved) : INITIAL_SLIDES;
    } catch {
      return INITIAL_SLIDES;
    }
  });

  const [galleryItems, setGalleryItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cche_admin_gallery');
      return saved ? JSON.parse(saved) : INITIAL_GALLERY;
    } catch {
      return INITIAL_GALLERY;
    }
  });

  // Institutional Site Settings state
  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('cche_site_settings');
      return saved ? JSON.parse(saved) : {
        collegeName: 'Capital College of Higher Education',
        affiliation: 'Affiliated to Nagaland University | Recognised under UGC 2(f) & 12(B)',
        phone1: '',
        phone2: '',
        email1: '',
        email2: '',
        address: 'P.R. Hill, Kohima, Nagaland 797001',
        officeHours: 'College Timing: 9:00 am to 4:00 pm',
        admissionDeadline: '',
        facebookUrl: 'https://www.facebook.com/capitalcollege.kohima',
        instagramUrl: 'https://www.instagram.com/capital_college_of_higher_educ/',
        youtubeUrl: '',
        showTelephonicAssistance: false,
        landlinePhone: '+91 370 2244101',
        admissionsPhone: '+91 94360 00000',
        generalEmail: 'cchekma@gmail.com',
        smtp_host: '',
        smtp_port: '587',
        smtp_user: 'npenwang@excellogics.co.in',
        smtp_pass: '',
        smtp_secure: 'false',
        notification_email: 'support@excellogics.co.in'
      };
    } catch {
      return {};
    }
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState(null);

  // Filters & Search
  const [filterStream, setFilterStream] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  // Category Filter for Notices
  const [noticeCategoryFilter, setNoticeCategoryFilter] = useState('ALL');
  const [noticeViewMode, setNoticeViewMode] = useState('list'); // 'list' | 'grid'
  // Album Filter for Gallery
  const [galleryAlbumFilter, setGalleryAlbumFilter] = useState('ALL');
  // Stream & Dept Filter for Faculty
  const [facultyStreamFilter, setFacultyStreamFilter] = useState('ALL');
  const [facultyDeptFilter, setFacultyDeptFilter] = useState('ALL');
  const [facultySearch, setFacultySearch] = useState('');
  const [facultyActiveStream, setFacultyActiveStream] = useState('ARTS'); // 'ARTS' | 'SCIENCE' | 'ALL'
  const [facultyActiveDept, setFacultyActiveDept] = useState('English');
  // Stream Filter for Courses
  const [courseStreamFilter, setCourseStreamFilter] = useState('ALL');
  // Inquiries Filter
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('ALL');

  // Modals
  const [viewDetailsApp, setViewDetailsApp] = useState(null);
  const [dossierNotifications, setDossierNotifications] = useState([]);
  const [reviewApp, setReviewApp] = useState(null);
  const [decisionStatus, setDecisionStatus] = useState('APPROVED');
  const [decisionRemarks, setDecisionRemarks] = useState('');
  const [submittingDecision, setSubmittingDecision] = useState(false);
  const [decisionSuccessMsg, setDecisionSuccessMsg] = useState('');

  // Manual Applicant Modal
  const [showManualAppModal, setShowManualAppModal] = useState(false);
  const [manualApp, setManualApp] = useState({
    full_name: '',
    email: '',
    phone: '',
    dob: '2005-01-01',
    gender: 'Male',
    category: 'ST',
    stream: 'ARTS',
    course_type: 'HONOURS',
    major_subject: 'Political Science',
    minor_subjects: '',
    marks_12th: '75',
    board_name: 'NBSE',
    previous_school: '',
    guardian_name: '',
    guardian_phone: '',
    address: 'Kohima, Nagaland'
  });

  // Notice Form Modal
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [noticeTypeFilter, setNoticeTypeFilter] = useState('ALL'); // 'ALL' | 'notice' | 'event'
  const [noticeFormData, setNoticeFormData] = useState({
    title: '',
    item_type: 'notice',
    category: 'Official Notice',
    summary: '',
    content: '',
    event_date: '',
    image_url: '',
    link_url: '',
    pdf_url: '',
    pdf_name: '',
    is_featured: false
  });

  // Faculty Form Modal
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [facultyFormData, setFacultyFormData] = useState({
    name: '',
    stream: 'ARTS',
    department: 'English',
    qualification: '',
    designation: 'Assistant Professor',
    is_hod: false,
    image_url: ''
  });

  // Governing Body Form Modal
  const [showGoverningModal, setShowGoverningModal] = useState(false);
  const [editingGoverningMember, setEditingGoverningMember] = useState(null);
  const [governingTypeFilter, setGoverningTypeFilter] = useState('ALL');
  const [governingSearch, setGoverningSearch] = useState('');
  const [governingFormData, setGoverningFormData] = useState({
    name: '',
    role: 'Member',
    category: 'Council Member',
    affiliation: '',
    member_type: 'MEMBER',
    order_index: 0,
    image_url: ''
  });

  // Course Form Modal
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseFormData, setCourseFormData] = useState({
    course_name: '',
    stream: 'ARTS',
    degree_type: 'Four Years Under Graduate Programme (FYUGP)',
    description: '',
    eligibility: '10+2 / HSSLC passed from recognized board',
    duration: '4 Years (8 Semesters)'
  });

  // Hero Slide Modal
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [slideFormData, setSlideFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    order: 1,
    active: true
  });

  // Gallery Modal
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryFormData, setGalleryFormData] = useState({
    title: '',
    album: 'Campus Life',
    image: '',
    caption: ''
  });
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState(null);

  // Inquiry View Modal
  const [viewInquiry, setViewInquiry] = useState(null);

  // Add User Modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    role: 'ADMIN'
  });

  // Profile / Password Modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    newUsername: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Diagnostic Ping State
  const [pingLatency, setPingLatency] = useState(null);
  const [pingRunning, setPingRunning] = useState(false);

  // Fetch all administrative data
  const fetchData = async () => {
    if (!adminUser) return;
    setLoading(true);
    try {
      const [appRes, notRes, inqRes, statRes, facRes, govRes, couRes, userRes, admStatusRes, annRes, socRes, docRes] = await Promise.all([
        apiFetch(`/api/admissions?stream=${filterStream}&status=${filterStatus}&search=${search}`).then((r) => r.json()).catch(() => ({ success: false })),
        apiFetch('/api/notices').then((r) => r.json()).catch(() => ({ success: false })),
        apiFetch('/api/contact').then((r) => r.json()).catch(() => ({ success: false })),
        apiFetch('/api/stats').then((r) => r.json()).catch(() => ({ success: false })),
        apiFetch('/api/faculty').then((r) => r.json()).catch(() => ({ success: false })),
        apiFetch('/api/governing-body').then((r) => r.json()).catch(() => ({ success: false })),
        apiFetch('/api/courses').then((r) => r.json()).catch(() => ({ success: false })),
        apiFetch('/api/admin/users').then((r) => r.json()).catch(() => ({ success: false })),
        apiFetch('/api/admissions/status').then((r) => r.json()).catch(() => ({ success: false })),
        apiFetch('/api/announcements').then((r) => r.json()).catch(() => ({ success: false })),
        apiFetch('/api/social-links').then((r) => r.json()).catch(() => ({ success: false })),
        apiFetch('/api/documents').then((r) => r.json()).catch(() => ({ success: false }))
      ]);

      if (appRes?.success) setApplications(appRes.applications || []);
      if (notRes?.success) setNotices(notRes.notices || []);
      if (inqRes?.success) setInquiries(inqRes.inquiries || []);
      if (statRes?.success) setStats(statRes);
      if (facRes?.success) setFaculty(facRes.faculty || []);
      if (govRes?.success) setGoverningBody(govRes.members || []);
      if (couRes?.success) setCourses(couRes.courses || []);
      if (userRes?.success) setAdminUsers(userRes.users || []);
      if (admStatusRes?.success) {
        setAdmissionControl({
          open: Boolean(admStatusRes.admissions_open),
          notice: admStatusRes.notice || '',
          academic_year: admStatusRes.academic_year || '2024-25',
          stats: admStatusRes.stats || { total: 0, arts: 0, science: 0, pending: 0, under_review: 0, approved: 0, rejected: 0 }
        });
        setEditNoticeText(admStatusRes.notice || '');
      }
      if (annRes?.success) {
        setAnnouncements(annRes.announcements || []);
        if (annRes.settings) setBannerSettings(annRes.settings);
      }
      if (socRes?.success) setSocialLinks(socRes.links || []);
      if (docRes?.success) setDocuments(docRes.documents || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmissions = async () => {
    setSavingAdmissionStatus(true);
    const nextState = !admissionControl.open;
    const defaultNotice = nextState
      ? 'Online admissions for FYUGP 4-Year B.A. & B.Sc. degree programmes are currently OPEN. Prospective candidates may complete and submit their admission dossier online.'
      : 'Online admissions for FYUGP 4-Year B.A. & B.Sc. programmes are closed for now. Please download the official print form (PDF) or visit the college office at P.R. Hill, Kohima.';

    try {
      const res = await apiFetch('/api/admissions/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admissions_open: nextState,
          notice: defaultNotice,
          academic_year: admissionControl.academic_year
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdmissionControl(prev => ({ ...prev, open: nextState, notice: defaultNotice }));
        setEditNoticeText(defaultNotice);
        if (onStatusChange) onStatusChange(nextState);
        window.dispatchEvent(new CustomEvent('admissions-status-changed', {
          detail: { open: nextState, notice: defaultNotice }
        }));
        alert(`Online admissions are now ${nextState ? 'OPEN' : 'CLOSED FOR NOW'}.`);
      } else {
        throw new Error(data.message || 'Server rejected status update');
      }
    } catch (err) {
      alert('Failed to update admission status: ' + err.message);
    } finally {
      setSavingAdmissionStatus(false);
    }
  };

  const handleSaveNotice = async () => {
    setSavingAdmissionStatus(true);
    try {
      const res = await apiFetch('/api/admissions/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admissions_open: admissionControl.open,
          notice: editNoticeText,
          academic_year: admissionControl.academic_year
        })
      });
      const data = await res.json();
      if (data.success) {
        setAdmissionControl(prev => ({ ...prev, notice: editNoticeText }));
        setShowNoticeEditModal(false);
        window.dispatchEvent(new CustomEvent('admissions-status-changed', {
          detail: { open: admissionControl.open, notice: editNoticeText }
        }));
        alert('Admission notice updated successfully.');
      }
    } catch (err) {
      alert('Failed to save notice: ' + err.message);
    } finally {
      setSavingAdmissionStatus(false);
    }
  };

  useEffect(() => {
    if (isOpen && adminUser) {
      fetchData();
      setProfileData({
        full_name: adminUser.full_name || '',
        newUsername: adminUser.username || '',
        email: adminUser.email || '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [isOpen, adminUser, filterStream, filterStatus]);

  // When viewing dossier, fetch student notification history
  useEffect(() => {
    if (viewDetailsApp) {
      apiFetch(`/api/admissions/track?application_no=${encodeURIComponent(viewDetailsApp.application_no)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.notifications) {
            setDossierNotifications(data.notifications);
          } else {
            setDossierNotifications([]);
          }
        })
        .catch(() => setDossierNotifications([]));
    } else {
      setDossierNotifications([]);
    }
  }, [viewDetailsApp]);

  // Determine allowed modules for the current role
  const userRole = adminUser?.role || 'SUPER_ADMIN';
  const allowedModules = useMemo(() => {
    return ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.SUPER_ADMIN;
  }, [userRole]);

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!captchaVerified) {
      setCaptchaError(true);
      setLoginError('Please complete the security reCAPTCHA verification to proceed.');
      return;
    }

    setLoginLoading(true);

    try {
      const res = await apiFetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...loginCreds,
          captchaToken
        })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid administrative credentials.');
      }

      sessionStorage.setItem('cche_admin_token', data.token);
      sessionStorage.setItem('cche_admin_user', JSON.stringify(data.admin));
      sessionStorage.setItem('cche_admin_open', 'true');
      setAdminUser(data.admin);
      setLoginCreds({ username: '', password: '' });
      setCaptchaVerified(false);
      setCaptchaToken('');
      setCaptchaError(false);
    } catch (err) {
      setLoginError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Register Admin Account
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    if (registerData.username.trim().length < 3) {
      setRegisterError('Username must be at least 3 characters long.');
      return;
    }
    if (registerData.password.length < 4) {
      setRegisterError('Password must be at least 4 characters long.');
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Passwords do not match.');
      return;
    }

    setRegisterLoading(true);
    try {
      const res = await apiFetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerData.username.trim(),
          password: registerData.password.trim(),
          full_name: registerData.full_name.trim() || registerData.username.trim(),
          email: registerData.email.trim() || `${registerData.username.trim()}@capitalcollege.edu.in`,
          role: registerData.role
        })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create admin account.');
      }

      setRegisterSuccess('Admin account created successfully! Signing in...');
      sessionStorage.setItem('cche_admin_token', data.token);
      sessionStorage.setItem('cche_admin_user', JSON.stringify(data.admin));
      sessionStorage.setItem('cche_admin_open', 'true');

      setTimeout(() => {
        setAdminUser(data.admin);
        setRegisterSuccess('');
      }, 1000);
    } catch (err) {
      setRegisterError(err.message || 'Failed to create admin account.');
    } finally {
      setRegisterLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem('cche_admin_token');
    sessionStorage.removeItem('cche_admin_user');
    sessionStorage.removeItem('cche_admin_open');
    sessionStorage.removeItem('cche_admin_tab');
    localStorage.removeItem('cche_admin_token');
    localStorage.removeItem('cche_admin_user');
    setAdminUser(null);
    setApplications([]);
    setLoginCreds({ username: '', password: '' });
    setAuthMode('login');
    setShowResetOnLogin(false);
    setLoginError('');
  };

  // Handle Reset Password on Login Screen
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (resetData.newPassword !== resetData.confirmPassword) {
      setResetError('New passwords do not match.');
      return;
    }
    if (resetData.newPassword.length < 4) {
      setResetError('Password must be at least 4 characters long.');
      return;
    }

    setResetLoading(true);
    try {
      const res = await apiFetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: resetData.username,
          newPassword: resetData.newPassword
        })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update password');
      }

      setResetSuccess('Password updated successfully! You can now log in with your new password.');
      setLoginCreds({ username: resetData.username, password: resetData.newPassword });
      setTimeout(() => {
        setShowResetOnLogin(false);
        setResetSuccess('');
      }, 2000);
    } catch (err) {
      setResetError(err.message || 'Error updating password.');
    } finally {
      setResetLoading(false);
    }
  };

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      setProfileError('New passwords do not match.');
      return;
    }

    setProfileLoading(true);
    try {
      const res = await apiFetch('/api/admin/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUsername: adminUser.username,
          newUsername: profileData.newUsername.trim(),
          newPassword: profileData.newPassword.trim() || undefined,
          full_name: profileData.full_name.trim(),
          email: profileData.email.trim()
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setProfileSuccess('Profile & Credentials updated successfully!');
      sessionStorage.setItem('cche_admin_user', JSON.stringify(data.admin));
      setAdminUser(data.admin);

      setTimeout(() => {
        setShowProfileModal(false);
        setProfileSuccess('');
      }, 1500);
    } catch (err) {
      setProfileError(err.message || 'Error updating credentials.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Open Decision Dialog for Applicant
  const openDecisionModal = (app, status) => {
    setReviewApp(app);
    setDecisionStatus(status);
    if (status === 'APPROVED') {
      setDecisionRemarks(
        `Congratulations ${app.full_name}! You have been granted provisional admission to ${app.course_type} in ${app.major_subject} (${app.stream}). Please report to the administrative office with original NBSE marksheets and admission fee by July 25, 2026.`
      );
    } else if (status === 'UNDER_REVIEW') {
      setDecisionRemarks(
        `Dear ${app.full_name}, your application credentials and marksheet are currently under active evaluation by the Admissions Committee.`
      );
    } else {
      setDecisionRemarks(
        `Dear ${app.full_name}, your application could not be selected due to seat quota limitations in ${app.major_subject}. You are invited to contact the academic counseling desk regarding alternative programs.`
      );
    }
    setDecisionSuccessMsg('');
  };

  // Submit Admission Decision
  const submitDecision = async (e) => {
    e.preventDefault();
    if (!reviewApp) return;
    setSubmittingDecision(true);

    try {
      const res = await apiFetch(`/api/admissions/${reviewApp.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: decisionStatus,
          remarks: decisionRemarks
        })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update application status.');
      }

      setApplications((prev) =>
        prev.map((a) => (a.id === reviewApp.id ? { ...a, status: decisionStatus, remarks: decisionRemarks } : a))
      );
      if (viewDetailsApp && viewDetailsApp.id === reviewApp.id) {
        setViewDetailsApp((prev) => ({ ...prev, status: decisionStatus, remarks: decisionRemarks }));
      }

      setDecisionSuccessMsg(`Status updated to ${decisionStatus} and notification sent to ${reviewApp.full_name}!`);
      fetchData();
      setTimeout(() => {
        setReviewApp(null);
        setDecisionSuccessMsg('');
      }, 1500);
    } catch (err) {
      alert('Error updating application: ' + err.message);
    } finally {
      setSubmittingDecision(false);
    }
  };

  // Delete Application
  const handleDeleteApplication = async (id, appNo) => {
    if (!window.confirm(`Are you sure you want to permanently delete application ${appNo}?`)) return;
    try {
      const res = await apiFetch(`/api/admissions/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) => prev.filter((a) => a.id !== id));
        fetchData();
      } else {
        alert(data.message || 'Failed to delete application.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Manual Application Submission
  const handleManualAppSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualApp)
      });
      const data = await res.json();
      if (data.success) {
        alert(`Application registered successfully! Reference No: ${data.application.application_no}`);
        setShowManualAppModal(false);
        fetchData();
      } else {
        alert(data.message || 'Failed to register application.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Export Applications to CSV
  const exportToCSV = () => {
    if (!applications || applications.length === 0) {
      alert('No applications to export.');
      return;
    }

    const headers = [
      'Application Reference No',
      'Student Full Name',
      'Gender',
      'Social Category',
      'Date of Birth',
      'Academic Stream',
      'Course Type',
      'Major Subject',
      'Minor Subjects',
      'Class 12th Marks (%)',
      'Class 10th Marks (%)',
      'Board of Examination',
      'Previous Institution',
      'Student Phone',
      'Student Email',
      'Guardian Full Name',
      'Guardian Contact Phone',
      'Residential Address',
      'Application Status',
      'Reviewer Remarks / Instructions',
      'Application Submission Timestamp'
    ];

    const rows = applications.map((a) => [
      `"${a.application_no || ''}"`,
      `"${(a.full_name || '').replace(/"/g, '""')}"`,
      `"${a.gender || ''}"`,
      `"${a.category || ''}"`,
      `"${a.dob || ''}"`,
      `"${a.stream || ''}"`,
      `"${a.course_type || ''}"`,
      `"${(a.major_subject || '').replace(/"/g, '""')}"`,
      `"${(a.minor_subjects || '').replace(/"/g, '""')}"`,
      `"${a.marks_12th || ''}"`,
      `"${a.marks_10th || ''}"`,
      `"${(a.board_name || '').replace(/"/g, '""')}"`,
      `"${(a.previous_school || '').replace(/"/g, '""')}"`,
      `"${a.phone || ''}"`,
      `"${a.email || ''}"`,
      `"${(a.guardian_name || '').replace(/"/g, '""')}"`,
      `"${a.guardian_phone || ''}"`,
      `"${(a.address || '').replace(/"/g, '""')}"`,
      `"${a.status || ''}"`,
      `"${(a.remarks || '').replace(/"/g, '""')}"`,
      `"${a.created_at || ''}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CCHE_Admissions_Full_Data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Full Database JSON Backup Export
  const handleExportBackup = async () => {
    try {
      const res = await apiFetch('/api/admin/backup');
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Backup failed');

      const jsonStr = JSON.stringify(data.backup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CapitalCollege_DB_Full_Backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Database export error: ' + err.message);
    }
  };

  // Diagnostic Ping Test
  const handleRunPingTest = async () => {
    setPingRunning(true);
    const start = performance.now();
    try {
      const res = await apiFetch('/api/stats');
      await res.json();
      const end = performance.now();
      setPingLatency((end - start).toFixed(1));
    } catch (err) {
      setPingLatency('Error');
    } finally {
      setPingRunning(false);
    }
  };

  // Notice CRUD
  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    try {
      // Notice Board items must never pollute the Homepage Events Showcase
      const payload = {
        ...noticeFormData,
        is_featured: noticeFormData.item_type === 'event' ? Boolean(noticeFormData.is_featured) : false
      };
      const url = editingNotice ? `/api/notices/${editingNotice.id}` : '/api/notices';
      const method = editingNotice ? 'PUT' : 'POST';
      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowNoticeModal(false);
        setEditingNotice(null);
        fetchData();
        window.dispatchEvent(new Event('cche_notices_updated'));
      } else {
        alert(data.message || 'Failed to save notice.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      const res = await apiFetch(`/api/notices/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchData();
        window.dispatchEvent(new Event('cche_notices_updated'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleToggleNoticeFeatured = async (notice) => {
    try {
      const res = await apiFetch(`/api/notices/${notice.id}/toggle-featured`, {
        method: 'PATCH'
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        window.dispatchEvent(new Event('cche_notices_updated'));
      } else {
        alert(data.message || 'Could not toggle featured status.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Faculty CRUD
  const handleFacultySubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingFaculty ? `/api/faculty/${editingFaculty.id}` : '/api/faculty';
      const method = editingFaculty ? 'PUT' : 'POST';
      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facultyFormData)
      });
      const data = await res.json();
      if (data.success) {
        setShowFacultyModal(false);
        setEditingFaculty(null);
        fetchData();
        window.dispatchEvent(new CustomEvent('faculty-updated'));
      } else {
        alert(data.message || 'Failed to save faculty profile.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteFaculty = async (id) => {
    if (!window.confirm('Remove this faculty member from the directory?')) return;
    try {
      const res = await apiFetch(`/api/faculty/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchData();
        window.dispatchEvent(new CustomEvent('faculty-updated'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleSetHOD = async (facultyId, shouldBeHOD) => {
    try {
      const res = await apiFetch(`/api/faculty/${facultyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_hod: shouldBeHOD ? 1 : 0 })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        window.dispatchEvent(new CustomEvent('faculty-updated'));
      } else {
        alert(data.message || 'Failed to update HOD role.');
      }
    } catch (err) {
      alert('Error updating HOD: ' + err.message);
    }
  };

  // Governing Body CRUD
  const handleGoverningSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingGoverningMember ? `/api/governing-body/${editingGoverningMember.id}` : '/api/governing-body';
      const method = editingGoverningMember ? 'PUT' : 'POST';
      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(governingFormData)
      });
      const data = await res.json();
      if (data.success) {
        setShowGoverningModal(false);
        setEditingGoverningMember(null);
        fetchData();
        window.dispatchEvent(new CustomEvent('governing-body-updated'));
      } else {
        alert(data.message || 'Failed to save governing body member profile.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteGoverning = async (id) => {
    if (!window.confirm('Remove this member from the Governing Body?')) return;
    try {
      const res = await apiFetch(`/api/governing-body/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchData();
        window.dispatchEvent(new CustomEvent('governing-body-updated'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Top Alert Bar & Ticker Handlers
  const handleToggleAnnouncement = async (id) => {
    try {
      const res = await apiFetch(`/api/announcements/${id}/toggle`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, is_active: data.is_active } : a)));
        window.dispatchEvent(new CustomEvent('cche_announcements_updated'));
      }
    } catch (err) {
      alert('Failed to toggle announcement: ' + err.message);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this ticker announcement?')) return;
    try {
      const res = await apiFetch(`/api/announcements/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
        window.dispatchEvent(new CustomEvent('cche_announcements_updated'));
      }
    } catch (err) {
      alert('Failed to delete announcement: ' + err.message);
    }
  };

  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();
    setSavingAnnouncement(true);
    try {
      const url = editingAnnouncement ? `/api/announcements/${editingAnnouncement.id}` : '/api/announcements';
      const method = editingAnnouncement ? 'PUT' : 'POST';
      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementFormData)
      });
      const data = await res.json();
      if (data.success) {
        setShowAnnouncementModal(false);
        setEditingAnnouncement(null);
        fetchData();
        window.dispatchEvent(new CustomEvent('cche_announcements_updated'));
      } else {
        alert(data.message || 'Failed to save announcement');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSavingAnnouncement(false);
    }
  };

  const handleSaveBannerSettings = async (updatedSettings) => {
    setSavingBannerSettings(true);
    try {
      const res = await apiFetch('/api/announcements/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      const data = await res.json();
      if (data.success) {
        setBannerSettings(data.settings);
        window.dispatchEvent(new CustomEvent('cche_announcements_updated'));
      }
    } catch (err) {
      alert('Failed to save banner settings: ' + err.message);
    } finally {
      setSavingBannerSettings(false);
    }
  };

  const handleImportNoticeToTicker = (notice) => {
    setEditingAnnouncement(null);
    setAnnouncementFormData({
      tag: notice.category ? notice.category.toUpperCase().slice(0, 16) : 'NOTICE',
      text: notice.title || '',
      action_label: 'VIEW NOTICE →',
      action_type: 'page',
      action_page: 'notices',
      action_href: '',
      secondary_label: 'NOTICE BOARD',
      secondary_href: '/notices',
      is_active: true,
      display_order: announcements.length + 1
    });
    setShowAnnouncementModal(true);
  };

  // Social Links Handlers
  const handleToggleSocialLink = async (id) => {
    try {
      const res = await apiFetch(`/api/social-links/${id}/toggle`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        setSocialLinks((prev) => prev.map((s) => (s.id === id ? { ...s, is_active: data.is_active } : s)));
        window.dispatchEvent(new CustomEvent('cche_social_updated'));
      }
    } catch (err) {
      alert('Failed to toggle social channel: ' + err.message);
    }
  };

  const handleDeleteSocialLink = async (id) => {
    if (!window.confirm('Delete this social channel link?')) return;
    try {
      const res = await apiFetch(`/api/social-links/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSocialLinks((prev) => prev.filter((s) => s.id !== id));
        window.dispatchEvent(new CustomEvent('cche_social_updated'));
      }
    } catch (err) {
      alert('Failed to delete social channel: ' + err.message);
    }
  };

  const handleSaveSocialLink = async (e) => {
    e.preventDefault();
    setSavingSocialLink(true);
    try {
      const url = editingSocialLink ? `/api/social-links/${editingSocialLink.id}` : '/api/social-links';
      const method = editingSocialLink ? 'PUT' : 'POST';
      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialFormData)
      });
      const data = await res.json();
      if (data.success) {
        setShowSocialModal(false);
        setEditingSocialLink(null);
        fetchData();
        window.dispatchEvent(new CustomEvent('cche_social_updated'));
      } else {
        alert(data.message || 'Failed to save social link');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSavingSocialLink(false);
    }
  };

  const handleQuickAddWhatsApp = async () => {
    const cleanNumber = whatsAppQuickPhone.replace(/[^0-9]/g, '');
    if (!cleanNumber) {
      alert('Please enter a valid WhatsApp phone number.');
      return;
    }
    const finalNumber = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;
    const waUrl = `https://wa.me/${finalNumber}`;
    try {
      const existing = socialLinks.find((s) => s.platform.toLowerCase() === 'whatsapp');
      if (existing) {
        await apiFetch(`/api/social-links/${existing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: waUrl, is_active: 1 })
        });
      } else {
        await apiFetch('/api/social-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform: 'whatsapp',
            label: 'WhatsApp Official Helpline',
            url: waUrl,
            is_active: 1,
            display_order: 1
          })
        });
      }
      fetchData();
      window.dispatchEvent(new CustomEvent('cche_social_updated'));
      alert(`Official WhatsApp channel configured: ${waUrl}`);
    } catch (err) {
      alert('Error saving WhatsApp link: ' + err.message);
    }
  };

  // Documents Hub Handlers
  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!documentFormData.file_data) {
      alert('Please select or upload a PDF file.');
      return;
    }
    setUploadingDoc(true);
    try {
      const res = await apiFetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentFormData)
      });
      const data = await res.json();
      if (data.success) {
        setShowDocumentModal(false);
        setEditingDocument(null);
        setDocumentFormData({ doc_key: '', title: '', category: 'Admission', file_name: '', file_data: '', description: '' });
        fetchData();
        window.dispatchEvent(new CustomEvent('cche_documents_updated'));
        setQuickDocSuccess('Document uploaded and synchronized successfully!');
        setTimeout(() => setQuickDocSuccess(''), 3500);
      } else {
        alert(data.message || 'Failed to upload document');
      }
    } catch (err) {
      alert('Error uploading document: ' + err.message);
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleQuickReplaceAdmissionForm = async (fileBase64, fileName) => {
    if (!fileBase64) return;
    try {
      const res = await apiFetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc_key: 'admission_form',
          title: 'Official Print Admission Form (FYUGP Degree)',
          category: 'Admission',
          file_name: 'admission_form.pdf',
          file_data: fileBase64
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        window.dispatchEvent(new CustomEvent('cche_documents_updated'));
        setQuickDocSuccess('admission_form.pdf updated and synchronized for all downloads!');
        setTimeout(() => setQuickDocSuccess(''), 4000);
      } else {
        alert(data.message || 'Failed to update admission form.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm('Delete this official document from the archive?')) return;
    try {
      const res = await apiFetch(`/api/documents/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
        window.dispatchEvent(new CustomEvent('cche_documents_updated'));
      }
    } catch (err) {
      alert('Failed to delete document: ' + err.message);
    }
  };

  // Course CRUD
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCourse ? `/api/courses/${editingCourse.id}` : '/api/courses';
      const method = editingCourse ? 'PUT' : 'POST';
      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseFormData)
      });
      const data = await res.json();
      if (data.success) {
        setShowCourseModal(false);
        setEditingCourse(null);
        fetchData();
      } else {
        alert(data.message || 'Failed to save course.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this academic course?')) return;
    try {
      const res = await apiFetch(`/api/courses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Hero Slide Management
  const handleSaveSlide = (e) => {
    e.preventDefault();
    let updated;
    if (editingSlide) {
      updated = heroSlides.map((s) => (s.id === editingSlide.id ? { ...slideFormData, id: editingSlide.id } : s));
    } else {
      updated = [...heroSlides, { ...slideFormData, id: Date.now() }];
    }
    setHeroSlides(updated);
    localStorage.setItem('cche_admin_slides', JSON.stringify(updated));
    window.dispatchEvent(new Event('cche_slides_updated'));
    setShowHeroModal(false);
    setEditingSlide(null);
  };

  const handleDeleteSlide = (id) => {
    if (!window.confirm('Delete this hero slider slide?')) return;
    const updated = heroSlides.filter((s) => s.id !== id);
    setHeroSlides(updated);
    localStorage.setItem('cche_admin_slides', JSON.stringify(updated));
    window.dispatchEvent(new Event('cche_slides_updated'));
  };

  const handleToggleSlideActive = (id) => {
    const updated = heroSlides.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    setHeroSlides(updated);
    localStorage.setItem('cche_admin_slides', JSON.stringify(updated));
    window.dispatchEvent(new Event('cche_slides_updated'));
  };

  // Gallery Photo Management
  const handleSaveGalleryPhoto = (e) => {
    e.preventDefault();
    const updated = [
      {
        id: Date.now(),
        title: galleryFormData.title,
        album: galleryFormData.album,
        image: galleryFormData.image,
        caption: galleryFormData.caption
      },
      ...galleryItems
    ];
    setGalleryItems(updated);
    localStorage.setItem('cche_admin_gallery', JSON.stringify(updated));
    setShowGalleryModal(false);
    setGalleryFormData({ title: '', album: 'Campus Life', image: '', caption: '' });
  };

  const handleDeleteGalleryPhoto = (id) => {
    if (!window.confirm('Remove this photo from the media gallery?')) return;
    const updated = galleryItems.filter((g) => g.id !== id);
    setGalleryItems(updated);
    localStorage.setItem('cche_admin_gallery', JSON.stringify(updated));
  };

  // Inquiries Management
  const handleUpdateInquiryStatus = async (id, status) => {
    try {
      const res = await apiFetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
        if (viewInquiry && viewInquiry.id === id) {
          setViewInquiry((prev) => ({ ...prev, status }));
        }
      }
    } catch (err) {
      alert('Error updating inquiry status');
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      const res = await apiFetch(`/api/contact/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        if (viewInquiry?.id === id) setViewInquiry(null);
      }
    } catch (err) {
      alert('Error deleting inquiry');
    }
  };

  // Admin User Management
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData)
      });
      const data = await res.json();
      if (data.success) {
        alert(`Admin user ${newUserData.username} created successfully!`);
        setShowAddUserModal(false);
        setNewUserData({ full_name: '', username: '', email: '', password: '', role: 'ADMIN' });
        fetchData();
      } else {
        alert(data.message || 'Failed to create user');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleUpdateUserRole = async (userId, role) => {
    try {
      const res = await apiFetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (data.success) {
        setAdminUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
        alert('User role updated to ' + role);
      }
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (username === 'admin') {
      alert('Cannot delete the root administrator account.');
      return;
    }
    if (!window.confirm(`Delete administrator account "${username}"?`)) return;
    try {
      const res = await apiFetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAdminUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  // Save Site Settings
  const handleSaveSettings = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    localStorage.setItem('cche_site_settings', JSON.stringify(siteSettings));

    try {
      await apiFetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_show_assistance: siteSettings.showTelephonicAssistance ? 'true' : 'false',
          contact_landline: siteSettings.landlinePhone || '',
          contact_admissions_desk: siteSettings.admissionsPhone || '',
          contact_general_email: siteSettings.generalEmail || '',
          smtp_host: siteSettings.smtp_host || '',
          smtp_port: siteSettings.smtp_port || '587',
          smtp_user: siteSettings.smtp_user || '',
          smtp_pass: siteSettings.smtp_pass || '',
          smtp_secure: siteSettings.smtp_secure || 'false',
          notification_email: siteSettings.notification_email || 'support@excellogics.co.in'
        })
      });
    } catch (err) {
      console.warn('Failed to save settings to backend:', err);
    }

    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Test Outgoing SMTP Mail Dispatch
  const handleTestEmail = async () => {
    setTestingEmail(true);
    setTestEmailResult(null);
    try {
      const res = await apiFetch('/api/contact/test-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: siteSettings.smtp_host,
          port: siteSettings.smtp_port,
          user: siteSettings.smtp_user,
          pass: siteSettings.smtp_pass,
          secure: siteSettings.smtp_secure === 'true' || siteSettings.smtp_port === '465',
          notificationEmail: siteSettings.notification_email || 'support@excellogics.co.in'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestEmailResult({ success: true, message: data.message || `Test email dispatched to ${siteSettings.notification_email || 'support@excellogics.co.in'}` });
      } else {
        setTestEmailResult({ success: false, message: data.message || 'SMTP connection failed. Check host, port, user and credentials.' });
      }
    } catch (err) {
      setTestEmailResult({ success: false, message: err.message || 'Network error while testing SMTP server.' });
    } finally {
      setTestingEmail(false);
    }
  };

  const statData = stats?.stats || {};

  // Filtered lists
  const filteredNotices = notices.filter((n) => {
    const matchesCategory = noticeCategoryFilter === 'ALL' || n.category === noticeCategoryFilter;
    const matchesType =
      noticeTypeFilter === 'ALL' ||
      (noticeTypeFilter === 'notice' && (n.item_type === 'notice' || !n.item_type)) ||
      (noticeTypeFilter === 'event' && n.item_type === 'event');
    return matchesCategory && matchesType;
  });

  const filteredGallery = galleryItems.filter(
    (g) => galleryAlbumFilter === 'ALL' || g.album === galleryAlbumFilter
  );

  const filteredFaculty = faculty.filter((f) => {
    const matchStream = facultyStreamFilter === 'ALL' || f.stream === facultyStreamFilter;
    const matchDept = facultyDeptFilter === 'ALL' || f.department === facultyDeptFilter;
    const q = facultySearch.trim().toLowerCase();
    const matchSearch = !q ||
      (f.name && f.name.toLowerCase().includes(q)) ||
      (f.department && f.department.toLowerCase().includes(q)) ||
      (f.designation && f.designation.toLowerCase().includes(q)) ||
      (f.qualification && f.qualification.toLowerCase().includes(q));
    return matchStream && matchDept && matchSearch;
  });

  const filteredGoverning = governingBody.filter((m) => {
    let matchSubTab = true;
    if (governingSubTab === 'MANAGEMENT') {
      matchSubTab = m.member_type === 'MANAGEMENT';
    } else if (governingSubTab === 'ADMINISTRATION') {
      matchSubTab = m.member_type === 'ADMINISTRATION';
    } else if (governingSubTab === 'COUNCIL') {
      matchSubTab = m.member_type === 'MEMBER' || m.member_type === 'OFFICER' || !m.member_type;
    }
    const matchType = governingTypeFilter === 'ALL' || m.member_type === governingTypeFilter;
    const q = governingSearch.trim().toLowerCase();
    const matchSearch = !q ||
      (m.name && m.name.toLowerCase().includes(q)) ||
      (m.role && m.role.toLowerCase().includes(q)) ||
      (m.category && m.category.toLowerCase().includes(q)) ||
      (m.affiliation && m.affiliation.toLowerCase().includes(q));
    return matchSubTab && matchType && matchSearch;
  });

  const filteredDocuments = documents.filter((d) => {
    return docCategoryFilter === 'ALL' || d.category === docCategoryFilter;
  });

  const filteredCourses = courses.filter(
    (c) => courseStreamFilter === 'ALL' || c.stream === courseStreamFilter
  );

  const filteredInquiries = inquiries.filter(
    (i) => inquiryStatusFilter === 'ALL' || i.status === inquiryStatusFilter
  );

  // Return to public website
  const handleExitToLiveWebsite = () => {
    try {
      sessionStorage.removeItem('cche_admin_open');
    } catch {}
    if (onStatusChange) onStatusChange(admissionControl.open);
    window.dispatchEvent(new CustomEvent('admissions-status-changed', {
      detail: { open: admissionControl.open, notice: admissionControl.notice }
    }));
    onClose();
  };

  // Nav menu items definition
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart3, count: null },
    { id: 'ticker', label: 'Top Alert Bar & Ticker', icon: Megaphone, count: announcements.filter((a) => a.is_active).length || announcements.length },
    { id: 'documents', label: 'Forms & PDF Documents Hub', icon: FileText, count: documents.length },
    { id: 'admissions', label: 'Admissions Registry', icon: GraduationCap, count: applications.length },
    { id: 'news', label: 'News & Announcements', icon: Bell, count: notices.length },
    { id: 'hero', label: 'Hero Slider Showcase', icon: Sliders, count: heroSlides.length },
    { id: 'gallery', label: 'Media & Gallery Hub', icon: Image, count: galleryItems.length },
    { id: 'faculty', label: 'Faculty & Staff Directory', icon: Users, count: faculty.length },
    { id: 'governing', label: 'Leadership & Governance', icon: Landmark, count: governingBody.length },
    { id: 'courses', label: 'Academic Programmes', icon: BookOpen, count: courses.length },
    { id: 'inquiries', label: 'Contact Inquiries', icon: Mail, count: inquiries.filter((i) => i.status === 'UNREAD').length || null },
    { id: 'users', label: 'Staff Users & RBAC', icon: ShieldCheck, count: adminUsers.length || statData.totalAdmins },
    { id: 'settings', label: 'Site Settings & Channels', icon: Settings, count: null },
    { id: 'database', label: 'System & Database Monitor', icon: Database, count: null }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-0 md:p-3 modal-backdrop-anim">
      {/* 1. CONFIDENTIAL LOGIN / GATEKEEPER CARD (Inspired by nnnagischool.edu.in) */}
      {!adminUser ? (
        <div className="relative bg-white w-full max-w-md rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 modal-login-card my-6 mx-3">
          {/* Top Close Button to exit to website */}
          <button
            onClick={handleExitToLiveWebsite}
            className="absolute top-4 right-4 z-20 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl backdrop-blur-sm transition-all duration-300 transform hover:rotate-90 hover:scale-105 cursor-pointer"
            title="Return to Website"
            aria-label="Close Login"
          >
            <X size={16} />
          </button>

          {/* Institutional Crest Header with Shimmer */}
          <div className="bg-gradient-to-b from-[#001736] via-[#002147] to-[#001736] text-white px-6 py-8 text-center border-b-4 border-[#4a6b28] relative overflow-hidden">
            {/* Ambient background glow accents */}
            <div className="absolute top-0 right-10 w-40 h-40 bg-[#8fc35e]/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-10 w-40 h-40 bg-[#002858]/30 rounded-full blur-2xl pointer-events-none"></div>

            {/* Pulsing Lock Halo Icon */}
            <div className="relative w-16 h-16 mx-auto mb-3.5">
              <span className="absolute -inset-1.5 rounded-2xl bg-[#8fc35e]/20 animate-pulse-subtle pointer-events-none"></span>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 border border-white/30 backdrop-blur-md flex items-center justify-center shadow-inner group">
                <Lock size={26} className="text-[#8fc35e] drop-shadow-[0_2px_8px_rgba(143,195,94,0.6)] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-white">
              <span className="shine-gold">Administrative Suite</span> 2.0
            </h3>
            <p className="text-xs text-gray-300 mt-1 font-medium">
              Capital College of Higher Education, Kohima
            </p>
            <div className="mt-3 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-[10.5px] font-bold text-gray-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#8fc35e] animate-pulse" />
              <span>Staff &amp; Faculty Login Only</span>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-5 bg-gradient-to-b from-white to-slate-50/50">
            {/* Direct Institutional Staff Login (Login Only - No Public Sign-Up) */}
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl flex items-start gap-2.5 animate-shake shadow-xs">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                  <span className="font-medium leading-relaxed">{loginError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                  Administrative Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. admin"
                  value={loginCreds.username}
                  onChange={(e) => setLoginCreds({ ...loginCreds, username: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none input-glow text-xs font-mono font-bold text-gray-800 transition-all duration-300 shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                    Security Key / Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowResetOnLogin(true)}
                    className="text-[11px] font-semibold text-[#4a6b28] hover:underline cursor-pointer"
                  >
                    Reset password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter confidential password"
                  value={loginCreds.password}
                  onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none input-glow text-xs font-mono text-gray-800 transition-all duration-300 shadow-2xs"
                />
              </div>

              {/* reCAPTCHA Security Verification */}
              <div className="pt-1">
                <RecaptchaWidget
                  verified={captchaVerified}
                  hasError={captchaError}
                  disabled={loginLoading}
                  onVerify={(tok) => {
                    setCaptchaVerified(true);
                    setCaptchaToken(tok);
                    setCaptchaError(false);
                    if (loginError && loginError.includes('reCAPTCHA')) setLoginError('');
                  }}
                  onExpire={() => {
                    setCaptchaVerified(false);
                    setCaptchaToken('');
                  }}
                />
              </div>

              {/* Glossy Animated Submit Button */}
              <button
                type="submit"
                disabled={loginLoading}
                className="btn-lift w-full bg-[#002147] hover:bg-[#4a6b28] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
              >
                {loginLoading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin text-[#8fc35e]" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} className="text-[#8fc35e] group-hover:rotate-12 group-hover:scale-115 transition-transform duration-300" />
                    <span>Authenticate &amp; Access Suite</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Reset Password Trigger on Login */}
            {showResetOnLogin && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs animate-fadeIn">
                <div className="flex justify-between items-center font-bold text-gray-800">
                  <span>Reset Admin Password</span>
                  <button onClick={() => setShowResetOnLogin(false)} className="text-gray-400 hover:text-gray-700">
                    <X size={14} />
                  </button>
                </div>
                {resetSuccess && <p className="text-green-700 font-bold">{resetSuccess}</p>}
                {resetError && <p className="text-red-600">{resetError}</p>}
                <form onSubmit={handleResetSubmit} className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Admin Username (default: admin)"
                    value={resetData.username}
                    onChange={(e) => setResetData({ ...resetData, username: e.target.value })}
                    className="w-full border rounded p-1.5"
                  />
                  <input
                    type="password"
                    required
                    placeholder="New password"
                    value={resetData.newPassword}
                    onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                    className="w-full border rounded p-1.5"
                  />
                  <input
                    type="password"
                    required
                    placeholder="Confirm new password"
                    value={resetData.confirmPassword}
                    onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                    className="w-full border rounded p-1.5"
                  />
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full bg-gray-800 text-white py-1.5 rounded font-bold"
                  >
                    {resetLoading ? 'Updating...' : 'Set New Password'}
                  </button>
                </form>
              </div>
            )}

            <div className="pt-2 text-center border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <span>Capital College of Higher Education</span>
              <button
                onClick={handleExitToLiveWebsite}
                className="text-[#002858] font-bold hover:underline flex items-center gap-1"
              >
                <span>Back to Live Website</span>
                <ExternalLink size={11} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 2. AUTHENTICATED ADMINISTRATIVE WORKSTATION (FULL 11-MODULE WORKSPACE) */
        <div className={`bg-[#0f172a] w-full h-full md:h-[96vh] md:max-w-[98vw] xl:max-w-[1600px] md:rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col animate-fadeIn ${viewDetailsApp ? 'print:hidden' : ''}`}>
          {/* TOP GLOBAL BAR */}
          <header className="bg-[#002858] text-white px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#4a6b28] shrink-0">
            {/* Left: Branding & Module Breadcrumb */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4a6b28] to-[#2d4218] flex items-center justify-center font-black text-white text-base shadow-md">
                CC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm md:text-base tracking-tight text-white flex items-center gap-2">
                    <span>Capital College Administration Suite</span>
                  </h3>
                  <span className="hidden sm:inline-block bg-white/10 text-gray-200 text-[10px] px-2 py-0.5 rounded font-mono font-semibold">
                    v2.0-Enterprise
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-300">
                  <span className="font-semibold text-[#4a6b28] capitalize">{activeTab}</span>
                  <span>•</span>
                  <span>Kohima, Nagaland</span>
                </div>
              </div>
            </div>

            {/* Right: Status Pills, View Live Website, Profile & Sign Out */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Database indicator pill */}
              <div className="hidden lg:flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {stats?.database?.engine === 'mysql' ? '🐬 MySQL Active' : '📦 SQLite Local Active'}
                </span>
              </div>

              {/* User role chip */}
              <div className="bg-[#4a6b28]/20 border border-[#4a6b28]/40 text-[#8fc35e] px-2.5 py-1 rounded-full text-[11px] font-mono font-bold">
                {adminUser.role || 'SUPER_ADMIN'}
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchData}
                className="text-gray-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Refresh All Server Data"
              >
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              </button>

              {/* VIEW LIVE WEBSITE (Primary CTA) */}
              <button
                onClick={handleExitToLiveWebsite}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                title="Return to the public college website"
              >
                <Globe size={14} />
                <span>View Live Website</span>
              </button>

              {/* My Profile / Credentials */}
              <button
                onClick={() => setShowProfileModal(true)}
                className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/15"
                title="Manage My Credentials"
              >
                <Settings size={13} />
                <span className="hidden sm:inline">Credentials</span>
              </button>

              {/* Sign Out */}
              <button
                onClick={handleLogout}
                className="bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-rose-500/30"
                title="Sign out of administration portal"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Close Button */}
              <button
                onClick={handleExitToLiveWebsite}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 ml-1 cursor-pointer"
                title="Close Portal"
              >
                <X size={20} />
              </button>
            </div>
          </header>

          {/* MAIN TWO-COLUMN WORKSTATION LAYOUT */}
          <div className="flex-1 flex overflow-hidden">
            {/* LEFT PERSISTENT SIDEBAR */}
            <aside className="w-64 md:w-72 bg-[#0a1120] border-r border-slate-800 flex flex-col shrink-0 text-slate-300 text-xs transition-all">
              {/* User profile card */}
              <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center font-bold text-amber-400 shrink-0 shadow-inner">
                  <ShieldCheck size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-white text-xs truncate">{adminUser.full_name}</p>
                  <p className="text-[11px] text-slate-400 font-mono truncate">@{adminUser.username}</p>
                  <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-amber-400 mt-0.5">
                    {adminUser.role || 'SUPER_ADMIN'}
                  </span>
                </div>
              </div>

              {/* Navigation items list */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Management Modules
                </p>

                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isAllowed = allowedModules.includes(item.id);
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => isAllowed && setActiveTab(item.id)}
                      disabled={!isAllowed}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all text-xs font-semibold ${
                        isActive
                          ? 'bg-[#4a6b28] text-white shadow-md font-bold'
                          : isAllowed
                          ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                          : 'text-slate-600 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-1">
                        <Icon size={16} className={`shrink-0 ${isActive ? 'text-white' : isAllowed ? 'text-[#4a6b28]' : 'text-slate-600'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.count !== null && item.count !== undefined && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                            isActive
                              ? 'bg-black/25 text-white'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sidebar bottom system info */}
              <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 text-[11px] text-slate-400 space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span>Connected DB Engine:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {stats?.database?.engine === 'mysql' ? 'MySQL 3306' : 'SQLite'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span>Admissions Status:</span>
                  <span className="text-amber-400 font-bold">Cycle 2026 Open</span>
                </div>
                <button
                  onClick={handleExportBackup}
                  className="w-full mt-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download size={11} />
                  <span>Download DB Backup</span>
                </button>
              </div>
            </aside>

            {/* RIGHT WORKSPACE AREA */}
            <main className="flex-1 overflow-y-auto bg-slate-100 p-4 md:p-6 text-gray-800">
              {/* ========================================================
                  MODULE 1: EXECUTIVE DASHBOARD
              ======================================================== */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Welcome Hero Bar */}
                  <div className="bg-gradient-to-r from-[#002858] via-[#00387a] to-[#0a192f] text-white p-5 md:p-6 rounded-2xl shadow-md border border-slate-700 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="inline-block bg-[#4a6b28]/30 text-[#b5d697] border border-[#4a6b28]/40 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
                        Executive Oversight & Analytics
                      </span>
                      <h2 className="text-xl md:text-2xl font-black tracking-tight">
                        Welcome back, {adminUser.full_name}
                      </h2>
                      <p className="text-xs text-slate-300 mt-1 max-w-xl">
                        Capital College Administration Suite connected to{' '}
                        <strong className="text-white">
                          {stats?.database?.engine === 'mysql' ? 'Production MySQL' : 'Local Persistent Storage'}
                        </strong>
                        . Today is{' '}
                        {new Date().toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        .
                      </p>
                    </div>

                    {/* Quick Fast Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setEditingNotice(null);
                          setNoticeFormData({
                            title: '',
                            item_type: 'notice',
                            category: 'Official Notice',
                            summary: '',
                            content: '',
                            event_date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                            image_url: '',
                            link_url: '',
                            pdf_url: '',
                            pdf_name: '',
                            is_featured: false
                          });
                          setShowNoticeModal(true);
                        }}
                        className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                      >
                        <PlusCircle size={14} />
                        <span>Publish Notice / Event</span>
                      </button>

                      <button
                        onClick={() => setShowManualAppModal(true)}
                        className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition-colors"
                      >
                        <UserPlus size={14} />
                        <span>Register Applicant</span>
                      </button>

                      <button
                        onClick={handleExportBackup}
                        className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition-colors"
                      >
                        <Download size={14} />
                        <span>Export Backup</span>
                      </button>
                    </div>
                  </div>

                  {/* 6 Key Performance Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-[#4a6b28] transition-all">
                      <div className="flex items-center justify-between text-gray-500 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Total Applicants</span>
                        <GraduationCap size={16} className="text-[#002858]" />
                      </div>
                      <span className="text-2xl font-black text-[#002858] block">
                        {statData.totalApplications || applications.length || 0}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                        {statData.approvedApplications || 0} Approved
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-[#4a6b28] transition-all">
                      <div className="flex items-center justify-between text-gray-500 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Pending Review</span>
                        <Activity size={16} className="text-amber-500" />
                      </div>
                      <span className="text-2xl font-black text-amber-600 block">
                        {statData.pendingApplications || applications.filter((a) => a.status === 'PENDING').length || 0}
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-1">Awaiting decision</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-[#4a6b28] transition-all">
                      <div className="flex items-center justify-between text-gray-500 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Faculty Members</span>
                        <Users size={16} className="text-blue-600" />
                      </div>
                      <span className="text-2xl font-black text-blue-700 block">
                        {statData.totalFaculty || faculty.length || 0}
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-1">Arts & Science</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-[#4a6b28] transition-all">
                      <div className="flex items-center justify-between text-gray-500 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Courses (FYUGP)</span>
                        <BookOpen size={16} className="text-purple-600" />
                      </div>
                      <span className="text-2xl font-black text-purple-700 block">
                        {statData.totalCourses || courses.length || 0}
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-1">B.A. & B.Sc. Honours</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-[#4a6b28] transition-all">
                      <div className="flex items-center justify-between text-gray-500 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Visitor Inquiries</span>
                        <Mail size={16} className="text-emerald-600" />
                      </div>
                      <span className="text-2xl font-black text-emerald-700 block">
                        {statData.totalInquiries || inquiries.length || 0}
                      </span>
                      <span className="text-[10px] text-rose-600 font-bold block mt-1">
                        {statData.unreadInquiries || inquiries.filter((i) => i.status === 'UNREAD').length || 0} Unread
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-[#4a6b28] transition-all">
                      <div className="flex items-center justify-between text-gray-500 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Active Staff Admins</span>
                        <ShieldCheck size={16} className="text-[#4a6b28]" />
                      </div>
                      <span className="text-2xl font-black text-[#4a6b28] block">
                        {statData.totalAdmins || adminUsers.length || 1}
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-1">RBAC matrix active</span>
                    </div>
                  </div>

                  {/* Admissions Distribution & Stream Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Status Distribution */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-[#002858] text-sm flex items-center gap-2">
                          <Activity size={16} className="text-[#4a6b28]" />
                          <span>Admissions Funnel & Status Distribution</span>
                        </h4>
                        <button
                          onClick={() => setActiveTab('admissions')}
                          className="text-xs text-[#4a6b28] font-bold hover:underline"
                        >
                          View Registry →
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        {/* Approved */}
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="font-semibold text-emerald-800">Approved Admissions</span>
                            <span className="font-bold text-emerald-800">
                              {statData.approvedApplications || applications.filter((a) => a.status === 'APPROVED').length}
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-2.5 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((statData.approvedApplications || 1) / Math.max(1, statData.totalApplications || 1)) * 100
                                )}%`
                              }}
                            />
                          </div>
                        </div>

                        {/* Under Review */}
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="font-semibold text-blue-800">Under Review</span>
                            <span className="font-bold text-blue-800">
                              {statData.underReviewApplications || applications.filter((a) => a.status === 'UNDER_REVIEW').length}
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((statData.underReviewApplications || 0) / Math.max(1, statData.totalApplications || 1)) * 100
                                )}%`
                              }}
                            />
                          </div>
                        </div>

                        {/* Pending */}
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="font-semibold text-amber-800">Pending Evaluation</span>
                            <span className="font-bold text-amber-800">
                              {statData.pendingApplications || applications.filter((a) => a.status === 'PENDING').length}
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-amber-500 h-2.5 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((statData.pendingApplications || 0) / Math.max(1, statData.totalApplications || 1)) * 100
                                )}%`
                              }}
                            />
                          </div>
                        </div>

                        {/* Rejected */}
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="font-semibold text-rose-800">Seat Constrained / Rejected</span>
                            <span className="font-bold text-rose-800">
                              {statData.rejectedApplications || applications.filter((a) => a.status === 'REJECTED').length}
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-rose-500 h-2.5 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((statData.rejectedApplications || 0) / Math.max(1, statData.totalApplications || 1)) * 100
                                )}%`
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Academic Stream Breakdown */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-[#002858] text-sm flex items-center gap-2">
                          <BookOpen size={16} className="text-[#4a6b28]" />
                          <span>Stream Breakdown & Performance Benchmarks</span>
                        </h4>
                        <span className="text-[11px] text-gray-500">Avg. 12th Marks: <strong>{statData.averageMarks || '75'}%</strong></span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-center">
                          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                            Bachelor of Arts (B.A.)
                          </span>
                          <span className="text-3xl font-extrabold text-[#002858] block mt-1">
                            {statData.streamBreakdown?.ARTS || applications.filter((a) => a.stream === 'ARTS').length}
                          </span>
                          <span className="text-[10px] text-gray-500 block mt-1">7 Honours Disciplines</span>
                        </div>

                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 text-center">
                          <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                            Bachelor of Science (B.Sc.)
                          </span>
                          <span className="text-3xl font-extrabold text-[#002858] block mt-1">
                            {statData.streamBreakdown?.SCIENCE || applications.filter((a) => a.stream === 'SCIENCE').length}
                          </span>
                          <span className="text-[10px] text-gray-500 block mt-1">4 Honours Disciplines</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs text-gray-600 flex justify-between items-center">
                        <span>Automated Student Notifications Dispatched:</span>
                        <strong className="text-[#002858] font-mono text-sm">
                          {statData.totalNotificationsDispatched || 0}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Recent Applicants Fast Table */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-[#002858] text-sm">Recent Registered Applicants</h4>
                        <p className="text-xs text-gray-500">Quick decision and status triage</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('admissions')}
                        className="bg-[#002858] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#001c3d]"
                      >
                        All Applications ({applications.length})
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-100 text-gray-600 font-semibold border-b">
                          <tr>
                            <th className="py-2.5 px-3">Ref No</th>
                            <th className="py-2.5 px-3">Student Name</th>
                            <th className="py-2.5 px-3">Stream / Major</th>
                            <th className="py-2.5 px-3">12th Marks</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {applications.slice(0, 5).map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-2.5 px-3 font-mono font-bold text-[#002858]">{app.application_no}</td>
                              <td className="py-2.5 px-3 font-semibold text-gray-900">{app.full_name}</td>
                              <td className="py-2.5 px-3 text-gray-600">
                                {app.stream} • <strong className="text-gray-800">{app.major_subject}</strong>
                              </td>
                              <td className="py-2.5 px-3 font-bold text-emerald-700">{app.marks_12th}%</td>
                              <td className="py-2.5 px-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    app.status === 'APPROVED'
                                      ? 'bg-green-100 text-green-800'
                                      : app.status === 'REJECTED'
                                      ? 'bg-red-100 text-red-800'
                                      : app.status === 'UNDER_REVIEW'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {app.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  onClick={() => setViewDetailsApp(app)}
                                  className="text-xs text-[#4a6b28] hover:underline font-bold"
                                >
                                  View Dossier
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  MODULE: TOP ALERT BAR & TICKER (REQUEST 6)
              ======================================================== */}
              {activeTab === 'ticker' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Master Controls & Live Preview Card */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#002147] to-[#4a6b28] flex items-center justify-center text-white shadow-xs">
                          <Megaphone size={22} className="text-[#8fc35e]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#002147] text-base flex items-center gap-2">
                            <span>Top Alert Bar & Announcement Ticker</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              bannerSettings.top_banner_enabled
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {bannerSettings.top_banner_enabled ? '● LIVE ON WEBSITE' : '○ PAUSED / HIDDEN'}
                            </span>
                          </h4>
                          <p className="text-xs text-gray-500">
                            Decide what announcements and exam routines to show or hide at the very top of all public pages.
                          </p>
                        </div>
                      </div>

                      {/* Master Banner Enable / Disable Toggle */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleSaveBannerSettings({ ...bannerSettings, top_banner_enabled: !bannerSettings.top_banner_enabled })}
                          disabled={savingBannerSettings}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                            bannerSettings.top_banner_enabled
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                        >
                          <Power size={14} />
                          <span>{bannerSettings.top_banner_enabled ? 'Banner: Master ON' : 'Banner: Master OFF'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Speed & Notice Board Pill Settings */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Ticker Auto-Cycle Speed
                        </label>
                        <select
                          value={bannerSettings.top_banner_speed || 5500}
                          onChange={(e) => handleSaveBannerSettings({ ...bannerSettings, top_banner_speed: parseInt(e.target.value, 10) })}
                          className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-800"
                        >
                          <option value={3500}>3.5 Seconds (Fast)</option>
                          <option value={5500}>5.5 Seconds (Recommended Standard)</option>
                          <option value={8000}>8.0 Seconds (Relaxed)</option>
                          <option value={12000}>12.0 Seconds (Slow Reading)</option>
                        </select>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Notice Board Destination
                        </label>
                        <div className="text-[11px] text-gray-500 leading-relaxed mt-1">
                          Notice Board circulars are accessed via the header menu. The top announcement bar remains dedicated to urgent alerts.
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
                        <span className="text-[11px] font-bold text-gray-700">Live Status Counter</span>
                        <div className="text-xs text-gray-600 flex items-center gap-2 mt-1">
                          <span className="font-bold text-emerald-700">{announcements.filter((a) => a.is_active).length} Active</span>
                          <span>•</span>
                          <span className="font-bold text-slate-500">{announcements.filter((a) => !a.is_active).length} Hidden</span>
                          <span>•</span>
                          <span className="font-mono text-[11px]">{announcements.length} Total</span>
                        </div>
                      </div>
                    </div>

                    {/* Live Visual Preview Mirroring StickyAnnouncementBar */}
                    <div className="mt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                        Interactive Live Preview (Exact view seen by visitors on Home & Inner Pages)
                      </span>
                      <div className="relative rounded-xl overflow-hidden shadow-xs border border-[#001736]">
                        {bannerSettings.top_banner_enabled ? (
                          <div className="bg-[#002147] text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <span className="bg-[#4a6b28] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs tracking-wider shrink-0">
                                {announcements.find((a) => a.is_active)?.tag || 'ANNOUNCEMENT'}
                              </span>
                              <span className="truncate font-medium text-slate-100">
                                {announcements.find((a) => a.is_active)?.text || 'No active announcements published.'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[#8fc35e] font-bold text-xs hover:underline cursor-pointer">
                                {announcements.find((a) => a.is_active)?.action_label || 'VIEW DETAILS →'}
                              </span>
                              <span className="text-white/60 hover:text-white cursor-pointer px-1">✕</span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-800 text-slate-400 px-4 py-3 text-center text-xs italic">
                            Ticker is currently turned OFF by master switch. It will not render on public pages.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Announcements Control Table Card */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-[#002147] text-sm">
                          Announcement Messages & Routines (Show / Hide Control)
                        </h4>
                        <p className="text-xs text-gray-500">
                          Use the toggle switch on any row to instantly publish or hide that notice from the top ticker.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingAnnouncement(null);
                            setAnnouncementFormData({
                              tag: 'EXAM ROUTINE',
                              text: '',
                              action_label: 'VIEW ROUTINES →',
                              action_type: 'page',
                              action_page: 'exam-routine',
                              action_href: '',
                              secondary_label: 'NOTICE BOARD',
                              secondary_href: '/notices',
                              is_active: true,
                              display_order: announcements.length + 1
                            });
                            setShowAnnouncementModal(true);
                          }}
                          className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <PlusCircle size={14} />
                          <span>Add New Alert to Ticker</span>
                        </button>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                        <thead className="bg-[#002147] text-white">
                          <tr>
                            <th className="px-3.5 py-3 font-semibold w-32">Tag Badge</th>
                            <th className="px-3.5 py-3 font-semibold">Announcement / Notice Message</th>
                            <th className="px-3.5 py-3 font-semibold">Action Button</th>
                            <th className="px-3.5 py-3 font-semibold text-center w-36">Show / Hide Status</th>
                            <th className="px-3.5 py-3 font-semibold text-right w-28">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {announcements.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                                No ticker alerts found in database. Click "Add New Alert to Ticker" to publish one.
                              </td>
                            </tr>
                          ) : (
                            announcements.map((ann) => (
                              <tr key={ann.id} className={`hover:bg-slate-50 transition-colors ${ann.is_active ? '' : 'bg-gray-50/60 opacity-75'}`}>
                                <td className="px-3.5 py-3">
                                  <span className={`inline-block font-black text-[10px] px-2 py-0.5 rounded shadow-2xs uppercase tracking-wider ${
                                    ann.is_active ? 'bg-[#4a6b28] text-white' : 'bg-gray-300 text-gray-700'
                                  }`}>
                                    {ann.tag}
                                  </span>
                                </td>
                                <td className="px-3.5 py-3 font-medium text-gray-900 max-w-md">
                                  <div className="truncate">{ann.text}</div>
                                  <div className="text-[10px] text-gray-400 mt-0.5">
                                    Display Order: {ann.display_order} • Target: {ann.action_page || ann.action_href || 'Self'}
                                  </div>
                                </td>
                                <td className="px-3.5 py-3">
                                  <span className="font-bold text-[#002147] bg-slate-100 px-2 py-1 rounded text-[11px] border border-slate-200 inline-block">
                                    {ann.action_label || 'LEARN MORE'}
                                  </span>
                                </td>
                                <td className="px-3.5 py-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleAnnouncement(ann.id)}
                                    className={`px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                                      ann.is_active
                                        ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600 border border-gray-300'
                                    }`}
                                    title="Click to toggle Show / Hide on live website"
                                  >
                                    <span className={`w-2 h-2 rounded-full ${ann.is_active ? 'bg-emerald-600' : 'bg-gray-400'}`}></span>
                                    <span>{ann.is_active ? 'Shown' : 'Hidden'}</span>
                                  </button>
                                </td>
                                <td className="px-3.5 py-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingAnnouncement(ann);
                                        setAnnouncementFormData({
                                          tag: ann.tag || 'NOTICE',
                                          text: ann.text || '',
                                          action_label: ann.action_label || 'VIEW DETAILS →',
                                          action_type: ann.action_type || 'page',
                                          action_page: ann.action_page || '',
                                          action_href: ann.action_href || '',
                                          secondary_label: ann.secondary_label || 'NOTICE BOARD',
                                          secondary_href: ann.secondary_href || '/notices',
                                          is_active: Boolean(ann.is_active),
                                          display_order: ann.display_order || 0
                                        });
                                        setShowAnnouncementModal(true);
                                      }}
                                      className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                                      title="Edit announcement"
                                    >
                                      <Edit3 size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteAnnouncement(ann.id)}
                                      className="p-1.5 text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                                      title="Delete alert"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* 1-Click Import from Published Notices Section */}
                    {notices.length > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <span className="text-[11px] font-bold text-gray-700 block mb-2">
                          1-Click Import from Published Institutional Notices:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {notices.slice(0, 3).map((notice) => (
                            <div key={notice.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <span className="text-[9px] font-bold uppercase text-[#4a6b28] block truncate">
                                  {notice.category || 'NOTICE'}
                                </span>
                                <span className="font-semibold text-gray-900 text-xs block truncate" title={notice.title}>
                                  {notice.title}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleImportNoticeToTicker(notice)}
                                className="shrink-0 bg-white hover:bg-emerald-50 text-[#4a6b28] border border-[#4a6b28]/40 px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer"
                              >
                                + Ticker
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================
                  MODULE: FORMS & PDF DOCUMENTS HUB (REQUEST 4 & 8)
              ======================================================== */}
              {activeTab === 'documents' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Top Header Card */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#002147] to-[#4a6b28] flex items-center justify-center text-white shadow-xs">
                        <FileText size={22} className="text-[#8fc35e]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#002147] text-base flex items-center gap-2">
                          <span>Institutional Forms & PDF Documents Hub</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                            OFFICIAL ARCHIVE
                          </span>
                        </h4>
                        <p className="text-xs text-gray-500">
                          Upload, modify, and change admission forms, prospectuses, examination routines, and welfare PDF forms.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingDocument(null);
                          setDocumentFormData({
                            doc_key: '',
                            title: '',
                            category: 'Admission',
                            file_name: '',
                            file_data: '',
                            description: ''
                          });
                          setShowDocumentModal(true);
                        }}
                        className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Upload size={14} />
                        <span>Upload New Document / Form</span>
                      </button>
                    </div>
                  </div>

                  {quickDocSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                      <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                      <span>{quickDocSuccess}</span>
                    </div>
                  )}

                  {/* CORE INSTITUTIONAL FORMS ROW (PROMINENT CARDS) */}
                  <div>
                    <h5 className="font-bold text-[#002147] text-xs uppercase tracking-wider mb-2.5">
                      Core Institutional Application Forms & Circulars
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Card 1: Official Admission Application Form (admission_form.pdf) */}
                      <div className="bg-gradient-to-br from-white to-emerald-50/40 p-4 rounded-2xl border-2 border-emerald-500/40 shadow-xs flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              PRIMARY FORM
                            </span>
                            <span className="font-mono text-[10px] text-gray-500">
                              admission_form.pdf
                            </span>
                          </div>
                          <h6 className="font-black text-gray-900 text-sm">
                            Official Admission Application Form
                          </h6>
                          <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                            Exact document served when applicants click "Download Offline Form (PDF)" on the portal. Guaranteed download name: <code className="bg-emerald-100/60 text-emerald-900 px-1 py-0.2 rounded font-bold">admission_form.pdf</code>.
                          </p>
                        </div>

                        <div className="pt-2 border-t border-emerald-100 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <a
                              href="/admission_form.pdf"
                              download="admission_form.pdf"
                              className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 hover:underline"
                            >
                              <Download size={13} />
                              <span>Download Current Form</span>
                            </a>
                            <span className="text-[10px] text-gray-400">PDF Document</span>
                          </div>

                          {/* Quick Device Replacement Upload */}
                          <div className="pt-1">
                            <DeviceDocumentUpload
                              label="Upload Replacement admission_form.pdf"
                              hint="Drop a new PDF to immediately replace admission_form.pdf on public site"
                              onChange={(base64) => handleQuickReplaceAdmissionForm(base64, 'admission_form.pdf')}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card 2: College Prospectus */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              PROSPECTUS
                            </span>
                            <span className="font-mono text-[10px] text-gray-500">
                              prospectus.pdf
                            </span>
                          </div>
                          <h6 className="font-black text-gray-900 text-sm">
                            Institutional Academic Prospectus
                          </h6>
                          <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                            Complete FYUGP syllabus, course curriculum, fees matrix, code of conduct, and faculty credentials for prospective students.
                          </p>
                        </div>

                        <div className="pt-2 border-t border-gray-100 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <a
                              href="/api/documents/2/download"
                              className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 hover:underline"
                            >
                              <Download size={13} />
                              <span>Download Prospectus</span>
                            </a>
                            <span className="text-[10px] text-gray-400">Official Brochure</span>
                          </div>

                          <div className="pt-1">
                            <DeviceDocumentUpload
                              label="Replace Prospectus PDF"
                              hint="Upload new official academic prospectus brochure"
                              onChange={async (base64) => {
                                await apiFetch('/api/documents/upload', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    doc_key: 'prospectus',
                                    title: 'Capital College Academic Prospectus (FYUGP)',
                                    category: 'Prospectus',
                                    file_name: 'prospectus.pdf',
                                    file_data: base64
                                  })
                                });
                                fetchData();
                                setQuickDocSuccess('Academic Prospectus PDF updated successfully!');
                                setTimeout(() => setQuickDocSuccess(''), 3500);
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card 3: University Exam Routine */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              EXAMINATION
                            </span>
                            <span className="font-mono text-[10px] text-gray-500">
                              exam_routine.pdf
                            </span>
                          </div>
                          <h6 className="font-black text-gray-900 text-sm">
                            Nagaland University Exam Routine
                          </h6>
                          <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                            Official Nagaland University UG Semester Exam Routine for B.A. and B.Sc. students with exam slots, hall timings and instructions.
                          </p>
                        </div>

                        <div className="pt-2 border-t border-gray-100 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <a
                              href="/api/documents/3/download"
                              className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 hover:underline"
                            >
                              <Download size={13} />
                              <span>Download Exam Routine</span>
                            </a>
                            <span className="text-[10px] text-gray-400">University Schedule</span>
                          </div>

                          <div className="pt-1">
                            <DeviceDocumentUpload
                              label="Replace Exam Routine PDF"
                              hint="Upload latest university examination schedule"
                              onChange={async (base64) => {
                                await apiFetch('/api/documents/upload', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    doc_key: 'exam_routine',
                                    title: 'Nagaland University UG Examination Routine',
                                    category: 'Examination',
                                    file_name: 'exam_routine.pdf',
                                    file_data: base64
                                  })
                                });
                                fetchData();
                                setQuickDocSuccess('Exam routine PDF updated successfully!');
                                setTimeout(() => setQuickDocSuccess(''), 3500);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ALL DOCUMENTS ARCHIVE TABLE */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-[#002147] text-sm">
                          All Institutional Forms & Documents ({filteredDocuments.length})
                        </h4>
                        <p className="text-xs text-gray-500">
                          Complete registry of downloadable PDFs, scholarship forms, and academic circulars.
                        </p>
                      </div>

                      {/* Category Filter Pills */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {['ALL', 'Admission', 'Examination', 'Welfare', 'Prospectus', 'General'].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setDocCategoryFilter(cat)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              docCategoryFilter === cat
                                ? 'bg-[#002147] text-white shadow-2xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-gray-600'
                            }`}
                          >
                            {cat === 'ALL' ? 'All Documents' : cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                        <thead className="bg-[#002147] text-white">
                          <tr>
                            <th className="px-3.5 py-3 font-semibold">Document Title</th>
                            <th className="px-3.5 py-3 font-semibold w-28">Category</th>
                            <th className="px-3.5 py-3 font-semibold w-36">File Name</th>
                            <th className="px-3.5 py-3 font-semibold text-center w-24">File Size</th>
                            <th className="px-3.5 py-3 font-semibold text-center w-28">Download</th>
                            <th className="px-3.5 py-3 font-semibold text-right w-20">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {filteredDocuments.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                No documents found in this category.
                              </td>
                            </tr>
                          ) : (
                            filteredDocuments.map((doc) => (
                              <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-3.5 py-3">
                                  <div className="font-bold text-gray-900 text-xs">{doc.title}</div>
                                  {doc.description && (
                                    <div className="text-[11px] text-gray-400 truncate max-w-sm mt-0.5">
                                      {doc.description}
                                    </div>
                                  )}
                                </td>
                                <td className="px-3.5 py-3">
                                  <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
                                    {doc.category || 'General'}
                                  </span>
                                </td>
                                <td className="px-3.5 py-3 font-mono text-[11px] text-gray-600">
                                  {doc.file_name}
                                </td>
                                <td className="px-3.5 py-3 text-center text-[11px] text-gray-500 font-mono">
                                  {doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : '—'}
                                </td>
                                <td className="px-3.5 py-3 text-center">
                                  <a
                                    href={doc.download_url || `/api/documents/${doc.id}/download`}
                                    download={doc.file_name}
                                    className="inline-flex items-center gap-1 bg-[#4a6b28] hover:bg-[#3d5920] text-white px-2.5 py-1 rounded text-[11px] font-bold shadow-2xs"
                                  >
                                    <Download size={11} />
                                    <span>Download</span>
                                  </a>
                                </td>
                                <td className="px-3.5 py-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteDocument(doc.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                    title="Delete document"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  MODULE 2: ADMISSIONS REGISTRY
              ======================================================== */}
              {activeTab === 'admissions' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Real-Time Admissions Portal Control Center & Live Monitor */}
                  <div className={`p-5 rounded-2xl border shadow-xs transition-all ${
                    admissionControl.open 
                      ? 'bg-emerald-50/80 border-emerald-300' 
                      : 'bg-slate-50 border-slate-300'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm ${
                          admissionControl.open ? 'bg-[#4a6b28]' : 'bg-[#002147]'
                        }`}>
                          <GraduationCap size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              admissionControl.open 
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 animate-pulse' 
                                : 'bg-slate-200 text-slate-800 border border-slate-300'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${admissionControl.open ? 'bg-emerald-700' : 'bg-slate-600'}`}></span>
                              <span>{admissionControl.open ? 'Online Admissions: ACTIVE / OPEN' : 'Online Admissions: CLOSED FOR NOW'}</span>
                            </span>
                            <span className="text-[11px] text-gray-500 font-medium">Session {admissionControl.academic_year}</span>
                          </div>
                          <p className="text-xs text-gray-700 mt-1 max-w-xl line-clamp-1">
                            {admissionControl.notice}
                          </p>
                        </div>
                      </div>

                      {/* Control Buttons */}
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={handleToggleAdmissions}
                          disabled={savingAdmissionStatus}
                          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                            admissionControl.open
                              ? 'bg-rose-700 hover:bg-rose-800 text-white'
                              : 'bg-[#4a6b28] hover:bg-[#3d5920] text-white'
                          }`}
                        >
                          <Power size={13} />
                          <span>{savingAdmissionStatus ? 'Updating...' : admissionControl.open ? 'Close Online Admissions' : 'Open Online Admissions'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setEditNoticeText(admissionControl.notice);
                            setShowNoticeEditModal(true);
                          }}
                          className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-xl text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <Edit3 size={13} />
                          <span>Edit Notice</span>
                        </button>
                      </div>
                    </div>

                    {/* Live Intake Monitor Counters */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-4 mt-3 border-t border-gray-200/60 text-center">
                      <div className="bg-white/90 p-2 rounded-xl border border-gray-200">
                        <p className="text-[10px] font-bold uppercase text-gray-500">Total Applicants</p>
                        <p className="text-base font-extrabold text-[#002147]">{applications.length}</p>
                      </div>
                      <div className="bg-white/90 p-2 rounded-xl border border-gray-200">
                        <p className="text-[10px] font-bold uppercase text-blue-700">Arts Stream</p>
                        <p className="text-base font-extrabold text-blue-700">
                          {applications.filter(a => (a.stream || '').toUpperCase() === 'ARTS').length}
                        </p>
                      </div>
                      <div className="bg-white/90 p-2 rounded-xl border border-gray-200">
                        <p className="text-[10px] font-bold uppercase text-emerald-700">Science Stream</p>
                        <p className="text-base font-extrabold text-emerald-700">
                          {applications.filter(a => (a.stream || '').toUpperCase() === 'SCIENCE').length}
                        </p>
                      </div>
                      <div className="bg-white/90 p-2 rounded-xl border border-gray-200">
                        <p className="text-[10px] font-bold uppercase text-indigo-700">Pending Review</p>
                        <p className="text-base font-extrabold text-indigo-700">
                          {applications.filter(a => a.status === 'PENDING').length}
                        </p>
                      </div>
                      <div className="bg-white/90 p-2 rounded-xl border border-gray-200">
                        <p className="text-[10px] font-bold uppercase text-emerald-600">Approved</p>
                        <p className="text-base font-extrabold text-emerald-600">
                          {applications.filter(a => a.status === 'APPROVED').length}
                        </p>
                      </div>
                      <div className="bg-white/90 p-2 rounded-xl border border-gray-200">
                        <p className="text-[10px] font-bold uppercase text-rose-600">Rejected</p>
                        <p className="text-base font-extrabold text-rose-600">
                          {applications.filter(a => a.status === 'REJECTED').length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action and Filter Toolbar */}
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 flex-1">
                      {/* Search */}
                      <div className="relative min-w-[220px]">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search applicant name, ref, email..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                          className="w-full pl-8 pr-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-[#4a6b28]"
                        />
                      </div>

                      {/* Stream Filter */}
                      <select
                        value={filterStream}
                        onChange={(e) => setFilterStream(e.target.value)}
                        className="border rounded-lg px-2.5 py-1.5 text-xs bg-white text-gray-700 focus:outline-none focus:border-[#4a6b28]"
                      >
                        <option value="">All Streams</option>
                        <option value="ARTS">Arts Stream</option>
                        <option value="SCIENCE">Science Stream</option>
                      </select>

                      {/* Status Filter */}
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border rounded-lg px-2.5 py-1.5 text-xs bg-white text-gray-700 focus:outline-none focus:border-[#4a6b28]"
                      >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>

                      <button
                        onClick={fetchData}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                        <span>Filter</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowManualAppModal(true)}
                        className="bg-[#002858] hover:bg-[#001c3d] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        <UserPlus size={13} />
                        <span>Manual Entry</span>
                      </button>

                      <button
                        onClick={exportToCSV}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        <FileSpreadsheet size={13} />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Applicants Registry Table */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                        <thead className="bg-[#002858] text-white">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Application Ref</th>
                            <th className="px-4 py-3 font-semibold">Student Name</th>
                            <th className="px-4 py-3 font-semibold">Stream</th>
                            <th className="px-4 py-3 font-semibold">Major Programme</th>
                            <th className="px-4 py-3 font-semibold">12th Marks</th>
                            <th className="px-4 py-3 font-semibold">Contact</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {applications.length > 0 ? (
                            applications.map((app) => (
                              <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-mono font-bold text-[#002858]">{app.application_no}</td>
                                <td className="px-4 py-3 font-semibold text-gray-900">{app.full_name}</td>
                                <td className="px-4 py-3 text-gray-600 font-semibold">{app.stream}</td>
                                <td className="px-4 py-3 font-medium text-gray-800">{app.major_subject}</td>
                                <td className="px-4 py-3">
                                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    {app.marks_12th}%
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500 text-[11px]">
                                  <div>{app.phone}</div>
                                  <div className="truncate max-w-[130px]">{app.email}</div>
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                      app.status === 'APPROVED'
                                        ? 'bg-green-100 text-green-800'
                                        : app.status === 'REJECTED'
                                        ? 'bg-red-100 text-red-800'
                                        : app.status === 'UNDER_REVIEW'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                  >
                                    {app.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      onClick={() => setViewDetailsApp(app)}
                                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                      title="View Full Student Dossier"
                                    >
                                      <Eye size={14} />
                                    </button>
                                    <button
                                      onClick={() => openDecisionModal(app, 'APPROVED')}
                                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                      title="Approve Admission"
                                    >
                                      <CheckCircle size={14} />
                                    </button>
                                    <button
                                      onClick={() => openDecisionModal(app, 'REJECTED')}
                                      className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                      title="Reject Application"
                                    >
                                      <XCircle size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteApplication(app.id, app.application_no)}
                                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                      title="Delete Application"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={8} className="py-8 text-center text-gray-400 text-xs">
                                No applicant records matched your criteria.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  MODULE 3: NEWS & ANNOUNCEMENTS
              ======================================================== */}
              {activeTab === 'news' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-[#002858] text-sm flex items-center gap-2">
                        <Bell size={16} className="text-[#4a6b28]" />
                        <span>Notices &amp; Campus Events Registry</span>
                      </h4>
                      <p className="text-xs text-gray-500">
                        Separate official notices &amp; circulars (with PDF/forms/links) from student campus events.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Notice vs Event Type Switcher */}
                      <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setNoticeTypeFilter('ALL')}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            noticeTypeFilter === 'ALL'
                              ? 'bg-white text-[#002147] shadow-xs font-bold'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          All ({notices.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoticeTypeFilter('notice')}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                            noticeTypeFilter === 'notice'
                              ? 'bg-[#002147] text-white shadow-xs font-bold'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <FileText size={12} />
                          <span>Notices ({notices.filter((n) => n.item_type === 'notice' || !n.item_type).length})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoticeTypeFilter('event')}
                          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                            noticeTypeFilter === 'event'
                              ? 'bg-[#4a6b28] text-white shadow-xs font-bold'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <Calendar size={12} />
                          <span>Events ({notices.filter((n) => n.item_type === 'event').length})</span>
                        </button>
                      </div>

                      <select
                        value={noticeCategoryFilter}
                        onChange={(e) => setNoticeCategoryFilter(e.target.value)}
                        className="border rounded-lg px-2.5 py-1.5 text-xs bg-white text-gray-700"
                      >
                        <option value="ALL">All Categories</option>
                        <option value="Examination">Examination</option>
                        <option value="Official Notice">Official Notice</option>
                        <option value="Administrative Circular">Administrative Circular</option>
                        <option value="Admissions">Admissions</option>
                        <option value="Student Welfare">Student Welfare</option>
                        <option value="Academic Circular">Academic Circular</option>
                        <option value="College Fest">College Fest</option>
                        <option value="Activities">Activities</option>
                        <option value="Events">Events</option>
                      </select>

                      {/* View Mode Switcher: List vs Grid */}
                      <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setNoticeViewMode('list')}
                          className={`px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                            noticeViewMode === 'list'
                              ? 'bg-[#002147] text-white shadow-xs font-bold'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                          title="List View"
                        >
                          <List size={13} />
                          <span>List</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoticeViewMode('grid')}
                          className={`px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                            noticeViewMode === 'grid'
                              ? 'bg-[#002147] text-white shadow-xs font-bold'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                          title="Grid View"
                        >
                          <LayoutGrid size={13} />
                          <span>Grid</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setEditingNotice(null);
                          setNoticeFormData({
                            title: '',
                            item_type: 'notice',
                            category: 'Official Notice',
                            summary: '',
                            content: '',
                            event_date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                            image_url: '',
                            link_url: '',
                            pdf_url: '',
                            pdf_name: '',
                            is_featured: false
                          });
                          setShowNoticeModal(true);
                        }}
                        className="bg-[#002147] hover:bg-[#001733] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <PlusCircle size={14} />
                        <span>+ Official Notice</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingNotice(null);
                          setNoticeFormData({
                            title: '',
                            item_type: 'event',
                            category: 'Events',
                            summary: '',
                            content: '',
                            event_date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                            image_url: '',
                            link_url: '',
                            pdf_url: '',
                            pdf_name: '',
                            is_featured: false
                          });
                          setShowNoticeModal(true);
                        }}
                        className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <PlusCircle size={14} />
                        <span>+ Event</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. PRIMARY LIST / TABLE VIEW */}
                  {noticeViewMode === 'list' && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                          <thead className="bg-[#002147] text-white">
                            <tr>
                              <th className="px-3.5 py-3 font-semibold uppercase tracking-wider text-[10.5px] w-24">Type</th>
                              <th className="px-3.5 py-3 font-semibold uppercase tracking-wider text-[10.5px]">Title &amp; Notice Summary</th>
                              <th className="px-3.5 py-3 font-semibold uppercase tracking-wider text-[10.5px] w-36">Category</th>
                              <th className="px-3.5 py-3 font-semibold uppercase tracking-wider text-[10.5px] w-28">Date</th>
                              <th className="px-3.5 py-3 font-semibold uppercase tracking-wider text-[10.5px] w-32">Attachments</th>
                              <th className="px-3.5 py-3 font-semibold uppercase tracking-wider text-[10.5px] text-center w-36">Showcase</th>
                              <th className="px-3.5 py-3 font-semibold uppercase tracking-wider text-[10.5px] text-right w-24">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 bg-white">
                            {filteredNotices.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                                  <Bell size={24} className="mx-auto mb-2 text-gray-300" />
                                  <p className="font-semibold">No notices or events match the current filter.</p>
                                </td>
                              </tr>
                            ) : (
                              filteredNotices.map((notice) => (
                                <tr key={notice.id} className="hover:bg-slate-50 transition-colors group">
                                  {/* Type */}
                                  <td className="px-3.5 py-3 whitespace-nowrap">
                                    <div className="flex flex-col gap-1 items-start">
                                      <span
                                        className={`inline-block font-extrabold text-[9.5px] px-2 py-0.5 rounded shadow-2xs uppercase tracking-wider ${
                                          notice.item_type === 'event'
                                            ? 'bg-[#4a6b28] text-white'
                                            : 'bg-[#002147] text-white'
                                        }`}
                                      >
                                        {notice.item_type === 'event' ? '🎪 Event' : '📄 Notice'}
                                      </span>
                                      {isNoticeNew(notice) && (
                                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                          NEW
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Title & Summary */}
                                  <td className="px-3.5 py-3">
                                    <div className="flex items-start gap-2.5">
                                      {notice.image_url ? (
                                        <img
                                          src={notice.image_url}
                                          alt={notice.title}
                                          className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0 mt-0.5 bg-gray-50"
                                        />
                                      ) : (
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                                          <Bell size={15} />
                                        </div>
                                      )}
                                      <div className="min-w-0 max-w-lg">
                                        <p className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-[#002147] transition-colors line-clamp-1">
                                          {notice.title}
                                        </p>
                                        <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5 leading-snug">
                                          {notice.summary || notice.content}
                                        </p>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Category */}
                                  <td className="px-3.5 py-3 whitespace-nowrap">
                                    <span className="font-semibold text-gray-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                                      {notice.category}
                                    </span>
                                  </td>

                                  {/* Date */}
                                  <td className="px-3.5 py-3 whitespace-nowrap text-gray-600 font-mono text-[11px]">
                                    {notice.event_date || 'Recent'}
                                  </td>

                                  {/* Attachments */}
                                  <td className="px-3.5 py-3 whitespace-nowrap">
                                    <div className="flex flex-wrap items-center gap-1">
                                      {notice.pdf_url && (
                                        <a
                                          href={notice.pdf_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-[9.5px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-1.5 py-0.5 rounded"
                                          title={notice.pdf_name || 'Download PDF'}
                                        >
                                          <FileText size={10} />
                                          <span>PDF</span>
                                        </a>
                                      )}
                                      {notice.link_url && (
                                        <a
                                          href={notice.link_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-[9.5px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded"
                                        >
                                          <ExternalLink size={10} />
                                          <span>Link</span>
                                        </a>
                                      )}
                                      {notice.image_url && (
                                        <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                          <Image size={10} />
                                          <span>Photo</span>
                                        </span>
                                      )}
                                      {!notice.pdf_url && !notice.link_url && !notice.image_url && (
                                        <span className="text-gray-400 text-[11px]">&mdash;</span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Showcase Pin */}
                                  <td className="px-3.5 py-3 whitespace-nowrap text-center">
                                    {notice.item_type === 'event' ? (
                                      <button
                                        type="button"
                                        onClick={() => handleToggleNoticeFeatured(notice)}
                                        className={`text-[10px] font-bold inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                                          notice.is_featured
                                            ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200 shadow-2xs'
                                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-amber-50 hover:text-amber-800'
                                        }`}
                                      >
                                        <Sparkles size={11} className={notice.is_featured ? 'text-amber-600' : 'text-slate-400'} />
                                        <span>{notice.is_featured ? 'Pinned' : 'Pin'}</span>
                                      </button>
                                    ) : (
                                      <span className="text-[10.5px] font-medium text-gray-400">
                                        Circular
                                      </span>
                                    )}
                                  </td>

                                  {/* Actions */}
                                  <td className="px-3.5 py-3 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => {
                                          setEditingNotice(notice);
                                          setNoticeFormData({
                                            title: notice.title,
                                            item_type: notice.item_type || 'notice',
                                            category: notice.category || 'Official Notice',
                                            summary: notice.summary || '',
                                            content: notice.content || '',
                                            event_date: notice.event_date || '',
                                            image_url: notice.image_url || '',
                                            link_url: notice.link_url || '',
                                            pdf_url: notice.pdf_url || '',
                                            pdf_name: notice.pdf_name || '',
                                            is_featured: Boolean(notice.is_featured)
                                          });
                                          setShowNoticeModal(true);
                                        }}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold p-1 hover:bg-blue-50 rounded cursor-pointer"
                                        title="Edit Notice"
                                      >
                                        <Edit3 size={13} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteNotice(notice.id)}
                                        className="text-xs text-red-600 hover:text-red-800 font-semibold p-1 hover:bg-red-50 rounded cursor-pointer"
                                        title="Delete Notice"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 2. OPTIONAL GRID VIEW */}
                  {noticeViewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredNotices.map((notice) => (
                        <div
                          key={notice.id}
                          className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col hover:border-[#4a6b28] transition-all"
                        >
                          {notice.image_url ? (
                            <div className="h-40 overflow-hidden relative bg-gray-100">
                              <img
                                src={notice.image_url}
                                alt={notice.title}
                                className="w-full h-full object-cover object-center"
                              />
                              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow ${
                                    notice.item_type === 'event'
                                      ? 'bg-[#4a6b28] text-white'
                                      : 'bg-[#002147] text-white'
                                  }`}
                                >
                                  {notice.item_type === 'event' ? '🎪 EVENT' : '📄 NOTICE'}
                                </span>
                                {isNoticeNew(notice) && (
                                  <span className="bg-[#1a4329] text-white text-[9.5px] font-extrabold px-2 py-0.5 rounded-full shadow border border-[#285e3c] flex items-center gap-1" title="Active within 3 days of release">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    NEW
                                  </span>
                                )}
                              </div>
                              {notice.is_featured ? (
                                <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                                  <Sparkles size={10} />
                                  <span>Featured</span>
                                </span>
                              ) : null}
                            </div>
                          ) : (
                            <div className="h-24 bg-gradient-to-br from-[#002858] to-[#0a192f] p-4 flex items-center justify-between text-white relative">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    notice.item_type === 'event'
                                      ? 'bg-[#4a6b28] text-white'
                                      : 'bg-emerald-100 text-[#002147]'
                                  }`}
                                >
                                  {notice.item_type === 'event' ? '🎪 CAMPUS EVENT' : '📄 OFFICIAL NOTICE'}
                                </span>
                                {isNoticeNew(notice) && (
                                  <span className="bg-[#1a4329] text-white text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border border-[#285e3c] flex items-center gap-1" title="Active within 3 days of release">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    NEW
                                  </span>
                                )}
                              </div>
                              <Bell size={18} className="text-[#4a6b28]" />
                            </div>
                          )}

                          <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                            <div>
                              <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono mb-1">
                                <span className="font-bold text-[#4a6b28] uppercase">{notice.category}</span>
                                <span>{notice.event_date || 'Recent'}</span>
                              </div>
                              <h5 className="font-bold text-gray-900 text-sm line-clamp-2">{notice.title}</h5>
                              <p className="text-xs text-gray-600 line-clamp-3 mt-1.5 leading-relaxed">
                                {notice.summary || notice.content}
                              </p>

                              {/* Attachment Badges */}
                              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                                {notice.pdf_url && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                                    <FileText size={10} />
                                    <span>PDF Attached</span>
                                  </span>
                                )}
                                {notice.link_url && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                                    <ExternalLink size={10} />
                                    <span>Form / Link</span>
                                  </span>
                                )}
                                {notice.image_url && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                    <Image size={10} />
                                    <span>Image Scan</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                              <div>
                                {notice.item_type === 'event' && (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleNoticeFeatured(notice)}
                                    className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                      notice.is_featured
                                        ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-800'
                                    }`}
                                    title={notice.is_featured ? 'Click to unpin from Homepage Showcase' : 'Click to pin to Homepage Showcase'}
                                  >
                                    <Sparkles size={11} className={notice.is_featured ? 'text-amber-600' : 'text-slate-400'} />
                                    <span>{notice.is_featured ? 'Pinned to Showcase' : 'Pin to Showcase'}</span>
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setEditingNotice(notice);
                                    setNoticeFormData({
                                      title: notice.title,
                                      item_type: notice.item_type || 'notice',
                                      category: notice.category || 'Official Notice',
                                      summary: notice.summary || '',
                                      content: notice.content || '',
                                      event_date: notice.event_date || '',
                                      image_url: notice.image_url || '',
                                      link_url: notice.link_url || '',
                                      pdf_url: notice.pdf_url || '',
                                      pdf_name: notice.pdf_name || '',
                                      is_featured: Boolean(notice.is_featured)
                                    });
                                    setShowNoticeModal(true);
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit3 size={12} />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteNotice(notice.id)}
                                  className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 size={12} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================
                  MODULE 4: HERO SLIDER SHOWCASE
              ======================================================== */}
              {activeTab === 'hero' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-[#002858] text-sm flex items-center gap-2">
                        <Sliders size={16} className="text-[#4a6b28]" />
                        <span>Homepage Hero Slider Showcase Manager</span>
                      </h4>
                      <p className="text-xs text-gray-500">
                        Configure authentic campus photography displayed in the full-width homepage carousel.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingSlide(null);
                        setSlideFormData({
                          title: '',
                          subtitle: '',
                          image: '',
                          order: heroSlides.length + 1,
                          active: true
                        });
                        setShowHeroModal(true);
                      }}
                      className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <PlusCircle size={14} />
                      <span>Add New Slide</span>
                    </button>
                  </div>

                  {/* Slides List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {heroSlides.map((slide, idx) => (
                      <div
                        key={slide.id}
                        className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col md:flex-row"
                      >
                        <div className="md:w-48 h-36 relative overflow-hidden bg-slate-900 shrink-0">
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover object-center"
                          />
                          <span className="absolute top-2 left-2 bg-black/60 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                            Slide #{idx + 1}
                          </span>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Order: {slide.order || idx + 1}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  slide.active !== false
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                {slide.active !== false ? 'Active' : 'Disabled'}
                              </span>
                            </div>
                            <h5 className="font-bold text-gray-900 text-sm line-clamp-1">{slide.title}</h5>
                            <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                              {slide.subtitle || slide.alt || 'Authentic campus photograph.'}
                            </p>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
                            <button
                              onClick={() => handleToggleSlideActive(slide.id)}
                              className="text-xs text-gray-600 hover:text-gray-900 font-semibold"
                            >
                              {slide.active !== false ? 'Deactivate' : 'Activate'}
                            </button>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingSlide(slide);
                                  setSlideFormData({
                                    title: slide.title || '',
                                    subtitle: slide.subtitle || '',
                                    image: slide.image || '',
                                    order: slide.order || idx + 1,
                                    active: slide.active !== false
                                  });
                                  setShowHeroModal(true);
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                              >
                                <Edit3 size={12} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteSlide(slide.id)}
                                className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                              >
                                <Trash2 size={12} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================
                  MODULE 5: MEDIA & GALLERY HUB
              ======================================================== */}
              {activeTab === 'gallery' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-[#002858] text-sm flex items-center gap-2">
                        <Image size={16} className="text-[#4a6b28]" />
                        <span>Campus Life & Photographic Albums</span>
                      </h4>
                      <p className="text-xs text-gray-500">
                        Curate sports, cultural, NSS outreach, and academic milestone albums.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={galleryAlbumFilter}
                        onChange={(e) => setGalleryAlbumFilter(e.target.value)}
                        className="border rounded-lg px-2.5 py-1.5 text-xs bg-white text-gray-700"
                      >
                        <option value="ALL">All Albums ({galleryItems.length})</option>
                        <option value="Sports & Fitness">Sports & Fitness</option>
                        <option value="Cultural Events">Cultural Events</option>
                        <option value="Trifecta Fest">Trifecta Fest</option>
                        <option value="NSS & Community">NSS & Community</option>
                        <option value="Campus Life">Campus Life</option>
                        <option value="Health & Social">Health & Social</option>
                      </select>

                      <button
                        onClick={() => setShowGalleryModal(true)}
                        className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        <PlusCircle size={14} />
                        <span>Add Photo to Album</span>
                      </button>
                    </div>
                  </div>

                  {/* Photos Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredGallery.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col group hover:border-[#4a6b28] transition-all"
                      >
                        <div
                          onClick={() => setSelectedGalleryPhoto(item)}
                          className="h-44 overflow-hidden relative cursor-pointer bg-slate-900"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 bg-black/60 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                            {item.album}
                          </span>
                        </div>

                        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <h5 className="font-bold text-gray-900 text-xs line-clamp-1">{item.title}</h5>
                            <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{item.caption}</p>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                            <button
                              onClick={() => setSelectedGalleryPhoto(item)}
                              className="text-xs text-blue-600 hover:underline font-semibold"
                            >
                              Expand
                            </button>
                            <button
                              onClick={() => handleDeleteGalleryPhoto(item.id)}
                              className="text-xs text-red-600 hover:text-red-800 font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================
                  MODULE 6: FACULTY & DEPARTMENT MANAGEMENT (STREAM & DEPT TIER)
              ======================================================== */}
              {activeTab === 'faculty' && (() => {
                const currentDeptList =
                  facultyActiveStream === 'ARTS'
                    ? ARTS_DEPARTMENTS
                    : facultyActiveStream === 'SCIENCE'
                    ? SCIENCE_DEPARTMENTS
                    : [];

                const activeDeptObj =
                  currentDeptList.find(
                    (d) =>
                      d.name.toLowerCase().includes(facultyActiveDept.toLowerCase()) ||
                      d.slug.toLowerCase() === facultyActiveDept.toLowerCase()
                  ) || currentDeptList[0] || ARTS_DEPARTMENTS[0];

                const deptFaculty = faculty.filter((f) => {
                  const fDept = (f.department || '').toLowerCase().trim();
                  const targetName = (activeDeptObj?.name || '').toLowerCase().trim();
                  const targetClean = targetName.replace(/^(department of|dept\.? of)\s+/i, '');
                  const targetSlug = (activeDeptObj?.slug || '').toLowerCase().trim();
                  return (
                    fDept === targetName ||
                    fDept === targetClean ||
                    fDept.includes(targetClean) ||
                    targetClean.includes(fDept) ||
                    fDept === targetSlug
                  );
                });

                const currentHOD = deptFaculty.find((f) => Boolean(f.is_hod));
                const otherTeachers = deptFaculty.filter((f) => f.id !== currentHOD?.id);

                return (
                  <div className="space-y-5 animate-fadeIn font-sans">
                    {/* Top Level Stream Selector Bar */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-emerald-100 text-[#4a6b28] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-200">
                              Academic Hierarchy
                            </span>
                            <span className="text-xs text-gray-500 font-semibold">
                              Stream → Department → HOD &amp; Faculty
                            </span>
                          </div>
                          <h4 className="font-black text-[#002147] text-base sm:text-lg flex items-center gap-2">
                            <Users size={19} className="text-[#4a6b28]" />
                            <span>Faculty &amp; Department Manager</span>
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Manage department HODs (pinned top-middle), faculty rosters, and profile photos without confusion.
                          </p>
                        </div>

                        {/* Search & Actions */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <div className="relative">
                            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search all faculty..."
                              value={facultySearch}
                              onChange={(e) => setFacultySearch(e.target.value)}
                              className="pl-7 pr-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#4a6b28] w-36 sm:w-44 bg-white"
                            />
                          </div>

                          <button
                            onClick={() => {
                              setEditingFaculty(null);
                              setFacultyFormData({
                                name: '',
                                stream: facultyActiveStream === 'SCIENCE' ? 'SCIENCE' : 'ARTS',
                                department: activeDeptObj ? activeDeptObj.name.replace('Department of ', '') : 'English',
                                qualification: '',
                                designation: 'Assistant Professor',
                                is_hod: false,
                                image_url: ''
                              });
                              setShowFacultyModal(true);
                            }}
                            className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                          >
                            <UserPlus size={14} />
                            <span>Add Faculty to {activeDeptObj ? activeDeptObj.name.replace('Department of ', '') : 'Dept'}</span>
                          </button>
                        </div>
                      </div>

                      {/* 1. PRIMARY STREAM TABS */}
                      <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 mr-1 uppercase tracking-wider text-[11px]">
                          Stream:
                        </span>
                        {[
                          { id: 'ARTS', label: '🎨 Arts Stream (B.A. Honours)', depts: 7, count: faculty.filter(f => f.stream === 'ARTS').length },
                          { id: 'SCIENCE', label: '🔬 Science Stream (B.Sc. Honours)', depts: 4, count: faculty.filter(f => f.stream === 'SCIENCE').length },
                          { id: 'ALL', label: '📋 All Faculty Master Directory', depts: 11, count: faculty.length }
                        ].map((streamTab) => {
                          const isActive = facultyActiveStream === streamTab.id;
                          return (
                            <button
                              key={streamTab.id}
                              type="button"
                              onClick={() => {
                                setFacultyActiveStream(streamTab.id);
                                if (streamTab.id === 'ARTS') setFacultyActiveDept('English');
                                if (streamTab.id === 'SCIENCE') setFacultyActiveDept('Botany');
                              }}
                              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                                isActive
                                  ? streamTab.id === 'SCIENCE'
                                    ? 'bg-blue-700 text-white shadow-md'
                                    : streamTab.id === 'ALL'
                                    ? 'bg-[#002147] text-white shadow-md'
                                    : 'bg-[#4a6b28] text-white shadow-md'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              <span>{streamTab.label}</span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                                  isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                                }`}
                              >
                                {streamTab.count} Teachers
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* 2. SUB-TIER DEPARTMENT TABS (UNDER ACTIVE STREAM) */}
                      {facultyActiveStream !== 'ALL' && (
                        <div className="pt-3 border-t border-gray-100 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                            <span>Select Department to Edit HOD &amp; Faculty:</span>
                            <span className="text-[10px] text-gray-400 font-normal">
                              HOD = Head of Department Designated
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {currentDeptList.map((dept) => {
                              const deptClean = dept.name.replace('Department of ', '');
                              const isDeptActive =
                                facultyActiveDept.toLowerCase() === dept.slug.toLowerCase() ||
                                facultyActiveDept.toLowerCase() === deptClean.toLowerCase();

                              const deptMembers = faculty.filter((f) => {
                                const fd = (f.department || '').toLowerCase();
                                return fd.includes(deptClean.toLowerCase()) || deptClean.toLowerCase().includes(fd);
                              });
                              const hasHOD = deptMembers.some((f) => Boolean(f.is_hod));

                              return (
                                <button
                                  key={dept.slug}
                                  type="button"
                                  onClick={() => setFacultyActiveDept(deptClean)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                                    isDeptActive
                                      ? 'bg-amber-100 text-amber-950 border-amber-400 shadow-xs ring-2 ring-amber-300/40'
                                      : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                                  }`}
                                >
                                  {hasHOD && (
                                    <Award size={12} className="text-amber-600 shrink-0" title="HOD Assigned" />
                                  )}
                                  <span>{deptClean}</span>
                                  <span
                                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                                      isDeptActive
                                        ? 'bg-amber-200 text-amber-900'
                                        : 'bg-gray-100 text-gray-500'
                                    }`}
                                  >
                                    {deptMembers.length}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* VIEW MODE A: SINGLE DEPARTMENT WORKSTATION (HOD IN TOP MIDDLE + FACULTY BELOW) */}
                    {facultyActiveStream !== 'ALL' && activeDeptObj && (
                      <div className="space-y-6">
                        {/* Department Banner & Live Page Link */}
                        <div className="bg-gradient-to-r from-[#001736] via-[#002147] to-[#001736] text-white p-5 rounded-2xl shadow-sm border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-[#4a6b28] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                                {activeDeptObj.stream === 'ARTS' ? '🎨 Arts Stream' : '🔬 Science Stream'}
                              </span>
                              <span className="text-xs text-slate-300 font-mono">
                                Code: {activeDeptObj.code} • FYUGP 4-Year Honours
                              </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-white">
                              {activeDeptObj.name}
                            </h3>
                            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                              {activeDeptObj.tagline}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => window.open(`/department/${activeDeptObj.slug}`, '_blank')}
                              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                              title="Open public department page"
                            >
                              <span>View Live Page</span>
                              <ExternalLink size={13} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingFaculty(null);
                                setFacultyFormData({
                                  name: '',
                                  stream: facultyActiveStream === 'SCIENCE' ? 'SCIENCE' : 'ARTS',
                                  department: activeDeptObj.name.replace('Department of ', ''),
                                  qualification: '',
                                  designation: 'Assistant Professor',
                                  is_hod: false,
                                  image_url: ''
                                });
                                setShowFacultyModal(true);
                              }}
                              className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                            >
                              <UserPlus size={14} />
                              <span>Add Faculty</span>
                            </button>
                          </div>
                        </div>

                        {/* SECTION 1: PROMINENT TOP-MIDDLE HOD SPOTLIGHT */}
                        <div>
                          <div className="text-center max-w-md mx-auto mb-3">
                            <h4 className="text-base sm:text-lg font-black text-[#002147]">
                              Head of Department (HOD)
                            </h4>
                            <p className="text-[11px] text-gray-500">
                              Appears prominently in top-middle on the public {activeDeptObj.name} page.
                            </p>
                          </div>

                          <div className="max-w-2xl mx-auto">
                            {currentHOD ? (
                              <div className="bg-gradient-to-br from-white via-white to-amber-50/50 rounded-2xl border-2 border-amber-400 shadow-md p-5 sm:p-6 relative">
                                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow-xs flex items-center gap-1">
                                  <Award size={12} />
                                  <span>HEAD OF DEPARTMENT</span>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                                  {/* HOD Photo */}
                                  <div className="shrink-0 relative">
                                    {currentHOD.image_url ? (
                                      <img
                                        src={currentHOD.image_url}
                                        alt={currentHOD.name}
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-400 shadow-sm"
                                      />
                                    ) : (
                                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#002147] to-[#001736] text-[#8fc35e] font-black text-2xl flex items-center justify-center border-2 border-amber-400 shadow-sm">
                                        {currentHOD.name ? currentHOD.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('') : 'CC'}
                                      </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-1 shadow-xs border border-white">
                                      <Check size={12} />
                                    </div>
                                  </div>

                                  {/* HOD Credentials & Actions */}
                                  <div className="flex-1 space-y-1.5 min-w-0">
                                    <h4 className="text-lg sm:text-xl font-black text-[#002147] truncate">
                                      {currentHOD.name}
                                    </h4>
                                    <p className="text-xs font-bold text-[#4a6b28]">
                                      {currentHOD.qualification || 'M.A. / M.Sc., UGC-NET'}
                                    </p>
                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                                      {currentHOD.designation}
                                    </p>
                                    <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                      <button
                                        onClick={() => {
                                          setEditingFaculty(currentHOD);
                                          setFacultyFormData({
                                            name: currentHOD.name || '',
                                            stream: currentHOD.stream || 'ARTS',
                                            department: currentHOD.department || 'English',
                                            qualification: currentHOD.qualification || '',
                                            designation: currentHOD.designation || 'Head of Department',
                                            is_hod: true,
                                            image_url: currentHOD.image_url || ''
                                          });
                                          setShowFacultyModal(true);
                                        }}
                                        className="bg-[#002147] hover:bg-[#001736] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                                      >
                                        <Edit3 size={13} />
                                        <span>Edit HOD Profile &amp; Photo</span>
                                      </button>
                                      <button
                                        onClick={() => handleSetHOD(currentHOD.id, false)}
                                        className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                                        title="Demote to regular faculty member"
                                      >
                                        Remove HOD Role
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-amber-50/60 rounded-2xl border-2 border-dashed border-amber-300 p-6 text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-2xs">
                                  <Award size={20} className="text-amber-700" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-amber-950">
                                    No Head of Department Assigned Yet
                                  </h4>
                                  <p className="text-xs text-amber-800 max-w-md mx-auto mt-0.5">
                                    Assign an existing faculty member as HOD below, or add a new faculty member with HOD designation.
                                  </p>
                                </div>
                                <button
                                  onClick={() => {
                                    setEditingFaculty(null);
                                    setFacultyFormData({
                                      name: '',
                                      stream: facultyActiveStream === 'SCIENCE' ? 'SCIENCE' : 'ARTS',
                                      department: activeDeptObj.name.replace('Department of ', ''),
                                      qualification: '',
                                      designation: 'Head of Department & Assistant Professor',
                                      is_hod: true,
                                      image_url: ''
                                    });
                                    setShowFacultyModal(true);
                                  }}
                                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                                >
                                  <UserPlus size={14} />
                                  <span>+ Add New Head of Department (HOD)</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* SECTION 2: DEPARTMENT FACULTY MEMBERS (BELOW HOD) */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                            <div>
                              <h4 className="font-black text-[#002147] text-base flex items-center gap-2">
                                <Users size={17} className="text-[#4a6b28]" />
                                <span>Department Faculty Members &amp; Teachers</span>
                                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                                  {otherTeachers.length} Teaching Staff
                                </span>
                              </h4>
                              <p className="text-xs text-gray-500">
                                Assistant professors and lecturers teaching in {activeDeptObj.name}.
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                setEditingFaculty(null);
                                setFacultyFormData({
                                  name: '',
                                  stream: facultyActiveStream === 'SCIENCE' ? 'SCIENCE' : 'ARTS',
                                  department: activeDeptObj.name.replace('Department of ', ''),
                                  qualification: '',
                                  designation: 'Assistant Professor',
                                  is_hod: false,
                                  image_url: ''
                                });
                                setShowFacultyModal(true);
                              }}
                              className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer self-start sm:self-auto"
                            >
                              <UserPlus size={13} />
                              <span>+ Add Teacher to {activeDeptObj.name.replace('Department of ', '')}</span>
                            </button>
                          </div>

                          {otherTeachers.length === 0 ? (
                            <div className="py-8 text-center text-gray-400 text-xs bg-gray-50 rounded-xl border border-dashed border-gray-200">
                              No other faculty members in this department yet. Click '+ Add Teacher' above to add one.
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {otherTeachers.map((teacher) => (
                                <div
                                  key={teacher.id}
                                  className="bg-gray-50/70 hover:bg-white rounded-2xl border border-gray-200 hover:border-[#4a6b28]/50 p-4 transition-all shadow-2xs hover:shadow-sm flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="flex items-center gap-3 mb-2.5">
                                      {teacher.image_url ? (
                                        <img
                                          src={teacher.image_url}
                                          alt={teacher.name}
                                          className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-600/30 shadow-2xs ring-1 ring-emerald-500/20 shrink-0"
                                        />
                                      ) : (
                                        <div className="w-12 h-12 rounded-xl bg-[#002147]/10 text-[#002147] font-bold text-xs flex items-center justify-center border border-gray-200 shrink-0">
                                          {teacher.name ? teacher.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('') : 'CC'}
                                        </div>
                                      )}
                                      <div className="min-w-0 flex-1">
                                        <h5 className="font-bold text-gray-900 text-sm truncate">
                                          {teacher.name}
                                        </h5>
                                        <p className="text-xs font-semibold text-[#4a6b28] truncate">
                                          {teacher.designation || 'Assistant Professor'}
                                        </p>
                                        <p className="text-[11px] text-gray-500 font-mono truncate">
                                          {teacher.qualification || '—'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="pt-3 border-t border-gray-200/70 flex items-center justify-between gap-1.5 text-xs">
                                      <button
                                        onClick={() => handleSetHOD(teacher.id, true)}
                                        className="text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded-md border border-amber-300 transition-colors cursor-pointer flex items-center gap-1"
                                        title="Designate this teacher as Head of Department"
                                      >
                                        <Award size={11} className="text-amber-700" />
                                        <span>Designate HOD</span>
                                      </button>
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => {
                                          setEditingFaculty(teacher);
                                          setFacultyFormData({
                                            name: teacher.name || '',
                                            stream: teacher.stream || 'ARTS',
                                            department: teacher.department || 'English',
                                            qualification: teacher.qualification || '',
                                            designation: teacher.designation || 'Assistant Professor',
                                            is_hod: false,
                                            image_url: teacher.image_url || ''
                                          });
                                          setShowFacultyModal(true);
                                        }}
                                        className="text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md border border-blue-200 cursor-pointer"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteFaculty(teacher.id)}
                                        className="text-[11px] font-semibold text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md border border-red-200 cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* VIEW MODE B: MASTER DIRECTORY (ALL FACULTY TABLE) */}
                    {facultyActiveStream === 'ALL' && (
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-[#002147] text-sm">
                              Master Faculty Roster ({filteredFaculty.length} Total)
                            </h4>
                            <p className="text-xs text-gray-500">
                              Comprehensive directory spanning all academic streams and departments.
                            </p>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                            <thead className="bg-[#002858] text-white">
                              <tr>
                                <th className="px-4 py-3 font-semibold text-center w-14">Photo</th>
                                <th className="px-4 py-3 font-semibold">Faculty / Professor Name</th>
                                <th className="px-4 py-3 font-semibold">Concern Department</th>
                                <th className="px-4 py-3 font-semibold">Designation</th>
                                <th className="px-4 py-3 font-semibold">Qualifications</th>
                                <th className="px-4 py-3 font-semibold text-center">Role / Status</th>
                                <th className="px-4 py-3 font-semibold text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {filteredFaculty.length === 0 ? (
                                <tr>
                                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                                    No faculty members found matching search query.
                                  </td>
                                </tr>
                              ) : (
                                filteredFaculty.map((f) => (
                                  <tr key={f.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-4 py-3 text-center">
                                      {f.image_url ? (
                                        <img
                                          src={f.image_url}
                                          alt={f.name}
                                          className="w-10 h-10 rounded-full object-cover border-2 border-emerald-600/30 shadow-2xs mx-auto ring-1 ring-emerald-500/20"
                                        />
                                      ) : (
                                        <div className="w-10 h-10 rounded-full bg-[#002858]/10 text-[#002858] font-bold text-xs flex items-center justify-center border border-gray-200 mx-auto">
                                          {f.name ? f.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('') : 'CC'}
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                                        <span>{f.name}</span>
                                        {f.is_hod && (
                                          <span className="bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.5 rounded text-[9px] border border-amber-300">
                                            HOD
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-gray-400">
                                        {f.image_url ? (
                                          <span className="text-emerald-600 font-medium">✓ Photo uploaded</span>
                                        ) : (
                                          <span className="text-amber-600 font-medium">No photo set</span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className="font-semibold text-gray-800 block">{f.department}</span>
                                      <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                                        f.stream === 'SCIENCE' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      }`}>
                                        {f.stream} STREAM
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 font-medium">{f.designation}</td>
                                    <td className="px-4 py-3 text-gray-500 font-mono text-[11px]">{f.qualification || '—'}</td>
                                    <td className="px-4 py-3 text-center">
                                      {f.is_hod ? (
                                        <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px] border border-amber-300 inline-block">
                                          Head of Dept
                                        </span>
                                      ) : (
                                        <span className="text-gray-400 text-[11px]">Faculty</span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          onClick={() => {
                                            setEditingFaculty(f);
                                            setFacultyFormData({
                                              name: f.name || '',
                                              stream: f.stream || 'ARTS',
                                              department: f.department || 'English',
                                              qualification: f.qualification || '',
                                              designation: f.designation || 'Assistant Professor',
                                              is_hod: Boolean(f.is_hod),
                                              image_url: f.image_url || ''
                                            });
                                            setShowFacultyModal(true);
                                          }}
                                          className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-md border border-blue-200 cursor-pointer"
                                        >
                                          Edit &amp; Photo
                                        </button>
                                        <button
                                          onClick={() => handleDeleteFaculty(f.id)}
                                          className="text-xs bg-red-50 hover:bg-red-100 text-red-700 font-semibold px-2.5 py-1 rounded-md border border-red-200 cursor-pointer"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ========================================================
                  MODULE: GOVERNING BODY & COUNCIL LEADERSHIP
              ======================================================== */}
              {/* ========================================================
                  MODULE: LEADERSHIP & GOVERNANCE (REQUEST 4 & 9)
              ======================================================== */}
              {activeTab === 'governing' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Top Bar with Sub-tabs and Actions */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-[#002147] text-base flex items-center gap-2">
                          <Landmark size={18} className="text-[#4a6b28]" />
                          <span>Leadership, Governance & Management Administration</span>
                        </h4>
                        <p className="text-xs text-gray-500">
                          Upload profile photos and manage members across Board of Management, College Administration, and Governing Body Council.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Search */}
                        <div className="relative">
                          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search leaders by name/role..."
                            value={governingSearch}
                            onChange={(e) => setGoverningSearch(e.target.value)}
                            className="pl-7 pr-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#4a6b28] w-44 sm:w-56 bg-white"
                          />
                        </div>

                        {/* Classification Dropdown */}
                        <select
                          value={governingTypeFilter}
                          onChange={(e) => setGoverningTypeFilter(e.target.value)}
                          className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white text-gray-700 font-medium"
                        >
                          <option value="ALL">All Classifications</option>
                          <option value="MANAGEMENT">Board of Management</option>
                          <option value="ADMINISTRATION">College Administration</option>
                          <option value="OFFICER">Council Executive Officers</option>
                          <option value="MEMBER">Governing Body Members</option>
                        </select>

                        <button
                          onClick={() => {
                            setEditingGoverningMember(null);
                            const defaultType = governingSubTab !== 'ALL' ? governingSubTab : 'MANAGEMENT';
                            setGoverningFormData({
                              name: '',
                              role: defaultType === 'MANAGEMENT' ? 'Board Member' : defaultType === 'ADMINISTRATION' ? 'Principal' : 'Council Member',
                              category: defaultType === 'MANAGEMENT' ? 'Sponsorship & Management' : defaultType === 'ADMINISTRATION' ? 'Administration' : 'Council Member',
                              affiliation: '',
                              member_type: defaultType,
                              order_index: governingBody.length + 1,
                              image_url: ''
                            });
                            setShowGoverningModal(true);
                          }}
                          className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <UserPlus size={14} />
                          <span>Add Leadership Member</span>
                        </button>
                      </div>
                    </div>

                    {/* Sub-Tabs: All / Board of Management / College Administration / Governing Body Council */}
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                      {[
                        { id: 'ALL', label: 'All Leadership', count: governingBody.length },
                        { id: 'MANAGEMENT', label: 'Board of Management', count: governingBody.filter((m) => m.member_type === 'MANAGEMENT').length },
                        { id: 'ADMINISTRATION', label: 'College Administration', count: governingBody.filter((m) => m.member_type === 'ADMINISTRATION').length },
                        { id: 'COUNCIL', label: 'Governing Body Council', count: governingBody.filter((m) => m.member_type === 'MEMBER' || m.member_type === 'OFFICER' || !m.member_type).length }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setGoverningSubTab(tab.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            governingSubTab === tab.id
                              ? 'bg-[#002147] text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-gray-700'
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            governingSubTab === tab.id ? 'bg-[#4a6b28] text-white' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {tab.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Governing Body Table */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                        <thead className="bg-[#002147] text-white">
                          <tr>
                            <th className="px-4 py-3 font-semibold text-center w-16">Photo</th>
                            <th className="px-4 py-3 font-semibold">Leader / Officer Name</th>
                            <th className="px-4 py-3 font-semibold">Leadership Role</th>
                            <th className="px-4 py-3 font-semibold">Classification & Domain</th>
                            <th className="px-4 py-3 font-semibold">Affiliation / Background</th>
                            <th className="px-4 py-3 font-semibold text-center">Photo Status</th>
                            <th className="px-4 py-3 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredGoverning.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                                No leaders or council members found matching your search.
                              </td>
                            </tr>
                          ) : (
                            filteredGoverning.map((m) => (
                              <tr key={m.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="px-4 py-3 text-center">
                                  {m.image_url ? (
                                    <img
                                      src={m.image_url}
                                      alt={m.name}
                                      className="w-10 h-10 rounded-xl object-cover border border-emerald-600 shadow-2xs mx-auto"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#002147] to-[#4a6b28] text-white font-extrabold flex items-center justify-center text-xs mx-auto shadow-2xs">
                                      {m.name.split(' ').map((n) => n[0]).filter(Boolean).slice(0, 2).join('')}
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                                    <span>{m.name}</span>
                                    {m.member_type === 'MANAGEMENT' && (
                                      <span className="bg-emerald-100 text-emerald-900 text-[9px] font-black px-1.5 py-0.2 rounded border border-emerald-300">
                                        MANAGEMENT
                                      </span>
                                    )}
                                    {m.member_type === 'ADMINISTRATION' && (
                                      <span className="bg-blue-100 text-blue-900 text-[9px] font-black px-1.5 py-0.2 rounded border border-blue-300">
                                        ADMIN
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-gray-400">ID #{m.id} • Order: {m.order_index}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`inline-block font-extrabold px-2.5 py-0.5 rounded-full text-[11px] ${
                                      m.member_type === 'MANAGEMENT'
                                        ? 'bg-[#4a6b28] text-white'
                                        : m.member_type === 'ADMINISTRATION'
                                        ? 'bg-[#002147] text-white'
                                        : m.member_type === 'OFFICER'
                                        ? 'bg-[#002147] text-white'
                                        : 'bg-slate-100 text-gray-800 border border-slate-200'
                                    }`}
                                  >
                                    {m.role}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                                      {m.category || 'Council Member'}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium capitalize">
                                      {m.member_type ? m.member_type.toLowerCase() : 'Council'}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 max-w-xs text-gray-600 truncate text-[11px]" title={m.affiliation}>
                                  {m.affiliation}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {m.image_url ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                      <CheckCircle size={10} />
                                      <span>Photo Added</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                                      Monogram (No Photo)
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingGoverningMember(m);
                                        setGoverningFormData({
                                          name: m.name || '',
                                          role: m.role || 'Member',
                                          category: m.category || 'Council Member',
                                          affiliation: m.affiliation || '',
                                          member_type: m.member_type || 'MEMBER',
                                          order_index: m.order_index || 0,
                                          image_url: m.image_url || ''
                                        });
                                        setShowGoverningModal(true);
                                      }}
                                      className="text-xs bg-emerald-50 hover:bg-emerald-100 text-[#4a6b28] font-bold px-2.5 py-1 rounded-md border border-emerald-200 cursor-pointer flex items-center gap-1"
                                    >
                                      <Edit3 size={12} />
                                      <span>Edit / Photo</span>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteGoverning(m.id)}
                                      className="text-xs bg-red-50 hover:bg-red-100 text-red-700 font-semibold px-2 py-1 rounded-md border border-red-200 cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  MODULE 7: ACADEMIC PROGRAMMES (COURSES)
              ======================================================== */}
              {activeTab === 'courses' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-[#002858] text-sm flex items-center gap-2">
                        <BookOpen size={16} className="text-[#4a6b28]" />
                        <span>FYUGP Academic Courses & Honours Programmes</span>
                      </h4>
                      <p className="text-xs text-gray-500">
                        Four Years Under Graduate Programme (FYUGP) affiliated to Nagaland University.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={courseStreamFilter}
                        onChange={(e) => setCourseStreamFilter(e.target.value)}
                        className="border rounded-lg px-2.5 py-1.5 text-xs bg-white text-gray-700"
                      >
                        <option value="ALL">All Streams</option>
                        <option value="ARTS">Arts Programmes</option>
                        <option value="SCIENCE">Science Programmes</option>
                      </select>

                      <button
                        onClick={() => {
                          setEditingCourse(null);
                          setCourseFormData({
                            course_name: '',
                            stream: 'ARTS',
                            degree_type: 'Four Years Under Graduate Programme (FYUGP)',
                            description: '',
                            eligibility: '10+2 / HSSLC passed from recognized board',
                            duration: '4 Years (8 Semesters)'
                          });
                          setShowCourseModal(true);
                        }}
                        className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        <PlusCircle size={14} />
                        <span>Add Academic Course</span>
                      </button>
                    </div>
                  </div>

                  {/* Courses Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCourses.map((c) => (
                      <div
                        key={c.id}
                        className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex flex-col justify-between space-y-3 hover:border-[#4a6b28] transition-all"
                      >
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                c.stream === 'ARTS'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-blue-100 text-blue-900'
                              }`}
                            >
                              {c.stream} STREAM
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">{c.duration || '4 Years'}</span>
                          </div>

                          <h5 className="font-bold text-gray-900 text-base">{c.course_name}</h5>
                          <p className="text-[11px] font-semibold text-gray-500 mt-0.5">{c.degree_type}</p>
                          <p className="text-xs text-gray-600 line-clamp-3 mt-2 leading-relaxed">
                            {c.description || 'Comprehensive curriculum aligned with NEP 2020 guidelines.'}
                          </p>

                          <div className="mt-3 p-2.5 bg-gray-50 rounded-xl text-[11px] text-gray-600 border border-gray-100">
                            <span className="font-bold text-[#002858] block">Eligibility:</span>
                            <span>{c.eligibility}</span>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => {
                              setEditingCourse(c);
                              setCourseFormData({
                                course_name: c.course_name,
                                stream: c.stream,
                                degree_type: c.degree_type,
                                description: c.description || '',
                                eligibility: c.eligibility || '',
                                duration: c.duration || '4 Years (8 Semesters)'
                              });
                              setShowCourseModal(true);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                          >
                            <Edit3 size={12} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(c.id)}
                            className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================
                  MODULE 8: CONTACT INQUIRIES
              ======================================================== */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-[#002858] text-sm flex items-center gap-2">
                        <Mail size={16} className="text-[#4a6b28]" />
                        <span>Student & Visitor Inquiries Desk</span>
                      </h4>
                      <p className="text-xs text-gray-500">
                        Messages submitted via the public contact forms and admission helpdesk.
                      </p>
                    </div>

                    <select
                      value={inquiryStatusFilter}
                      onChange={(e) => setInquiryStatusFilter(e.target.value)}
                      className="border rounded-lg px-2.5 py-1.5 text-xs bg-white text-gray-700"
                    >
                      <option value="ALL">All Inquiries ({inquiries.length})</option>
                      <option value="UNREAD">Unread Messages</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  </div>

                  {/* Inquiries Table */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                        <thead className="bg-[#002858] text-white">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Sender Name</th>
                            <th className="px-4 py-3 font-semibold">Contact Details</th>
                            <th className="px-4 py-3 font-semibold">Subject / Topic</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 font-semibold">Received</th>
                            <th className="px-4 py-3 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredInquiries.length > 0 ? (
                            filteredInquiries.map((inq) => (
                              <tr key={inq.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-bold text-gray-900">{inq.full_name}</td>
                                <td className="px-4 py-3 text-gray-600 text-[11px]">
                                  <div>{inq.email}</div>
                                  <div className="text-gray-400">{inq.phone || 'No phone'}</div>
                                </td>
                                <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">
                                  {inq.subject}
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                      inq.status === 'RESOLVED'
                                        ? 'bg-green-100 text-green-800'
                                        : inq.status === 'CONTACTED'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-rose-100 text-rose-800'
                                    }`}
                                  >
                                    {inq.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-gray-400 text-[11px] font-mono">{inq.created_at}</td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => setViewInquiry(inq)}
                                      className="text-xs text-blue-600 hover:underline font-semibold"
                                    >
                                      Read
                                    </button>
                                    <a
                                      href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)}`}
                                      className="text-xs text-[#4a6b28] hover:underline font-semibold"
                                    >
                                      Reply
                                    </a>
                                    <button
                                      onClick={() => handleDeleteInquiry(inq.id)}
                                      className="text-xs text-red-600 hover:underline font-semibold"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="text-center py-8 text-gray-400 text-xs">
                                No inquiries match the selected criteria.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  MODULE 9: STAFF USERS & RBAC MATRIX
              ======================================================== */}
              {activeTab === 'users' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-[#002858] text-sm flex items-center gap-2">
                        <ShieldCheck size={16} className="text-[#4a6b28]" />
                        <span>Administrative Users & Role-Based Access Control (RBAC)</span>
                      </h4>
                      <p className="text-xs text-gray-500">
                        Manage privileged administrative credentials and authorization levels.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAddUserModal(true)}
                      className="bg-[#002858] hover:bg-[#001c3d] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <UserPlus size={14} />
                      <span>Register Staff User</span>
                    </button>
                  </div>

                  {/* Registered Users Table */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                        <thead className="bg-[#002858] text-white">
                          <tr>
                            <th className="px-4 py-3 font-semibold">User ID</th>
                            <th className="px-4 py-3 font-semibold">Username</th>
                            <th className="px-4 py-3 font-semibold">Full Name / Title</th>
                            <th className="px-4 py-3 font-semibold">Email</th>
                            <th className="px-4 py-3 font-semibold">Assigned Role</th>
                            <th className="px-4 py-3 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {adminUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 font-mono text-gray-500">#{u.id}</td>
                              <td className="px-4 py-3 font-mono font-bold text-[#002858] flex items-center gap-1.5">
                                <ShieldCheck size={13} className="text-[#4a6b28]" />
                                <span>{u.username}</span>
                              </td>
                              <td className="px-4 py-3 font-semibold text-gray-900">{u.full_name}</td>
                              <td className="px-4 py-3 text-gray-600">{u.email}</td>
                              <td className="px-4 py-3">
                                <select
                                  value={u.role || 'ADMIN'}
                                  onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                                  className="border rounded px-2 py-1 text-xs font-bold font-mono bg-white text-gray-800"
                                >
                                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                  <option value="ADMIN">ADMIN</option>
                                  <option value="ADMISSIONS_ADMIN">ADMISSIONS_ADMIN</option>
                                  <option value="NEWS_ADMIN">NEWS_ADMIN</option>
                                  <option value="MEDIA_ADMIN">MEDIA_ADMIN</option>
                                  <option value="ACADEMICS_ADMIN">ACADEMICS_ADMIN</option>
                                </select>
                              </td>
                              <td className="px-4 py-3 text-right">
                                {u.username !== 'admin' && (
                                  <button
                                    onClick={() => handleDeleteUser(u.id, u.username)}
                                    className="text-xs text-red-600 hover:text-red-800 font-semibold"
                                  >
                                    Delete
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* RBAC PERMISSION MATRIX TABLE */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                    <h5 className="font-bold text-[#002858] text-sm flex items-center gap-2">
                      <Layers size={16} className="text-[#4a6b28]" />
                      <span>Role-Based Access Control (RBAC) Privilege Matrix</span>
                    </h5>
                    <p className="text-xs text-gray-500">
                      Exact permissions breakdown per assigned institutional role matching enterprise governance standards.
                    </p>

                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs text-left divide-y divide-gray-200 border border-gray-100 rounded-xl overflow-hidden">
                        <thead className="bg-gray-100 font-bold text-gray-700">
                          <tr>
                            <th className="p-3">Institutional Role</th>
                            <th className="p-3 text-center">Dashboard</th>
                            <th className="p-3 text-center">Admissions</th>
                            <th className="p-3 text-center">News / Events</th>
                            <th className="p-3 text-center">Hero Slider</th>
                            <th className="p-3 text-center">Media Gallery</th>
                            <th className="p-3 text-center">Faculty</th>
                            <th className="p-3 text-center">Courses</th>
                            <th className="p-3 text-center">User Management</th>
                            <th className="p-3 text-center">DB Monitor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                          <tr className="bg-amber-50/40">
                            <td className="p-3 font-bold text-amber-900">SUPER_ADMIN</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓ Full</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓ Full</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-[#002858]">ADMIN</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-blue-800">ADMISSIONS_ADMIN</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓ Full</td>
                            <td className="p-3 text-center text-gray-300">—</td>
                            <td className="p-3 text-center text-gray-300">—</td>
                            <td className="p-3 text-center text-gray-300">—</td>
                            <td className="p-3 text-center text-gray-300">—</td>
                            <td className="p-3 text-center text-gray-300">—</td>
                            <td className="p-3 text-center text-gray-300">—</td>
                            <td className="p-3 text-center text-gray-300">—</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-emerald-800">NEWS_ADMIN</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-gray-300">—</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓ Full</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-gray-300">—</td>
                            <td className="p-3 text-center text-gray-300">—</td>
                            <td className="p-3 text-center text-gray-300">—</td>
                            <td className="p-3 text-center text-gray-300">—</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-purple-800">ACADEMICS_ADMIN</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                            <td className="p-3 text-center text-gray-300">—</td>
                            <td className="p-3 text-center text-gray-300">—</td>
                            <td className="p-3 text-center text-gray-300">—</td>
                            <td className="p-3 text-center text-gray-300">—</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓ Full</td>
                            <td className="p-3 text-center text-emerald-600 font-bold">✓ Full</td>
                            <td className="p-3 text-center text-gray-300">—</td>
                            <td className="p-3 text-center text-gray-300">—</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  MODULE 10: SITE SETTINGS & CONFIG
              ======================================================== */}
              {activeTab === 'settings' && (
                <div className="space-y-4 animate-fadeIn max-w-4xl">
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-bold text-[#002858] text-base flex items-center gap-2">
                          <Settings size={18} className="text-[#4a6b28]" />
                          <span>Institutional Site Settings & Contact Coordinates</span>
                        </h4>
                        <p className="text-xs text-gray-500">
                          Configure public contact numbers, email addresses, and campus timings.
                        </p>
                      </div>

                      {settingsSaved && (
                        <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full animate-fadeIn shadow-xs border border-emerald-200">
                          ✓ Settings Saved!
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">College Name</label>
                          <input
                            type="text"
                            value={siteSettings.collegeName || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, collegeName: e.target.value })}
                            className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">University Affiliation</label>
                          <input
                            type="text"
                            value={siteSettings.affiliation || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, affiliation: e.target.value })}
                            className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Primary Contact Phone</label>
                          <input
                            type="text"
                            value={siteSettings.phone1 || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, phone1: e.target.value })}
                            className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Secondary / Admission Helpline</label>
                          <input
                            type="text"
                            value={siteSettings.phone2 || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, phone2: e.target.value })}
                            className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Official Institutional Email</label>
                          <input
                            type="email"
                            value={siteSettings.email1 || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, email1: e.target.value })}
                            className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Office Working Hours</label>
                          <input
                            type="text"
                            value={siteSettings.officeHours || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, officeHours: e.target.value })}
                            className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28]"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block font-bold text-gray-700 mb-1">Full Campus Address</label>
                          <textarea
                            rows={2}
                            value={siteSettings.address || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                            className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Facebook Handle / URL</label>
                          <input
                            type="text"
                            value={siteSettings.facebookUrl || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, facebookUrl: e.target.value })}
                            className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">Instagram Handle / URL</label>
                          <input
                            type="text"
                            value={siteSettings.instagramUrl || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, instagramUrl: e.target.value })}
                            className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-3 border-t">
                        <button
                          type="submit"
                          className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow"
                        >
                          Save Institutional Settings
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Contact Us Page: Telephonic Assistance Card Configuration */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                          <Phone size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#002147] text-base flex items-center gap-2">
                            <span>Contact Us Page: Telephonic &amp; General Assistance Card</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                              siteSettings.showTelephonicAssistance
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}>
                              {siteSettings.showTelephonicAssistance ? '● VISIBLE ON CONTACT US' : '○ CURRENTLY HIDDEN'}
                            </span>
                          </h4>
                          <p className="text-xs text-gray-500">
                            Control whether the Telephonic &amp; General Assistance card appears on the public Contact Us page, and customize the numbers.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...siteSettings, showTelephonicAssistance: !siteSettings.showTelephonicAssistance };
                          setSiteSettings(updated);
                          localStorage.setItem('cche_site_settings', JSON.stringify(updated));
                          apiFetch('/api/settings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ contact_show_assistance: updated.showTelephonicAssistance ? 'true' : 'false' })
                          }).catch(() => {});
                          setSettingsSaved(true);
                          setTimeout(() => setSettingsSaved(false), 2000);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2 ${
                          siteSettings.showTelephonicAssistance
                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                            : 'bg-[#4a6b28] hover:bg-[#3d5920] text-white'
                        }`}
                      >
                        <Power size={14} />
                        <span>{siteSettings.showTelephonicAssistance ? 'Disable / Hide Card' : 'Enable Card on Live Page'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">College Landline</label>
                        <input
                          type="text"
                          placeholder="+91 370 2244101"
                          value={siteSettings.landlinePhone || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, landlinePhone: e.target.value })}
                          className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28] text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Admissions Desk Phone</label>
                        <input
                          type="text"
                          placeholder="+91 94360 00000"
                          value={siteSettings.admissionsPhone || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, admissionsPhone: e.target.value })}
                          className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28] text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">General Assistance Email</label>
                        <input
                          type="email"
                          placeholder="cchekma@gmail.com"
                          value={siteSettings.generalEmail || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, generalEmail: e.target.value })}
                          className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28] text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t text-xs">
                      <span className="text-[11px] text-gray-500">
                        {siteSettings.showTelephonicAssistance
                          ? '✅ This assistance card is currently active and visible to website visitors.'
                          : 'ℹ️ This card is currently hidden from the public website as requested.'}
                      </span>
                      <button
                        type="button"
                        onClick={handleSaveSettings}
                        className="bg-[#002147] hover:bg-[#4a6b28] text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                      >
                        Save Assistance Numbers
                      </button>
                    </div>
                  </div>

                  {/* Outgoing Mail Dispatch & SMTP Configuration Card */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                          <Mail size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#002147] text-base flex items-center gap-2">
                            <span>Contact Us Form Email Notifications &amp; SMTP Server</span>
                            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                              EMAIL DISPATCH
                            </span>
                          </h4>
                          <p className="text-xs text-gray-500">
                            Configure SMTP mail server credentials so user queries are delivered directly to{' '}
                            <strong className="text-[#002147] font-bold">support@excellogics.co.in</strong>.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleTestEmail}
                          disabled={testingEmail}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
                        >
                          {testingEmail ? (
                            <>
                              <RefreshCw size={13} className="animate-spin" />
                              <span>Dispatching Test Mail...</span>
                            </>
                          ) : (
                            <>
                              <Send size={13} />
                              <span>Test Email Dispatch</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Test Email Result Banner */}
                    {testEmailResult && (
                      <div
                        className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 border animate-fadeIn ${
                          testEmailResult.success
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-red-50 border-red-300 text-red-800'
                        }`}
                      >
                        {testEmailResult.success ? (
                          <CheckCircle size={16} className="shrink-0 text-emerald-600 mt-0.5" />
                        ) : (
                          <AlertCircle size={16} className="shrink-0 text-red-600 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold">{testEmailResult.success ? 'Success!' : 'SMTP Connection Diagnostic:'}</p>
                          <p className="mt-0.5 leading-relaxed">{testEmailResult.message}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          Notification Recipient Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={siteSettings.notification_email || 'support@excellogics.co.in'}
                          onChange={(e) => setSiteSettings({ ...siteSettings, notification_email: e.target.value })}
                          className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28] text-xs font-mono font-bold text-gray-800"
                        />
                        <span className="text-[10.5px] text-gray-500 mt-1 block">
                          All user inquiries from the Contact Us form are sent to this address.
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          SMTP Username / Sender Account
                        </label>
                        <input
                          type="text"
                          placeholder="npenwang@excellogics.co.in"
                          value={siteSettings.smtp_user || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, smtp_user: e.target.value })}
                          className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28] text-xs font-mono"
                        />
                        <span className="text-[10.5px] text-gray-500 mt-1 block">
                          Email address used to authenticate with your mail server.
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1">
                          SMTP Server Host
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. mail.excellogics.co.in or smtp.gmail.com"
                          value={siteSettings.smtp_host || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, smtp_host: e.target.value })}
                          className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28] text-xs font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1">SMTP Port</label>
                          <input
                            type="text"
                            placeholder="587 or 465"
                            value={siteSettings.smtp_port || '587'}
                            onChange={(e) => setSiteSettings({ ...siteSettings, smtp_port: e.target.value })}
                            className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28] text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1">SSL / TLS</label>
                          <select
                            value={siteSettings.smtp_secure || 'false'}
                            onChange={(e) => setSiteSettings({ ...siteSettings, smtp_secure: e.target.value })}
                            className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28] text-xs"
                          >
                            <option value="false">STARTTLS (Port 587 / 25)</option>
                            <option value="true">SSL/TLS (Port 465)</option>
                          </select>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block font-bold text-gray-700 mb-1">
                          SMTP Password / App Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter mail account password or Google Workspace app password"
                          value={siteSettings.smtp_pass || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, smtp_pass: e.target.value })}
                          className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28] text-xs font-mono"
                        />
                        <span className="text-[10.5px] text-gray-500 mt-1 block">
                          Tip: For Gmail/Google Workspace, generate an App Password under Google Account &gt; Security &gt; 2-Step Verification.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t text-xs">
                      <span className="text-[11px] text-gray-500">
                        {siteSettings.smtp_host && siteSettings.smtp_user && siteSettings.smtp_pass
                          ? '✅ Outgoing SMTP server configured.'
                          : '⚠️ SMTP credentials pending. Without SMTP, inquiries are safely saved in database but live emails cannot be sent over the internet.'}
                      </span>
                      <button
                        type="button"
                        onClick={handleSaveSettings}
                        className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                      >
                        Save SMTP Settings
                      </button>
                    </div>
                  </div>

                  {/* Social Media & Channels Manager (Request 7) */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-[#4a6b28]">
                          <Share2 size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#002147] text-base flex items-center gap-2">
                            <span>Official Social Channels & Communication Links</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                              HEADER & FOOTER
                            </span>
                          </h4>
                          <p className="text-xs text-gray-500">
                            Add or remove links like official WhatsApp helpline, Facebook, Instagram, and decide what to show on live pages.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingSocialLink(null);
                          setSocialFormData({
                            platform: 'whatsapp',
                            label: 'WhatsApp Helpline',
                            url: 'https://wa.me/919436002789',
                            is_active: true,
                            display_order: socialLinks.length + 1
                          });
                          setShowSocialModal(true);
                        }}
                        className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <PlusCircle size={14} />
                        <span>Add New Channel</span>
                      </button>
                    </div>

                    {/* Quick WhatsApp Configuration Widget */}
                    <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-4 rounded-xl border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                          <MessageCircle size={18} />
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 text-xs block">
                            Official WhatsApp Helpline Quick Setup
                          </span>
                          <span className="text-[11px] text-gray-500">
                            Enter the institutional contact number. Click Save to generate and bind live chat links across Header & Footer.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-gray-500 bg-white px-2 py-1.5 border rounded-lg">
                          +91
                        </span>
                        <input
                          type="text"
                          placeholder="9436002789"
                          value={whatsAppQuickPhone}
                          onChange={(e) => setWhatsAppQuickPhone(e.target.value)}
                          className="w-32 bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-gray-800 focus:outline-none focus:border-emerald-600"
                        />
                        <button
                          type="button"
                          onClick={handleQuickAddWhatsApp}
                          className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <Check size={13} />
                          <span>Save WhatsApp Link</span>
                        </button>
                      </div>
                    </div>

                    {/* Social Channels List Table */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                        <thead className="bg-[#002147] text-white">
                          <tr>
                            <th className="px-3.5 py-3 font-semibold w-36">Channel / Platform</th>
                            <th className="px-3.5 py-3 font-semibold">Public Label & Target URL</th>
                            <th className="px-3.5 py-3 font-semibold text-center w-36">Show / Hide Switch</th>
                            <th className="px-3.5 py-3 font-semibold text-right w-24">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {socialLinks.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                                No social links configured. Add WhatsApp, Facebook, or Instagram above.
                              </td>
                            </tr>
                          ) : (
                            socialLinks.map((link) => (
                              <tr key={link.id} className={`hover:bg-slate-50 transition-colors ${link.is_active ? '' : 'bg-gray-50 opacity-70'}`}>
                                <td className="px-3.5 py-3">
                                  <div className="flex items-center gap-2">
                                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-2xs font-bold text-xs ${
                                      link.platform.toLowerCase() === 'whatsapp' ? 'bg-[#25D366]' :
                                      link.platform.toLowerCase() === 'facebook' ? 'bg-[#1877F2]' :
                                      link.platform.toLowerCase() === 'instagram' ? 'bg-gradient-to-tr from-[#f09433] to-[#bc1888]' :
                                      link.platform.toLowerCase() === 'youtube' ? 'bg-[#FF0000]' :
                                      link.platform.toLowerCase() === 'twitter' ? 'bg-[#000000]' :
                                      link.platform.toLowerCase() === 'linkedin' ? 'bg-[#0A66C2]' : 'bg-[#002147]'
                                    }`}>
                                      {link.platform[0].toUpperCase()}
                                    </span>
                                    <span className="font-bold text-gray-900 capitalize text-xs">
                                      {link.platform}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3.5 py-3">
                                  <div className="font-bold text-gray-900 text-xs">{link.label}</div>
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-blue-600 hover:underline truncate max-w-sm block mt-0.5 font-mono"
                                  >
                                    {link.url}
                                  </a>
                                </td>
                                <td className="px-3.5 py-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleSocialLink(link.id)}
                                    className={`px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                                      link.is_active
                                        ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600 border border-gray-300'
                                    }`}
                                  >
                                    <span className={`w-2 h-2 rounded-full ${link.is_active ? 'bg-emerald-600' : 'bg-gray-400'}`}></span>
                                    <span>{link.is_active ? 'Live on Site' : 'Hidden'}</span>
                                  </button>
                                </td>
                                <td className="px-3.5 py-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingSocialLink(link);
                                        setSocialFormData({
                                          platform: link.platform || 'whatsapp',
                                          label: link.label || '',
                                          url: link.url || '',
                                          is_active: Boolean(link.is_active),
                                          display_order: link.display_order || 0
                                        });
                                        setShowSocialModal(true);
                                      }}
                                      className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                                      title="Edit channel"
                                    >
                                      <Edit3 size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSocialLink(link.id)}
                                      className="p-1.5 text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                                      title="Delete channel"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  MODULE 11: DATABASE & SYSTEM MONITOR
              ======================================================== */}
              {activeTab === 'database' && (
                <div className="space-y-6 animate-fadeIn max-w-5xl">
                  {/* Database Engine Status Banner */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
                        <Database size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#002858] text-base flex items-center gap-2">
                          <span>Database Engine: {stats?.database?.engine === 'mysql' ? 'MySQL 8.0 Server' : 'SQLite Local Persistent Database'}</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                            ONLINE
                          </span>
                        </h4>
                        <p className="text-xs text-gray-500">
                          Location: <code>capital_colleg_backend/data/capital_college.sqlite</code> • Automatic multi-table relational schema
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRunPingTest}
                        disabled={pingRunning}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-gray-300"
                      >
                        <Activity size={13} className={pingRunning ? 'animate-spin' : ''} />
                        <span>{pingLatency ? `Latency: ${pingLatency}ms` : 'Ping DB Health'}</span>
                      </button>

                      <button
                        onClick={handleExportBackup}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                      >
                        <Download size={14} />
                        <span>Export Full DB JSON Backup</span>
                      </button>
                    </div>
                  </div>

                  {/* Table Record Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">applications</span>
                      <span className="text-2xl font-black text-[#002858] block mt-1">
                        {statData.totalApplications || applications.length}
                      </span>
                      <span className="text-[10px] text-gray-500 block">Records</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">notices</span>
                      <span className="text-2xl font-black text-[#002858] block mt-1">
                        {statData.totalNotices || notices.length}
                      </span>
                      <span className="text-[10px] text-gray-500 block">Records</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">faculty</span>
                      <span className="text-2xl font-black text-[#002858] block mt-1">
                        {statData.totalFaculty || faculty.length}
                      </span>
                      <span className="text-[10px] text-gray-500 block">Records</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">courses</span>
                      <span className="text-2xl font-black text-[#002858] block mt-1">
                        {statData.totalCourses || courses.length}
                      </span>
                      <span className="text-[10px] text-gray-500 block">Records</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">inquiries</span>
                      <span className="text-2xl font-black text-[#002858] block mt-1">
                        {statData.totalInquiries || inquiries.length}
                      </span>
                      <span className="text-[10px] text-gray-500 block">Records</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">admin_users</span>
                      <span className="text-2xl font-black text-[#002858] block mt-1">
                        {statData.totalAdmins || adminUsers.length || 1}
                      </span>
                      <span className="text-[10px] text-gray-500 block">Records</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">notifications</span>
                      <span className="text-2xl font-black text-[#002858] block mt-1">
                        {statData.totalNotificationsDispatched || 0}
                      </span>
                      <span className="text-[10px] text-gray-500 block">Dispatches</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-center">
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">hero_slides</span>
                      <span className="text-2xl font-black text-[#002858] block mt-1">
                        {heroSlides.length}
                      </span>
                      <span className="text-[10px] text-gray-500 block">Campus Slides</span>
                    </div>
                  </div>

                  {/* System Architecture Details */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                    <h5 className="font-bold text-[#002858] text-sm">Deployment & Technology Stack</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-600">
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <strong className="block text-gray-900 mb-1">Frontend Layer</strong>
                        <span>React 18 + Vite + Tailwind CSS + Lucide Icons</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <strong className="block text-gray-900 mb-1">Backend API</strong>
                        <span>Node.js Express on Port 5001 with CORS Fallback</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <strong className="block text-gray-900 mb-1">Database Engine</strong>
                        <span>Persistent SQLite with production MySQL compatibility</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: STUDENT DOSSIER (ALL 19+ FIELDS)
      ======================================================== */}
      {viewDetailsApp && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-3 sm:p-4 print:static print:inset-auto print:bg-white print:p-0 print:m-0 print:overflow-visible print:block">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn flex flex-col max-h-[92vh] print:max-h-none print:max-w-none print:w-full print:border-none print:shadow-none print:rounded-none print:my-0 print:overflow-visible print:p-0 print:block">
            <div className="bg-[#002858] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28] print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#4a6b28] flex items-center justify-center font-bold text-white shadow">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-base flex items-center gap-2">
                    <span>{viewDetailsApp.full_name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        viewDetailsApp.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : viewDetailsApp.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : viewDetailsApp.status === 'UNDER_REVIEW'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {viewDetailsApp.status}
                    </span>
                  </h4>
                  <p className="text-[11px] text-gray-300 font-mono">
                    Ref ID: {viewDetailsApp.application_no} • Registered: {viewDetailsApp.created_at}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewDetailsApp(null)}
                className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 text-xs space-y-4 overflow-y-auto flex-1 print:hidden">
              {/* Personal Details */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <span className="text-[10px] font-bold text-[#002858] uppercase tracking-wider block border-b pb-1">
                  1. Personal Information
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Full Name</span>
                    <span className="font-bold text-gray-900">{viewDetailsApp.full_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Gender</span>
                    <span className="font-medium text-gray-800">{viewDetailsApp.gender}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Date of Birth</span>
                    <span className="font-medium text-gray-800">{viewDetailsApp.dob}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Category</span>
                    <span className="font-bold text-[#4a6b28]">{viewDetailsApp.category || 'ST'}</span>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <span className="text-[10px] font-bold text-[#002858] uppercase tracking-wider block border-b pb-1">
                  2. Contact & Residence
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Phone</span>
                    <a href={`tel:${viewDetailsApp.phone}`} className="font-bold text-blue-700 hover:underline">
                      {viewDetailsApp.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Email Address</span>
                    <a href={`mailto:${viewDetailsApp.email}`} className="font-medium text-blue-700 hover:underline">
                      {viewDetailsApp.email}
                    </a>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Permanent Address</span>
                    <span className="text-gray-800">{viewDetailsApp.address}</span>
                  </div>
                </div>
              </div>

              {/* Guardian Info */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <span className="text-[10px] font-bold text-[#002858] uppercase tracking-wider block border-b pb-1">
                  3. Parent / Guardian Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Guardian Name</span>
                    <span className="font-bold text-gray-900">{viewDetailsApp.guardian_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Guardian Phone</span>
                    <a href={`tel:${viewDetailsApp.guardian_phone}`} className="font-bold text-blue-700 hover:underline">
                      {viewDetailsApp.guardian_phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Academic Enrollment */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <span className="text-[10px] font-bold text-[#002858] uppercase tracking-wider block border-b pb-1">
                  4. Academic Programme & Marks
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Stream</span>
                    <span className="font-bold text-[#002858]">{viewDetailsApp.stream}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Major Subject</span>
                    <span className="font-bold text-emerald-800">{viewDetailsApp.major_subject}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Class 12th Marks</span>
                    <span className="font-bold text-emerald-700 text-sm">{viewDetailsApp.marks_12th}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Board of Exam</span>
                    <span className="font-bold text-gray-800">{viewDetailsApp.board_name}</span>
                  </div>
                </div>
              </div>

              {/* Reviewer Remarks */}
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block border-b border-amber-200 pb-1">
                  5. Administrative Decision & Notes
                </span>
                <p className="text-gray-800 text-xs leading-relaxed">
                  {viewDetailsApp.remarks || 'No remarks recorded yet. You can approve or reject below.'}
                </p>
              </div>

              {/* Notifications Dispatched */}
              {dossierNotifications && dossierNotifications.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                  <span className="text-[10px] font-bold text-[#002858] uppercase tracking-wider block border-b pb-1">
                    6. Communications Sent to Student ({dossierNotifications.length})
                  </span>
                  <div className="space-y-2 pt-1">
                    {dossierNotifications.map((n) => (
                      <div key={n.id} className="bg-white p-2.5 rounded-lg border border-gray-200 text-[11px] space-y-1">
                        <div className="flex justify-between font-bold text-[#002858]">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{n.created_at}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Bar - Screen only */}
            <div className="bg-gray-100 px-6 py-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 print:hidden">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openDecisionModal(viewDetailsApp, 'APPROVED')}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Check size={13} />
                  <span>Approve &amp; Notify</span>
                </button>
                <button
                  onClick={() => openDecisionModal(viewDetailsApp, 'UNDER_REVIEW')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Activity size={13} />
                  <span>Mark Under Review</span>
                </button>
                <button
                  onClick={() => openDecisionModal(viewDetailsApp, 'REJECTED')}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <X size={13} />
                  <span>Reject</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print Sheet</span>
                </button>
                <button
                  onClick={() => setViewDetailsApp(null)}
                  className="bg-[#002858] text-white px-4 py-1.5 rounded-lg font-semibold text-xs cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>

            {/* PRINT-ONLY OFFICIAL 1-PAGE STUDENT ADMISSION DOSSIER SHEET */}
            <div className="hidden print:block print-page-fit w-full text-slate-900 bg-white p-4">
              <div className="border-b-2 border-[#4a6b28] pb-2.5 mb-2.5">
                <div className="flex items-center justify-between gap-3">
                  <img
                    src="https://capitalcollege.edu.in/wp-content/uploads/2023/05/1a.jpg"
                    alt="College Crest"
                    className="w-14 h-14 object-contain shrink-0"
                  />
                  <div className="text-center flex-1">
                    <h2 className="text-lg font-black text-[#002147] tracking-tight uppercase leading-tight">
                      Capital College of Higher Education
                    </h2>
                    <p className="text-[11px] font-bold text-slate-700 tracking-wide uppercase mt-0.5">
                      Kohima • Nagaland • Established 2004
                    </p>
                    <p className="text-[9.5px] text-slate-600 mt-0.5">
                      Permanently Affiliated to Nagaland University | UGC 2(f) &amp; 12(B) Recognized
                    </p>
                  </div>
                  <div className="w-14 h-14 border border-slate-300 rounded p-1 flex flex-col items-center justify-center text-center text-[7.5px] text-slate-600 font-mono shrink-0">
                    <span className="font-bold text-[#002147]">ADMIN</span>
                    <span>DOSSIER</span>
                    <span className="text-[#4a6b28] font-bold">CONFIDENTIAL</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#002147] text-white text-center py-1 px-3 rounded mb-2.5">
                <h3 className="text-[11px] font-black uppercase tracking-wider">
                  Candidate Admission Dossier &amp; Evaluation Sheet
                </h3>
                <p className="text-[8.5px] text-emerald-200 uppercase tracking-widest font-semibold">
                  Four-Year Undergraduate Programme (FYUGP) • NEP 2020 • Academic Session 2026–2027
                </p>
              </div>

              <div className="flex items-center justify-between border border-slate-300 rounded p-2 mb-2.5 bg-slate-50 text-[10.5px]">
                <div>
                  <span className="text-[8.5px] uppercase font-bold text-slate-500 block">Application Reference No.</span>
                  <span className="text-sm font-mono font-black text-[#002147]">{viewDetailsApp.application_no}</span>
                </div>
                <div className="text-center">
                  <span className="text-[8.5px] uppercase font-bold text-slate-500 block">Registration Timestamp</span>
                  <span className="font-semibold text-slate-800">{viewDetailsApp.created_at}</span>
                </div>
                <div className="text-right">
                  <span className="text-[8.5px] uppercase font-bold text-slate-500 block mb-0.5">Committee Decision</span>
                  <span className="inline-block bg-[#002147] text-white font-bold px-2 py-0.5 rounded text-[9.5px] uppercase tracking-wider">
                    {viewDetailsApp.status}
                  </span>
                </div>
              </div>

              <div className="border border-slate-300 rounded overflow-hidden mb-2.5 text-[10px]">
                <div className="bg-slate-100 font-bold px-2.5 py-0.5 text-[#002147] border-b border-slate-300 uppercase text-[9px] tracking-wider">
                  1. Candidate Personal Particulars
                </div>
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="w-1/4 p-1.5 bg-slate-50/70 font-semibold text-slate-600">Candidate Name:</td>
                      <td className="w-1/4 p-1.5 font-bold text-slate-900">{viewDetailsApp.full_name}</td>
                      <td className="w-1/4 p-1.5 bg-slate-50/70 font-semibold text-slate-600">Guardian Name:</td>
                      <td className="w-1/4 p-1.5 font-medium text-slate-800">{viewDetailsApp.guardian_name || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Gender &amp; Category:</td>
                      <td className="p-1.5 font-medium text-slate-800">{viewDetailsApp.gender || 'N/A'} • {viewDetailsApp.category || 'ST'}</td>
                      <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Date of Birth:</td>
                      <td className="p-1.5 font-medium text-slate-800">{viewDetailsApp.dob || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Contact Phone:</td>
                      <td className="p-1.5 font-mono text-slate-800">{viewDetailsApp.phone}</td>
                      <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Guardian Phone:</td>
                      <td className="p-1.5 font-mono text-slate-800">{viewDetailsApp.guardian_phone || 'Same'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Permanent Address:</td>
                      <td colSpan={3} className="p-1.5 font-medium text-slate-800 text-[9.5px]">{viewDetailsApp.address}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border border-slate-300 rounded overflow-hidden mb-2.5 text-[10px]">
                <div className="bg-slate-100 font-bold px-2.5 py-0.5 text-[#002147] border-b border-slate-300 uppercase text-[9px] tracking-wider">
                  2. Academic Allotment &amp; Prior Qualifications
                </div>
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="w-1/4 p-1.5 bg-slate-50/70 font-semibold text-slate-600">Allotted Stream:</td>
                      <td className="w-1/4 p-1.5 font-bold text-[#002147]">{viewDetailsApp.stream}</td>
                      <td className="w-1/4 p-1.5 bg-slate-50/70 font-semibold text-slate-600">Major / Honours:</td>
                      <td className="w-1/4 p-1.5 font-bold text-[#4a6b28] uppercase">{viewDetailsApp.major_subject}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Course Typology:</td>
                      <td className="p-1.5 font-medium text-slate-800">{viewDetailsApp.course_type}</td>
                      <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Minor Choices:</td>
                      <td className="p-1.5 font-medium text-slate-800">{viewDetailsApp.minor_subjects || 'None'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Class 12th Marks:</td>
                      <td className="p-1.5 font-bold text-emerald-700">{viewDetailsApp.marks_12th}% ({viewDetailsApp.board_name || 'NBSE'})</td>
                      <td className="p-1.5 bg-slate-50/70 font-semibold text-slate-600">Class 10th Marks:</td>
                      <td className="p-1.5 font-medium text-slate-800">{viewDetailsApp.marks_10th ? `${viewDetailsApp.marks_10th}%` : 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border border-slate-300 rounded p-2.5 mb-3 text-[10px] bg-slate-50/40">
                <span className="font-bold text-[#002147] uppercase tracking-wider block mb-0.5">
                  Admissions Committee Remarks &amp; Action Notes:
                </span>
                <p className="text-slate-800 leading-relaxed text-[10px]">
                  {viewDetailsApp.remarks || 'Application formally reviewed and evaluated under the criteria of Capital College of Higher Education Admissions Committee.'}
                </p>
              </div>

              <div className="pt-3 mt-1 border-t border-slate-300 flex items-end justify-between text-[10px]">
                <div className="text-center w-1/3">
                  <div className="border-b border-slate-400 w-32 mx-auto mb-1"></div>
                  <p className="font-bold text-slate-800 text-[9px]">Scrutiny Officer</p>
                </div>
                <div className="text-center w-1/3">
                  <div className="inline-block border-2 border-dashed border-[#002147] px-3 py-1 rounded text-center">
                    <p className="font-bold text-[#002147] text-[8.5px] uppercase tracking-wider">CCHE Admission Desk</p>
                    <p className="text-[7.5px] text-slate-500 font-mono">Official Record</p>
                  </div>
                </div>
                <div className="text-center w-1/3">
                  <div className="border-b border-slate-400 w-32 mx-auto mb-1"></div>
                  <p className="font-bold text-[#002147] text-[9px]">Principal / Dean</p>
                  <p className="text-[8px] text-slate-600">Capital College Kohima</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: DECISION & NOTIFICATION DISPATCH
      ======================================================== */}
      {reviewApp && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
            <div className={`px-5 py-4 text-white flex items-center justify-between ${
              decisionStatus === 'APPROVED' ? 'bg-emerald-700' : decisionStatus === 'UNDER_REVIEW' ? 'bg-blue-700' : 'bg-rose-700'
            }`}>
              <div className="flex items-center gap-2">
                {decisionStatus === 'APPROVED' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                <h4 className="font-bold text-sm">
                  {decisionStatus === 'APPROVED' ? 'Approve Admission Application' : decisionStatus === 'UNDER_REVIEW' ? 'Move Application to Under Review' : 'Reject Admission Application'}
                </h4>
              </div>
              <button onClick={() => setReviewApp(null)} className="text-white/80 hover:text-white p-1 rounded">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submitDecision} className="p-5 space-y-4 text-xs">
              {decisionSuccessMsg ? (
                <div className="bg-green-50 border border-green-300 text-green-800 p-3 rounded-lg text-center font-bold">
                  {decisionSuccessMsg}
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                    <p className="font-bold text-gray-900 text-sm">{reviewApp.full_name}</p>
                    <p className="text-gray-600">
                      Ref: <span className="font-mono font-semibold text-[#002858]">{reviewApp.application_no}</span> •{' '}
                      {reviewApp.stream} ({reviewApp.major_subject})
                    </p>
                    <p className="text-gray-500 text-[11px]">
                      Student Email: {reviewApp.email} | Phone: {reviewApp.phone}
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Decision Outcome</label>
                    <div className="flex gap-4">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="statusRadio"
                          value="APPROVED"
                          checked={decisionStatus === 'APPROVED'}
                          onChange={() => {
                            setDecisionStatus('APPROVED');
                            setDecisionRemarks(
                              `Congratulations ${reviewApp.full_name}! You have been granted provisional admission to ${reviewApp.course_type} in ${reviewApp.major_subject} (${reviewApp.stream}). Please report to the administrative office with original NBSE marksheets and admission fee by July 25, 2026.`
                            );
                          }}
                        />
                        <span className="font-bold text-emerald-700">Approve</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="statusRadio"
                          value="UNDER_REVIEW"
                          checked={decisionStatus === 'UNDER_REVIEW'}
                          onChange={() => {
                            setDecisionStatus('UNDER_REVIEW');
                            setDecisionRemarks(
                              `Dear ${reviewApp.full_name}, your application credentials and marksheet are currently under active evaluation by the Admissions Committee.`
                            );
                          }}
                        />
                        <span className="font-bold text-blue-700">Under Review</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="statusRadio"
                          value="REJECTED"
                          checked={decisionStatus === 'REJECTED'}
                          onChange={() => {
                            setDecisionStatus('REJECTED');
                            setDecisionRemarks(
                              `Dear ${reviewApp.full_name}, your application could not be selected due to seat quota limitations in ${reviewApp.major_subject}. You are invited to contact the academic counseling desk regarding alternative programs.`
                            );
                          }}
                        />
                        <span className="font-bold text-rose-700">Reject</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Official Remarks & Student Instructions *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={decisionRemarks}
                      onChange={(e) => setDecisionRemarks(e.target.value)}
                      className="w-full border rounded-lg p-2.5 text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-[#4a6b28]"
                    />
                    <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                      <Send size={11} className="text-[#4a6b28]" />
                      <span>This notification will be instantly sent to the student and visible when tracking status.</span>
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <button
                      type="button"
                      onClick={() => setReviewApp(null)}
                      className="px-3 py-1.5 rounded border text-gray-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingDecision}
                      className="bg-[#002858] hover:bg-[#001c3d] text-white px-4 py-1.5 rounded-lg font-bold shadow-xs"
                    >
                      {submittingDecision ? 'Dispatching...' : 'Dispatch Notification'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: MANUAL APPLICANT ENTRY
      ======================================================== */}
      {showManualAppModal && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn flex flex-col max-h-[92vh]">
            <div className="bg-[#002858] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28]">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <UserPlus size={16} className="text-[#4a6b28]" />
                <span>Manual Student Admission Registration (Desk Entry)</span>
              </h4>
              <button onClick={() => setShowManualAppModal(false)} className="text-gray-300 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleManualAppSubmit} className="p-6 text-xs space-y-3 overflow-y-auto flex-1">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={manualApp.full_name}
                  onChange={(e) => setManualApp({ ...manualApp, full_name: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#4a6b28]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Student Email *</label>
                  <input
                    type="email"
                    required
                    value={manualApp.email}
                    onChange={(e) => setManualApp({ ...manualApp, email: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#4a6b28]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Student Phone *</label>
                  <input
                    type="text"
                    required
                    value={manualApp.phone}
                    onChange={(e) => setManualApp({ ...manualApp, phone: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#4a6b28]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={manualApp.dob}
                    onChange={(e) => setManualApp({ ...manualApp, dob: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#4a6b28]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Gender</label>
                  <select
                    value={manualApp.gender}
                    onChange={(e) => setManualApp({ ...manualApp, gender: e.target.value })}
                    className="w-full border rounded-lg p-2 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={manualApp.category}
                    onChange={(e) => setManualApp({ ...manualApp, category: e.target.value })}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stream *</label>
                  <select
                    value={manualApp.stream}
                    onChange={(e) => setManualApp({ ...manualApp, stream: e.target.value })}
                    className="w-full border rounded-lg p-2 bg-white"
                  >
                    <option value="ARTS">ARTS</option>
                    <option value="SCIENCE">SCIENCE</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Major Subject *</label>
                  <input
                    type="text"
                    required
                    value={manualApp.major_subject}
                    onChange={(e) => setManualApp({ ...manualApp, major_subject: e.target.value })}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Class 12th Marks (%) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={manualApp.marks_12th}
                    onChange={(e) => setManualApp({ ...manualApp, marks_12th: e.target.value })}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Board of Examination</label>
                  <input
                    type="text"
                    value={manualApp.board_name}
                    onChange={(e) => setManualApp({ ...manualApp, board_name: e.target.value })}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={manualApp.guardian_name}
                    onChange={(e) => setManualApp({ ...manualApp, guardian_name: e.target.value })}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Guardian Phone *</label>
                  <input
                    type="text"
                    required
                    value={manualApp.guardian_phone}
                    onChange={(e) => setManualApp({ ...manualApp, guardian_phone: e.target.value })}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Residential Address *</label>
                <textarea
                  required
                  rows={2}
                  value={manualApp.address}
                  onChange={(e) => setManualApp({ ...manualApp, address: e.target.value })}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowManualAppModal(false)}
                  className="px-4 py-2 border rounded text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-5 py-2 rounded font-bold shadow"
                >
                  Submit & Register Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CREATE / EDIT NOTICE
      ======================================================== */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn flex flex-col max-h-[92vh]">
            <div className="bg-[#002858] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28]">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Bell size={16} className="text-[#4a6b28]" />
                <span>
                  {editingNotice
                    ? noticeFormData.item_type === 'event'
                      ? 'Edit Campus Event'
                      : 'Edit Official College Notice'
                    : noticeFormData.item_type === 'event'
                    ? 'Publish New Campus Event'
                    : 'Publish New College Notice'}
                </span>
              </h4>
              <button onClick={() => setShowNoticeModal(false)} className="text-gray-300 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleNoticeSubmit} className="p-6 text-xs space-y-3.5 overflow-y-auto flex-1">
              {/* Type Switcher: Notice vs Event */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Entry Type *</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() =>
                      setNoticeFormData({
                        ...noticeFormData,
                        item_type: 'notice',
                        category:
                          ['Activities', 'College Fest', 'Events', 'NSS', 'Health & Social'].includes(noticeFormData.category)
                            ? 'Official Notice'
                            : noticeFormData.category
                      })
                    }
                    className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      noticeFormData.item_type === 'notice'
                        ? 'bg-[#002147] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText size={14} />
                    <span>Official Notice / Circular</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNoticeFormData({
                        ...noticeFormData,
                        item_type: 'event',
                        category:
                          ['Official Notice', 'Examination', 'Administrative Circular', 'Admissions'].includes(noticeFormData.category)
                            ? 'Events'
                            : noticeFormData.category
                      })
                    }
                    className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      noticeFormData.item_type === 'event'
                        ? 'bg-[#4a6b28] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Calendar size={14} />
                    <span>Campus Event / Activity</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  {noticeFormData.item_type === 'event' ? 'Event Title *' : 'Notice / Circular Title *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    noticeFormData.item_type === 'event'
                      ? 'e.g. Annual Cultural & Sports Meet Trifecta 2026'
                      : 'e.g. Nagaland University Under Graduate Exam Routine 2024'
                  }
                  value={noticeFormData.title}
                  onChange={(e) => setNoticeFormData({ ...noticeFormData, title: e.target.value })}
                  className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={noticeFormData.category}
                    onChange={(e) => setNoticeFormData({ ...noticeFormData, category: e.target.value })}
                    className="w-full border rounded-lg p-2 bg-white"
                  >
                    {noticeFormData.item_type === 'event' ? (
                      <>
                        <option value="Events">General Events</option>
                        <option value="College Fest">College Fest</option>
                        <option value="Activities">Activities</option>
                        <option value="Sports & Fitness">Sports &amp; Fitness</option>
                        <option value="Health & Social">Health &amp; Social</option>
                        <option value="NSS">NSS &amp; Community</option>
                        <option value="Campus Integrity">Campus Integrity</option>
                        <option value="Faculty Development">Faculty Development</option>
                        <option value="IQAC">IQAC Seminars</option>
                      </>
                    ) : (
                      <>
                        <option value="Official Notice">Official Notice</option>
                        <option value="Examination">Examination &amp; Routine</option>
                        <option value="Administrative Circular">Administrative Circular</option>
                        <option value="Admissions">Admissions Notification</option>
                        <option value="Student Welfare">Student Welfare &amp; Scheme</option>
                        <option value="Academic Circular">Academic Circular</option>
                        <option value="Faculty Notice">Faculty &amp; Staff Notice</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    {noticeFormData.item_type === 'event' ? 'Event Date' : 'Issue Date'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aug 15, 2026"
                    value={noticeFormData.event_date}
                    onChange={(e) => setNoticeFormData({ ...noticeFormData, event_date: e.target.value })}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Summary / Lead Brief</label>
                <textarea
                  rows={2}
                  placeholder="Short 1-2 sentence overview for cards and notifications..."
                  value={noticeFormData.summary}
                  onChange={(e) => setNoticeFormData({ ...noticeFormData, summary: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#4a6b28]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Detailed Content / Directives *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Complete text of circular, guidelines, examination timings, or schedule..."
                  value={noticeFormData.content}
                  onChange={(e) => setNoticeFormData({ ...noticeFormData, content: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:border-[#4a6b28]"
                />
              </div>

              {/* PDF Document Upload */}
              <DeviceDocumentUpload
                label="PDF Document / Offline Form (Optional)"
                value={noticeFormData.pdf_url}
                fileName={noticeFormData.pdf_name}
                onChange={(pdf) => setNoticeFormData({ ...noticeFormData, pdf_url: pdf })}
                onFileNameChange={(name) => setNoticeFormData({ ...noticeFormData, pdf_name: name })}
                hint="Upload official examination routine PDF, institutional circular scan, or printable application form"
              />

              {/* External Link or Google Form */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Registration Form or External Link (Optional)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="e.g. Google Form link, Nagaland University portal URL, or registration form"
                    value={noticeFormData.link_url || ''}
                    onChange={(e) => setNoticeFormData({ ...noticeFormData, link_url: e.target.value })}
                    className="w-full border rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#4a6b28] pl-8"
                  />
                  <ExternalLink size={14} className="absolute left-2.5 top-3 text-slate-400" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Allows students and faculty to open an interactive online form or university portal with 1 click.
                </p>
              </div>

              {/* Cover Image or Circular Scan */}
              <DeviceImageUpload
                label={
                  noticeFormData.item_type === 'event'
                    ? 'Event Cover Photo (Recommended for Events)'
                    : 'Notice Circular Image / Scan (Optional — Not Mandatory)'
                }
                value={noticeFormData.image_url}
                onChange={(img) => setNoticeFormData({ ...noticeFormData, image_url: img })}
                aspectHint={
                  noticeFormData.item_type === 'event'
                    ? 'Recommended: 16:9 photo for campus events (fests, sports, treks, workshops)'
                    : 'Pictures are NOT mandatory for notices. Leave empty for standard circulars, or attach a signed document scan if available.'
                }
              />

              {noticeFormData.item_type === 'event' ? (
                <div className="flex items-center gap-2 pt-1 bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                  <input
                    type="checkbox"
                    id="featuredCheck"
                    checked={noticeFormData.is_featured}
                    onChange={(e) => setNoticeFormData({ ...noticeFormData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                  />
                  <div>
                    <label htmlFor="featuredCheck" className="font-bold text-gray-800 text-xs cursor-pointer flex items-center gap-1.5">
                      <span>Pin to Homepage "Campus Events &amp; Activities" Showcase</span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                        HOMEPAGE PIN
                      </span>
                    </label>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      When checked, this event will be pinned at the front of the homepage carousel.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-gray-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  Official notices &amp; circulars are published to the official <strong className="text-gray-700">Notice Board</strong> (/notice) and are separated from the homepage events showcase.
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 border rounded text-gray-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-5 py-2 rounded font-bold shadow cursor-pointer"
                >
                  {editingNotice ? 'Save Changes' : noticeFormData.item_type === 'event' ? 'Publish Event' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CREATE / EDIT FACULTY
      ======================================================== */}
      {showFacultyModal && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn max-h-[92vh] flex flex-col">
            <div className="bg-[#002858] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#8fc35e]">
                  <Users size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">
                    {editingFaculty ? 'Edit Faculty / HOD Profile' : 'Add Faculty Member / HOD'}
                  </h4>
                  <p className="text-[11px] text-gray-300">
                    Upload profile picture & categorize by concern department
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFacultyModal(false)}
                className="text-gray-300 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFacultySubmit} className="p-6 text-xs space-y-4 overflow-y-auto">
              {/* Profile Picture Upload via DeviceImageUpload */}
              <DeviceImageUpload
                label="Faculty / Professor / HOD Profile Picture"
                value={facultyFormData.image_url}
                onChange={(img) => setFacultyFormData({ ...facultyFormData, image_url: img })}
                aspectHint="Upload photo from phone or computer, or enter web URL. 1:1 square photo recommended."
              />

              {/* Live Card Preview */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wider block">
                  Live Card Preview (WYSIWYG)
                </span>
                <div className="max-w-[280px] mx-auto">
                  <PersonCard
                    name={facultyFormData.name || 'Faculty Member Name'}
                    role={facultyFormData.designation || 'Assistant Professor'}
                    qualification={facultyFormData.qualification || 'M.A., Ph.D.'}
                    image_url={facultyFormData.image_url}
                    is_hod={Boolean(facultyFormData.is_hod)}
                    department={facultyFormData.department || 'Department of English'}
                    stream={facultyFormData.stream}
                  />
                </div>
              </div>

              {facultyFormData.image_url ? (
                <div className="flex items-center justify-between bg-emerald-50/60 p-2 rounded-lg border border-emerald-200 text-xs">
                  <span className="text-[11px] text-emerald-800 font-medium">✓ Photo is uploaded (Optional)</span>
                  <button
                    type="button"
                    onClick={() => setFacultyFormData({ ...facultyFormData, image_url: '' })}
                    className="text-xs text-red-600 hover:text-red-800 font-bold px-2 py-0.5 bg-white rounded border border-red-200 cursor-pointer"
                  >
                    Clear Photo
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-gray-400 italic">
                  💡 Profile photo is optional. An institutional monogram avatar will be displayed automatically if left blank.
                </p>
              )}

              {/* Full Name */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name & Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rukulu Kezo Puro or Chubarenla Lkr"
                  value={facultyFormData.name}
                  onChange={(e) => setFacultyFormData({ ...facultyFormData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28] focus:ring-1 focus:ring-[#4a6b28] bg-white font-medium text-gray-900"
                />
              </div>

              {/* Stream & Concern Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Academic Stream *</label>
                  <select
                    value={facultyFormData.stream}
                    onChange={(e) => {
                      const newStream = e.target.value;
                      const defaultDept = newStream === 'SCIENCE' ? 'Botany' : 'English';
                      setFacultyFormData({
                        ...facultyFormData,
                        stream: newStream,
                        department: defaultDept
                      });
                    }}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-white font-medium text-gray-800"
                  >
                    <option value="ARTS">ARTS STREAM (P.R. Hill Campus)</option>
                    <option value="SCIENCE">SCIENCE STREAM (Thegaba Campus)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Concern Department *</label>
                  <select
                    value={facultyFormData.department}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, department: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-white font-medium text-gray-800"
                  >
                    {facultyFormData.stream === 'ARTS' ? (
                      <optgroup label="Arts Stream Departments">
                        <option value="English">Department of English</option>
                        <option value="History">Department of History</option>
                        <option value="Political Science">Department of Political Science</option>
                        <option value="Sociology">Department of Sociology</option>
                        <option value="Tenyidie">Department of Tenyidie</option>
                        <option value="Education">Department of Education</option>
                        <option value="Economics">Department of Economics</option>
                        <option value="Visiting Faculty (Arts)">Visiting Faculty (Arts)</option>
                      </optgroup>
                    ) : (
                      <optgroup label="Science Stream Departments">
                        <option value="Botany">Department of Botany</option>
                        <option value="Chemistry">Department of Chemistry</option>
                        <option value="Zoology">Department of Zoology</option>
                        <option value="Mathematics & Physics">Department of Mathematics & Physics</option>
                        <option value="Mathematics">Department of Mathematics</option>
                        <option value="Physics">Department of Physics</option>
                        <option value="Visiting Faculty (Science)">Visiting Faculty (Science)</option>
                      </optgroup>
                    )}
                    {/* Preserve existing custom department if not in standard list */}
                    {![
                      'English', 'History', 'Political Science', 'Sociology', 'Tenyidie', 'Education', 'Economics', 'Visiting Faculty (Arts)',
                      'Botany', 'Chemistry', 'Zoology', 'Mathematics & Physics', 'Mathematics', 'Physics', 'Visiting Faculty (Science)',
                      'Department of English', 'Department of History', 'Department of Political Science', 'Department of Sociology',
                      'Department of Tenyidie', 'Department of Education', 'Department of Economics', 'Department of Botany',
                      'Department of Chemistry', 'Department of Zoology', 'Department of Mathematics & Physics'
                    ].includes(facultyFormData.department) && facultyFormData.department && (
                      <option value={facultyFormData.department}>{facultyFormData.department}</option>
                    )}
                  </select>
                  <input
                    type="text"
                    placeholder="Or type custom department name..."
                    value={facultyFormData.department}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, department: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 mt-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#4a6b28]"
                  />
                </div>
              </div>

              {/* Designation & Qualifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Designation / Role *</label>
                  <select
                    value={facultyFormData.designation}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, designation: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 bg-white font-medium text-gray-800"
                  >
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Head of Department & Assistant Professor">Head of Department & Assistant Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Professor">Professor</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Vice Principal & Assistant Professor">Vice Principal & Assistant Professor</option>
                    <option value="Principal">Principal</option>
                    <option value="Visiting Professor">Visiting Professor</option>
                    <option value="Visiting Scholar">Visiting Scholar</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Or custom designation..."
                    value={facultyFormData.designation}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, designation: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 mt-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#4a6b28]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Academic Qualifications</label>
                  <input
                    type="text"
                    placeholder="e.g. M.A., M.Phil., Ph.D., UGC-NET"
                    value={facultyFormData.qualification}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, qualification: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28] bg-white font-mono text-gray-800"
                  />
                  <span className="text-[10px] text-gray-400 block mt-1">Degrees, doctorates, fellowships, NET/JRF</span>
                </div>
              </div>

              {/* Head of Department (HOD) Designation Banner */}
              <div className={`p-3 rounded-xl border transition-all cursor-pointer ${
                facultyFormData.is_hod
                  ? 'bg-amber-50/70 border-amber-300 text-amber-900'
                  : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}
              onClick={() => setFacultyFormData({ ...facultyFormData, is_hod: !facultyFormData.is_hod })}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="hodCheck"
                    checked={facultyFormData.is_hod}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, is_hod: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-[#4a6b28] focus:ring-[#4a6b28] cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <label htmlFor="hodCheck" className="font-bold text-xs cursor-pointer block">
                      Designate as Head of Department (HOD)
                    </label>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      When checked, this professor will be highlighted as the official Head of Department with leadership distinction at the top of the department card.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowFacultyModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-5 py-2 rounded-lg font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 size={15} />
                  <span>{editingFaculty ? 'Save Profile & Photo' : 'Add to Faculty Directory'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CREATE / EDIT GOVERNING BODY MEMBER
      ======================================================== */}
      {showGoverningModal && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn max-h-[92vh] flex flex-col">
            <div className="bg-[#002858] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#8fc35e]">
                  <Landmark size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">
                    {editingGoverningMember ? 'Edit Council Member Profile & Picture' : 'Add Governing Body Member'}
                  </h4>
                  <p className="text-[11px] text-gray-300">
                    Upload member profile picture & configure council credentials
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGoverningModal(false)}
                className="text-gray-300 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleGoverningSubmit} className="p-6 text-xs space-y-4 overflow-y-auto">
              {/* Profile Picture Upload via DeviceImageUpload */}
              <DeviceImageUpload
                label="Governing Body Member Profile Picture"
                value={governingFormData.image_url}
                onChange={(img) => setGoverningFormData({ ...governingFormData, image_url: img })}
                aspectHint="Upload member portrait photo from device or paste an image URL. 1:1 square photo recommended."
              />

              {/* Live Preview Card */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-gray-50 via-emerald-50/20 to-gray-50 border border-gray-200 flex items-center gap-3.5">
                <div className="relative shrink-0">
                  {governingFormData.image_url ? (
                    <img
                      src={governingFormData.image_url}
                      alt="Preview"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-600 shadow-xs ring-2 ring-emerald-500/20"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#002147] to-[#4a6b28] text-white font-extrabold flex items-center justify-center text-sm shadow-xs border-2 border-white/20">
                      {governingFormData.name ? governingFormData.name.split(' ').map((n) => n[0]).filter(Boolean).slice(0, 2).join('') : 'GB'}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                      {governingFormData.member_type === 'MANAGEMENT'
                        ? 'Board of Management'
                        : governingFormData.member_type === 'ADMINISTRATION'
                        ? 'College Administration'
                        : governingFormData.member_type === 'OFFICER'
                        ? 'Council Executive Officer'
                        : 'Council Member Matrix'}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-white border border-gray-200 text-gray-600">
                      {governingFormData.role || 'Member'}
                    </span>
                  </div>
                  <div className="font-bold text-gray-900 text-sm truncate">
                    {governingFormData.name || 'Member Full Name'}
                  </div>
                  <div className="text-[11px] text-gray-600 truncate">
                    {governingFormData.category || 'Classification'}
                  </div>
                  {governingFormData.affiliation && (
                    <div className="text-[10px] text-gray-400 truncate">
                      {governingFormData.affiliation}
                    </div>
                  )}
                </div>
              </div>

              {governingFormData.image_url ? (
                <div className="flex items-center justify-between bg-emerald-50/60 p-2 rounded-lg border border-emerald-200 text-xs">
                  <span className="text-[11px] text-emerald-800 font-medium">✓ Photo is uploaded (Optional)</span>
                  <button
                    type="button"
                    onClick={() => setGoverningFormData({ ...governingFormData, image_url: '' })}
                    className="text-xs text-red-600 hover:text-red-800 font-bold px-2 py-0.5 bg-white rounded border border-red-200 cursor-pointer"
                  >
                    Clear Photo
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-gray-400 italic">
                  💡 Profile photo is optional. An institutional monogram avatar will be displayed automatically if left blank.
                </p>
              )}

              {/* Full Name */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name & Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Vezuhu Keyho or Dr. Zokho Venuh"
                  value={governingFormData.name}
                  onChange={(e) => setGoverningFormData({ ...governingFormData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28] focus:ring-1 focus:ring-[#4a6b28] bg-white font-medium text-gray-900"
                />
              </div>

              {/* Leadership Role & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Leadership Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chairman, Board Member, Principal"
                    value={governingFormData.role}
                    onChange={(e) => setGoverningFormData({ ...governingFormData, role: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#4a6b28] bg-white font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Institutional Classification *</label>
                  <select
                    value={governingFormData.member_type}
                    onChange={(e) => setGoverningFormData({ ...governingFormData, member_type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#4a6b28] bg-white font-medium text-gray-900"
                  >
                    <option value="MANAGEMENT">Board of Management (Sponsorship & Management)</option>
                    <option value="ADMINISTRATION">College Administration (Principal & Deans)</option>
                    <option value="OFFICER">Governing Body - Executive Officer (Chairman/Secretary)</option>
                    <option value="MEMBER">Governing Body - Council Member Matrix</option>
                  </select>
                </div>
              </div>

              {/* Category / Domain & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Domain / Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Higher Education, Administration, Public Leadership"
                    value={governingFormData.category}
                    onChange={(e) => setGoverningFormData({ ...governingFormData, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#4a6b28] bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={governingFormData.order_index}
                    onChange={(e) => setGoverningFormData({ ...governingFormData, order_index: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#4a6b28] bg-white text-gray-900"
                  />
                </div>
              </div>

              {/* Affiliation / Background */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Institutional Affiliation & Background *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Former College Principal & Current Chairman, Supply Colony, Kohima"
                  value={governingFormData.affiliation}
                  onChange={(e) => setGoverningFormData({ ...governingFormData, affiliation: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28] focus:ring-1 focus:ring-[#4a6b28] bg-white text-gray-900 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowGoverningModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#4a6b28] hover:bg-[#3d5920] text-white font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>{editingGoverningMember ? 'Update Member Profile' : 'Save Council Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CREATE / EDIT COURSE
      ======================================================== */}
      {showCourseModal && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
            <div className="bg-[#002858] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28]">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <BookOpen size={16} className="text-[#4a6b28]" />
                <span>{editingCourse ? 'Edit Academic Programme' : 'Add New Academic Course'}</span>
              </h4>
              <button onClick={() => setShowCourseModal(false)} className="text-gray-300 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCourseSubmit} className="p-6 text-xs space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Course / Major Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Political Science (Honours & General)"
                  value={courseFormData.course_name}
                  onChange={(e) => setCourseFormData({ ...courseFormData, course_name: e.target.value })}
                  className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stream *</label>
                  <select
                    value={courseFormData.stream}
                    onChange={(e) => setCourseFormData({ ...courseFormData, stream: e.target.value })}
                    className="w-full border rounded-lg p-2 bg-white"
                  >
                    <option value="ARTS">ARTS</option>
                    <option value="SCIENCE">SCIENCE</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={courseFormData.duration}
                    onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Degree Type</label>
                <input
                  type="text"
                  value={courseFormData.degree_type}
                  onChange={(e) => setCourseFormData({ ...courseFormData, degree_type: e.target.value })}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Course Description</label>
                <textarea
                  rows={3}
                  value={courseFormData.description}
                  onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={courseFormData.eligibility}
                  onChange={(e) => setCourseFormData({ ...courseFormData, eligibility: e.target.value })}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 border rounded text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-5 py-2 rounded font-bold shadow"
                >
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: HERO SLIDE FORM
      ======================================================== */}
      {showHeroModal && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
            <div className="bg-[#002858] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28]">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Sliders size={16} className="text-[#4a6b28]" />
                <span>{editingSlide ? 'Edit Slide' : 'Add New Hero Slide'}</span>
              </h4>
              <button onClick={() => setShowHeroModal(false)} className="text-gray-300 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="p-6 text-xs space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Slide Title / Event *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 18th Freshers Day at State Academy Hall"
                  value={slideFormData.title}
                  onChange={(e) => setSlideFormData({ ...slideFormData, title: e.target.value })}
                  className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Subtitle / Caption</label>
                <input
                  type="text"
                  placeholder="e.g. Welcoming our fresh batch of undergraduate scholars"
                  value={slideFormData.subtitle}
                  onChange={(e) => setSlideFormData({ ...slideFormData, subtitle: e.target.value })}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <DeviceImageUpload
                label="Slide Background Image"
                required
                value={slideFormData.image}
                onChange={(img) => setSlideFormData({ ...slideFormData, image: img })}
                aspectHint="Recommended: 16:9 widescreen (1920×1080) for Hero Slider"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={slideFormData.order}
                    onChange={(e) => setSlideFormData({ ...slideFormData, order: parseInt(e.target.value) || 1 })}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="slideActive"
                    checked={slideFormData.active}
                    onChange={(e) => setSlideFormData({ ...slideFormData, active: e.target.checked })}
                  />
                  <label htmlFor="slideActive" className="font-semibold text-gray-800 cursor-pointer">
                    Display on Homepage
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowHeroModal(false)}
                  className="px-4 py-2 border rounded text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-5 py-2 rounded font-bold shadow"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD GALLERY PHOTO
      ======================================================== */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
            <div className="bg-[#002858] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28]">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Image size={16} className="text-[#4a6b28]" />
                <span>Add Photo to Campus Album</span>
              </h4>
              <button onClick={() => setShowGalleryModal(false)} className="text-gray-300 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGalleryPhoto} className="p-6 text-xs space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Volleyball Championship Finals"
                  value={galleryFormData.title}
                  onChange={(e) => setGalleryFormData({ ...galleryFormData, title: e.target.value })}
                  className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Album Category *</label>
                <select
                  value={galleryFormData.album}
                  onChange={(e) => setGalleryFormData({ ...galleryFormData, album: e.target.value })}
                  className="w-full border rounded-lg p-2 bg-white"
                >
                  <option value="Sports & Fitness">Sports & Fitness</option>
                  <option value="Cultural Events">Cultural Events</option>
                  <option value="Trifecta Fest">Trifecta Fest</option>
                  <option value="NSS & Community">NSS & Community</option>
                  <option value="Campus Life">Campus Life</option>
                  <option value="Health & Social">Health & Social</option>
                </select>
              </div>

              <DeviceImageUpload
                label="Gallery Photo"
                required
                value={galleryFormData.image}
                onChange={(img) => setGalleryFormData({ ...galleryFormData, image: img })}
                aspectHint="Recommended: High-resolution campus photo (JPG, PNG, WEBP)"
              />

              <div>
                <label className="block font-bold text-gray-700 mb-1">Caption / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Short description of the photo..."
                  value={galleryFormData.caption}
                  onChange={(e) => setGalleryFormData({ ...galleryFormData, caption: e.target.value })}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowGalleryModal(false)}
                  className="px-4 py-2 border rounded text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-5 py-2 rounded font-bold shadow"
                >
                  Upload to Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: FULLSCREEN PHOTO LIGHTBOX
      ======================================================== */}
      {selectedGalleryPhoto && (
        <div
          onClick={() => setSelectedGalleryPhoto(null)}
          className="fixed inset-0 z-70 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl animate-fadeIn text-white flex flex-col"
          >
            <div className="relative max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedGalleryPhoto.image}
                alt={selectedGalleryPhoto.title}
                className="max-h-[70vh] w-auto object-contain"
              />
              <button
                onClick={() => setSelectedGalleryPhoto(null)}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 bg-slate-900 flex justify-between items-center">
              <div>
                <span className="text-xs font-mono font-bold text-[#4a6b28] uppercase block">
                  {selectedGalleryPhoto.album}
                </span>
                <h4 className="font-bold text-base mt-0.5">{selectedGalleryPhoto.title}</h4>
                <p className="text-xs text-slate-300 mt-1">{selectedGalleryPhoto.caption}</p>
              </div>
              <button
                onClick={() => setSelectedGalleryPhoto(null)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-lg text-xs font-bold"
              >
                Close Lightbox
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: VIEW INQUIRY DETAILS
      ======================================================== */}
      {viewInquiry && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
            <div className="bg-[#002858] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28]">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Mail size={16} className="text-[#4a6b28]" />
                <span>Visitor Inquiry Message</span>
              </h4>
              <button onClick={() => setViewInquiry(null)} className="text-gray-300 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 text-xs space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">{viewInquiry.full_name}</h5>
                    <p className="text-blue-700 font-semibold">{viewInquiry.email}</p>
                    {viewInquiry.phone && <p className="text-gray-500">{viewInquiry.phone}</p>}
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">{viewInquiry.created_at}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-gray-700 block mb-1">Subject</span>
                <p className="font-semibold text-gray-900 text-sm bg-gray-50 p-2.5 rounded-lg border">
                  {viewInquiry.subject}
                </p>
              </div>

              <div>
                <span className="font-bold text-gray-700 block mb-1">Message Content</span>
                <p className="text-gray-800 leading-relaxed bg-gray-50 p-3 rounded-lg border whitespace-pre-wrap">
                  {viewInquiry.message}
                </p>
              </div>

              <div className="pt-2 border-t flex flex-wrap justify-between items-center gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateInquiryStatus(viewInquiry.id, 'CONTACTED')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold"
                  >
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => handleUpdateInquiryStatus(viewInquiry.id, 'RESOLVED')}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-bold"
                  >
                    Mark Resolved
                  </button>
                </div>

                <a
                  href={`mailto:${viewInquiry.email}?subject=Re: ${encodeURIComponent(viewInquiry.subject)}`}
                  className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5"
                >
                  <Send size={13} />
                  <span>Send Direct Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: REGISTER ADMIN USER
      ======================================================== */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
            <div className="bg-[#002858] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28]">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <UserPlus size={16} className="text-[#4a6b28]" />
                <span>Register Administrative User</span>
              </h4>
              <button onClick={() => setShowAddUserModal(false)} className="text-gray-300 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="p-6 text-xs space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name & Official Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sentila Ao"
                  value={newUserData.full_name}
                  onChange={(e) => setNewUserData({ ...newUserData, full_name: e.target.value })}
                  className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Login Username *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. sentila_admin"
                  value={newUserData.username}
                  onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                  className="w-full border rounded-lg p-2.5 font-mono font-bold focus:outline-none focus:border-[#4a6b28]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@capitalcollege.edu.in"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full border rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Temporary Security Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min. 4 characters"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  className="w-full border rounded-lg p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Institutional Role</label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full border rounded-lg p-2.5 bg-white font-mono font-bold"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="ADMISSIONS_ADMIN">ADMISSIONS_ADMIN</option>
                  <option value="NEWS_ADMIN">NEWS_ADMIN</option>
                  <option value="MEDIA_ADMIN">MEDIA_ADMIN</option>
                  <option value="ACADEMICS_ADMIN">ACADEMICS_ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border rounded text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-5 py-2 rounded font-bold shadow"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: PROFILE & CREDENTIALS
      ======================================================== */}
      {showProfileModal && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
            <div className="bg-[#002858] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28]">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Settings size={16} className="text-[#4a6b28]" />
                <span>Manage My Admin Credentials</span>
              </h4>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-300 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="p-6 text-xs space-y-3">
              {profileSuccess && (
                <div className="bg-green-50 border border-green-300 text-green-800 p-2.5 rounded font-bold text-center">
                  {profileSuccess}
                </div>
              )}
              {profileError && (
                <div className="bg-red-50 border border-red-300 text-red-700 p-2.5 rounded">
                  {profileError}
                </div>
              )}

              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Display Name</label>
                <input
                  type="text"
                  required
                  value={profileData.full_name}
                  onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                  className="w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#4a6b28]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Username (Custom Login ID)</label>
                <input
                  type="text"
                  required
                  value={profileData.newUsername}
                  onChange={(e) => setProfileData({ ...profileData, newUsername: e.target.value })}
                  className="w-full border rounded-lg p-2.5 font-mono font-bold text-[#002858] focus:outline-none focus:border-[#4a6b28]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full border rounded-lg p-2.5"
                />
              </div>

              <div className="pt-2 border-t">
                <label className="block font-bold text-gray-700 mb-1">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  placeholder="Enter new password if changing"
                  value={profileData.newPassword}
                  onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                  className="w-full border rounded-lg p-2.5"
                />
              </div>

              {profileData.newPassword && (
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={profileData.confirmPassword}
                    onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                    className="w-full border rounded-lg p-2.5"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 border rounded text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-5 py-2 rounded font-bold shadow"
                >
                  {profileLoading ? 'Saving...' : 'Save Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admission Closure Notice Modal */}
      {showNoticeEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div className="flex items-center gap-2">
                <Edit3 size={18} className="text-[#4a6b28]" />
                <h3 className="font-bold text-base text-[#002147]">Edit Admissions Notice</h3>
              </div>
              <button onClick={() => setShowNoticeEditModal(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Public Notice Message (Shown to prospective students)
                </label>
                <textarea
                  value={editNoticeText}
                  onChange={(e) => setEditNoticeText(e.target.value)}
                  rows={4}
                  className="w-full text-xs sm:text-sm border rounded-xl p-3 focus:outline-none focus:border-[#4a6b28]"
                  placeholder="Enter notice explaining admission status..."
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
                💡 This notice is immediately displayed on the public website and inside the online admission modal when admissions are closed.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowNoticeEditModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNotice}
                  disabled={savingAdmissionStatus}
                  className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {savingAdmissionStatus ? 'Saving...' : 'Save Notice'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CREATE / EDIT TICKER ANNOUNCEMENT (REQUEST 6)
      ======================================================== */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn max-h-[92vh] flex flex-col">
            <div className="bg-[#002147] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#8fc35e]">
                  <Megaphone size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">
                    {editingAnnouncement ? 'Edit Ticker Announcement' : 'Publish Alert to Top Ticker'}
                  </h4>
                  <p className="text-[11px] text-gray-300">
                    Displayed prominently in the sticky alert bar on header
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="text-gray-300 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="p-6 text-xs space-y-4 overflow-y-auto">
              {/* Tag & Presets */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Alert Tag Badge *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EXAM ROUTINE, FYUGP ADMISSIONS, SCHOLARSHIPS"
                  value={announcementFormData.tag}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, tag: e.target.value.toUpperCase() })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 font-bold uppercase text-gray-900 focus:outline-none focus:border-[#4a6b28]"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['EXAM ROUTINE', 'FYUGP ADMISSION', 'SCHOLARSHIP', 'IQAC NOTICE', 'HOLIDAY NOTICE', 'URGENT'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAnnouncementFormData({ ...announcementFormData, tag: preset })}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold cursor-pointer"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Announcement Message */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Announcement Message *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Nagaland University Under Graduate Examination Routine 2023 for B.A & B.Sc semester exams is out."
                  value={announcementFormData.text}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, text: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 leading-relaxed focus:outline-none focus:border-[#4a6b28]"
                />
              </div>

              {/* Action Button Config */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Primary Action Label</label>
                  <input
                    type="text"
                    placeholder="e.g. VIEW ROUTINES →"
                    value={announcementFormData.action_label}
                    onChange={(e) => setAnnouncementFormData({ ...announcementFormData, action_label: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Page ID or URL</label>
                  <input
                    type="text"
                    placeholder="e.g. exam-routine or /notices"
                    value={announcementFormData.action_page || announcementFormData.action_href}
                    onChange={(e) => setAnnouncementFormData({ ...announcementFormData, action_page: e.target.value, action_href: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-900 font-mono"
                  />
                </div>
              </div>

              {/* Order & Live Active */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={announcementFormData.display_order}
                    onChange={(e) => setAnnouncementFormData({ ...announcementFormData, display_order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-900"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="annActiveCheck"
                    checked={announcementFormData.is_active}
                    onChange={(e) => setAnnouncementFormData({ ...announcementFormData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 cursor-pointer"
                  />
                  <label htmlFor="annActiveCheck" className="font-bold text-gray-800 cursor-pointer">
                    Show immediately on live website
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAnnouncement}
                  className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-5 py-2 rounded-lg font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>{savingAnnouncement ? 'Saving...' : editingAnnouncement ? 'Update Announcement' : 'Publish Alert'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: UPLOAD / EDIT INSTITUTIONAL DOCUMENT (REQUEST 8)
      ======================================================== */}
      {showDocumentModal && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn max-h-[92vh] flex flex-col">
            <div className="bg-[#002147] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#8fc35e]">
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">
                    Upload Official Institutional Document / PDF Form
                  </h4>
                  <p className="text-[11px] text-gray-300">
                    PDF application forms, syllabi, circulars, and routines
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDocumentModal(false)}
                className="text-gray-300 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="p-6 text-xs space-y-4 overflow-y-auto">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FYUGP Admission Application Form or Academic Prospectus"
                  value={documentFormData.title}
                  onChange={(e) => setDocumentFormData({ ...documentFormData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 font-bold focus:outline-none focus:border-[#4a6b28]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={documentFormData.category}
                    onChange={(e) => setDocumentFormData({ ...documentFormData, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs text-gray-800 bg-white"
                  >
                    <option value="Admission">Admission</option>
                    <option value="Examination">Examination</option>
                    <option value="Welfare">Welfare & Schemes</option>
                    <option value="Prospectus">Prospectus</option>
                    <option value="General">General Circular</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Document Key Identifier</label>
                  <input
                    type="text"
                    placeholder="e.g. admission_form, prospectus"
                    value={documentFormData.doc_key}
                    onChange={(e) => setDocumentFormData({ ...documentFormData, doc_key: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs font-mono text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description / Student Guidance</label>
                <textarea
                  rows={2}
                  placeholder="Brief note on who should download this form and submission instructions..."
                  value={documentFormData.description}
                  onChange={(e) => setDocumentFormData({ ...documentFormData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900"
                />
              </div>

              {/* Device Document Upload */}
              <DeviceDocumentUpload
                label="Select PDF File from Device *"
                value={documentFormData.file_data}
                fileName={documentFormData.file_name}
                onChange={(base64) => setDocumentFormData({ ...documentFormData, file_data: base64 })}
                onFileNameChange={(fName) => setDocumentFormData({ ...documentFormData, file_name: fName })}
                hint="Upload official PDF file. Will be available for instant download by students."
              />

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowDocumentModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingDoc}
                  className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-5 py-2 rounded-lg font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Upload size={14} />
                  <span>{uploadingDoc ? 'Uploading...' : 'Save & Upload Document'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT SOCIAL CHANNEL (REQUEST 7)
      ======================================================== */}
      {showSocialModal && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
            <div className="bg-[#002147] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#8fc35e]">
                  <Share2 size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">
                    {editingSocialLink ? 'Edit Social Channel' : 'Add Social Channel / Link'}
                  </h4>
                  <p className="text-[11px] text-gray-300">
                    Rendered in Footer and Top Navigation Bar
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSocialModal(false)}
                className="text-gray-300 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSocialLink} className="p-6 text-xs space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Social Platform *</label>
                <select
                  value={socialFormData.platform}
                  onChange={(e) => {
                    const plat = e.target.value;
                    const defaultLabels = {
                      whatsapp: 'WhatsApp Helpline',
                      facebook: 'Facebook',
                      instagram: 'Instagram',
                      youtube: 'YouTube Channel',
                      twitter: 'Twitter / X',
                      linkedin: 'LinkedIn',
                      telegram: 'Telegram Channel'
                    };
                    setSocialFormData({
                      ...socialFormData,
                      platform: plat,
                      label: defaultLabels[plat] || plat
                    });
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-900 font-bold"
                >
                  <option value="whatsapp">WhatsApp (Official Helpline)</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="telegram">Telegram</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Display Title / Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WhatsApp Helpline or Official Instagram"
                  value={socialFormData.label}
                  onChange={(e) => setSocialFormData({ ...socialFormData, label: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Channel / Chat Link URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://wa.me/919436002789 or https://facebook.com/..."
                  value={socialFormData.url}
                  onChange={(e) => setSocialFormData({ ...socialFormData, url: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-mono text-gray-900"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  💡 For WhatsApp: use format <code>https://wa.me/919436002789</code>
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="socActiveCheck"
                  checked={socialFormData.is_active}
                  onChange={(e) => setSocialFormData({ ...socialFormData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 cursor-pointer"
                />
                <label htmlFor="socActiveCheck" className="font-bold text-gray-800 cursor-pointer">
                  Show channel icon on live website
                </label>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowSocialModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSocialLink}
                  className="bg-[#4a6b28] hover:bg-[#3d5920] text-white px-5 py-2 rounded-lg font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>{savingSocialLink ? 'Saving...' : editingSocialLink ? 'Update Channel' : 'Add Channel'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
