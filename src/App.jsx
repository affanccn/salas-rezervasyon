import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, Users, UtensilsCrossed, Armchair, Plus, Trash2, MoonStar, 
  ChefHat, Search, Edit2, X, Check, Loader2, Clock, CheckCircle, Phone, 
  Printer, MessageSquareText, MessageCircle, Map, Flame, BellRing, 
  MonitorPlay, Lock, ArrowRight, MapPin, Instagram, Wind, Coffee, 
  ChevronRight, Star, Inbox, CheckCircle2, AlertTriangle, History, MenuSquare,
  Image as ImageIcon, AlignLeft, DollarSign, UploadCloud, GripVertical, UserSquare, Menu,
  Home, Smartphone, Copy, Sparkles, Share2, Eye, Calendar, CheckSquare,
  ChevronDown, Tv, Trophy, HelpCircle
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// --- ZORUNLU MOBİL UYUMLULUK (VIEWPORT) ---
if (typeof document !== 'undefined') {
  let viewportMeta = document.querySelector('meta[name="viewport"]');
  if (!viewportMeta) {
    viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    document.head.appendChild(viewportMeta);
  }
  viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
}

// --- FIREBASE AYARLARI ---
const firebaseConfig = {
  apiKey: "AIzaSyD6RgXBBISFM21oJKRYRhwwCnR38NBbl9k",
  authDomain: "salaas-cafe-9c6dc.firebaseapp.com",
  projectId: "salaas-cafe-9c6dc",
  storageBucket: "salaas-cafe-9c6dc.firebasestorage.app",
  messagingSenderId: "1074809461661",
  appId: "1:1074809461661:web:5fb47660e84968e3ffed74"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// --- SABİTLER VE VERİLER ---
const WHATSAPP_NO = "905360170208";

const TABLE_MAP = [
  { id: 'B-3', top: '8%', left: '5%', width: '8%', height: '11%', type: 'v' }, { id: 'B-2', top: '8%', left: '17%', width: '8%', height: '11%', type: 'v' }, { id: 'B-1', top: '8%', left: '29%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-4', top: '23%', left: '5%', width: '8%', height: '11%', type: 'v' }, { id: 'B-5', top: '23%', left: '17%', width: '8%', height: '11%', type: 'v' }, { id: 'B-6', top: '23%', left: '29%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-9', top: '38%', left: '5%', width: '8%', height: '11%', type: 'v' }, { id: 'B-8', top: '38%', left: '17%', width: '8%', height: '11%', type: 'v' }, { id: 'B-7', top: '38%', left: '29%', width: '8%', height: '11%', type: 'v' },
  { id: 'B-10', top: '53%', left: '5%', width: '13%', height: '6%', type: 'h' }, { id: 'B-11', top: '53%', left: '21%', width: '13%', height: '6%', type: 'h' },
  { id: 'B-12', top: '48%', left: '38%', width: '9%', height: '14%', type: 'lg-v' }, { id: 'B-24', top: '74%', left: '38%', width: '9%', height: '14%', type: 'lg-v' },
  { id: 'B-13', top: '8%', left: '76%', width: '9%', height: '14%', type: 'lg-v' }, { id: 'B-14', top: '26%', left: '76%', width: '9%', height: '14%', type: 'lg-v' },
  { id: 'B-20', top: '48%', left: '56%', width: '14%', height: '6%', type: 'h' }, { id: 'B-21', top: '61%', left: '56%', width: '14%', height: '6%', type: 'h' }, { id: 'B-22', top: '74%', left: '56%', width: '14%', height: '6%', type: 'h' }, { id: 'B-23', top: '87%', left: '56%', width: '14%', height: '6%', type: 'h' },
  { id: 'B-16', top: '46%', left: '80%', width: '9%', height: '12%', type: 'lg-v' }, { id: 'B-17', top: '60%', left: '80%', width: '9%', height: '12%', type: 'lg-v' }, { id: 'B-18', top: '74%', left: '80%', width: '9%', height: '12%', type: 'lg-v' }, { id: 'B-19', top: '88%', left: '80%', width: '9%', height: '12%', type: 'lg-v' },
];

const MATCH_FIXTURE = [
  { date: '2026-03-10', displayDate: '10 Mart 2026', team1: 'Galatasaray', team2: 'Liverpool' },
  { date: '2026-03-13', displayDate: '13 Mart 2026', team1: 'F. Karagümrük', team2: 'Fenerbahçe' },
  { date: '2026-03-14', displayDate: '14 Mart 2026', team1: 'Galatasaray', team2: 'Başakşehir' },
].sort((a, b) => new Date(a.date) - new Date(b.date));

const BASE_CATEGORIES = [
  { id: 'kahvalti', name: 'KAHVALTI', Icon: Coffee }, { id: 'tostlar', name: 'TOSTLAR', Icon: UtensilsCrossed },
  { id: 'wrap', name: 'WRAP & QUESADILLA', Icon: UtensilsCrossed }, { id: 'pizza', name: 'PİZZA', Icon: UtensilsCrossed },
  { id: 'burger', name: 'HAMBURGER', Icon: UtensilsCrossed }, { id: 'kofte', name: 'KÖFTE LEZZETLERİ', Icon: ChefHat },
  { id: 'tavuk', name: 'TAVUK LEZZETLERİ', Icon: ChefHat }, { id: 'et', name: 'ET LEZZETLERİ', Icon: ChefHat },
  { id: 'makarna', name: 'MAKARNA ÇEŞİTLERİ', Icon: UtensilsCrossed }, { id: 'salata', name: 'SALATA ÇEŞİTLERİ', Icon: UtensilsCrossed },
  { id: 'tatli', name: 'SALAŞ TATLI', Icon: Star }, { id: 'cay', name: 'ÇAYLAR', Icon: Coffee },
  { id: 'turk_kahvesi', name: 'TÜRK KAHVESİ', Icon: Coffee }, { id: 'sicak_kahve', name: 'SICAK KAHVELER', Icon: Coffee },
  { id: 'sicak_diger', name: 'SICAK ÇİKOLATA', Icon: Coffee }, { id: 'soguk_kahve', name: 'SOĞUK KAHVELER', Icon: Coffee },
  { id: 'kokteyl', name: 'KOKTEYLLER', Icon: Coffee }, { id: 'soguk_icecek', name: 'SOĞUK İÇECEKLER', Icon: Coffee },
  { id: 'nargile', name: 'NARGİLE ÇEŞİTLERİ', Icon: Wind }
];

const AVAILABLE_ICONS_MAP = { Coffee, UtensilsCrossed, ChefHat, Star, Wind, Flame, MoonStar, CheckCircle };

const BADGE_OPTIONS = [
  { id: 'iki_kisilik', label: 'İki Kişiliktir', icon: '👥' },
  { id: 'yeni', label: 'Yeni Çıkan', icon: '🆕' },
  { id: 'acili', label: 'Acılı', icon: '🌶️' },
  { id: 'sefin_onerisi', label: 'Şefin Önerisi', icon: '👨‍🍳' },
  { id: 'populer', label: 'En Çok Tercih Edilen', icon: '🔥' },
  { id: 'vegan', label: 'Vegan', icon: '🌿' }
];

const DEFAULT_MENU_GALLERY = [
  { id: '1', name: 'Salaaş Köy Kahvaltısı', image: '/salaskoy.jpg', tag: 'İmza Lezzet', isFeatured: true },
  { id: '2', name: 'Mantarlı Fırın Burger', image: '/mantarlıfırınburger.jpg', tag: 'Özel', isFeatured: true },
  { id: '3', name: 'Ispanak Yatağında Tavuk', image: '/ıspanakyatagındatavuk.jpg', tag: 'Şefin Tavsiyesi', isFeatured: true },
  { id: '4', name: 'Etli Bowl Tabağı', image: '/etlibowltabagi.jpg', tag: 'Sağlıklı', isFeatured: true },
  { id: '5', name: 'Üç Renkli Tortellini', image: '/ucrenklitortellini.jpg', tag: 'Yeni', isFeatured: true },
];

const DEFAULT_MENU_ITEMS = [
  { cat: 'kahvalti', items: [{n:'Salaaş Köy Kahvaltısı', i:'/salaskoy.jpg', f:true, b:['sefin_onerisi'], o:1}, {n:'Kahvaltı Tabağı', i:'/kahvaltitabagi.jpg', o:2}, {n:'Menemen', o:3}, {n:'Pankek', o:4}] },
  { cat: 'burger', items: [{n:'Mantarlı Fırın Burger', i:'/mantarlıfırınburger.jpg', b:['populer'], o:1}, {n:'Klasik Burger', o:2}, {n:'Cheeseburger', o:3}] },
  { cat: 'kofte', items: [{n:'Hünkar Köfte', i:'/hunkarkofte.jpg', b:['sefin_onerisi'], o:1}, {n:'Izgara Köfte', o:2}, {n:'Kaşarlı Köfte', o:3}] },
  { cat: 'tavuk', items: [{n:'Cafe de Paris Soslu Tavuk', i:'/cafedeparis.jpg', o:1}, {n:'Ispanak Yatağında Tavuk', i:'/ıspanakyatagındatavuk.jpg', f:true, o:2}, {n:'Köz Patlıcanlı Tavuk', i:'/közpatlıcanlıtavukbnfile.jpg', o:3}] },
  { cat: 'et', items: [{n:'Etli Bowl Tabağı', i:'/etlibowltabagi.jpg', f:true, o:1}, {n:'Dana Lokum', o:2}, {n:'Çoban Kavurma', o:3}] },
  { cat: 'makarna', items: [{n:'Üç Renkli Tortellini', i:'/ucrenklitortellini.jpg', f:true, o:1}, {n:'Cheddar Çıtır Makarna', i:'/chedarcitirmakarna.jpg', o:2}, {n:'Penne Arabiata', o:3}] },
  { cat: 'tatli', items: [{n:'Dubai Çikolatalı', i:'/dubai cikolatalı.jpg', b:['yeni', 'populer'], o:1}, {n:'Lotus Dome', i:'/lotus dome.jpg', o:2}, {n:'Profiterol', i:'/profiterol.jpg', o:3}] },
  { cat: 'kokteyl', items: [{n:'Cool Lime', i:'/coollime.jpg', o:1}, {n:'Mojito', o:2}, {n:'Pina Colada', o:3}] },
  { cat: 'soguk_kahve', items: [{n:'Ice Mocha', i:'/icemocha.jpg', o:1}, {n:'Ice Latte', o:2}] },
  { cat: 'sicak_kahve', items: [{n:'Caramel Macchiato', i:'/caramelmachiato.jpg', o:1}, {n:'Espresso', o:2}] }
];

const GLOBAL_CSS = ``;

export default function App() {
  const getToday = () => {
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' });
    return formatter.format(new Date());
  };

  const typeLabels = { kahvalti: 'Kahvaltı', yemek: 'Yemek', dogum_gunu: 'Doğum Günü', organizasyon: 'Organizasyon', mac: 'Maç Yayını' };

  // --- KALICI AUTH VE MOBİL / PWA BAŞLANGIÇ YÖNLENDİRMESİ ---
  const getInitialAuth = () => {
    try {
      return localStorage.getItem('salaas_admin_auth') === 'true';
    } catch (e) {
      return false;
    }
  };

  const getInitialView = () => {
    try {
      const hash = (typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '');
      const search = (typeof window !== 'undefined' ? window.location.search : '');
      const pathname = (typeof window !== 'undefined' ? window.location.pathname : '');
      
      if (hash === 'admin' || search.includes('admin') || pathname === '/admin') {
        return 'admin';
      }
      if (hash === 'menu') return 'menu';
      if (hash === 'personnel') return 'personnel';
      
      // iPhone Safari "Telefona Ekle" (Standalone Modu)
      if (typeof window !== 'undefined' && window.navigator?.standalone && localStorage.getItem('salaas_admin_auth') === 'true') {
        return 'admin';
      }
    } catch (e) {}
    return 'landing';
  };

  // --- STATE ---
  const [currentView, setCurrentView] = useState(getInitialView);
  const [activeAdminTab, setActiveAdminTab] = useState('talepler'); // Talepler öncelikli
  
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuth);
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showAdminPwaGuide, setShowAdminPwaGuide] = useState(true);
  const [previousPendingCount, setPreviousPendingCount] = useState(0);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bulkMessage, setBulkMessage] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestData, setRequestData] = useState({ type: 'yemek', name: '', phone: '', peopleCount: 2, date: getToday(), notes: '' });
  const [requestError, setRequestError] = useState('');

  const [reservations, setReservations] = useState([]);
  const [matchReservations, setMatchReservations] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  
  const [menuItems, setMenuItems] = useState([]);
  const [dbCategories, setDbCategories] = useState([]); 

  // --- PERSONEL STATE ---
  const [personnelList, setPersonnelList] = useState([]);
  const [isPersonnelEditing, setIsPersonnelEditing] = useState(null);
  const initialPersonnelState = { name: '', surname: '', nickname: '', skills: '', image: '', order: '', reviews: [] };
  const [personnelData, setPersonnelData] = useState(initialPersonnelState);
  const [personnelErrorMsg, setPersonnelErrorMsg] = useState('');
  const [uploadingPersonnelImage, setUploadingPersonnelImage] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null); 
  const [reviewData, setReviewData] = useState({ name: '', isAnonymous: false, rating: 5, comment: '' }); 
  
  const [managingReviewsFor, setManagingReviewsFor] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});

  const [selectedFilterDate, setSelectedFilterDate] = useState(getToday());
  const [selectedMatchDate, setSelectedMatchDate] = useState(getToday());
  const [searchTerm, setSearchTerm] = useState('');
  const [matchSearchTerm, setMatchSearchTerm] = useState('');
  
  const [isEditing, setIsEditing] = useState(null);
  const [isMatchEditing, setIsMatchEditing] = useState(null);
  
  const initialFormState = { type: 'yemek', name: '', phone: '', notes: '', peopleCount: 1, table: '', date: getToday() };
  const [formData, setFormData] = useState(initialFormState);
  
  const initialMatchFormState = { type: 'mac', name: '', phone: '', notes: '', peopleCount: 1, table: '', date: getToday() };
  const [matchFormData, setMatchFormData] = useState(initialMatchFormState);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [matchErrorMsg, setMatchErrorMsg] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [matchDeleteConfirmId, setMatchDeleteConfirmId] = useState(null);
  const [personnelDeleteConfirmId, setPersonnelDeleteConfirmId] = useState(null);
  const [printSingleId, setPrintSingleId] = useState(null);
  const [showTableMap, setShowTableMap] = useState(false);

  // --- TOAST NOTIFICATION STATE ---
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const [historyDateFilter, setHistoryDateFilter] = useState(''); 
  const [historyTypeFilter, setHistoryTypeFilter] = useState('all'); 

  // --- MENÜ YÖNETİMİ STATE ---
  const [isMenuEditing, setIsMenuEditing] = useState(null);
  const [menuSearchTerm, setMenuSearchTerm] = useState('');
  const [menuFilterCategory, setMenuFilterCategory] = useState('all');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [draggedItem, setDraggedItem] = useState(null);

  const initialMenuItemState = { category: 'kahvalti', name: '', price: '', description: '', image: '', isFeatured: false, order: '', badges: [], isSoldOut: false, prepTime: '', calories: '' };
  const [menuItemData, setMenuItemData] = useState(initialMenuItemState);
  const [menuErrorMsg, setMenuErrorMsg] = useState('');
  const [menuDeleteConfirmId, setMenuDeleteConfirmId] = useState(null);

  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  // --- DERIVED STATE CALCULATIONS ---
  const ALL_CATEGORIES = [...BASE_CATEGORIES];
  dbCategories.forEach(dbC => {
    if (!ALL_CATEGORIES.find(c => c.id === dbC.id)) {
       ALL_CATEGORIES.push({ ...dbC, Icon: AVAILABLE_ICONS_MAP[dbC.iconString] || UtensilsCrossed });
    }
  });

  const activeMenuCategories = menuItems.length > 0 
    ? ALL_CATEGORIES.map(cat => ({ 
        ...cat, 
        items: menuItems
                 .filter(item => item.category === cat.id)
                 .sort((a,b) => (a.order || 999) - (b.order || 999) || a.name.localeCompare(b.name)) 
      })).filter(cat => cat.items.length > 0)
    : ALL_CATEGORIES.map(cat => {
        const defaultCat = DEFAULT_MENU_ITEMS.find(c => c.cat === cat.id);
        return { 
          ...cat, 
          items: defaultCat ? defaultCat.items.map(i => ({
            name: i.n, image: i.i || null, isFeatured: i.f || false, tag: i.t || null, price: null, description: null, order: i.o || 999, badges: i.b || [], isSoldOut: false, prepTime: '', calories: ''
          })).sort((a,b) => a.order - b.order) : [] 
        };
      }).filter(cat => cat.items.length > 0);

  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    if (!activeCategory && activeMenuCategories.length > 0) {
      setActiveCategory(activeMenuCategories[0].id);
    }
  }, [activeMenuCategories, activeCategory]);

  useEffect(() => {
    if (currentView !== 'menu' || activeMenuCategories.length === 0) return;

    let ticking = false;
    const handleScrollSpy = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const headerOffset = 180; 
          let currentCatId = activeMenuCategories[0]?.id;
          
          for (const cat of activeMenuCategories) {
            const el = document.getElementById(`cat-${cat.id}`);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= headerOffset) {
                currentCatId = cat.id;
              }
            }
          }

          if (currentCatId && currentCatId !== activeCategory) {
            setActiveCategory(currentCatId);
            const btn = document.getElementById(`btn-${currentCatId}`);
            if (btn && btn.parentNode) {
              const container = btn.parentNode;
              const scrollLeft = btn.offsetLeft - (container.offsetWidth / 2) + (btn.offsetWidth / 2);
              container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [currentView, activeMenuCategories, activeCategory]);

  useEffect(() => {
    document.title = "Salaaş Cafe Restaurant | Rezervasyon & Menü";
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- URL HASH VE SAFARI STANDALONE YÖNLENDİRME DİNLEYİCİSİ ---
  useEffect(() => {
    const handleHash = () => {
      try {
        const hash = window.location.hash.replace('#', '');
        if (hash === 'admin') {
          const authed = localStorage.getItem('salaas_admin_auth') === 'true';
          if (authed) {
            setIsAuthenticated(true);
            setCurrentView('admin');
          } else {
            setShowLoginModal(true);
          }
        } else if (hash === 'menu') {
          setCurrentView('menu');
        } else if (hash === 'personnel') {
          setCurrentView('personnel');
        } else if (!hash) {
          if (localStorage.getItem('salaas_admin_auth') !== 'true') {
            setCurrentView('landing');
          }
        }
      } catch (e) {}
    };

    window.addEventListener('hashchange', handleHash);

    // İlk sayfa yüklenişinde kontrol
    const hash = (typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '');
    const authed = (typeof window !== 'undefined' ? localStorage.getItem('salaas_admin_auth') === 'true' : false);
    
    if (hash === 'admin') {
      if (authed) {
        setIsAuthenticated(true);
        setCurrentView('admin');
      } else {
        setShowLoginModal(true);
      }
    } else if (authed && typeof window !== 'undefined' && window.navigator?.standalone) {
      // iPhone Safari "Telefona Ekle" ile açıldığında otomatik Yönetim Panelinde kalır
      setIsAuthenticated(true);
      setCurrentView('admin');
      window.location.hash = 'admin';
    }

    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // --- YENİ REZERVASYON TALEBİ GELDİĞİNDE YALNIZCA YÖNETİCİYE BİLDİRİM GÖSTER (MÜŞTERİLER ASLA GÖRMEZ) ---
  useEffect(() => {
    if (isAuthenticated && currentView === 'admin') {
      if (pendingRequests.length > previousPendingCount && previousPendingCount > 0) {
        showToast(`🔔 Yeni Rezervasyon Talebi Düştü! (${pendingRequests.length} bekleyen)`, 'success');
        try {
          if ('vibrate' in navigator) navigator.vibrate([150, 80, 150]);
        } catch (e) {}
      }
    }
    setPreviousPendingCount(pendingRequests.length);
  }, [pendingRequests.length, previousPendingCount, isAuthenticated, currentView]);

  useEffect(() => {
    const handleAfterPrint = () => setPrintSingleId(null);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  useEffect(() => {
    signInAnonymously(auth).catch((err) => console.error("Auth error:", err));
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const restoranUnsub = onSnapshot(collection(db, 'reservations'), (snapshot) => {
      setReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    
    const matchUnsub = onSnapshot(collection(db, 'matchReservations'), (snapshot) => {
      setMatchReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    
    const reqUnsub = onSnapshot(collection(db, 'reservationRequests'), (snapshot) => {
      const allReqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const pendingList = allReqs.filter(r => r.status === 'pending').sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
      setPendingRequests(pendingList);
    });
    
    const menuUnsub = onSnapshot(collection(db, 'menuItems'), (snapshot) => {
      setMenuItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const catUnsub = onSnapshot(collection(db, 'menuCategories'), (snapshot) => {
      setDbCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const personnelUnsub = onSnapshot(collection(db, 'personnel'), (snapshot) => {
      setPersonnelList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    
    return () => { 
      restoranUnsub(); 
      matchUnsub(); 
      reqUnsub(); 
      menuUnsub(); 
      catUnsub();
      personnelUnsub();
    };
  }, [user]);

  // --- YARDIMCI VE YÖNLENDİRME FONKSİYONLARI ---
  const handleNavToMenu = () => {
    setCurrentView('menu');
    try { window.location.hash = 'menu'; } catch(e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavToHome = () => {
    setCurrentView('landing');
    try {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch(e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavToPersonnel = () => {
    setCurrentView('personnel');
    try { window.location.hash = 'personnel'; } catch(e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavToAdmin = () => {
    if (isAuthenticated) {
      setCurrentView('admin');
      try { window.location.hash = 'admin'; } catch(e) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowLoginModal(true);
    }
  };

  const handleScrollToId = (id) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      try {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch(e) {}
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const scrollToMenuCategory = (id) => {
    setActiveCategory(id); 
    const el = document.getElementById(`cat-${id}`);
    if (el) { 
      const y = el.getBoundingClientRect().top + window.scrollY - 140; 
      window.scrollTo({ top: y, behavior: 'smooth' }); 
    }
  };

  // --- KALICI GİRİŞ (IPHONE SAFARI İÇİN LOCALSTORAGE VE HASH) ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUser === 'salaas' && loginPass === 'Salaas.2026') {
      try {
        if (rememberMe) {
          localStorage.setItem('salaas_admin_auth', 'true');
        }
      } catch(err) {}
      setIsAuthenticated(true); 
      setShowLoginModal(false); 
      setLoginError('');
      setCurrentView('admin'); 
      try { window.location.hash = 'admin'; } catch(err) {}
      setActiveAdminTab('talepler'); // Hemen rezervasyon talepleri sekmesi açılır
      showToast('Yönetim Paneline Hoş Geldiniz! Oturum kalıcı olarak kaydedildi.', 'success');
    } else { 
      setLoginError('Kullanıcı adı veya şifre hatalı!'); 
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('salaas_admin_auth');
    } catch(err) {}
    setIsAuthenticated(false);
    setLoginUser('');
    setLoginPass('');
    setCurrentView('landing');
    try {
      history.replaceState(null, '', window.location.pathname);
    } catch(err) {}
    showToast('Yönetim oturumu kapatıldı', 'info');
  };

  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setRequestError('');
    setRequestData(prev => ({ 
      ...prev, 
      [name]: name.includes('Count') ? (value === '' ? '' : parseInt(value, 10)) : value 
    }));
  };

  // --- TALEP GÖNDERME (HEM DB HEM İSTEĞE BAĞLI WHATSAPP) ---
  const submitRequest = async (e, sendToWhatsapp = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!user) return;
    if (!requestData.name?.trim() || !requestData.phone?.trim()) return;

    if ((requestData.type === 'dogum_gunu' || requestData.type === 'organizasyon') && (!requestData.notes || !requestData.notes.trim())) {
      setRequestError("Lütfen detaylı açıklama giriniz."); 
      return;
    }

    try {
      const submissionData = { 
        ...requestData, 
        phone: requestData.phone.trim(), 
        peopleCount: parseInt(requestData.peopleCount, 10) || 1, 
        status: 'pending', 
        createdAt: new Date().toISOString(), 
        createdBy: user.uid 
      };
      
      // 1. Firebase Veritabanına (Panele) Kaydet
      await addDoc(collection(db, 'reservationRequests'), submissionData);

      // 2. Eğer WhatsApp ile de gönderilsin istenmişse doğrudan Salaaş WhatsApp hattına yönlendir
      if (sendToWhatsapp) {
        const typeName = typeLabels[submissionData.type] || submissionData.type;
        const msg = `Merhaba Salaaş Cafe & Restaurant,\nWeb siteniz üzerinden yeni bir rezervasyon talebi oluşturdum:\n\n` +
          `👤 İsim Soyisim: ${submissionData.name}\n` +
          `📞 Telefon: ${submissionData.phone}\n` +
          `📅 Tarih: ${submissionData.date}\n` +
          `👥 Kişi Sayısı: ${submissionData.peopleCount} Kişi\n` +
          `🏷️ Tür: ${typeName}\n` +
          `📝 Not / Detay: ${submissionData.notes || 'Belirtilmedi'}\n\n` +
          `Müsaitlik durumunu ve onayınızı rica ederim.`;

        window.open(`https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent(msg)}`, '_blank');
      }

      setRequestSuccess(true);
      setTimeout(() => { 
        setShowRequestModal(false); 
        setRequestSuccess(false); 
        setRequestData({ type: 'yemek', name: '', phone: '', peopleCount: 2, date: getToday(), notes: '' }); 
        setRequestError(''); 
      }, 3000);
    } catch (err) { 
      setRequestError("Hata oluştu."); 
    }
  };

  const handleApproveRequest = async (req, sendWhatsapp = false) => {
    if (!user) return;
    try {
      const targetCol = req.type === 'mac' ? 'matchReservations' : 'reservations';
      const newRes = { 
        type: req.type || 'yemek', 
        name: req.name, 
        phone: req.phone, 
        notes: req.notes || '', 
        peopleCount: req.peopleCount, 
        date: req.date, 
        table: '', 
        isArrived: false, 
        createdAt: new Date().toISOString(), 
        createdBy: user.uid 
      };
      await addDoc(collection(db, targetCol), newRes);
      await deleteDoc(doc(db, 'reservationRequests', req.id));
      if (sendWhatsapp) sendWhatsApp(newRes, req.type, true);
    } catch(err) { 
      console.error(err); 
    }
  };

  const handleRejectRequest = async (id) => {
    if (!user) return;
    try { await deleteDoc(doc(db, 'reservationRequests', id)); } catch(err) {}
  };

  const handleFormSubmit = async (e, isMac) => {
    e.preventDefault();
    if (!user) return;
    
    const currentForm = isMac ? matchFormData : formData;
    const currentEdit = isMac ? isMatchEditing : isEditing;
    const setFunc = isMac ? setMatchErrorMsg : setErrorMsg;
    const setForm = isMac ? setMatchFormData : setFormData;
    const initialForm = isMac ? { ...initialFormState, type: 'mac' } : initialFormState;
    const colName = isMac ? 'matchReservations' : 'reservations';

    if (!currentForm.name?.trim()) { 
      setFunc("İsim alanını doldurun."); 
      return; 
    }
    const cleanData = { 
      ...currentForm, 
      phone: currentForm.phone?.trim() || '', 
      notes: currentForm.notes?.trim() || '', 
      peopleCount: parseInt(currentForm.peopleCount, 10) || 1 
    };
    
    try {
      if (currentEdit) { 
        await updateDoc(doc(db, colName, currentEdit), { 
          ...cleanData, 
          updatedAt: new Date().toISOString() 
        }); 
        isMac ? setIsMatchEditing(null) : setIsEditing(null); 
      } else { 
        await addDoc(collection(db, colName), { 
          ...cleanData, 
          createdAt: new Date().toISOString(), 
          createdBy: user.uid, 
          isArrived: false 
        }); 
      }
      setForm({ ...initialForm, date: cleanData.date }); 
      setShowTableMap(false); 
      setFunc('');
    } catch (err) { 
      setFunc("Kayıt hatası."); 
    }
  };

  const handleEditClick = (res, isMac) => { 
    if(isMac) { 
      setMatchFormData({ ...res, phone: res.phone || '', notes: res.notes || '' }); 
      setIsMatchEditing(res.id); 
      setSelectedMatchDate(res.date); 
    } else { 
      setFormData({ ...res, phone: res.phone || '', notes: res.notes || '' }); 
      setIsEditing(res.id); 
      setSelectedFilterDate(res.date); 
    }
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };
  
  const cancelEdit = (isMac) => { 
    if(isMac) { 
      setIsMatchEditing(null); 
      setMatchFormData({ ...initialFormState, type: 'mac', date: selectedMatchDate }); 
      setMatchErrorMsg(''); 
    } else { 
      setIsEditing(null); 
      setFormData({ ...initialFormState, date: selectedFilterDate }); 
      setErrorMsg(''); 
    }
  };

  // --- MENÜ YÖNETİMİ FONKSİYONLARI ---
  const handleMenuChange = (e) => {
    const { name, value } = e.target;
    setMenuErrorMsg('');
    setMenuItemData(prev => ({ 
      ...prev, 
      [name]: name === 'order' ? (value === '' ? '' : parseInt(value, 10)) : value 
    }));
  };

  const handleBadgeChange = (badgeId) => {
    setMenuItemData(prev => {
      const hasBadge = prev.badges.includes(badgeId);
      if (hasBadge) {
        return { ...prev, badges: prev.badges.filter(b => b !== badgeId) };
      } else {
        if (prev.badges.length >= 2) {
          alert("Maksimum 2 adet ikon seçebilirsiniz.");
          return prev;
        }
        return { ...prev, badges: [...prev.badges, badgeId] };
      }
    });
  };

  const compressImageToBase64 = (file, maxWidth = 800) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    setMenuErrorMsg('');
    
    try {
      const base64Image = await compressImageToBase64(file, 800);
      setMenuItemData(prev => ({ ...prev, image: base64Image }));
    } catch (error) {
      console.error(error);
      setMenuErrorMsg("Resim işlenirken hata oluştu: " + (error.message || "Bilinmeyen hata"));
    } finally {
      setUploadingImage(false);
    }
  };

  const removeMenuImage = () => {
    setMenuItemData(prev => ({ ...prev, image: '' }));
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!menuItemData.name?.trim()) { 
      setMenuErrorMsg("Ürün adı zorunludur."); 
      return; 
    }
    
    const dataToSave = {
      ...menuItemData,
      order: menuItemData.order === '' ? 999 : menuItemData.order
    };

    try {
      if (isMenuEditing) {
        await updateDoc(doc(db, 'menuItems', isMenuEditing), { 
          ...dataToSave, 
          updatedAt: new Date().toISOString() 
        });
        setIsMenuEditing(null);
      } else {
        await addDoc(collection(db, 'menuItems'), { 
          ...dataToSave, 
          createdAt: new Date().toISOString() 
        });
      }
      setMenuItemData(initialMenuItemState); 
      setMenuErrorMsg('');
    } catch (err) { 
      setMenuErrorMsg("Menü kaydedilirken hata oluştu."); 
    }
  };

  const duplicateMenuItem = (item) => {
    setMenuItemData({
       category: item.category, 
       name: `${item.name} (Kopya)`, 
       price: item.price || '', 
       description: item.description || '', 
       image: item.image || '', 
       isFeatured: item.isFeatured || false, 
       order: item.order || 999, 
       badges: item.badges || [],
       isSoldOut: false,
       prepTime: item.prepTime || '',
       calories: item.calories || ''
    });
    setIsMenuEditing(null);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const toggleSoldOut = async (item) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'menuItems', item.id), { isSoldOut: !item.isSoldOut });
    } catch(err) { console.error(err); }
  };

  const handleAddCategory = async (e) => {
    if (e) e.preventDefault();
    if (!user || !newCategoryName.trim()) return;
    try {
      const catId = newCategoryName.trim().toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
      await addDoc(collection(db, 'menuCategories'), {
        id: catId,
        name: newCategoryName.trim().toUpperCase(),
        iconString: 'UtensilsCrossed'
      });
      setShowCategoryModal(false);
      setNewCategoryName('');
      setMenuItemData(prev => ({...prev, category: catId}));
    } catch(err) { console.error(err); }
  };

  // --- PERSONEL YÖNETİMİ FONKSİYONLARI ---
  const handlePersonnelChange = (e) => {
    const { name, value } = e.target;
    setPersonnelErrorMsg('');
    setPersonnelData(prev => ({ 
      ...prev, 
      [name]: name === 'order' ? (value === '' ? '' : parseInt(value, 10)) : value 
    }));
  };

  const handlePersonnelImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPersonnelImage(true);
    setPersonnelErrorMsg('');
    
    try {
      const base64Image = await compressImageToBase64(file, 800);
      setPersonnelData(prev => ({ ...prev, image: base64Image }));
    } catch (error) {
      console.error(error);
      setPersonnelErrorMsg("Resim işlenirken hata oluştu.");
    } finally {
      setUploadingPersonnelImage(false);
    }
  };

  const removePersonnelImage = () => {
    setPersonnelData(prev => ({ ...prev, image: '' }));
  };

  const handlePersonnelSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!personnelData.name?.trim() || !personnelData.surname?.trim()) { 
      setPersonnelErrorMsg("İsim ve Soyisim zorunludur."); 
      return; 
    }
    
    const dataToSave = {
      ...personnelData,
      order: personnelData.order === '' ? 999 : personnelData.order,
      reviews: personnelData.reviews || [] 
    };

    try {
      if (isPersonnelEditing) {
        await updateDoc(doc(db, 'personnel', isPersonnelEditing), { 
          ...dataToSave, 
          updatedAt: new Date().toISOString() 
        });
        setIsPersonnelEditing(null);
      } else {
        await addDoc(collection(db, 'personnel'), { 
          ...dataToSave, 
          createdAt: new Date().toISOString() 
        });
      }
      setPersonnelData(initialPersonnelState); 
      setPersonnelErrorMsg('');
    } catch (err) { 
      setPersonnelErrorMsg("Personel kaydedilirken hata oluştu."); 
    }
  };

  const executeDeletePersonnel = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'personnel', id));
      if (isPersonnelEditing === id) { 
        setIsPersonnelEditing(null); 
        setPersonnelData(initialPersonnelState); 
      }
      setPersonnelDeleteConfirmId(null);
      showToast('Personel başarıyla silindi.', 'success');
    } catch (err) { 
      console.error(err); 
      showToast('Personel silinirken hata oluştu.', 'error');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewData.comment.trim()) return;
    if (!reviewData.isAnonymous && !reviewData.name.trim()) {
      showToast('Lütfen adınızı girin veya Anonim olarak işaretleyin.', 'error');
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      name: reviewData.isAnonymous ? 'Anonim' : reviewData.name.trim(),
      rating: reviewData.rating,
      comment: reviewData.comment.trim(),
      date: new Date().toISOString()
    };

    try {
      const personRef = doc(db, 'personnel', selectedPersonnel.id);
      const updatedReviews = [...(selectedPersonnel.reviews || []), newReview];
      await updateDoc(personRef, { reviews: updatedReviews });
      
      setSelectedPersonnel(prev => ({ ...prev, reviews: updatedReviews }));
      setReviewData({ name: '', isAnonymous: false, rating: 5, comment: '' });
      showToast('Yorumunuz başarıyla eklendi! Teşekkür ederiz. 🙏', 'success');
    } catch (error) {
      console.error(error);
      showToast('Yorum eklenirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    }
  };

  const handleDeleteReview = async (personId, reviewId) => {
    try {
      const person = personnelList.find(p => p.id === personId);
      const updatedReviews = person.reviews.filter(r => r.id !== reviewId);
      await updateDoc(doc(db, 'personnel', personId), { reviews: updatedReviews });
      
      if (managingReviewsFor && managingReviewsFor.id === personId) {
        setManagingReviewsFor(prev => ({ ...prev, reviews: updatedReviews }));
      }
      if (selectedPersonnel && selectedPersonnel.id === personId) {
        setSelectedPersonnel(prev => ({ ...prev, reviews: updatedReviews }));
      }
      showToast('Yorum silindi.', 'info');
    } catch (err) { 
      console.error(err); 
      showToast('Yorum silinirken bir hata oluştu.', 'error');
    }
  };

  const handleReplyReview = async (personId, reviewId) => {
    const replyText = replyTexts[reviewId];
    if (!replyText?.trim()) return;
    try {
      const person = personnelList.find(p => p.id === personId);
      const updatedReviews = person.reviews.map(r => r.id === reviewId ? { ...r, reply: replyText.trim() } : r);
      await updateDoc(doc(db, 'personnel', personId), { reviews: updatedReviews });
      
      if (managingReviewsFor && managingReviewsFor.id === personId) {
        setManagingReviewsFor(prev => ({ ...prev, reviews: updatedReviews }));
      }
      if (selectedPersonnel && selectedPersonnel.id === personId) {
        setSelectedPersonnel(prev => ({ ...prev, reviews: updatedReviews }));
      }
      setReplyTexts(prev => ({ ...prev, [reviewId]: '' }));
    } catch (err) { 
      console.error(err); 
      alert("Cevap gönderilirken hata oluştu."); 
    }
  };

  const handleDeleteReply = async (personId, reviewId) => {
    try {
      const person = personnelList.find(p => p.id === personId);
      const updatedReviews = person.reviews.map(r => r.id === reviewId ? { ...r, reply: '' } : r);
      await updateDoc(doc(db, 'personnel', personId), { reviews: updatedReviews });
      
      if (managingReviewsFor && managingReviewsFor.id === personId) {
        setManagingReviewsFor(prev => ({ ...prev, reviews: updatedReviews }));
      }
      if (selectedPersonnel && selectedPersonnel.id === personId) {
        setSelectedPersonnel(prev => ({ ...prev, reviews: updatedReviews }));
      }
      showToast('Cevap silindi.', 'info');
    } catch (err) { 
      console.error(err); 
      showToast('Cevap silinirken bir hata oluştu.', 'error');
    }
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetItem) => {
    e.preventDefault();
    if (!user || !draggedItem || draggedItem.id === targetItem.id) {
       setDraggedItem(null);
       return;
    }

    const o1 = draggedItem.order !== undefined && draggedItem.order !== '' ? draggedItem.order : 999;
    const o2 = targetItem.order !== undefined && targetItem.order !== '' ? targetItem.order : 999;
    
    let finalO1 = o2;
    let finalO2 = o1;
    if (o1 === o2) { finalO1 = o1 - 1; finalO2 = o2 + 1; }

    try {
      await updateDoc(doc(db, 'menuItems', draggedItem.id), { order: finalO1 });
      await updateDoc(doc(db, 'menuItems', targetItem.id), { order: finalO2 });
    } catch(err) { console.error(err); }

    setDraggedItem(null);
  };

  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const importDefaultMenu = async () => {
    if (!user) return;
    setShowImportConfirm(false);
    try {
      for (const cat of DEFAULT_MENU_ITEMS) {
        for (const item of cat.items) {
          await addDoc(collection(db, 'menuItems'), { 
            category: cat.cat, 
            name: item.n, 
            price: '', 
            description: '', 
            image: item.i || '', 
            isFeatured: item.f || false, 
            order: item.o || 999, 
            badges: item.b || [],
            isSoldOut: false,
            prepTime: '',
            calories: '',
            createdAt: new Date().toISOString() 
          });
        }
      }
      showToast('Varsayılan menü başarıyla aktarıldı! ✅', 'success');
    } catch (err) { 
      showToast('Menü aktarımı sırasında hata oluştu.', 'error'); 
    }
  };

  const handleToggleArrived = async (id, currentStatus, collectionName) => {
    if (!user) return; 
    await updateDoc(doc(db, collectionName, id), { isArrived: !currentStatus });
  };

  const executeDelete = async (id, colName) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, colName, id));
      if (colName === 'reservations') { 
        setDeleteConfirmId(null); 
        if (isEditing === id) cancelEdit(false); 
      } 
      else if (colName === 'matchReservations') { 
        setMatchDeleteConfirmId(null); 
        if (isMatchEditing === id) cancelEdit(true); 
      } 
      else if (colName === 'menuItems') { 
        setMenuDeleteConfirmId(null); 
        if (isMenuEditing === id) { setIsMenuEditing(null); setMenuItemData(initialMenuItemState); } 
      }
    } catch (err) {}
  };

  const sendWhatsApp = (res, type, isApproval = false) => {
    if (!res.phone) return;
    let cleanPhone = res.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '9' + cleanPhone;
    else if (cleanPhone.length === 10) cleanPhone = '90' + cleanPhone;
    
    const eventName = typeLabels[res.type] ? typeLabels[res.type].toLowerCase() : 'rezervasyon';
    const masaMetni = res.table ? `${res.table} nolu masanız için ` : '';
    
    let message = `Sayın ${res.name || 'Misafirimiz'},\nSalaaş Cafe'ye ${res.date} tarihindeki ${masaMetni}${res.peopleCount} kişilik ${eventName} rezervasyonunuz alınmıştır. Bizi tercih ettiğiniz için teşekkür ederiz.`;
    
    if (isApproval) {
      message = `Sayın ${res.name || 'Misafirimiz'},\nSalaaş Cafe'ye ${res.date} tarihi için oluşturduğunuz ${res.peopleCount} kişilik ${eventName} rezervasyon talebiniz ONAYLANMIŞTIR. Bizi tercih ettiğiniz için teşekkür ederiz.`;
    }
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const sendBulkWhatsApp = (reservationsList, type) => {
    if (!reservationsList || reservationsList.length === 0) { 
      setBulkMessage("Gönderilecek kayıt yok."); 
      setTimeout(() => setBulkMessage(''), 5000); 
      return; 
    }
    const validReservations = reservationsList.filter(res => res.phone && res.phone.trim().length >= 10);
    if (validReservations.length === 0) { 
      setBulkMessage("Geçerli telefon numarası yok."); 
      setTimeout(() => setBulkMessage(''), 5000); 
      return; 
    }
    
    const eventName = type === 'mac' ? 'maç yayını' : 'rezervasyonunuzu';
    const dateStr = type === 'mac' ? selectedMatchDate : selectedFilterDate;
    
    let phoneListStr = "";
    validReservations.forEach(res => {
        let cleanPhone = res.phone.replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '9' + cleanPhone;
        else if (cleanPhone.length === 10) cleanPhone = '90' + cleanPhone;
        phoneListStr += cleanPhone + ",";
    });
    phoneListStr = phoneListStr.slice(0, -1);
    
    if(navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(phoneListStr).then(() => {
            setBulkMessage(`${validReservations.length} numara kopyalandı! Broadcast listenize yapıştırıp mesajı iletebilirsiniz.`);
            setTimeout(() => setBulkMessage(''), 6000);
        }).catch(err => { console.error(err); });
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return "SC";
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return "SC";
    return parts.length === 1 ? parts[0].substring(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const activeGallery = menuItems.length > 0 
    ? menuItems.filter(item => item.isFeatured).sort((a,b) => (a.order || 999) - (b.order || 999)) 
    : DEFAULT_MENU_GALLERY;

  const filteredReservations = reservations.filter(res => res.date === selectedFilterDate);
  const searchedReservations = filteredReservations.filter(res => !searchTerm || res.name?.toLowerCase().includes(searchTerm.toLowerCase()) || res.table?.toLowerCase().includes(searchTerm.toLowerCase()) || (res.phone && res.phone.includes(searchTerm)));
  const sortedReservations = [...searchedReservations].sort((a, b) => a.isArrived === b.isArrived ? new Date(b.createdAt) - new Date(a.createdAt) : (a.isArrived ? 1 : -1));
  const dailySummary = filteredReservations.reduce((acc, res) => { acc.totalPeople += (parseInt(res.peopleCount, 10) || 0); return acc; }, { totalPeople: 0 });

  const filteredMatchReservations = matchReservations.filter(res => res.date === selectedMatchDate);
  const searchedMatchReservations = filteredMatchReservations.filter(res => !matchSearchTerm || res.name?.toLowerCase().includes(matchSearchTerm.toLowerCase()) || res.table?.toLowerCase().includes(matchSearchTerm.toLowerCase()) || (res.phone && res.phone.includes(matchSearchTerm)));
  const sortedMatchReservations = [...searchedMatchReservations].sort((a, b) => a.isArrived === b.isArrived ? new Date(b.createdAt) - new Date(a.createdAt) : (a.isArrived ? 1 : -1));
  const totalMatchPeople = filteredMatchReservations.reduce((acc, res) => acc + (parseInt(res.peopleCount, 10) || 0), 0);

  const getTableStatus = (tableName) => {
    const res = filteredReservations.find(r => r.table?.trim().toUpperCase() === tableName.toUpperCase());
    if (!res) return 'empty';
    if (res.isArrived) return 'full';
    return 'reserved';
  };

  const handlePrintSingle = (id) => { 
    setPrintSingleId(id); 
    setTimeout(() => { window.print(); }, 150); 
  };

  const getHistoryData = () => {
    let allData = [];
    if (historyTypeFilter === 'all' || historyTypeFilter === 'restoran') {
        allData = [...allData, ...reservations.map(r => ({ ...r, eventType: typeLabels[r.type] || 'Genel' }))];
    }
    if (historyTypeFilter === 'all' || historyTypeFilter === 'mac') {
        allData = [...allData, ...matchReservations.map(r => ({ ...r, eventType: 'Maç' }))];
    }
    if (historyDateFilter) {
      allData = allData.filter(r => r.date === historyDateFilter);
    }
    allData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const totalPeople = allData.reduce((acc, curr) => acc + (parseInt(curr.peopleCount, 10) || 0), 0);
    const totalArrived = allData.filter(r => r.isArrived).reduce((acc, curr) => acc + (parseInt(curr.peopleCount, 10) || 0), 0);
    const arrivalRate = totalPeople > 0 ? Math.round((totalArrived * 100) / (totalPeople || 1)) : 0;
    
    return { list: allData, totalPeople, totalArrived, arrivalRate };
  };

  const historyStats = getHistoryData();

  // --- RENDER MODÜLLERİ ---
  const renderNavbar = (isDark = false) => (
    <>
      <div className={`fixed top-0 left-0 w-full z-50 flex flex-col transition-all duration-500 ${isScrolled || isDark ? 'glass py-2 sm:py-2.5 shadow-2xl' : 'bg-transparent py-2.5 sm:py-4'} border-b ${isScrolled || isDark ? 'border-white/10' : 'border-transparent'}`}>
        <nav className="w-full transition-all duration-500 flex flex-col items-center">
          
          {/* Üst Ana Satır: Logo (Sol) | Menü Linkleri (Orta-Masaüstü) | Butonlar (Sağ) */}
          <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-8 lg:px-16 flex items-center justify-between">
            <div className={`transition-all duration-300 cursor-pointer flex items-center justify-center shrink-0 ${isScrolled || isDark ? 'h-9 sm:h-12' : 'h-11 sm:h-16'}`} onClick={handleNavToHome}>
              <img src="/salaaslogobg.png" alt="Salaaş Logo" className="h-full w-auto object-contain select-none transition-transform duration-300 hover:scale-105" />
            </div>
            
            <div className={`hidden lg:flex flex-1 justify-center items-center gap-6 xl:gap-8 font-bold text-xs xl:text-sm uppercase tracking-[0.18em] transition-colors duration-500 ${isScrolled || isDark ? 'text-slate-200' : 'text-white drop-shadow-md'}`}>
              <button onClick={() => { if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('kahvalti'), 100); }} className="hover:text-[#c2784f] transition-all hover:-translate-y-0.5 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#c2784f] after:transition-all text-[#e09f7a]">🥞 Serpme Kahvaltı</button>
              <button onClick={() => { if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('mac-yayini'), 100); }} className="hover:text-[#c2784f] transition-all hover:-translate-y-0.5 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#c2784f] after:transition-all">⚽ Canlı Maç</button>
              <button onClick={() => { if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('lezzetler'), 100); }} className="hover:text-[#c2784f] transition-all hover:-translate-y-0.5 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#c2784f] after:transition-all">Lezzetler</button>
              <button onClick={handleNavToPersonnel} className={`hover:text-[#c2784f] transition-all hover:-translate-y-0.5 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#c2784f] after:transition-all ${currentView === 'personnel' ? 'text-[#c2784f] after:w-full' : ''}`}>Ekibimiz</button>
              <button onClick={() => { if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('sss'), 100); }} className="hover:text-[#c2784f] transition-all hover:-translate-y-0.5 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#c2784f] after:transition-all">SSS</button>
              <button onClick={() => { if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('iletisim'), 100); }} className="hover:text-[#c2784f] transition-all hover:-translate-y-0.5 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#c2784f] after:transition-all">İletişim</button>
            </div>
            
            {/* Masaüstü Butonlar + Mobilde Lüks Hızlı İkonlar */}
            <div className="shrink-0 flex items-center justify-end gap-2 sm:gap-3">
              {/* Masaüstü Rezervasyon & Menü Butonları */}
              <button 
                onClick={() => setShowRequestModal(true)} 
                className="hidden sm:flex btn-outline-premium active-press px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-black tracking-wider uppercase shadow-md items-center gap-2 shrink-0 hover:border-[#c2784f] transition-all"
              >
                <CalendarDays size={15} className="shrink-0" /> <span>Rezervasyon</span>
              </button>
              <button 
                onClick={handleNavToMenu} 
                className="hidden sm:flex btn-premium shine-effect active-press px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs font-black tracking-wider uppercase shadow-xl items-center gap-2 shrink-0"
              >
                <MenuSquare size={15} className="shrink-0" /> <span>Dijital Menü</span>
              </button>

              {/* Mobilde Hızlı Arama & Instagram Butonları */}
              <a 
                href={`tel:+${WHATSAPP_NO}`}
                className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#c2784f] active-press"
                aria-label="Telefonla Ara"
              >
                <Phone size={16} />
              </a>
              <a 
                href="https://www.instagram.com/salascaferestaurant/"
                target="_blank" 
                rel="noreferrer"
                className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#e09f7a] active-press"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>

              {/* Hamburger Butonu */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className={`lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl transition-colors active-press shrink-0 ${isScrolled || isDark ? 'text-slate-200 hover:text-white bg-white/10 border border-white/10' : 'text-white hover:text-[#c2784f] bg-black/40 backdrop-blur-md border border-white/15'}`}
                aria-label="Menüyü Aç"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
          
        </nav>
      </div>

      {/* MOBİL MENÜ ÇEKMECESİ - Ultra Lüks Midnight Panel */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-[#0a0908]/95 backdrop-blur-2xl flex flex-col p-6 sm:p-8 animate-in fade-in duration-300 lg:hidden overflow-y-auto">
          <div className="flex justify-between items-center w-full mb-8 pb-4 border-b border-white/10">
            <img src="/salaaslogobg.png" alt="Salaaş Logo" className="h-12 object-contain select-none" />
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-3 border border-white/20 rounded-2xl hover:bg-white/10 transition-colors active-press"><X size={24} /></button>
          </div>
          
          <div className="flex flex-col items-start gap-5 flex-1 text-xl font-black text-white tracking-wider font-serif">
            <button className="hover:text-[#c2784f] text-[#e09f7a] transition-colors active-press flex items-center justify-between w-full text-left" onClick={() => { setIsMobileMenuOpen(false); if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('kahvalti'), 100); }}>
              <span>🥞 Serpme Kahvaltı</span> <ChevronRight size={20} className="text-[#c2784f] opacity-80"/>
            </button>
            <button className="hover:text-[#c2784f] transition-colors active-press flex items-center justify-between w-full text-left" onClick={() => { setIsMobileMenuOpen(false); if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('mac-yayini'), 100); }}>
              <span>⚽ Canlı Maç & Derbi</span> <ChevronRight size={20} className="text-[#c2784f] opacity-60"/>
            </button>
            <button className="hover:text-[#c2784f] transition-colors active-press flex items-center justify-between w-full text-left" onClick={() => { setIsMobileMenuOpen(false); handleNavToMenu(); }}>
              <span>🍽️ Dijital Menü & Lezzetler</span> <ChevronRight size={20} className="text-[#c2784f] opacity-60"/>
            </button>
            <button className={`hover:text-[#c2784f] transition-colors active-press flex items-center justify-between w-full text-left ${currentView === 'personnel' ? 'text-[#c2784f]' : ''}`} onClick={() => { setIsMobileMenuOpen(false); handleNavToPersonnel(); }}>
              <span>👥 Ekibimiz</span> <ChevronRight size={20} className="text-[#c2784f] opacity-60"/>
            </button>
            <button className="hover:text-[#c2784f] transition-colors active-press flex items-center justify-between w-full text-left" onClick={() => { setIsMobileMenuOpen(false); if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('sss'), 100); }}>
              <span>❓ Sıkça Sorulan Sorular</span> <ChevronRight size={20} className="text-[#c2784f] opacity-60"/>
            </button>
            <button className="hover:text-[#c2784f] transition-colors active-press flex items-center justify-between w-full text-left" onClick={() => { setIsMobileMenuOpen(false); if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('iletisim'), 100); }}>
              <span>📍 İletişim & Konum</span> <ChevronRight size={20} className="text-[#c2784f] opacity-60"/>
            </button>
            
            <hr className="w-full border-white/10 my-2" />
            
            <div className="w-full grid grid-cols-2 gap-3">
              <a href={`tel:+${WHATSAPP_NO}`} className="glass p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-slate-200 border border-white/10 active-press">
                <Phone size={16} className="text-[#c2784f]"/> Telefon Et
              </a>
              <a href="https://www.instagram.com/salascaferestaurant/" target="_blank" rel="noreferrer" className="glass p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-slate-200 border border-white/10 active-press">
                <Instagram size={16} className="text-[#c2784f]"/> Instagram
              </a>
            </div>
            
            <button onClick={() => { setIsMobileMenuOpen(false); setShowRequestModal(true); }} className="w-full btn-premium py-4 rounded-2xl flex items-center justify-center gap-3 uppercase text-xs sm:text-sm tracking-[0.2em] font-sans font-black shadow-2xl active-press mt-auto">
              <CalendarDays size={18}/> Rezervasyon Talebi Yap
            </button>
          </div>
        </div>
      )}
    </>
  );

  const renderFooter = () => (
    <footer id="iletisim" className="w-full bg-[#0a0908] text-slate-400 py-24 lg:py-32 relative z-10 border-t border-white/5 overflow-hidden">
      {/* Footer Arkaplan Süslemeleri */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c2784f]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>
      
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24 relative z-10">
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img src="/salaaslogobg.png" alt="Salaaş Logo" className="h-28 lg:h-36 object-contain mb-8 select-none drop-shadow-[0_0_15px_rgba(194,120,79,0.3)]" />
          <p className="text-base lg:text-lg leading-relaxed mb-6 max-w-sm font-light text-slate-400">
            Şehrin kalbinde, lüks ve samimiyetin kesişme noktası. Sizi ağırlamaktan mutluluk duyarız.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-gradient-copper font-black uppercase tracking-[0.3em] mb-10 text-sm lg:text-base">İletişim</h4>
          <ul className="space-y-6 text-sm lg:text-base font-light text-slate-300">
            <li>
               <div className="flex flex-col items-center md:items-start gap-3">
                 <div className="flex items-center justify-center md:justify-start gap-4">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 shrink-0"><MapPin size={18} className="text-[#c2784f]"/></div>
                    <span className="text-white font-medium tracking-wide">Konum</span>
                 </div>
                 <p className="ml-0 md:ml-14 text-slate-400">Gebze, Kocaeli</p>
                 <a 
                   href="https://www.google.com/maps/dir/?api=1&destination=Salaaş+Cafe+Restaurant+Gebze" 
                   target="_blank" 
                   rel="noreferrer" 
                   className="btn-outline-premium px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase mt-3 ml-0 md:ml-14 inline-flex items-center gap-2 w-max"
                 >
                    Yol Tarifi <ArrowRight size={14}/>
                 </a>
               </div>
            </li>
            <li>
               <a href={`tel:+${WHATSAPP_NO}`} className="hover:text-[#c2784f] transition-all flex items-center justify-center md:justify-start gap-4 group">
                 <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 shrink-0 group-hover:border-[#c2784f]/50 transition-colors"><Phone size={18} className="text-[#c2784f]"/></div>
                 <span className="text-white font-medium tracking-wide">Telefon: </span>
                 <span className="ml-1 font-light tracking-wider">0536 017 02 08</span>
               </a>
            </li>
            <li>
               <a href="https://www.instagram.com/salascaferestaurant/" target="_blank" rel="noreferrer" className="hover:text-[#c2784f] transition-all flex items-center justify-center md:justify-start gap-4 group">
                 <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 shrink-0 group-hover:border-[#c2784f]/50 transition-colors"><Instagram size={18} className="text-[#c2784f]"/></div>
                 <span className="text-white font-medium tracking-wide">Instagram: </span>
                 <span className="ml-1 font-light tracking-wider">@salascaferestaurant</span>
               </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-gradient-copper font-black uppercase tracking-[0.3em] mb-8 text-sm lg:text-base">Keşfedin & Rezervasyon</h4>
          <ul className="space-y-4 text-sm font-medium mb-8 text-slate-300">
            <li>
              <button 
                onClick={() => { if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('kahvalti'), 100); }} 
                className="hover:text-[#c2784f] text-[#e09f7a] transition-colors flex items-center justify-center md:justify-start gap-3 tracking-widest uppercase text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-[#c2784f]"></div> 🥞 Serpme Köy Kahvaltısı
              </button>
            </li>
            <li>
              <button 
                onClick={() => { if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('mac-yayini'), 100); }} 
                className="hover:text-[#c2784f] transition-colors flex items-center justify-center md:justify-start gap-3 tracking-widest uppercase text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-[#c2784f]"></div> ⚽ Dev Ekran Canlı Maç Yayını
              </button>
            </li>
            <li>
              <button 
                onClick={handleNavToMenu} 
                className="hover:text-[#c2784f] transition-colors flex items-center justify-center md:justify-start gap-3 tracking-widest uppercase text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-[#c2784f]"></div> 🍽️ Dijital Menü
              </button>
            </li>
            <li>
              <button 
                onClick={() => { if (currentView !== 'landing') handleNavToHome(); setTimeout(() => handleScrollToId('sss'), 100); }} 
                className="hover:text-[#c2784f] transition-colors flex items-center justify-center md:justify-start gap-3 tracking-widest uppercase text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-[#c2784f]"></div> ❓ Sıkça Sorulan Sorular (SSS)
              </button>
            </li>
            <li>
              <button 
                onClick={handleNavToPersonnel} 
                className="hover:text-[#c2784f] transition-colors flex items-center justify-center md:justify-start gap-3 tracking-widest uppercase text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-[#c2784f]"></div> 👥 Personel Ekibi
              </button>
            </li>
          </ul>
          
          <button 
            onClick={() => setShowLoginModal(true)} 
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 lg:px-8 lg:py-4 rounded-2xl text-xs lg:text-sm font-black uppercase tracking-widest flex items-center gap-3 transition-all border border-slate-700 hover:border-slate-600 shadow-lg hover:shadow-xl hover:-translate-y-1 mt-auto"
          >
            <Lock size={16} /> Personel Girişi
          </button>
        </div>
      </div>
      
      {/* ALT TELİF VE GELİŞTİRİCİ İMZASI (Tasarım & Geliştirme Telifin Doğrudan Altında) */}
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 lg:px-24 mt-20 pt-8 border-t border-white/5 flex flex-col items-center justify-center gap-3 text-center">
        <p className="text-xs sm:text-sm font-medium text-slate-400 opacity-80">
          © {new Date().getFullYear()} Salaaş Cafe Restaurant. Tüm hakları saklıdır.
        </p>
        
        <div className="flex items-center justify-center gap-2 text-xs text-slate-300">
          <span className="font-light tracking-wide text-slate-400">Tasarım & Geliştirme:</span>
          <a
            href="https://affanccn.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c2784f]/10 hover:bg-[#c2784f]/20 text-[#e09f7a] hover:text-white border border-[#c2784f]/30 hover:border-[#c2784f] transition-all duration-300 group shadow-[0_0_15px_rgba(194,120,79,0.15)] hover:shadow-[0_0_20px_rgba(194,120,79,0.3)] hover:-translate-y-0.5"
          >
            <span className="font-black tracking-widest text-[11px] uppercase">CCN TEKNOLOJİ</span>
            <svg
              className="w-3.5 h-3.5 text-[#c2784f] group-hover:text-white transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );

  // --- MOBİL UYGULAMA TİPİ YÜZEN TAB ÇUBUĞU (100% MOBİL DENEYİM) ---
  const renderMobileBottomDock = () => {
    if (currentView === 'admin') return null;

    return (
      <aside aria-label="Mobil Gezinme Menüsü" className="md:hidden fixed bottom-3 left-3 right-3 z-40 max-w-md mx-auto pointer-events-auto">
        <nav className="mobile-nav-dock rounded-full px-2 py-1.5 flex items-center justify-around text-slate-300 shadow-2xl relative">
          
          {/* 1. Ana Sayfa */}
          <button 
            type="button"
            onClick={handleNavToHome}
            className={`flex flex-col items-center justify-center p-1.5 min-w-[50px] rounded-2xl active-press transition-colors ${
              currentView === 'landing' ? 'text-[#e09f7a] font-black' : 'text-slate-400 hover:text-white'
            }`}
            aria-label="Ana Sayfa"
          >
            <Home size={19} className={currentView === 'landing' ? 'stroke-[2.5]' : 'stroke-2'} />
            <span className="text-[10px] tracking-tight mt-0.5">Ana Sayfa</span>
          </button>

          {/* 2. Menü */}
          <button 
            type="button"
            onClick={handleNavToMenu}
            className={`flex flex-col items-center justify-center p-1.5 min-w-[50px] rounded-2xl active-press transition-colors ${
              currentView === 'menu' ? 'text-[#e09f7a] font-black' : 'text-slate-400 hover:text-white'
            }`}
            aria-label="Menü"
          >
            <UtensilsCrossed size={19} className={currentView === 'menu' ? 'stroke-[2.5]' : 'stroke-2'} />
            <span className="text-[10px] tracking-tight mt-0.5">Menü</span>
          </button>

          {/* 3. REZERVASYON (Merkezi Parlayan Hero Buton) */}
          <button 
            type="button"
            onClick={() => setShowRequestModal(true)}
            className="flex flex-col items-center justify-center -mt-6 active-press group"
            aria-label="Rezervasyon Talebi Gönder"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#934b26] via-[#c2784f] to-[#e09f7a] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(194,120,79,0.55)] border-[3.5px] border-[#0a0908] animate-gold-pulse group-hover:scale-105 transition-transform p-3">
              <CalendarDays size={22} className="stroke-[2.5]" />
            </div>
            <span className="text-[9px] font-black tracking-wider text-[#e09f7a] mt-0.5 uppercase">Rezv.</span>
          </button>

          {/* 4. Ekibimiz */}
          <button 
            type="button"
            onClick={handleNavToPersonnel}
            className={`flex flex-col items-center justify-center p-1.5 min-w-[50px] rounded-2xl active-press transition-colors ${
              currentView === 'personnel' ? 'text-[#e09f7a] font-black' : 'text-slate-400 hover:text-white'
            }`}
            aria-label="Ekibimiz"
          >
            <Users size={19} className={currentView === 'personnel' ? 'stroke-[2.5]' : 'stroke-2'} />
            <span className="text-[10px] tracking-tight mt-0.5">Ekibimiz</span>
          </button>

          {/* 5. WhatsApp */}
          <a 
            href={`https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent('Merhaba Salaaş Cafe Restaurant,')}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center justify-center p-1.5 min-w-[50px] rounded-2xl active-press text-[#25D366] hover:text-[#20b858] transition-colors"
            aria-label="WhatsApp Canlı Destek"
          >
            <MessageCircle size={19} className="stroke-[2.5]" />
            <span className="text-[10px] tracking-tight mt-0.5 font-bold">WhatsApp</span>
          </a>

        </nav>
      </aside>
    );
  };

  const renderModals = () => (
    <>
      {showRequestModal && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0e0d0b] rounded-t-[2.5rem] sm:rounded-3xl shadow-[0_0_60px_rgba(194,120,79,0.25)] border border-[#c2784f]/25 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-sheet-up sm:animate-in sm:slide-in-from-bottom-4 duration-300 pb-safe">
            
            {/* Mobil Çekme Çubuğu */}
            <div className="sm:hidden w-full flex justify-center pt-2.5 pb-1">
              <div className="w-12 h-1.5 rounded-full bg-white/20"></div>
            </div>

            <div className="p-5 sm:p-7 flex items-center justify-between text-white shrink-0 z-10 border-b border-white/10 relative overflow-hidden bg-[#14110e]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#c2784f]/20 via-transparent to-transparent opacity-60"></div>
              <div className="relative z-10">
                <h3 className="font-serif font-light text-xl sm:text-2xl flex items-center gap-2.5">
                  <CalendarDays size={22} className="text-[#c2784f]"/> Rezervasyon <span className="text-gradient-copper font-black italic">Talebi</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-light mt-0.5">Tarih, kişi ve talebinizi belirleyin; size hemen dönüş yapalım.</p>
              </div>
              <button type="button" onClick={() => setShowRequestModal(false)} className="p-2.5 hover:bg-white/10 rounded-2xl transition-colors relative z-10 active-press text-slate-400 hover:text-white"><X size={22}/></button>
            </div>
            
            <div className="overflow-y-auto bg-transparent flex-1 relative custom-scrollbar">
              {requestSuccess ? (
                 <div className="p-8 sm:p-14 flex flex-col items-center justify-center text-center space-y-6 h-full min-h-[380px] animate-in fade-in zoom-in-95 duration-400">
                    <div className="relative">
                      <div className="w-24 h-24 bg-[#c2784f]/20 text-[#c2784f] border border-[#c2784f]/40 rounded-full flex items-center justify-center animate-spark-pop shadow-[0_0_40px_rgba(194,120,79,0.3)]">
                        <CheckCircle2 size={50} />
                      </div>
                      <Sparkles size={28} className="absolute -top-2 -right-2 text-[#d4af37] animate-bounce" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl sm:text-3xl font-serif font-light text-white">Talebiniz <span className="text-gradient-copper italic font-black">Başarıyla Alındı!</span></h3>
                      <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-md mx-auto">
                        Rezervasyon talebiniz yönetim panelimize iletilmiştir. Ekibimiz müsaitliği kontrol ederek kısa süre içinde sizinle iletişime geçecektir.
                      </p>
                    </div>

                    <div className="w-full max-w-sm flex flex-col gap-3 pt-2">
                      <a 
                        href={`https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent(`Merhaba Salaaş Cafe, web sitenizden ${requestData.name} adına ${requestData.peopleCount} kişilik rezervasyon talebi oluşturdum.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-premium active-press py-3.5 px-6 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl"
                      >
                        <MessageCircle size={18} /> WhatsApp ile de Bilgi Al
                      </a>
                      <button 
                        type="button" 
                        onClick={() => { setShowRequestModal(false); setRequestSuccess(false); }}
                        className="py-3 px-6 rounded-2xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        Pencereyi Kapat
                      </button>
                    </div>
                 </div>
              ) : (
                <form onSubmit={(e) => submitRequest(e, false)} className="p-6 sm:p-8 space-y-6">
                  {requestError && (
                    <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-xs font-bold border border-red-500/20 flex items-center gap-2.5">
                      <AlertTriangle size={18} className="shrink-0" /> {requestError}
                    </div>
                  )}

                  {/* 1. Tür Seçimi */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5">Rezervasyon Türü</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        <button type="button" onClick={() => setRequestData({...requestData, type: 'kahvalti'})} className={`py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 active-press ${requestData.type === 'kahvalti' ? 'border-[#c2784f] bg-[#c2784f]/15 text-[#e09f7a] shadow-[0_0_15px_rgba(194,120,79,0.2)]' : 'border-white/10 text-slate-400 hover:border-white/20 bg-white/5 hover:bg-white/10'}`}>
                           <Coffee size={16}/> Kahvaltı
                        </button>
                        <button type="button" onClick={() => setRequestData({...requestData, type: 'yemek'})} className={`py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 active-press ${requestData.type === 'yemek' ? 'border-[#c2784f] bg-[#c2784f]/15 text-[#e09f7a] shadow-[0_0_15px_rgba(194,120,79,0.2)]' : 'border-white/10 text-slate-400 hover:border-white/20 bg-white/5 hover:bg-white/10'}`}>
                           <UtensilsCrossed size={16}/> Yemek
                        </button>
                        <button type="button" onClick={() => setRequestData({...requestData, type: 'mac'})} className={`py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 active-press ${requestData.type === 'mac' ? 'border-[#c2784f] bg-[#c2784f]/15 text-[#e09f7a] shadow-[0_0_15px_rgba(194,120,79,0.2)]' : 'border-white/10 text-slate-400 hover:border-white/20 bg-white/5 hover:bg-white/10'}`}>
                           <MonitorPlay size={16}/> Maç Yayını
                        </button>
                        <button type="button" onClick={() => setRequestData({...requestData, type: 'dogum_gunu'})} className={`py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 active-press ${requestData.type === 'dogum_gunu' ? 'border-[#c2784f] bg-[#c2784f]/15 text-[#e09f7a] shadow-[0_0_15px_rgba(194,120,79,0.2)]' : 'border-white/10 text-slate-400 hover:border-white/20 bg-white/5 hover:bg-white/10'}`}>
                           <Star size={16}/> Doğum Günü
                        </button>
                        <button type="button" onClick={() => setRequestData({...requestData, type: 'organizasyon'})} className={`py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 col-span-2 sm:col-span-2 active-press ${requestData.type === 'organizasyon' ? 'border-[#c2784f] bg-[#c2784f]/15 text-[#e09f7a] shadow-[0_0_15px_rgba(194,120,79,0.2)]' : 'border-white/10 text-slate-400 hover:border-white/20 bg-white/5 hover:bg-white/10'}`}>
                           <Users size={16}/> Özel Davet & Organizasyon
                        </button>
                    </div>
                  </div>

                  {/* 2. Kişi Sayısı Hızlı Butonları (Mobilde 1 Dokunuşla Seçim) */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5">Kişi Sayısı</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[1, 2, 3, 4, 5, 6, 8, 10, 15].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRequestData({...requestData, peopleCount: num})}
                          className={`w-10 h-10 rounded-xl font-bold text-xs border transition-all active-press flex items-center justify-center ${
                            parseInt(requestData.peopleCount, 10) === num 
                              ? 'bg-[#c2784f] text-white border-[#c2784f] shadow-lg shadow-[#c2784f]/30' 
                              : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      <div className="flex-1 min-w-[70px]">
                        <input 
                          type="number" 
                          min="1" 
                          value={requestData.peopleCount} 
                          onChange={handleRequestChange} 
                          name="peopleCount" 
                          placeholder="Diğer"
                          className="w-full h-10 rounded-xl bg-white/5 border border-white/10 text-white text-center font-bold text-xs outline-none focus:border-[#c2784f]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. İsim ve Telefon */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Ad Soyad *</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={requestData.name} 
                        onChange={handleRequestChange} 
                        className="w-full bg-white/5 text-white px-4 py-3.5 rounded-2xl border border-white/10 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none font-medium transition-all text-sm placeholder-slate-600" 
                        required 
                        placeholder="Örn: Ahmet Yılmaz" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Telefon Numarası *</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={requestData.phone} 
                        onChange={handleRequestChange} 
                        className="w-full bg-white/5 text-white px-4 py-3.5 rounded-2xl border border-white/10 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none font-medium transition-all text-sm placeholder-slate-600" 
                        required 
                        placeholder="05XX XXX XX XX" 
                      />
                    </div>
                  </div>

                  {/* 4. Tarih */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Rezervasyon Tarihi *</label>
                    <input 
                      type="date" 
                      name="date" 
                      min={getToday()} 
                      value={requestData.date} 
                      onChange={handleRequestChange} 
                      className="w-full bg-white/5 text-white px-4 py-3.5 rounded-2xl border border-white/10 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none font-medium transition-all text-sm cursor-pointer" 
                      required 
                    />
                  </div>

                  {/* 5. Notlar */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                      {(requestData.type === 'dogum_gunu' || requestData.type === 'organizasyon') ? 'Detaylı Açıklama (Zorunlu)' : 'Özel İstek / Masa Tercihi (İsteğe Bağlı)'}
                    </label>
                    <textarea 
                      name="notes" 
                      value={requestData.notes} 
                      onChange={handleRequestChange} 
                      rows="2" 
                      required={(requestData.type === 'dogum_gunu' || requestData.type === 'organizasyon')} 
                      className="w-full bg-white/5 text-white px-4 py-3 rounded-2xl border border-white/10 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none font-medium transition-all resize-none text-xs sm:text-sm placeholder-slate-600" 
                      placeholder="Bahçe masası, pasta servisi veya çocuk sandalyesi gibi notlarınız..."
                    ></textarea>
                  </div>

                  {/* Butonlar */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button 
                      type="submit" 
                      className="flex-1 btn-premium py-4 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl active-press"
                    >
                      Talebi Gönder <ArrowRight size={17} />
                    </button>
                    
                    <button 
                      type="button" 
                      onClick={(e) => submitRequest(e, true)}
                      className="flex-1 bg-[#25D366] hover:bg-[#20b858] text-white py-4 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(37,211,102,0.35)] active-press"
                    >
                      <MessageCircle size={18} /> WhatsApp ile de İlet
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LÜKS YÖNETİM PANELİ GİRİŞİ MODALI */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12100e] border border-[#c2784f]/35 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] w-full max-w-sm sm:max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300 text-white">
            <div className="p-6 sm:p-7 flex items-center justify-between border-b border-white/10 bg-[#191512]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c2784f]/15 border border-[#c2784f]/30 flex items-center justify-center text-[#e09f7a]">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="font-serif font-light text-lg sm:text-xl text-white">Yönetim <span className="text-gradient-copper italic font-black">Paneli</span></h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Yetkili Girişi</p>
                </div>
              </div>
              <button type="button" onClick={() => { setShowLoginModal(false); setLoginError(''); }} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white active-press"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleLogin} className="p-6 sm:p-7 space-y-4">
              {loginError && (
                <div className="bg-red-500/10 text-red-400 text-xs font-bold p-3 rounded-xl border border-red-500/20 flex items-center gap-2">
                  <AlertTriangle size={15}/> {loginError}
                </div>
              )}
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Kullanıcı Adı</label>
                <input 
                  type="text" 
                  value={loginUser} 
                  onChange={(e) => setLoginUser(e.target.value)} 
                  autoComplete="username" 
                  className="w-full px-4 py-3.5 rounded-xl border border-white/10 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white/5 font-bold text-white transition-all text-sm" 
                  placeholder="Kullanıcı adı" 
                  autoFocus 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Şifre</label>
                <input 
                  type="password" 
                  value={loginPass} 
                  onChange={(e) => setLoginPass(e.target.value)} 
                  autoComplete="current-password" 
                  className="w-full px-4 py-3.5 rounded-xl border border-white/10 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white/5 font-bold text-white transition-all text-sm" 
                  placeholder="••••••••" 
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={rememberMe} 
                    onChange={(e) => setRememberMe(e.target.checked)} 
                    className="rounded accent-[#c2784f] w-4 h-4 cursor-pointer" 
                  />
                  <span className="text-slate-300 text-xs font-medium">Beni Hatırla (iPhone'da Kalıcı)</span>
                </label>
              </div>
              
              <button 
                type="submit" 
                className="w-full btn-premium py-4 rounded-xl font-black tracking-widest uppercase text-xs flex items-center justify-center gap-2 shadow-lg active-press mt-2"
              >
                Giriş Yap <ArrowRight size={16} />
              </button>

              <div className="pt-2 text-center">
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  💡 <strong>İpucu:</strong> iPhone Safari'de Paylaş ➔ "Ana Ekrana Ekle" dendiğinde oturumunuz kalıcı olur.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAYLI ÜRÜN MODALI */}
      {selectedMenuItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#120f0d] rounded-3xl shadow-[0_0_50px_rgba(194,120,79,0.15)] border border-white/10 w-full max-w-md sm:max-w-lg overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
            <button type="button" onClick={() => setSelectedMenuItem(null)} className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white p-3 w-10 h-10 rounded-full transition-colors flex items-center justify-center border border-white/10">
              <X size={20} />
            </button>
            
            <div className="w-full bg-[#0a0908] relative flex justify-center items-center border-b border-white/5 min-h-[12rem]">
              {selectedMenuItem.image ? (
                 <img src={selectedMenuItem.image} alt={selectedMenuItem.name} className={`w-full h-auto max-h-[45vh] object-contain ${selectedMenuItem.isSoldOut ? 'opacity-40 grayscale' : ''}`} />
              ) : (
                 <div className="w-full h-48 flex items-center justify-center text-slate-600"><ImageIcon size={48} /></div>
              )}
              {selectedMenuItem.isSoldOut && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <span className="bg-red-900/80 text-white px-6 py-2 rounded-xl font-black text-xl tracking-widest uppercase shadow-2xl border border-red-500/30">TÜKENDİ</span>
                 </div>
              )}
            </div>
            
            <div className="p-6 sm:p-8 flex flex-col gap-4">
               <div className="flex justify-between items-start gap-4">
                  <h3 className={`text-2xl font-serif font-light tracking-wide leading-tight ${selectedMenuItem.isSoldOut ? 'text-slate-500' : 'text-white'}`}>{selectedMenuItem.name}</h3>
                  {selectedMenuItem.price && <span className={`text-xl font-serif whitespace-nowrap ${selectedMenuItem.isSoldOut ? 'text-slate-500' : 'text-[#c2784f]'}`}>{selectedMenuItem.price} TL</span>}
               </div>
               
               {(selectedMenuItem.badges?.length > 0 || selectedMenuItem.prepTime || selectedMenuItem.calories) && (
                 <div className="flex flex-wrap gap-2 items-center border-b border-white/5 pb-5">
                   {selectedMenuItem.badges?.map(b => {
                     const badgeDef = BADGE_OPTIONS.find(opt => opt.id === b);
                     return badgeDef ? (
                       <span key={b} className={`bg-[#c2784f]/10 text-[#c2784f] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-md flex items-center gap-1.5 border border-[#c2784f]/20 ${selectedMenuItem.isSoldOut ? 'opacity-50' : ''}`}>
                         <span>{badgeDef.icon}</span> {badgeDef.label}
                       </span>
                     ) : null;
                   })}
                   {selectedMenuItem.prepTime && <span className="flex items-center gap-1.5 text-slate-400 font-medium text-xs ml-2 uppercase tracking-widest"><Clock size={14} className="text-[#c2784f]"/> {selectedMenuItem.prepTime}</span>}
                   {selectedMenuItem.calories && <span className="flex items-center gap-1.5 text-slate-400 font-medium text-xs ml-2 uppercase tracking-widest"><Flame size={14} className="text-orange-500"/> {selectedMenuItem.calories}</span>}
                 </div>
               )}
               
               {selectedMenuItem.description && (
                 <p className={`text-sm leading-relaxed font-light ${selectedMenuItem.isSoldOut ? 'text-slate-500' : 'text-slate-300'}`}>
                   {selectedMenuItem.description}
                 </p>
               )}
               
               <button type="button" onClick={() => setSelectedMenuItem(null)} className="w-full mt-6 btn-premium shine-effect py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs">
                 Kapat
               </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAYLI PERSONEL MODALI VE YORUM ALANI */}
      {selectedPersonnel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0a0908] rounded-3xl shadow-[0_0_50px_rgba(194,120,79,0.15)] border border-white/10 w-full max-w-md sm:max-w-lg overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300 max-h-[85vh] sm:max-h-[90vh]">
            <button type="button" onClick={() => {setSelectedPersonnel(null); setReviewData({ name: '', isAnonymous: false, rating: 5, comment: '' });}} className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white p-3 w-10 h-10 rounded-full transition-colors flex items-center justify-center border border-white/10">
              <X size={20} />
            </button>
            
            <div className="w-full bg-[#120f0d] relative flex justify-center items-end shrink-0 border-b border-white/5 overflow-hidden">
              {selectedPersonnel.image ? (
                 <img src={selectedPersonnel.image} alt={selectedPersonnel.name} className="w-full h-auto max-h-[40vh] object-contain p-4 pb-16 opacity-90" />
              ) : (
                 <div className="w-full h-48 flex items-center justify-center text-slate-600 bg-[#120f0d]"><UserSquare size={64} /></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/60 to-transparent pointer-events-none"></div>
              
              <div className="absolute bottom-0 left-0 p-5 sm:p-6 text-white w-full">
                 <div className="flex justify-between items-end gap-3">
                   <div className="flex-1">
                     <h3 className="text-2xl sm:text-3xl font-serif font-light leading-tight drop-shadow-md text-white">{selectedPersonnel.name} <span className="font-black italic text-[#c2784f]">{selectedPersonnel.surname}</span></h3>
                     {selectedPersonnel.nickname && <p className="text-[#e09f7a] font-light tracking-wide text-sm mt-1 drop-shadow-md">"{selectedPersonnel.nickname}"</p>}
                   </div>
                   <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex flex-col items-center shrink-0 shadow-lg">
                     <span className="flex items-center gap-1 text-[#e09f7a] font-black text-lg sm:text-xl"><Star size={16} className="text-[#c2784f]"/> {selectedPersonnel.reviews?.length > 0 ? (selectedPersonnel.reviews.reduce((a,c)=>a+c.rating,0)/selectedPersonnel.reviews.length).toFixed(1) : '5.0'}</span>
                     <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">{selectedPersonnel.reviews?.length || 0} Yorum</span>
                   </div>
                 </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-7 bg-transparent custom-scrollbar pb-24 sm:pb-8">
               {selectedPersonnel.skills && (
                 <div className="mb-6 bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm text-center">
                   <h4 className="text-[10px] sm:text-xs font-black text-[#c2784f] uppercase tracking-widest mb-2 flex items-center justify-center gap-2"><div className="w-4 h-[1px] bg-[#c2784f]"></div> Yetenekler & Uzmanlık <div className="w-4 h-[1px] bg-[#c2784f]"></div></h4>
                   <p className="text-sm font-light text-slate-300 leading-relaxed italic">"{selectedPersonnel.skills}"</p>
                 </div>
               )}

               <div className="mb-8">
                 <h4 className="font-serif font-light text-xl text-white mb-4 border-b border-white/5 pb-3 flex items-center gap-3"><MessageSquareText size={20} className="text-[#c2784f]"/> Müşteri Yorumları</h4>
                 {(!selectedPersonnel.reviews || selectedPersonnel.reviews.length === 0) ? (
                    <p className="text-sm text-slate-500 italic text-center py-6 font-light">Bu personel için henüz yorum yapılmamış. İlk değerlendiren siz olun!</p>
                 ) : (
                    <div className="space-y-4">
                      {selectedPersonnel.reviews.sort((a,b) => new Date(b.date) - new Date(a.date)).map(rev => (
                        <div key={rev.id} className="bg-white/5 p-5 rounded-2xl border border-white/5 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <span className="font-bold text-sm text-slate-200">{rev.name}</span>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className={i < rev.rating ? "text-[#c2784f]" : "text-slate-700"} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-slate-300 font-light leading-relaxed">{rev.comment}</p>
                          <span className="text-[10px] font-black tracking-widest uppercase text-slate-500 mt-3 block">{new Date(rev.date).toLocaleDateString('tr-TR')}</span>
                          
                          {rev.reply && (
                            <div className="mt-4 bg-[#1a1512] p-4 rounded-xl border border-[#c2784f]/20 relative ml-4">
                              <div className="absolute -left-2 top-4 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-[#1a1512] border-b-[6px] border-b-transparent"></div>
                              <span className="text-[10px] font-black text-[#e09f7a] uppercase tracking-widest flex items-center gap-2 mb-2"><MessageCircle size={12}/> Salaaş Cafe Yönetimi</span>
                              <p className="text-sm text-slate-300 font-light leading-relaxed">{rev.reply}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                 )}
               </div>
               
               <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 shadow-lg">
                 <h4 className="font-serif font-light text-xl text-white mb-5 text-center">Puan Verin</h4>
                 <form onSubmit={handleReviewSubmit} className="space-y-5">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="flex gap-2 mx-auto sm:mx-0">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button key={star} type="button" onClick={() => setReviewData({...reviewData, rating: star})} className="hover:scale-110 transition-transform">
                            <Star size={24} className={reviewData.rating >= star ? "text-[#c2784f]" : "text-slate-600"} />
                          </button>
                        ))}
                      </div>
                      <label className="flex items-center justify-center gap-3 cursor-pointer text-xs font-black tracking-widest uppercase text-slate-400 bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 shadow-sm transition-colors hover:bg-white/10">
                        <input type="checkbox" checked={reviewData.isAnonymous} onChange={(e) => setReviewData({...reviewData, isAnonymous: e.target.checked, name: e.target.checked ? '' : reviewData.name})} className="w-4 h-4 text-[#c2784f] rounded border-white/20 bg-transparent focus:ring-[#c2784f]" />
                        Gizli İsim
                      </label>
                   </div>
                   
                   {!reviewData.isAnonymous && (
                     <div>
                       <input type="text" placeholder="Adınız Soyadınız" value={reviewData.name} onChange={(e) => setReviewData({...reviewData, name: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-white/10 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none font-medium transition-all text-sm bg-white/5 text-white placeholder-slate-500" required />
                     </div>
                   )}
                   
                   <div>
                     <textarea placeholder="Personelimiz hakkındaki görüşlerinizi yazın..." value={reviewData.comment} onChange={(e) => setReviewData({...reviewData, comment: e.target.value})} rows="3" className="w-full px-5 py-4 rounded-xl border border-white/10 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none font-medium transition-all resize-none text-sm bg-white/5 text-white placeholder-slate-500" required></textarea>
                   </div>
                   
                   <button type="submit" className="w-full btn-premium shine-effect py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-lg mt-2">Yorumu Gönder</button>
                 </form>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* YÖNETİM PANELİ YORUM CEVAPLAMA MODALI */}
      {/* YÖNETİM PANELİ YORUM CEVAPLAMA MODALI */}
      {managingReviewsFor && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-[#12100e] border border-[#c2784f]/35 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] text-white">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#191512] shrink-0">
                <div>
                   <h3 className="font-serif font-light text-xl text-white flex items-center gap-2">
                     <MessageSquareText className="text-[#c2784f]" /> 
                     Yorum <span className="text-gradient-copper font-black italic">Yönetimi</span>
                   </h3>
                   <p className="text-xs font-medium text-slate-400 mt-1">{managingReviewsFor.name} {managingReviewsFor.surname}</p>
                </div>
                <button type="button" onClick={()=>setManagingReviewsFor(null)} className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-colors w-10 h-10 flex items-center justify-center border border-white/10"><X size={20}/></button>
              </div>
              
              <div className="overflow-y-auto flex-1 p-6 space-y-4 bg-transparent custom-scrollbar">
                {(!managingReviewsFor.reviews || managingReviewsFor.reviews.length === 0) ? (
                  <div className="text-center text-slate-400 py-12 flex flex-col items-center">
                    <MessageCircle size={48} className="mb-4 opacity-30 text-[#c2784f]" />
                    <p className="text-lg font-serif font-light text-white">Henüz yorum yapılmamış.</p>
                  </div>
                ) : (
                  managingReviewsFor.reviews.sort((a,b) => new Date(b.date) - new Date(a.date)).map(rev => (
                    <div key={rev.id} className="bg-[#1a1613] p-5 rounded-2xl border border-white/10">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="font-bold text-sm text-white block">{rev.name}</span>
                          <div className="flex gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} className={i < rev.rating ? "fill-[#c2784f] text-[#c2784f]" : "fill-white/10 text-white/10"} />
                            ))}
                          </div>
                        </div>
                        <button type="button" onClick={() => handleDeleteReview(managingReviewsFor.id, rev.id)} className="text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 p-2 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold" title="Yorumu Sil"><Trash2 size={14}/> Sil</button>
                      </div>
                      <p className="text-sm text-slate-300 mb-2 leading-relaxed font-light">{rev.comment}</p>
                      <span className="text-[10px] font-mono text-slate-500">{new Date(rev.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      
                      {rev.reply ? (
                        <div className="mt-4 bg-[#c2784f]/10 p-3.5 rounded-xl border border-[#c2784f]/20 relative group">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-black text-[#e09f7a] uppercase tracking-widest block">Salaaş Cafe Cevabı</span>
                            <button type="button" onClick={() => handleDeleteReply(managingReviewsFor.id, rev.id)} className="text-red-400 hover:text-red-300 p-1 bg-red-500/20 hover:bg-red-500/30 rounded transition-colors flex items-center gap-1 text-[10px] font-bold opacity-0 group-hover:opacity-100" title="Cevabı Sil">
                              <Trash2 size={12}/> Sil
                            </button>
                          </div>
                          <p className="text-sm text-slate-200">{rev.reply}</p>
                        </div>
                      ) : (
                        <div className="mt-4 flex flex-col sm:flex-row gap-2">
                          <input 
                            type="text" 
                            placeholder="Müşteriye yanıt yazın..." 
                            value={replyTexts[rev.id] || ''} 
                            onChange={(e) => setReplyTexts({...replyTexts, [rev.id]: e.target.value})} 
                            className="flex-1 text-sm p-3 rounded-xl border border-white/10 focus:border-[#c2784f] outline-none font-medium bg-white/5 text-white placeholder-slate-500"
                          />
                          <button 
                            type="button" 
                            onClick={() => handleReplyReview(managingReviewsFor.id, rev.id)} 
                            className="bg-gradient-to-r from-[#c2784f] to-[#a16241] hover:from-[#d99268] hover:to-[#c2784f] text-white px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md active-press"
                          >
                            <MessageCircle size={14}/> Cevapla
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
           </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-[#12100e] border border-[#c2784f]/35 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] w-full max-w-sm overflow-hidden flex flex-col p-6 text-white">
              <h3 className="font-serif font-light text-xl mb-4 text-white">Yeni <span className="text-gradient-copper font-black italic">Kategori</span> Ekle</h3>
              <input type="text" placeholder="Örn: Tatlılar" value={newCategoryName} onChange={(e)=>setNewCategoryName(e.target.value)} className="w-full p-3.5 border border-white/10 rounded-2xl focus:border-[#c2784f] outline-none font-bold mb-6 text-white bg-white/5 placeholder-slate-500" autoFocus />
              <div className="flex gap-3">
                 <button type="button" onClick={()=>setShowCategoryModal(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl transition-colors border border-white/10">İptal</button>
                 <button type="button" onClick={handleAddCategory} className="flex-1 py-3 btn-premium font-bold rounded-xl shadow-md transition-colors text-xs uppercase tracking-wider">Ekle</button>
              </div>
           </div>
        </div>
      )}

      {personnelDeleteConfirmId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#12100e] border border-red-500/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 text-white">
            <div className="p-8 flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center">
                <Trash2 size={28} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-light text-white mb-2">Personeli Sil</h3>
                <p className="text-slate-400 text-xs sm:text-sm font-light">Bu personeli silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
              </div>
              <div className="flex gap-3 w-full">
                <button type="button" onClick={() => setPersonnelDeleteConfirmId(null)} className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 text-slate-300 font-bold hover:bg-white/10 transition-colors text-xs uppercase tracking-wider">İptal</button>
                <button type="button" onClick={() => executeDeletePersonnel(personnelDeleteConfirmId)} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-md text-xs uppercase tracking-wider">Evet, Sil</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showImportConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#12100e] border border-[#c2784f]/35 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 text-white">
            <div className="p-8 flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 bg-[#c2784f]/15 border border-[#c2784f]/30 text-[#e09f7a] rounded-full flex items-center justify-center">
                <MenuSquare size={28} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-light text-white mb-2">Varsayılan Menüyü Aktar</h3>
                <p className="text-slate-400 text-xs sm:text-sm font-light">Varsayılan menü öğeleri veritabanına eklenecektir. Onaylıyor musunuz?</p>
              </div>
              <div className="flex gap-3 w-full">
                <button type="button" onClick={() => setShowImportConfirm(false)} className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 text-slate-300 font-bold hover:bg-white/10 transition-colors text-xs uppercase tracking-wider">İptal</button>
                <button type="button" onClick={importDefaultMenu} className="flex-1 py-3 rounded-xl btn-premium text-white font-bold transition-colors shadow-md text-xs uppercase tracking-wider">Aktar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div 
          className={`fixed bottom-24 right-4 sm:right-6 z-[300] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl max-w-xs sm:max-w-sm border ${
            toast.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 
            toast.type === 'error'   ? 'bg-red-600 border-red-500 text-white' : 
                                       'bg-slate-700 border-slate-600 text-white'
          }`}
          style={{ animation: 'toastIn 0.35s cubic-bezier(.21,1.02,.73,1) both' }}
        >
          <span className="text-xl shrink-0">
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <p className="font-bold text-sm leading-snug">{toast.message}</p>
          <button type="button" onClick={() => setToast(null)} className="ml-2 shrink-0 opacity-70 hover:opacity-100 transition-opacity">
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );

  // --- SAYFA RENDER: VİTRİN ---
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-[#0a0908] font-sans text-slate-100 relative flex flex-col scroll-smooth w-full overflow-x-hidden">
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
        {renderNavbar(false)}

        {/* HERO BÖLÜMÜ */}
        <header className="relative w-full min-h-[640px] sm:min-h-[720px] lg:h-[92vh] max-h-[1100px] flex items-center justify-center overflow-hidden pt-28 sm:pt-24 pb-20 sm:pb-24 bg-[#0a0908] bg-[url('/salaasarkaplan.jpeg')] bg-cover bg-center bg-no-repeat">
           <div className="absolute inset-0 z-0 bg-black/60">
             <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908]/90 via-black/40 to-[#0a0908] w-full"></div>
             <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #c2784f 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }}></div>
           </div>
           
           {/* Masaüstü Atmosferik Bakır Işık */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] lg:w-[800px] h-[350px] sm:h-[450px] bg-[#c2784f]/15 rounded-full blur-[140px] pointer-events-none"></div>

           <div className="relative z-10 text-center px-4 sm:px-6 w-full max-w-6xl mx-auto flex flex-col items-center justify-center h-full">
              
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white font-serif mb-4 sm:mb-6 drop-shadow-2xl animate-fade-in-up leading-[1.12]">
                Gebze'nin En Sevilen <span className="text-gradient-copper italic font-light">Serpme Kahvaltısı</span> &amp; Lezzet Durağı
              </h1>
              
              <p className="text-sm sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto font-light tracking-wide mb-8 sm:mb-12 leading-relaxed drop-shadow-md animate-fade-in-up delay-100">
                25+ çeşit taze serpme köy kahvaltısı, dev ekranda canlı derbi maç heyecanı, zengin dünya mutfağı ve nezih bahçe atmosferiyle Salaaş Cafe Restaurant'ta buluşun.
              </p>
              
              {/* Eylem Butonları: Rezervasyon + Menü */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3.5 sm:gap-5 animate-fade-in-scale delay-200 w-full max-w-md lg:max-w-xl mx-auto mb-10 sm:mb-14">
                 <button 
                   onClick={() => setShowRequestModal(true)} 
                   className="w-full sm:w-auto btn-premium active-press px-8 py-4 sm:py-4.5 lg:px-10 rounded-full font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 text-xs sm:text-sm glow-copper"
                 >
                   <CalendarDays size={18} /> Rezervasyon Talebi
                 </button>
                 
                 <button 
                   onClick={handleNavToMenu} 
                   className="w-full sm:w-auto btn-outline-premium active-press bg-black/40 backdrop-blur-md px-8 py-4 sm:py-4.5 rounded-full font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 text-xs sm:text-sm hover:border-[#c2784f] text-white"
                 >
                   <UtensilsCrossed size={17} className="text-[#c2784f]" /> Dijital Menü
                 </button>
              </div>
              
              {/* Kategori Rozetleri */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-8 text-[10px] sm:text-xs font-black tracking-widest uppercase text-slate-200 animate-fade-in-up delay-300">
                 <button onClick={() => handleScrollToId('kahvalti')} className="flex items-center gap-2 glass px-5 py-2.5 sm:px-6 sm:py-3 rounded-full shadow-lg hover:border-[#c2784f]/50 hover:bg-[#c2784f]/15 transition-all active-press border-[#c2784f]/30 text-[#e09f7a]">
                   <Coffee size={16} className="text-[#c2784f]"/> 🥞 Serpme Kahvaltı
                 </button>
                 <button onClick={() => handleScrollToId('mac-yayini')} className="flex items-center gap-2 glass px-5 py-2.5 sm:px-6 sm:py-3 rounded-full shadow-lg hover:border-[#c2784f]/50 hover:bg-[#c2784f]/15 transition-all active-press">
                   <Tv size={16} className="text-[#c2784f]"/> ⚽ Canlı Maç Yayını
                 </button>
                 <button onClick={handleNavToMenu} className="flex items-center gap-2 glass px-5 py-2.5 sm:px-6 sm:py-3 rounded-full shadow-lg hover:border-[#c2784f]/50 hover:bg-[#c2784f]/10 transition-all active-press">
                   <UtensilsCrossed size={16} className="text-[#c2784f]"/> 🥩 Izgara &amp; Burger
                 </button>
                 <button onClick={handleNavToMenu} className="flex items-center gap-2 glass px-5 py-2.5 sm:px-6 sm:py-3 rounded-full shadow-lg hover:border-[#c2784f]/50 hover:bg-[#c2784f]/10 transition-all active-press">
                   <Wind size={16} className="text-[#c2784f]"/> 💨 Nargile &amp; İçecek
                 </button>
              </div>

              {/* Keşfet Kaydırma İndikatörü */}
              <div 
                className="mt-8 sm:mt-12 flex flex-col items-center justify-center text-center text-white/50 hover:text-[#c2784f] transition-colors cursor-pointer animate-bounce pointer-events-auto"
                onClick={() => handleScrollToId('kahvalti')}
                title="Kahvaltı Bölümüne Kaydır"
              >
                 <span className="text-[10px] tracking-[0.25em] uppercase font-bold block mb-1.5 opacity-70 text-center pl-1">Keşfet</span>
                 <div className="w-5 h-8 sm:w-6 sm:h-9 border-2 border-white/25 rounded-full flex justify-center p-1 shadow-lg bg-black/20 backdrop-blur-sm">
                   <div className="w-1 h-2 bg-[#c2784f] rounded-full"></div>
                 </div>
              </div>
           </div>
        </header>

        <main className="w-full relative z-10 flex-1 flex flex-col">
          {/* HİKAYEMİZ / BİZ KİMİZ */}
          <section id="hakkimizda" className="relative w-full mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 py-20 sm:py-28 md:py-36 text-center bg-[#1c1917] text-white bg-[url('/bizkimizarkaplan.png')] bg-cover bg-center bg-fixed">
            <div className="absolute inset-0 z-0 bg-black/65">
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-black/40 to-[#0a0908]"></div>
            </div>
            
            <div className="relative z-10 max-w-5xl mx-auto">
              <div className="animate-float inline-block mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#c2784f]/10 flex items-center justify-center border border-[#c2784f]/30 shadow-[0_0_30px_rgba(194,120,79,0.2)]">
                  <MoonStar size={36} className="text-[#c2784f]" />
                </div>
              </div>
              
              <h2 className="text-[10px] sm:text-xs lg:text-sm font-black tracking-[0.4em] text-[#e09f7a] uppercase mb-3">Hikayemiz</h2>
              <h3 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-white mb-8 leading-tight">
                Sıcak, Samimi ve <span className="text-gradient-copper font-black italic">Lezzetli</span>
              </h3>
              
              <p className="text-sm sm:text-base lg:text-xl text-slate-300 leading-relaxed font-light max-w-4xl mx-auto px-4">
                Salaaş Cafe Restaurant olarak, misafirlerimize kendilerini evlerinde hissedecekleri sıcak bir ortam sunuyoruz. Özenle seçilmiş malzemelerle hazırladığımız zengin menümüz, imza ızgaralarımız, serpme kahvaltımız ve keyifli nargile köşemizle günün her saatinde kaliteli bir deneyim yaşatmayı hedefliyoruz.
              </p>

              {/* Masaüstü ve Mobil Prestij Kartları */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8 max-w-5xl mx-auto mt-14 sm:mt-16 text-left">
                <div className="glass-card rounded-2xl p-6 sm:p-7 flex items-start gap-4 border border-white/10 hover:border-[#c2784f]/40 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[#c2784f]/15 border border-[#c2784f]/30 flex items-center justify-center shrink-0 text-[#e09f7a]">
                    <Users size={22} />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-white font-medium mb-1">300+ Kişilik Alan</h4>
                    <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">Ferah bahçe ve kapalı salonumuzla keyifli buluşmalara ev sahipliği yapıyoruz.</p>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6 sm:p-7 flex items-start gap-4 border border-white/10 hover:border-[#c2784f]/40 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[#c2784f]/15 border border-[#c2784f]/30 flex items-center justify-center shrink-0 text-[#e09f7a]">
                    <ChefHat size={22} />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-white font-medium mb-1">Doğal & Taze Mutfak</h4>
                    <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">Serpme köy kahvaltısından zengin ızgaralara günlük en kaliteli ürünler.</p>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6 sm:p-7 flex items-start gap-4 border border-white/10 hover:border-[#c2784f]/40 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[#c2784f]/15 border border-[#c2784f]/30 flex items-center justify-center shrink-0 text-[#e09f7a]">
                    <Wind size={22} />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-white font-medium mb-1">Keyifli Muhabbet</h4>
                    <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">Özel nargile çeşitleri, sıcak kahveler ve maç yayınları eşliğinde samimi vakit.</p>
                  </div>
                </div>
              </div>

              <div className="w-20 h-1 bg-[#c2784f] mx-auto mt-14 rounded-full opacity-50"></div>
            </div>
          </section>

          {/* GEBZE SERPME KAHVALTI BÖLÜMÜ (EN ÖNCELİKLİ SEO BÖLÜMÜ) */}
          <section id="kahvalti" className="w-full py-20 sm:py-28 md:py-36 bg-[#0d0c0a] text-white relative overflow-hidden border-t border-b border-white/5">
            {/* Arkaplan Işık Efektleri */}
            <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#c2784f]/10 rounded-full blur-[160px] pointer-events-none"></div>
            <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute inset-0 opacity-[0.03] w-full h-full pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
              
              {/* Başlık & SEO Açıklama */}
              <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c2784f]/15 border border-[#c2784f]/35 text-[#e09f7a] text-[10px] sm:text-xs font-black tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(194,120,79,0.2)]">
                  <Coffee size={14} className="text-[#c2784f]" /> GEBZE'NİN 1 NUMARALI KAHVALTI ADRESİ
                </div>
                
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-white mb-6 leading-tight">
                  Gebze'nin En Zengin <br/>
                  <span className="text-gradient-copper italic font-black">Serpme Köy Kahvaltısı</span>
                </h2>
                
                <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-light leading-relaxed max-w-3xl mx-auto">
                  Güne enfes bir başlangıç için Gebze'de doğru adrestesiniz! Özenle seçilmiş 25'ten fazla doğal köy ürünü, sıcacık çıtır pişiler, sahanda tereyağlı sucuklu yumurta, manda kaymağı ve organik petek bal eşliğinde sınırsız semaver çayıyla unutulmaz bir kahvaltı şöleni sunuyoruz.
                </p>
              </div>

              {/* Tek ve Görkemli Serpme Köy Kahvaltısı Vitrin Kartı */}
              <div className="max-w-5xl mx-auto mb-16">
                <div className="glass-card rounded-[2.5rem] overflow-hidden border border-[#c2784f]/40 hover:border-[#c2784f]/70 transition-all duration-500 shadow-2xl group flex flex-col">
                  
                  {/* Üst Görsel ve Karşılama Başlığı */}
                  <div className="relative h-72 sm:h-96 lg:h-[460px] w-full overflow-hidden">
                    <img 
                      src="/salaskoy.jpg" 
                      alt="Gebze Salaaş Serpme Köy Kahvaltısı" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
                    
                    <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex flex-wrap gap-2">
                      <span className="px-4 py-2 rounded-full bg-black/75 backdrop-blur-md border border-[#c2784f]/60 text-[#e09f7a] text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xl">
                        <Star size={13} className="text-[#c2784f] fill-[#c2784f]"/> GEBZE'NİN İMZA LEZZETİ
                      </span>
                      <span className="px-4 py-2 rounded-full bg-[#c2784f]/25 backdrop-blur-md border border-[#c2784f]/40 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider hidden sm:flex items-center gap-1.5">
                        🥞 25+ ÇEŞİT DOĞAL KÖY KAHVALTISI
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-10 sm:right-10">
                      <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-light drop-shadow-lg">
                        Salaaş <span className="text-gradient-copper font-black italic">Serpme Köy Kahvaltısı</span>
                      </h3>
                      <p className="text-sm sm:text-base text-slate-300 font-light mt-2 max-w-2xl leading-relaxed">
                        Doğal çiftlik ürünleri, sahanda sıcacık pişen sucuk ve yumurta, çıtır pişiler ve masanıza özel sınırsız demlik çay.
                      </p>
                    </div>
                  </div>

                  {/* Zengin İçerik Listesi (Geniş 2 Sütunlu Izgara) */}
                  <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-black/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 text-xs sm:text-sm text-slate-300 font-light">
                      <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <CheckCircle2 size={18} className="text-[#c2784f] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block font-medium mb-0.5">🍳 Sahanda Sıcaklar &amp; Hamur İşi:</strong>
                          <span>Sahanda tereyağlı sucuklu yumurta, menemen veya sıcak kuymak, sıcacık puf pişiler ve ekmek sepeti.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <CheckCircle2 size={18} className="text-[#c2784f] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block font-medium mb-0.5">🧀 Yöresel Doğal Peynirler:</strong>
                          <span>Ezine tam yağlı beyaz peynir, eski kaşar, tulum peyniri, tel çeçil ve taze kahvaltılık lor.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <CheckCircle2 size={18} className="text-[#c2784f] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block font-medium mb-0.5">🍯 Tatlılar &amp; Bal-Kaymak:</strong>
                          <span>Hakiki organik petek bal, manda kaymağı, ev yapımı reçeller, tereyağı ve özel acuka ezmesi.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <CheckCircle2 size={18} className="text-[#c2784f] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block font-medium mb-0.5">🫒 Zeytin &amp; Taze Bahçe Söğüşü:</strong>
                          <span>Gemlik siyah zeytin, Hatay kırma yeşil zeytin, salkım domates, çıtır salatalık ve taze yeşillikler.</span>
                        </div>
                      </div>
                    </div>

                    {/* Sınırsız Semaver Çay Vurgusu */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#c2784f]/10 border border-[#c2784f]/30 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                      <div className="flex items-center gap-3 text-center sm:text-left">
                        <div className="w-10 h-10 rounded-xl bg-[#c2784f]/20 border border-[#c2784f]/30 flex items-center justify-center text-[#e09f7a] shrink-0">
                          <Coffee size={20} />
                        </div>
                        <div>
                          <span className="font-bold text-white text-sm block">Sınırsız Demlik Çay İkramımızdır</span>
                          <span className="text-xs text-slate-400 font-light">Kahvaltınız boyunca masanıza özel taze demlenen Rize çayı kesintisiz servis edilir.</span>
                        </div>
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-[#e09f7a] border border-[#c2784f]/30 px-3 py-1.5 rounded-full shrink-0">
                        SINIRSIZ SERVİS
                      </span>
                    </div>

                    {/* Eylem Butonları */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={() => { setRequestData({...requestData, type: 'kahvalti'}); setShowRequestModal(true); }}
                        className="flex-1 btn-premium py-4 px-8 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-2xl active-press glow-copper"
                      >
                        <CalendarDays size={18} /> Kahvaltı Masası Ayırt
                      </button>
                      <a 
                        href={`https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent('Merhaba Salaaş Cafe, Gebze serpme köy kahvaltısı için masa ayırtmak istiyorum.')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-outline-premium py-4 px-6 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:border-[#c2784f] active-press bg-white/5"
                      >
                        <MessageCircle size={18} className="text-[#25D366]" /> WhatsApp'tan Sor
                      </a>
                      <button 
                        onClick={handleNavToMenu}
                        className="btn-outline-premium py-4 px-6 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:border-[#c2784f] active-press"
                      >
                        <UtensilsCrossed size={17} className="text-[#c2784f]" /> Menüde Gör
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Önemli Güvence Rozeti */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
                <div className="glass p-5 rounded-2xl border border-white/10 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-[#c2784f]/15 border border-[#c2784f]/30 text-[#e09f7a] flex items-center justify-center mb-3">
                    <Flame size={22} />
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">Sıcak &amp; Anında Servis</h4>
                  <p className="text-[11px] text-slate-400 font-light">Siparişinize özel anında masanıza gelen sıcacık sahanda lezzetler</p>
                </div>

                <div className="glass p-5 rounded-2xl border border-white/10 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-[#c2784f]/15 border border-[#c2784f]/30 text-[#e09f7a] flex items-center justify-center mb-3">
                    <ChefHat size={22} />
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">Yöresel &amp; Doğal</h4>
                  <p className="text-[11px] text-slate-400 font-light">Çiftlik yumurtası, manda kaymağı ve organik petek bal</p>
                </div>

                <div className="glass p-5 rounded-2xl border border-white/10 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-[#c2784f]/15 border border-[#c2784f]/30 text-[#e09f7a] flex items-center justify-center mb-3">
                    <Coffee size={22} />
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">Sınırsız Demlik Çay</h4>
                  <p className="text-[11px] text-slate-400 font-light">Kahvaltınız süresince taze demlenen kesintisiz Rize çayı</p>
                </div>

                <div className="glass p-5 rounded-2xl border border-white/10 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-[#c2784f]/15 border border-[#c2784f]/30 text-[#e09f7a] flex items-center justify-center mb-3">
                    <Users size={22} />
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">300 Kişilik Bahçe</h4>
                  <p className="text-[11px] text-slate-400 font-light">Geniş oturma düzeni, çocuk dostu alan ve kolay otopark</p>
                </div>
              </div>

            </div>
          </section>

          {/* VİTRİNİMİZ / BUNU DENEDİNİZ Mİ */}
          <section id="lezzetler" className="w-full py-20 sm:py-28 md:py-36 bg-[#0a0908] relative">
            <div className="absolute top-1/4 left-0 w-72 h-72 bg-[#c2784f]/10 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[160px] pointer-events-none"></div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 sm:mb-16 gap-6">
                <div>
                  <h2 className="text-[10px] sm:text-xs lg:text-sm font-black tracking-[0.4em] text-[#e09f7a] uppercase mb-3">Vitrinimiz</h2>
                  <h3 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-white">Bunu <span className="text-gradient-copper italic font-black">Denediniz mi?</span></h3>
                </div>
                <button 
                  onClick={handleNavToMenu} 
                  className="group flex items-center gap-3.5 text-xs font-black text-slate-300 hover:text-[#c2784f] transition-all uppercase tracking-[0.2em] active-press"
                >
                  Tüm Menüyü Gör 
                  <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-[#c2784f] group-hover:bg-[#c2784f]/15 group-hover:translate-x-1 transition-all">
                    <ChevronRight size={18} className="text-white group-hover:text-[#c2784f]"/>
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {activeGallery.slice(0, 4).map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedMenuItem(item)} 
                    className="glass-card rounded-3xl overflow-hidden relative group h-80 sm:h-96 md:h-[440px] cursor-pointer active-press hover:border-[#c2784f]/50 hover:shadow-[0_20px_50px_rgba(194,120,79,0.2)] transition-all duration-500"
                  >
                    <img src={item.image} alt={item.name} className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${item.isSoldOut ? 'opacity-40 grayscale' : 'opacity-85 group-hover:opacity-100'}`} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-8">
                       <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full w-max mb-3 flex items-center gap-1.5 backdrop-blur-md border ${item.isSoldOut ? 'bg-red-900/80 border-red-500/50 text-red-200' : 'bg-black/60 border-white/20 text-[#e09f7a]'}`}>
                         {item.isSoldOut ? 'TÜKENDİ' : <><Star size={11} className="text-[#c2784f] fill-[#c2784f]"/> {item.tag || 'Öne Çıkan'}</>}
                       </span>
                       <h4 className="text-white font-serif font-light text-2xl sm:text-3xl drop-shadow-md mb-1 group-hover:text-[#c2784f] transition-colors leading-snug">{item.name}</h4>
                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex items-center gap-1 text-[#e09f7a]">
                         İncele & Bilgi Al <ChevronRight size={12}/>
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CANLI MAÇ & DERBİ YAYINI BÖLÜMÜ (DEV EKRAN CANLI YAYINLAR) */}
          <section id="mac-yayini" className="w-full py-20 sm:py-28 md:py-36 bg-[#080706] text-white relative overflow-hidden border-t border-b border-white/5">
            {/* Atmosferik Stadyum Yeşil & Bakır Işıltıları */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 rounded-full blur-[170px] pointer-events-none"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#c2784f]/10 rounded-full blur-[160px] pointer-events-none"></div>
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
              
              <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 text-[10px] sm:text-xs font-black tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <Tv size={14} className="text-emerald-400" /> GEBZE'DE CANLI MAÇ &amp; DERBİ HEYECANI
                </div>
                
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-white mb-6 leading-tight">
                  Dev Ekranda Canlı <br/>
                  <span className="text-gradient-copper italic font-black">Maç &amp; Derbi Keyfi</span>
                </h2>
                
                <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-light leading-relaxed max-w-3xl mx-auto">
                  Trendyol Süper Lig derbileri (Galatasaray, Fenerbahçe, Beşiktaş, Trabzonspor), Avrupa Kupaları ve A Milli Takım karşılaşmaları dev LED ekranlarda kesintisiz yüksek çözünürlüklü HD yayın kalitesiyle Salaaş Cafe'de! Donmasız yayın ve stadyum coşkusuyla yerinizi şimdiden ayırtın.
                </p>
              </div>

              {/* 4 Ana Maç Özelliği Kartı */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                
                <div className="glass-card rounded-2xl p-6 border border-white/10 hover:border-emerald-500/40 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Tv size={24} />
                  </div>
                  <h4 className="font-serif text-lg text-white font-medium mb-2">Dev LED Ekranlar</h4>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Mekanın her açısından net görüş sağlayan geniş projeksiyon ve çoklu HD ekran donanımı.
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-white/10 hover:border-[#c2784f]/40 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-[#c2784f]/15 border border-[#c2784f]/30 text-[#e09f7a] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Trophy size={24} />
                  </div>
                  <h4 className="font-serif text-lg text-white font-medium mb-2">Tüm Derbiler &amp; Ligler</h4>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Kesintisiz yüksek çözünürlüklü HD yayın akışıyla donma ve gecikme olmadan tüm lig maçlarında stadyum keyfi.
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-white/10 hover:border-amber-500/40 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UtensilsCrossed size={24} />
                  </div>
                  <h4 className="font-serif text-lg text-white font-medium mb-2">Maç Menüsü &amp; Burger</h4>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Çıtır patates kovaları, ev yapımı burgerler, çıtır tavuk atıştırmalıkları ve buz gibi içecekler.
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-white/10 hover:border-[#c2784f]/40 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-[#c2784f]/15 border border-[#c2784f]/30 text-[#e09f7a] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Wind size={24} />
                  </div>
                  <h4 className="font-serif text-lg text-white font-medium mb-2">Nargile &amp; Sıcak Sohbet</h4>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Maç heyecanına eşlik eden özel nargile aromaları, taze kahveler ve konforlu oturma grupları.
                  </p>
                </div>

              </div>

              {/* Canlı Yayın Programı & Hızlı Rezervasyon Banner'ı */}
              <div className="card-luxury rounded-3xl p-6 sm:p-10 border border-emerald-500/25 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="text-center md:text-left">
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-emerald-400 block mb-2">CANLI YAYIN PROGRAMI</span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-white font-light">
                      Büyük Derbilerde <span className="text-gradient-copper italic font-black">Yerinizi Garantileyin</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-light mt-2 max-w-xl">
                      Derbi günleri yoğunluk yaşanmaktadır. Siz ve arkadaş grubunuz için en iyi görüş açısına sahip masayı erkenden ayırtın.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                    <button 
                      onClick={() => { setRequestData({...requestData, type: 'mac'}); setShowRequestModal(true); }}
                      className="btn-premium py-4 px-8 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-2xl active-press glow-copper"
                    >
                      <CalendarDays size={17} /> Maç Masası Ayırt
                    </button>
                    <a 
                      href={`https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent('Merhaba Salaaş Cafe, canlı derbi maç yayını için masa ayırtmak istiyorum.')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline-premium py-4 px-7 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:border-emerald-500 active-press bg-white/5"
                    >
                      <MessageCircle size={17} className="text-[#25D366]" /> WhatsApp'tan Ayırt
                    </a>
                  </div>
                </div>

                {/* Daima Güncel Yayın Programı Kartları */}
                <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                    <div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mb-2">
                        <span className="text-emerald-400 font-bold flex items-center gap-1"><Tv size={11} /> Canlı HD Yayın</span>
                        <span className="text-slate-400">Hafta Sonu &amp; Derbi Günleri</span>
                      </div>
                      <h4 className="text-base font-serif font-medium text-white mb-1">Süper Lig Derbileri</h4>
                      <p className="text-xs text-slate-400 font-light">Galatasaray, Fenerbahçe, Beşiktaş, Trabzonspor ve tüm lig heyecanı</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => { setRequestData({...requestData, type: 'mac', notes: 'Süper Lig derbi maçı için masa talebi'}); setShowRequestModal(true); }}
                      className="text-xs font-black text-[#e09f7a] hover:text-white uppercase tracking-wider mt-4 pt-3 border-t border-white/5 flex items-center justify-between transition-colors"
                    >
                      <span>Derbi Masası Ayırt</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                    <div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mb-2">
                        <span className="text-emerald-400 font-bold flex items-center gap-1"><Trophy size={11} /> Canlı HD Yayın</span>
                        <span className="text-slate-400">Salı &amp; Çarşamba Akşamları</span>
                      </div>
                      <h4 className="text-base font-serif font-medium text-white mb-1">Şampiyonlar Ligi &amp; Avrupa</h4>
                      <p className="text-xs text-slate-400 font-light">UEFA Şampiyonlar Ligi, Avrupa Ligi ve Konferans Ligi karşılaşmaları</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => { setRequestData({...requestData, type: 'mac', notes: 'Avrupa kupaları maçı için masa talebi'}); setShowRequestModal(true); }}
                      className="text-xs font-black text-[#e09f7a] hover:text-white uppercase tracking-wider mt-4 pt-3 border-t border-white/5 flex items-center justify-between transition-colors"
                    >
                      <span>Avrupa Masası Ayırt</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                    <div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mb-2">
                        <span className="text-emerald-400 font-bold flex items-center gap-1"><Tv size={11} /> Canlı HD Yayın</span>
                        <span className="text-slate-400">Fikstür Günleri</span>
                      </div>
                      <h4 className="text-base font-serif font-medium text-white mb-1">Milli Maçlar &amp; Kupalar</h4>
                      <p className="text-xs text-slate-400 font-light">A Milli Takım, Türkiye Kupası ve tüm özel futbol geceleri</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => { setRequestData({...requestData, type: 'mac', notes: 'Milli maç / kupa yayını için masa talebi'}); setShowRequestModal(true); }}
                      className="text-xs font-black text-[#e09f7a] hover:text-white uppercase tracking-wider mt-4 pt-3 border-t border-white/5 flex items-center justify-between transition-colors"
                    >
                      <span>Önceden Yer Ayırt</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                </div>

              </div>

            </div>
          </section>

          {/* DAVET & ORGANİZASYON - Lüks Kart Yapısı */}
          <section className="w-full py-20 sm:py-28 md:py-36 bg-[#0e0d0b] text-white relative overflow-hidden border-t border-white/5">
             <div className="absolute inset-0 opacity-[0.03] w-full h-full pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#c2784f]/10 rounded-full blur-[160px] pointer-events-none"></div>
             
             <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
               <div className="card-luxury rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-14 lg:p-20 text-center relative overflow-hidden border border-[#c2784f]/25 shadow-2xl">
                 <span className="text-[10px] sm:text-xs font-black tracking-[0.4em] text-[#e09f7a] uppercase mb-4 inline-block">Davet & Organizasyon</span>
                 
                 <h3 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light mb-6 drop-shadow-lg text-white leading-tight">
                   Özel Günleriniz İçin <br/> 
                   <span className="text-gradient-copper font-black italic">Yanınızdayız</span>
                 </h3>
                 
                 <p className="text-sm sm:text-base lg:text-xl text-slate-300 font-light mb-10 max-w-3xl mx-auto leading-relaxed">
                   Doğum günü partileri, şirket yemekleri, toplu iftarlar ve tüm özel kutlamalarınız için 300 kişilik kapasitemiz ve size özel menülerimizle hizmetinizdeyiz.
                 </p>

                 {/* Organizasyon Rozetleri */}
                 <div className="flex flex-wrap justify-center gap-2.5 sm:gap-4 mb-10 sm:mb-12 max-w-2xl mx-auto">
                   <span className="glass px-4 py-2 rounded-full text-xs font-bold text-slate-200 border border-white/10 flex items-center gap-2">🎂 Doğum Günleri</span>
                   <span className="glass px-4 py-2 rounded-full text-xs font-bold text-slate-200 border border-white/10 flex items-center gap-2">💼 Kurumsal Yemekler</span>
                   <span className="glass px-4 py-2 rounded-full text-xs font-bold text-slate-200 border border-white/10 flex items-center gap-2">🌙 Toplu İftarlar</span>
                   <span className="glass px-4 py-2 rounded-full text-xs font-bold text-slate-200 border border-white/10 flex items-center gap-2">✨ Özel Kutlamalar</span>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                   <button 
                     onClick={() => {setRequestData({...requestData, type: 'organizasyon'}); setShowRequestModal(true);}} 
                     className="w-full sm:w-auto btn-premium active-press px-8 py-4 sm:py-4.5 lg:px-10 rounded-full font-black uppercase tracking-[0.2em] shadow-2xl inline-flex items-center justify-center gap-3 text-xs sm:text-sm glow-copper"
                   >
                     <CalendarDays size={18}/> Organizasyon Talebi
                   </button>
                   
                   <a
                     href={`https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent('Merhaba Salaaş Cafe, organizasyon ve özel davetler hakkında bilgi almak istiyorum.')}`}
                     target="_blank"
                     rel="noreferrer"
                     className="w-full sm:w-auto btn-outline-premium active-press px-7 py-4 rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm inline-flex items-center justify-center gap-2 bg-white/5 hover:border-[#c2784f]"
                   >
                     <MessageCircle size={18} className="text-[#25D366]"/> WhatsApp'tan Bilgi Al
                   </a>
                 </div>
               </div>
             </div>
          </section>

          {/* SIKÇA SORULAN SORULAR / SEO SSS (GOOGLE FAQ RICH CARDS İLE BİREBİR UYUMLU) */}
          <section id="sss" className="w-full py-20 sm:py-28 md:py-36 bg-[#0a0908] text-white relative overflow-hidden border-t border-white/5">
            <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-[#c2784f]/10 rounded-full blur-[160px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
              
              <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c2784f]/15 border border-[#c2784f]/35 text-[#e09f7a] text-[10px] sm:text-xs font-black tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(194,120,79,0.2)]">
                  <HelpCircle size={14} className="text-[#c2784f]" /> SIKÇA SORULAN SORULAR
                </div>
                
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-white mb-6 leading-tight">
                  Merak <span className="text-gradient-copper italic font-black">Edilenler</span>
                </h2>
                
                <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                  Gebze serpme kahvaltı, dev ekranda derbi maç yayınları ve rezervasyon süreçleri hakkında en çok sorulan soruların yanıtları.
                </p>
              </div>

              {/* Akordiyon Listesi */}
              <div className="space-y-4">
                {[
                  {
                    q: "Gebze'de en iyi serpme kahvaltı nerede yenir?",
                    a: "Gebze'de zengin serpme köy kahvaltısı için Salaaş Cafe Restaurant en popüler ve ferah mekandır. 25'ten fazla çeşit taze köy ürünü, sahanda sucuklu yumurta, menemen, sıcacık çıtır pişiler, manda kaymağı, organik petek bal ve masanıza özel sınırsız demlik çay eşliğinde servis edilmektedir."
                  },
                  {
                    q: "Salaaş Cafe Gebze'de derbi ve canlı maç yayını var mı?",
                    a: "Evet! Salaaş Cafe'de tüm Trendyol Süper Lig derbileri (Galatasaray, Fenerbahçe, Beşiktaş, Trabzonspor), UEFA Şampiyonlar Ligi, Avrupa Ligi ve Milli maçlar dev LED ekranlarda kesintisiz yüksek çözünürlüklü HD yayın ve stadyum akustiğiyle canlı yayınlanmaktadır."
                  },
                  {
                    q: "Gebze serpme kahvaltı ve derbi maçları için rezervasyon gerekli mi?",
                    a: "Hafta sonu serpme kahvaltısı saatlerinde (10:00 - 14:00) ve büyük derbi maç akşamlarında mekanımızda yoğun talep yaşandığı için web sitemizdeki rezervasyon formundan veya 0536 017 02 08 numaralı WhatsApp hattımızdan önceden masa ayırtmanız tavsiye edilir."
                  },
                  {
                    q: "Salaaş Cafe Restaurant'ta otopark ve bahçe alanı var mı?",
                    a: "Evet, Salaaş Cafe Restaurant 300 kişilik geniş açık hava bahçe ve konforlu kapalı salon alanına sahiptir. Ailenizle, sevdiklerinizle ve kalabalık arkadaş gruplarınızla huzurlu vakit geçirebileceğiniz ferah oturma düzeni ve otopark kolaylığı sunulmaktadır."
                  }
                ].map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div 
                      key={idx}
                      className={`glass-card rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden ${
                        isOpen ? 'border-[#c2784f]/60 bg-[#141210] shadow-[0_10px_30px_rgba(194,120,79,0.15)]' : 'border-white/10 hover:border-white/25 bg-black/40'
                      }`}
                    >
                      <button 
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-5 sm:p-7 text-left flex items-center justify-between gap-4 active-press"
                        aria-expanded={isOpen}
                      >
                        <span className={`font-serif text-base sm:text-xl font-medium transition-colors ${isOpen ? 'text-[#e09f7a]' : 'text-white'}`}>
                          {item.q}
                        </span>
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                          isOpen ? 'bg-[#c2784f] text-white border-[#c2784f] rotate-180 shadow-md shadow-[#c2784f]/30' : 'bg-white/5 text-slate-400 border-white/10'
                        }`}>
                          <ChevronDown size={18} />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 sm:px-7 pb-6 sm:pb-7 pt-1 text-slate-300 text-xs sm:text-base font-light leading-relaxed border-t border-white/5 animate-in fade-in duration-200">
                          <p>{item.a}</p>
                          <div className="mt-4 pt-3 flex flex-wrap gap-3">
                            <button 
                              onClick={() => { setRequestData({...requestData, type: idx === 1 ? 'mac' : 'kahvalti'}); setShowRequestModal(true); }}
                              className="text-xs font-bold text-[#e09f7a] hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                            >
                              <span>Hemen Masa Ayırt</span> <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Ek Soru / WhatsApp İletişim Kutusu */}
              <div className="mt-12 text-center p-8 glass-card rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <h4 className="font-serif text-lg text-white font-medium mb-1">Başka Bir Sorunuz mu Var?</h4>
                  <p className="text-xs sm:text-sm text-slate-400 font-light">Ekibimiz merak ettiğiniz her konuda 7/24 WhatsApp üzerinden yardımcı olmaktan mutluluk duyar.</p>
                </div>
                <a 
                  href={`https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent('Merhaba Salaaş Cafe, bir sorum vardı.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-premium px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest inline-flex items-center gap-2 shadow-xl shrink-0 active-press"
                >
                  <MessageCircle size={17} /> WhatsApp ile Sorun
                </a>
              </div>

            </div>
          </section>

        </main>

        <div className="pb-24 md:pb-0">
          {renderFooter()}
        </div>

        {renderMobileBottomDock()}
        {renderModals()}
        
        {/* WHATSAPP YÜZEN BUTON (Masaüstünde Sağ Altta) */}
        <a 
          href={`https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent('Merhaba Salaaş Cafe, ')}`} 
          target="_blank" 
          rel="noreferrer" 
          className="hidden md:flex fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-3.5 rounded-full font-black shadow-2xl items-center justify-center gap-2 transition-transform hover:scale-105 active-press animate-beacon border-2 border-white/80"
          aria-label="WhatsApp İletişim"
        >
          <span className="text-xl">💬</span>
          <span className="text-xs font-black uppercase tracking-widest">WhatsApp</span>
        </a>
      </div>
    );
  }

  if (currentView === 'menu') {
    return (
      <div className="min-h-screen bg-[#0a0908] font-sans text-slate-200 relative w-full">
        
        {/* Background Accents */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#c2784f]/5 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-white/5 rounded-full blur-[150px]"></div>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #c2784f 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

        {renderNavbar(true)}
        
        {/* Sabit Kategori Çubuğu (Üst Menüyle Çakışmaz, Aşağı İndikçe Yapışık Kalır & Aktif Kategori Işığı Yanar) */}
        <div className="fixed top-[52px] sm:top-[66px] left-0 w-full z-40 glass border-b border-white/10 py-2 sm:py-2.5 shadow-2xl backdrop-blur-xl">
           <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 flex overflow-x-auto gap-2.5 sm:gap-4 hide-scrollbar items-center">
              {activeMenuCategories.map(cat => (
                  <button 
                    id={`btn-${cat.id}`}
                    key={cat.id} 
                    onClick={() => scrollToMenuCategory(cat.id)} 
                    className={`whitespace-nowrap px-5 sm:px-8 py-2 sm:py-2.5 rounded-full transition-all uppercase text-[10px] sm:text-xs font-black tracking-[0.2em] flex-shrink-0 active-press ${
                      activeCategory === cat.id 
                        ? 'btn-premium text-white ring-2 ring-[#e09f7a] shadow-[0_0_22px_rgba(194,120,79,0.7)] scale-105 glow-copper' 
                        : 'btn-outline-premium bg-white/5 text-slate-300 opacity-70 hover:opacity-100 hover:border-[#c2784f]/40'
                    }`}
                  >
                      {cat.name}
                  </button>
              ))}
           </div>
        </div>

        <main className="w-full mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 pt-32 sm:pt-40 pb-16 md:pb-24 relative z-10">
           {activeGallery.length > 0 && (
             <div className="mb-28">
                <div className="text-center mb-16">
                   <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-white mb-4 drop-shadow-lg"><span className="text-gradient-copper italic font-black">Öne</span> Çıkanlar</h1>
                   <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg font-light tracking-wide uppercase">En çok tercih edilen imza lezzetlerimiz.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-10">
                   {activeGallery.map((item, idx) => (
                      <div key={item.id || idx} onClick={() => setSelectedMenuItem(item)} className="glass-card rounded-3xl overflow-hidden group relative shadow-2xl h-80 md:h-96 cursor-pointer">
                         <img src={item.image} alt={item.name} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${item.isSoldOut ? 'opacity-30 grayscale' : 'opacity-80 group-hover:opacity-100'}`} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6 lg:p-8">
                            {item.isSoldOut ? (
                               <span className="bg-red-900/80 border border-red-500/50 text-red-200 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full w-max mb-4 flex items-center gap-2 backdrop-blur-md">TÜKENDİ</span>
                            ) : item.tag && (
                               <span className="bg-black/60 border border-white/20 text-[#e09f7a] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full w-max mb-4 flex items-center gap-2 backdrop-blur-md"><Star size={12} className="text-[#c2784f]"/> {item.tag}</span>
                            )}
                            <h3 className={`text-2xl sm:text-3xl font-serif font-light tracking-wide drop-shadow-md group-hover:text-[#c2784f] transition-colors ${item.isSoldOut ? 'text-slate-400' : 'text-white'}`}>{item.name}</h3>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           )}

           <div className="space-y-28">
              {activeMenuCategories.map(cat => {
                 const CatIcon = cat.Icon || UtensilsCrossed;
                 return (
                   <div id={`cat-${cat.id}`} key={cat.id} className="scroll-mt-[125px] sm:scroll-mt-[145px]">
                      <div className="flex items-center gap-6 mb-12">
                         <div className="bg-[#1c1917] border border-white/10 w-14 h-14 rounded-full flex items-center justify-center shadow-lg shrink-0">
                           <CatIcon size={24} className="text-[#c2784f]" />
                         </div>
                         <h2 className="text-3xl sm:text-4xl font-serif font-light text-white tracking-wide"><span className="text-gradient-copper font-black italic">{cat.name}</span></h2>
                         <div className="h-[1px] flex-1 bg-gradient-to-r from-[#c2784f]/50 to-transparent ml-6"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                         {cat.items.map((itemObj, idx) => {
                           if(itemObj.image) {
                             return (
                                <div key={idx} onClick={() => setSelectedMenuItem(itemObj)} className={`glass-card rounded-2xl overflow-hidden group shadow-lg flex flex-col h-full min-h-[220px] cursor-pointer relative ${itemObj.isSoldOut ? 'opacity-60 grayscale' : ''}`}>
                                   {itemObj.badges && itemObj.badges.length > 0 && (
                                     <div className="absolute top-3 left-3 z-10 flex gap-2">
                                       {itemObj.badges.map(b => {
                                          const def = BADGE_OPTIONS.find(o=>o.id===b);
                                          return def ? <span key={b} className="bg-white/90 text-slate-900 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-lg backdrop-blur-md">{def.icon}</span> : null;
                                       })}
                                     </div>
                                   )}
                                   {itemObj.isSoldOut && <div className="absolute top-3 right-3 z-10 bg-red-900/90 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-[0.2em] backdrop-blur-md border border-red-500/50">Tükendi</div>}
                                   <div className="relative w-full h-44 sm:h-52 bg-white/5 flex items-center justify-center overflow-hidden shrink-0 border-b border-white/5">
                                      <img src={itemObj.image} alt={itemObj.name} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000 opacity-90 group-hover:opacity-100" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                   </div>
                                   <div className="p-6 flex flex-col justify-between bg-transparent grow">
                                      <div>
                                        <div className="flex justify-between items-start gap-4 mb-3"><span className="text-white font-serif font-light text-lg sm:text-xl tracking-wide leading-snug group-hover:text-[#c2784f] transition-colors">{itemObj.name}</span>{itemObj.price && <span className="text-[#e09f7a] font-bold whitespace-nowrap text-sm sm:text-base border border-[#c2784f]/30 px-3 py-1 rounded-full bg-[#c2784f]/10">{itemObj.price} TL</span>}</div>
                                        {itemObj.description && <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 font-light">{itemObj.description}</p>}
                                      </div>
                                   </div>
                                </div>
                             );
                           } else {
                             return (
                                <div key={idx} onClick={() => setSelectedMenuItem(itemObj)} className={`glass-card rounded-2xl p-6 flex flex-col justify-between group transition-all h-full min-h-[100px] cursor-pointer relative ${itemObj.isSoldOut ? 'opacity-60 grayscale' : ''}`}>
                                   {itemObj.isSoldOut && <div className="absolute top-3 right-3 z-10 bg-red-900/90 text-white text-[8px] font-black px-2 py-1 rounded-full shadow-lg uppercase tracking-widest backdrop-blur-md border border-red-500/50">Tükendi</div>}
                                   {itemObj.badges && itemObj.badges.length > 0 && (
                                     <div className="flex gap-2 mb-3">
                                       {itemObj.badges.map(b => {
                                          const def = BADGE_OPTIONS.find(o=>o.id===b);
                                          return def ? <span key={b} className="bg-white/10 text-slate-200 text-[9px] font-black tracking-wider px-2 py-1 rounded border border-white/10 backdrop-blur-sm">{def.icon}</span> : null;
                                       })}
                                     </div>
                                   )}
                                   <div className="flex justify-between items-start gap-4">
                                     <span className="text-slate-200 font-serif font-light text-lg group-hover:text-[#c2784f] transition-colors leading-snug">{itemObj.name}</span>
                                     {itemObj.price && <span className="text-[#e09f7a] font-bold whitespace-nowrap text-sm border border-[#c2784f]/30 px-3 py-1 rounded-full bg-[#c2784f]/10">{itemObj.price} TL</span>}
                                   </div>
                                   {itemObj.description && <p className="text-slate-400 text-xs mt-3 line-clamp-2 font-light">{itemObj.description}</p>}
                                </div>
                             );
                           }
                         })}
                      </div>
                   </div>
                 );
              })}
           </div>
           
           <div className="mt-24 text-center flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="https://m.1menu.com.tr/salaascafe/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest transition-transform hover:scale-105 shadow-[0_0_30px_rgba(249,115,22,0.4)] text-base lg:text-lg">
                Fiyatlı Dijital Menüye Git <ArrowRight size={20} />
              </a>
           </div>
        </main>
        
        <div className="pb-24 md:pb-0">
          {renderFooter()}
        </div>

        {renderMobileBottomDock()}
        {renderModals()}

        {/* WHATSAPP FLOATING BUTTON (Masaüstü) */}
        <a 
          href={`https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent('Merhaba Salaaş Cafe, ')}`} 
          target="_blank" 
          rel="noreferrer" 
          className="hidden md:flex fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-3.5 rounded-full font-black shadow-2xl items-center justify-center gap-2 transition-transform hover:scale-110 border-4 border-white"
        >
          <span className="text-xl">💬</span>
          <span className="text-sm uppercase tracking-widest font-black">WhatsApp</span>
        </a>
      </div>
    );
  }

  // --- SAYFA RENDER: PERSONELLERİMİZ ---
  if (currentView === 'personnel') {
    return (
      <div className="min-h-screen bg-[#0a0908] font-sans text-slate-200 relative w-full overflow-x-hidden">
        {renderNavbar(false)}
        
        <header className="w-full pt-36 pb-20 lg:pt-44 lg:pb-32 bg-aurora text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/50 z-0"></div>
          <div className="absolute inset-0 opacity-20 z-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #c2784f 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="relative z-10 px-4">
             <h2 className="text-[10px] sm:text-xs lg:text-sm font-black tracking-[0.4em] text-[#e09f7a] uppercase mb-4">Takımımız</h2>
             <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light mb-6 text-white drop-shadow-2xl">Ekibimizin <span className="text-gradient-copper italic font-black">Kalbi</span></h1>
             <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto font-light tracking-wide">Salaaş Restaurant'ın lüksünü ve samimiyetini var eden, her gün özveriyle hizmet sunan değerlerimiz.</p>
          </div>
        </header>

        <main className="w-full mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 py-20 md:py-32 relative z-10">
           {personnelList.length === 0 ? (
             <div className="text-center text-slate-500 py-24 flex flex-col items-center">
                <Users size={72} className="mb-6 opacity-40 text-[#c2784f]" />
                <h3 className="text-2xl font-light font-serif text-slate-400 mb-2">Henüz kimse eklenmedi</h3>
                <p className="text-sm font-light tracking-wide uppercase">Ekibimizi çok yakında burada görebileceksiniz.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
               {personnelList.sort((a,b) => (a.order || 999) - (b.order || 999)).map(person => {
                 const avgRating = person.reviews?.length > 0 ? (person.reviews.reduce((a,c)=>a+c.rating,0)/person.reviews.length).toFixed(1) : 'Yeni';
                 return (
                   <div key={person.id} onClick={() => setSelectedPersonnel(person)} className="glass-card rounded-[2.5rem] overflow-hidden transition-all duration-700 group cursor-pointer relative shadow-2xl">
                      <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/10">
                        <Star size={12} className="text-[#c2784f]" />
                        <span className="font-bold text-white text-[10px] tracking-widest">{avgRating}</span>
                      </div>
                      <div className="h-72 sm:h-80 w-full bg-[#111] relative overflow-hidden">
                         {person.image ? (
                           <img src={person.image} alt={`${person.name} ${person.surname}`} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000 opacity-90 group-hover:opacity-100" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center bg-[#111] text-slate-700"><UserSquare size={64}/></div>
                         )}
                         <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/60 to-transparent"></div>
                         <div className="absolute bottom-0 left-0 w-full p-8 text-white z-10">
                            <h3 className="text-3xl font-serif font-light leading-tight drop-shadow-md group-hover:text-[#c2784f] transition-colors">{person.name} <span className="font-black italic text-gradient-copper">{person.surname}</span></h3>
                            {person.nickname && <p className="text-[#e09f7a] font-light tracking-wide text-sm mt-2">"{person.nickname}"</p>}
                         </div>
                      </div>
                      <div className="p-8 bg-transparent min-h-[140px] flex flex-col justify-center">
                         <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><div className="w-4 h-[1px] bg-[#c2784f]"></div> Uzmanlık</h4>
                         {person.skills ? (
                           <p className="text-sm font-light text-slate-300 leading-relaxed line-clamp-3">{person.skills}</p>
                         ) : (
                           <p className="text-sm font-light text-slate-600 italic">Belirtilmedi</p>
                         )}
                      </div>
                   </div>
                 );
               })}
             </div>
           )}
        </main>
        
        <div className="pb-24 md:pb-0">
          {renderFooter()}
        </div>

        {renderMobileBottomDock()}
        {renderModals()}

        {/* WHATSAPP FLOATING BUTTON (Masaüstü) */}
        <a 
          href={`https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent('Merhaba Salaaş Cafe, ')}`} 
          target="_blank" 
          rel="noreferrer" 
          className="hidden md:flex fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20b858] text-white px-5 py-3.5 rounded-full font-black shadow-2xl items-center justify-center gap-2 transition-transform hover:scale-110 border-4 border-white"
        >
          <span className="text-xl">💬</span>
          <span className="text-sm uppercase tracking-widest font-black">WhatsApp</span>
        </a>
      </div>
    );
  }

  // --- SAYFA RENDER: ADMİN GİRİŞİ VEYA YÖNETİM PANELİ ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center p-4 relative overflow-hidden text-white font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c2784f]/15 rounded-full blur-[140px] pointer-events-none"></div>
        
        <div className="bg-[#12100e] border border-[#c2784f]/35 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl relative z-10 text-white">
          <div className="flex flex-col items-center text-center mb-8">
            <img src="/salaaslogobg.png" alt="Salaaş Logo" className="h-16 w-auto object-contain mb-4 select-none" />
            <h1 className="text-2xl font-serif font-light text-white">Salaaş <span className="text-gradient-copper italic font-black">Yönetim Paneli</span></h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-sans font-bold">Yetkili Girişi</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertTriangle size={16} /> {loginError}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Kullanıcı Adı</label>
              <input 
                type="text" 
                value={loginUser} 
                onChange={(e) => setLoginUser(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] text-white p-3.5 rounded-xl outline-none font-bold text-sm" 
                placeholder="salaas" 
                autoFocus 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Şifre</label>
              <input 
                type="password" 
                value={loginPass} 
                onChange={(e) => setLoginPass(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] text-white p-3.5 rounded-xl outline-none font-bold text-sm" 
                placeholder="••••••••" 
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  className="rounded accent-[#c2784f] w-4 h-4 cursor-pointer" 
                />
                <span className="font-medium text-slate-300">Beni Hatırla (Telefonda Kalıcı)</span>
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full btn-premium py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl glow-copper active-press mt-2"
            >
              <Lock size={16} /> Panele Giriş Yap
            </button>

            <button 
              type="button" 
              onClick={handleNavToHome} 
              className="w-full text-center text-xs text-slate-400 hover:text-white transition-colors pt-2 active-press"
            >
              ← Ana Sayfaya / Vitrine Dön
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              💡 <strong>iPhone Safari İpucu:</strong> Giriş yaptıktan sonra Safari'nin Paylaş (📤) menüsünden <strong>"Ana Ekrana Ekle"</strong> diyerek paneli telefonunuza mobil uygulama olarak kaydedebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- SAYFA RENDER: YÖNETİM PANELİ (GİRİŞ YAPILMIŞ) ---
  return (
    <div className="min-h-screen bg-[#0a0908] text-slate-100 font-sans pb-32 md:pb-16 relative overflow-x-hidden w-full selection:bg-[#c2784f] selection:text-white print:bg-white print:text-black print:pb-0">
      {/* Ambient Luxury Copper Glows */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#c2784f]/10 rounded-full blur-[140px]"></div>
      <div className="pointer-events-none fixed bottom-0 right-0 w-[500px] h-[400px] bg-[#c2784f]/5 rounded-full blur-[150px]"></div>

      {bulkMessage && (
        <div className="fixed top-24 right-4 sm:right-10 z-[100] bg-[#14110e] text-white p-4 sm:p-5 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm border border-[#c2784f]/40 animate-in slide-in-from-right-8 duration-300">
          <CheckCircle size={24} className="text-[#c2784f] shrink-0" />
          <p className="font-medium text-sm sm:text-base leading-snug">{bulkMessage}</p>
          <button type="button" onClick={() => setBulkMessage('')} className="ml-auto text-slate-400 hover:text-white bg-white/5 p-1.5 rounded-lg transition-colors shrink-0">
            <X size={18} />
          </button>
        </div>
      )}

      <header className="bg-[#0a0908]/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30 print:hidden transition-colors duration-300 w-full shadow-lg">
        {/* Üst Bar: Logo, Başlık, Siteyi Gör, Tarih Seçici, Çıkış */}
        <div className="w-full px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 shrink-0">
            <div className="h-9 sm:h-11 shrink-0 flex items-center justify-center cursor-pointer active-press" onClick={handleNavToHome} title="Ana Sayfaya Git">
              <img src="/salaaslogobg.png" alt="Salaaş Cafe Logo" className="h-full w-auto object-contain select-none drop-shadow-md" />
            </div>
            <div className="hidden sm:block border-l border-white/10 pl-3.5">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#c2784f] font-black block">Salaaş Cafe & Restaurant</span>
              <h1 className="text-sm font-serif font-light text-white tracking-wide">Yönetim <span className="text-gradient-copper italic font-black">Paneli</span></h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 ml-auto">
            {/* Müşteri Vitrinini Gör Butonu */}
            <button 
              onClick={handleNavToHome} 
              className="shrink-0 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 border border-white/10 active-press"
              title="Siteyi müşteri gözünden görüntüle"
            >
              <Eye size={15} className="text-[#c2784f]" /> <span className="hidden sm:inline">Siteyi Gör</span>
            </button>

            {(activeAdminTab === 'restoran' || activeAdminTab === 'mac') && (
              <div className="flex shrink-0 items-center bg-white/5 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 border border-white/10 shadow-sm">
                <CalendarDays className="mr-1.5 text-[#c2784f]" size={15} />
                <input 
                  type="date" 
                  value={activeAdminTab === 'restoran' ? selectedFilterDate : selectedMatchDate} 
                  onChange={(e) => activeAdminTab === 'restoran' ? setSelectedFilterDate(e.target.value) : setSelectedMatchDate(e.target.value)} 
                  className="bg-transparent text-white outline-none font-bold cursor-pointer text-xs sm:text-sm w-auto [color-scheme:dark]" 
                />
              </div>
            )}

            <button 
              onClick={handleLogout} 
              className="shrink-0 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/30 hover:border-red-500 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md whitespace-nowrap active-press"
            >
              ÇIKIŞ
            </button>
          </div>
        </div>

        {/* ÜST KAYDIRILABİLİR SEKME MENÜSÜ (Yatay Kaydırılabilir ve Mobil Dostu) */}
        <div className="w-full border-t border-white/10 relative">
          {/* Sağ kaydırma ipucu gölgesi (Mobilde sekmelerin sağa devam ettiğini hissettirir) */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0a0908] to-transparent z-10 md:hidden flex items-center justify-end pr-1 text-[#c2784f]">
            <span className="text-xs font-bold animate-pulse">›</span>
          </div>

          <div className="w-full overflow-x-auto hide-scrollbar scroll-smooth touch-pan-x" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex items-center min-w-max px-4 sm:px-8 lg:px-12 py-2 gap-2">
              {/* 1. Talepler */}
              <button 
                onClick={() => setActiveAdminTab('talepler')} 
                className={`relative px-4 sm:px-5 py-2.5 rounded-2xl text-[11px] sm:text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 active-press ${
                  activeAdminTab === 'talepler' 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400/30 ring-1 ring-emerald-400/50' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <Inbox size={15} /> <span>Talepler</span>
                {pendingRequests.length > 0 && (
                  <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full shadow-md font-black border border-white/40 animate-pulse">
                    {pendingRequests.length} Yeni
                  </span>
                )}
              </button>

              {/* 2. Restoran */}
              <button 
                onClick={() => setActiveAdminTab('restoran')} 
                className={`px-4 sm:px-5 py-2.5 rounded-2xl text-[11px] sm:text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 active-press ${
                  activeAdminTab === 'restoran' 
                    ? 'bg-gradient-to-r from-[#c2784f] to-[#d99268] text-white shadow-lg shadow-[#c2784f]/30 border border-[#e09f7a]/40 ring-1 ring-[#e09f7a]/50' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <UtensilsCrossed size={15} /> <span>Restoran</span>
              </button>

              {/* 3. Maç */}
              <button 
                onClick={() => setActiveAdminTab('mac')} 
                className={`px-4 sm:px-5 py-2.5 rounded-2xl text-[11px] sm:text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 active-press ${
                  activeAdminTab === 'mac' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400/40 ring-1 ring-blue-400/50' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <MonitorPlay size={15} /> <span>Maç</span>
              </button>

              {/* 4. Menü */}
              <button 
                onClick={() => setActiveAdminTab('menu')} 
                className={`px-4 sm:px-5 py-2.5 rounded-2xl text-[11px] sm:text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 active-press ${
                  activeAdminTab === 'menu' 
                    ? 'bg-gradient-to-r from-[#c2784f] to-[#d99268] text-white shadow-lg shadow-[#c2784f]/30 border border-[#e09f7a]/40 ring-1 ring-[#e09f7a]/50' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <MenuSquare size={15} /> <span>Menü</span>
              </button>

              {/* 5. Personel */}
              <button 
                onClick={() => setActiveAdminTab('personel')} 
                className={`px-4 sm:px-5 py-2.5 rounded-2xl text-[11px] sm:text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 active-press ${
                  activeAdminTab === 'personel' 
                    ? 'bg-gradient-to-r from-[#c2784f] to-[#d99268] text-white shadow-lg shadow-[#c2784f]/30 border border-[#e09f7a]/40 ring-1 ring-[#e09f7a]/50' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <Users size={15} /> <span>Personel</span>
              </button>

              {/* 6. Geçmiş */}
              <button 
                onClick={() => setActiveAdminTab('gecmis')} 
                className={`px-4 sm:px-5 py-2.5 rounded-2xl text-[11px] sm:text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 shrink-0 active-press ${
                  activeAdminTab === 'gecmis' 
                    ? 'bg-white/20 text-white shadow-lg border border-white/30 ring-1 ring-white/30' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <History size={15} /> <span>Geçmiş</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-4 sm:px-8 lg:px-12 xl:px-20 mt-6 lg:mt-8 relative z-10">
        
        {/* IPHONE SAFARI "TELEFONA EKLE" (STANDALONE UYGULAMA REHBERİ) */}
        {showAdminPwaGuide && (
          <div className="bg-gradient-to-r from-[#171310] via-[#211914] to-[#171310] border border-[#c2784f]/40 rounded-3xl p-5 sm:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.6)] mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 text-white animate-in fade-in duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#c2784f]/20 border border-[#c2784f]/40 flex items-center justify-center text-[#e09f7a] shrink-0 mt-0.5 shadow-[0_0_20px_rgba(194,120,79,0.25)]">
                <Smartphone size={26} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 className="font-serif font-light text-base sm:text-lg text-white">iPhone Safari'de <span className="text-gradient-copper font-black italic">Telefona Ekle</span></h4>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Oturum Sürekli Açık Kalır</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light max-w-2xl">
                  Safari'de alttaki <strong>Paylaş (📤) ➔ 'Ana Ekrana Ekle'</strong> yaparak bu paneli telefonunuza bağımsız bir uygulama gibi yükleyin. Uygulamayı her açtığınızda doğrudan bu ekranda kalır ve bekleyen rezervasyon taleplerini anında kontrol edebilirsiniz.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + '/#admin');
                  showToast('Panel bağlantısı kopyalandı! Safari adres çubuğuna yapıştırabilirsiniz.', 'success');
                }}
                className="flex-1 md:flex-none px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-slate-200 active-press transition-colors"
              >
                <Copy size={15} /> Bağlantıyı Kopyala
              </button>
              <button 
                onClick={() => setShowAdminPwaGuide(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                title="Bildirimi Kapat"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-32 relative z-10 w-full text-[#c2784f]">
            <Loader2 className="animate-spin mb-4" size={56} />
            <p className="font-serif font-light text-lg tracking-widest uppercase text-white animate-pulse">Sisteme Bağlanıyor...</p>
          </div>
        ) : activeAdminTab === 'talepler' ? (
          /* TALEPLER PANELİ */
          <div className="bg-[#14110e]/95 backdrop-blur-xl rounded-3xl p-5 sm:p-8 shadow-2xl border border-white/10 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-5 border-b border-white/10 gap-4">
               <div>
                 <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-black">Canlı Gelen İstekler</span>
                 <h2 className="text-xl sm:text-2xl font-serif font-light text-white flex items-center gap-3 mt-0.5">
                   <Inbox className="text-emerald-400" size={24}/> Rezervasyon <span className="text-gradient-copper font-black italic">Talepleri</span>
                 </h2>
                 <p className="text-xs text-slate-400 mt-1 font-medium">Müşterilerin web sitesinden ilettiği anlık bekleyen istekler</p>
               </div>
               <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full text-xs font-black flex items-center gap-2 shadow-sm">
                 <BellRing size={15} className="animate-bounce" /> {pendingRequests.length} Bekleyen Talep
               </span>
            </div>
            {pendingRequests.length === 0 ? (
              <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                  <CheckCircle2 size={40} />
                </div>
                <p className="font-serif font-light text-2xl text-white">Bekleyen yeni talep yok.</p>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-sm">Müşterilerden gelen yeni rezervasyon istekleri anında burada sesli ve görsel bildirimle belirecektir.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {pendingRequests.map(req => (
                   <div key={req.id} className="bg-[#1a1613] border border-white/10 hover:border-[#c2784f]/50 rounded-3xl p-5 sm:p-6 flex flex-col relative overflow-hidden shadow-xl transition-all group">
                     <div className="absolute top-0 right-0 bg-gradient-to-r from-[#c2784f] to-[#a16241] text-white px-3.5 py-1 rounded-bl-2xl font-black text-[9px] uppercase tracking-widest shadow-md">
                       {typeLabels[req.type] || req.type}
                     </div>
                     <span className="text-[10px] text-slate-400 font-mono mb-1">{req.createdAt ? new Date(req.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                     <h3 className="text-lg sm:text-xl font-serif font-bold text-white group-hover:text-[#c2784f] transition-colors">{req.name}</h3>
                     <a href={`tel:${req.phone}`} className="text-xs sm:text-sm font-mono font-bold text-slate-300 hover:text-emerald-400 flex items-center gap-2 mt-1 mb-4 transition-colors">
                       <Phone size={14} className="text-[#c2784f]"/> {req.phone}
                     </a>
                     <div className="flex flex-wrap gap-2 mb-4">
                       <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200">📅 {req.date}</span>
                       <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200">👥 {req.peopleCount} Kişi</span>
                     </div>
                     {req.notes && (
                       <div className="bg-[#c2784f]/10 border border-[#c2784f]/25 p-3 rounded-2xl mb-4 text-xs font-medium text-[#f0cfbb] leading-relaxed italic">
                         "{req.notes}"
                       </div>
                     )}
                     <div className="mt-auto flex flex-col gap-2 pt-3 border-t border-white/10">
                        {/* Hızlı Arama & WhatsApp Onay */}
                        <div className="grid grid-cols-2 gap-2">
                          <a href={`tel:${req.phone}`} className="bg-sky-600 hover:bg-sky-500 text-white py-2.5 px-3 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 active-press shadow-sm transition-all">
                            <Phone size={14}/> Ara
                          </a>
                          <button onClick={() => handleApproveRequest(req, true)} className="bg-[#25D366] hover:bg-[#20b858] text-white py-2.5 px-3 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 active-press shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-all">
                            <MessageCircle size={15}/> WA Onay
                          </button>
                        </div>
                        {/* Masaya Al Onayla & Reddet */}
                        <div className="flex gap-2">
                          <button onClick={() => handleApproveRequest(req, false)} className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 active-press">
                            <Check size={15}/> Masaya Ekle
                          </button>
                          <button onClick={() => handleRejectRequest(req.id)} className="bg-white/5 hover:bg-red-500/80 text-slate-400 hover:text-white border border-white/10 px-3.5 rounded-xl transition-all active-press" title="Talebi Reddet / Sil">
                            <Trash2 size={15}/>
                          </button>
                        </div>
                     </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        ) : (activeAdminTab === 'restoran' || activeAdminTab === 'mac') ? (
          /* RESTORAN & MAÇ PANELLERİ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 w-full col-span-12">
            <div className="lg:col-span-4 xl:col-span-3 space-y-6 print:hidden w-full">
              <div className={`bg-[#14110e]/95 backdrop-blur-xl rounded-3xl border overflow-hidden transition-colors w-full shadow-2xl ${activeAdminTab==='mac' ? (isMatchEditing?'border-blue-400/60':'border-white/10') : (isEditing?'border-[#c2784f]':'border-white/10')}`}>
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                  <h2 className="text-base sm:text-lg font-serif font-light text-white">{activeAdminTab==='mac' ? (isMatchEditing?'Maç Düzelt':'Yeni Maç Kaydı') : (isEditing?'Kayıt Düzelt':'Yeni Rezervasyon')}</h2>
                  {(isEditing || isMatchEditing) && <button type="button" onClick={()=>activeAdminTab==='mac'?cancelEdit(true):cancelEdit(false)} className="text-slate-400 hover:text-white p-1 rounded-lg"><X size={18}/></button>}
                </div>
                <form onSubmit={(e) => handleFormSubmit(e, activeAdminTab==='mac')} className="p-6 space-y-4">
                  {activeAdminTab === 'restoran' && (
                    <div>
                      <label className="block text-[10px] font-black text-[#c2784f] tracking-widest uppercase mb-1.5">Türü</label>
                      <select name="type" value={formData.type} onChange={(e)=>setFormData({...formData, type: e.target.value})} className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white font-bold outline-none focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] transition-all text-sm [color-scheme:dark]"><option value="kahvalti" className="bg-[#14110e]">Kahvaltı</option><option value="yemek" className="bg-[#14110e]">Yemek</option><option value="dogum_gunu" className="bg-[#14110e]">Doğum Günü</option><option value="organizasyon" className="bg-[#14110e]">Organizasyon</option></select>
                    </div>
                  )}
                  <div><label className="block text-[10px] font-black text-[#c2784f] tracking-widest uppercase mb-1.5">İsim</label><input type="text" name="name" value={activeAdminTab==='mac'?matchFormData.name:formData.name} onChange={(e)=>activeAdminTab==='mac'?setMatchFormData({...matchFormData, name:e.target.value}):setFormData({...formData, name:e.target.value})} className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white font-bold outline-none focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] transition-all text-sm placeholder-slate-600" required placeholder="Müşteri Adı" /></div>
                  <div><label className="block text-[10px] font-black text-[#c2784f] tracking-widest uppercase mb-1.5">Telefon</label><input type="tel" name="phone" value={activeAdminTab==='mac'?matchFormData.phone:formData.phone} onChange={(e)=>activeAdminTab==='mac'?setMatchFormData({...matchFormData, phone:e.target.value}):setFormData({...formData, phone:e.target.value})} className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white font-bold outline-none focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] transition-all text-sm placeholder-slate-600" placeholder="05XX XXX XX XX" /></div>
                  <div className="flex gap-4">
                    <div className="flex-[2]"><label className="block text-[10px] font-black text-[#c2784f] tracking-widest uppercase mb-1.5">Masa</label><input type="text" name="table" value={activeAdminTab==='mac'?matchFormData.table:formData.table} onChange={(e)=>activeAdminTab==='mac'?setMatchFormData({...matchFormData, table:e.target.value}):setFormData({...formData, table:e.target.value})} className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white font-bold uppercase outline-none focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] transition-all text-sm placeholder-slate-600" placeholder="Örn: B1" /></div>
                    <div className="flex-[1]"><label className="block text-[10px] font-black text-[#c2784f] tracking-widest uppercase mb-1.5">Kişi</label><input type="number" name="peopleCount" min="1" value={activeAdminTab==='mac'?matchFormData.peopleCount:formData.peopleCount} onChange={(e)=>activeAdminTab==='mac'?setMatchFormData({...matchFormData, peopleCount:parseInt(e.target.value)||1}):setFormData({...formData, peopleCount:parseInt(e.target.value)||1})} className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white font-bold text-center outline-none focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] transition-all text-sm" /></div>
                  </div>
                  <div><label className="block text-[10px] font-black text-[#c2784f] tracking-widest uppercase mb-1.5">Tarih</label><input type="date" name="date" value={activeAdminTab==='mac'?matchFormData.date:formData.date} onChange={(e)=>activeAdminTab==='mac'?setMatchFormData({...matchFormData, date:e.target.value}):setFormData({...formData, date:e.target.value})} className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white font-bold outline-none focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] transition-all text-sm [color-scheme:dark]" required /></div>
                  <div><label className="block text-[10px] font-black text-[#c2784f] tracking-widest uppercase mb-1.5">Not</label><textarea name="notes" value={activeAdminTab==='mac'?matchFormData.notes:formData.notes} onChange={(e)=>activeAdminTab==='mac'?setMatchFormData({...matchFormData, notes:e.target.value}):setFormData({...formData, notes:e.target.value})} rows="2" className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium resize-none outline-none focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] transition-all text-xs placeholder-slate-600" placeholder="Özel notlar..."></textarea></div>
                  <button type="submit" className={`w-full text-white font-black py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 tracking-widest uppercase text-xs active-press ${activeAdminTab==='mac' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'btn-premium'}`}>{activeAdminTab==='mac'?(isMatchEditing?'GÜNCELLE':'EKLE'):(isEditing?'GÜNCELLE':'EKLE')}</button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-8 xl:col-span-9 space-y-6 print:w-full print:block w-full">
              <div className="bg-[#14110e]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-5 sm:p-8 min-h-[500px] w-full">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-white/10 gap-4">
                  <h2 className="text-xl sm:text-2xl font-serif font-light text-white tracking-wide">{activeAdminTab==='mac' ? 'Maç Rezervasyonları' : 'Aktif Masalar'}</h2>
                  <div className="flex items-center gap-2.5 w-full md:w-auto">
                    <input type="text" placeholder="Ara..." value={activeAdminTab==='mac'?matchSearchTerm:searchTerm} onChange={(e)=>activeAdminTab==='mac'?setMatchSearchTerm(e.target.value):setSearchTerm(e.target.value)} className="p-2.5 border border-white/10 shadow-sm rounded-xl outline-none font-medium w-full md:w-48 bg-white/5 text-white placeholder-slate-500 focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] transition-all text-xs" />
                    <span className="font-black text-xs text-slate-300 bg-white/5 px-3.5 py-2.5 rounded-xl whitespace-nowrap uppercase tracking-widest border border-white/10 shrink-0">{(activeAdminTab==='mac'?sortedMatchReservations:sortedReservations).length} Kayıt</span>
                    <button onClick={()=>window.print()} className="bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 p-2.5 rounded-xl shadow-sm transition-all shrink-0 active-press" title="Yazdır"><Printer size={18}/></button>
                  </div>
                </div>

                {(activeAdminTab==='mac'?sortedMatchReservations:sortedReservations).length === 0 ? (
                  <div className="p-16 text-center text-slate-400 flex flex-col items-center"><Inbox size={48} className="mb-4 opacity-30 text-[#c2784f]" /><p className="font-serif font-light text-2xl text-white tracking-wide">Kayıt bulunamadı.</p></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {(activeAdminTab==='mac'?sortedMatchReservations:sortedReservations).map(res => (
                      <div key={res.id} className={`bg-[#1a1613] border p-5 sm:p-6 rounded-2xl flex flex-col relative shadow-md hover:shadow-xl transition-all group ${res.isArrived ? 'border-emerald-500/50 bg-[#142319]/40' : 'border-white/10 hover:border-[#c2784f]/50'}`}>
                         <div className="flex justify-between items-start mb-4">
                           <div>
                             <h3 className="font-serif font-bold text-lg text-white leading-none mb-1 group-hover:text-[#c2784f] transition-colors">{res.name}</h3>
                             <p className="text-xs font-mono font-bold text-slate-400 tracking-wider mt-1">{res.phone}</p>
                           </div>
                           <div className="text-right">
                             <div className="bg-[#c2784f]/15 text-[#e09f7a] border border-[#c2784f]/30 font-black px-3 py-1 rounded-xl text-sm shadow-sm">{res.table}</div>
                             <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1.5">{res.peopleCount} Kişi</div>
                           </div>
                         </div>
                         {res.notes && <p className="text-[11px] font-medium text-slate-300 bg-white/5 border border-white/5 p-3 rounded-xl mb-4 italic leading-relaxed">Not: {res.notes}</p>}
                         <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                           <button onClick={()=>handleToggleArrived(res.id, res.isArrived, activeAdminTab==='mac'?'matchReservations':'reservations')} className={`text-[10px] font-black uppercase tracking-[0.2em] px-3.5 py-2 rounded-xl shadow-sm transition-all active-press ${res.isArrived ? 'bg-emerald-500 text-white shadow-emerald-500/30 shadow-md' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'}`}>{res.isArrived ? 'MASADA' : 'GELMEDİ'}</button>
                           <div className="flex gap-2">
                             <button onClick={()=>sendWhatsApp(res, activeAdminTab, false)} className="text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/20 p-2 rounded-xl hover:bg-[#25D366] hover:text-white transition-all shadow-sm active-press" title="WhatsApp Mesajı"><MessageCircle size={16}/></button>
                             <button onClick={()=>handleEditClick(res, activeAdminTab==='mac')} className="text-[#c2784f] bg-[#c2784f]/10 border border-[#c2784f]/20 p-2 rounded-xl hover:bg-[#c2784f] hover:text-white transition-all shadow-sm active-press" title="Düzenle"><Edit2 size={16}/></button>
                             <button onClick={()=>executeDelete(res.id, activeAdminTab==='mac'?'matchReservations':'reservations')} className="text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm active-press" title="Sil"><Trash2 size={16}/></button>
                           </div>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeAdminTab === 'menu' ? (
          /* MENÜ YÖNETİMİ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 w-full col-span-12">
            <div className="lg:col-span-4 xl:col-span-3 space-y-6 w-full">
              {menuItems.length === 0 && (
                <div className="bg-[#c2784f]/15 border border-[#c2784f]/30 rounded-3xl p-6 text-center shadow-sm">
                  <p className="text-[#f0cfbb] font-bold mb-4 text-sm">Sisteminizde hiç menü öğesi yok.</p>
                  <button type="button" onClick={() => setShowImportConfirm(true)} className="btn-premium text-white px-5 py-3 rounded-xl font-black uppercase text-xs w-full transition-all">Varsayılan Menüyü Aktar</button>
                </div>
              )}
              <div className={`bg-[#14110e]/95 backdrop-blur-xl rounded-3xl shadow-2xl border overflow-hidden transition-colors w-full ${isMenuEditing ? 'border-[#c2784f]' : 'border-white/10'}`}>
                <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isMenuEditing ? 'bg-[#c2784f]/20 text-[#e09f7a]' : 'bg-white/5 text-slate-400'}`}>{isMenuEditing ? <Edit2 size={18} /> : <Plus size={18} />}</div>
                    <h2 className="font-serif font-light text-base sm:text-lg text-white">{isMenuEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
                  </div>
                  {isMenuEditing && <button type="button" onClick={()=>{setIsMenuEditing(null); setMenuItemData(initialMenuItemState); setMenuErrorMsg('');}} className="text-slate-400 p-1.5 hover:bg-white/10 rounded-full transition-colors"><X size={18}/></button>}
                </div>
                <form onSubmit={handleMenuSubmit} className="p-6 space-y-4">
                  {menuErrorMsg && <div className="text-red-400 font-bold text-xs bg-red-500/10 p-3 rounded-xl flex items-center gap-2 border border-red-500/20"><X size={16}/> {menuErrorMsg}</div>}
                  
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-black text-[#c2784f] uppercase tracking-widest">Kategori</label>
                    <button type="button" onClick={(e) => { e.preventDefault(); setShowCategoryModal(true); }} className="text-[10px] bg-[#c2784f]/15 text-[#e09f7a] font-black uppercase tracking-widest px-3 py-1 rounded-lg hover:bg-[#c2784f]/25 transition-all shadow-sm border border-[#c2784f]/30 active-press">+ Yeni</button>
                  </div>
                  <select name="category" value={menuItemData.category} onChange={handleMenuChange} className="w-full p-3 rounded-xl border border-white/10 shadow-sm font-bold outline-none focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] bg-white/5 text-white transition-all text-sm [color-scheme:dark]">
                    {ALL_CATEGORIES.map(c => <option key={c.id} value={c.id} className="bg-[#14110e]">{c.name}</option>)}
                  </select>
                  
                  <div>
                    <label className="block text-[10px] font-black text-[#c2784f] mb-1.5 uppercase tracking-widest">Ürün Adı *</label>
                    <input type="text" name="name" value={menuItemData.name} onChange={handleMenuChange} className="w-full p-3 rounded-xl border border-white/10 shadow-sm font-bold focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white/5 text-white placeholder-slate-600 transition-all text-sm" required placeholder="Örn: Karışık Tost" />
                  </div>
                  
                  <div className="flex gap-3">
                     <div className="flex-1">
                        <label className="block text-[10px] font-black text-[#c2784f] mb-1.5 uppercase tracking-widest">Fiyat</label>
                        <div className="relative">
                          <DollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input type="text" name="price" value={menuItemData.price} onChange={handleMenuChange} className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-white/10 shadow-sm font-bold focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white/5 text-white placeholder-slate-600 transition-all text-sm" placeholder="150" />
                        </div>
                     </div>
                     <div className="flex-1">
                        <label className="block text-[10px] font-black text-[#c2784f] mb-1.5 uppercase tracking-widest">Hazırlama</label>
                        <div className="relative">
                          <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input type="text" name="prepTime" value={menuItemData.prepTime} onChange={handleMenuChange} className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-white/10 shadow-sm font-bold focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white/5 text-white placeholder-slate-600 transition-all text-sm" placeholder="15 dk" />
                        </div>
                     </div>
                     <div className="flex-1">
                        <label className="block text-[10px] font-black text-[#c2784f] mb-1.5 uppercase tracking-widest">Kalori</label>
                        <div className="relative">
                          <Flame size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input type="text" name="calories" value={menuItemData.calories} onChange={handleMenuChange} className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-white/10 shadow-sm font-bold focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white/5 text-white placeholder-slate-600 transition-all text-sm" placeholder="350 kcal" />
                        </div>
                     </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-[#c2784f] mb-1.5 uppercase tracking-widest">Durum & Etiket (Maks: 2)</label>
                    <div className="flex flex-wrap gap-2">
                      {BADGE_OPTIONS.map(badge => (
                        <label key={badge.id} className="flex items-center gap-2 cursor-pointer bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl shadow-sm hover:border-[#c2784f]/40 transition-colors">
                          <input type="checkbox" checked={menuItemData.badges.includes(badge.id)} onChange={() => handleBadgeChange(badge.id)} className="w-3.5 h-3.5 accent-[#c2784f] rounded" />
                          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5"><span>{badge.icon}</span> {badge.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-[#c2784f] mb-1.5 uppercase tracking-widest">Açıklama</label>
                    <div className="relative">
                      <AlignLeft size={16} className="absolute left-3 top-3.5 text-slate-500" />
                      <textarea name="description" value={menuItemData.description} onChange={handleMenuChange} rows={3} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/10 shadow-sm font-medium resize-y focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white/5 text-white placeholder-slate-600 transition-all text-xs" placeholder="Örn İçerik: Beyaz peynir, Taze kaşar..."></textarea>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-[10px] font-black text-[#c2784f] mb-1.5 uppercase tracking-widest">Ürün Resim (Yükle)</label>
                      <label className="flex items-center justify-center px-3 py-2.5 bg-white/5 border border-white/10 shadow-sm rounded-xl cursor-pointer hover:bg-white/10 transition-colors text-xs font-bold text-slate-300 w-full text-center">
                        {uploadingImage ? <Loader2 className="animate-spin mr-2" size={15} /> : <UploadCloud className="mr-2 text-[#c2784f]" size={15} />}
                        Dosya Seç
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                      </label>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#c2784f] mb-1.5 uppercase tracking-widest">Sıra</label>
                      <input type="number" name="order" value={menuItemData.order} onChange={handleMenuChange} className="w-full p-2.5 rounded-xl border border-white/10 shadow-sm font-bold focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white/5 text-white transition-all text-sm" placeholder="999" />
                    </div>
                  </div>
                  
                  {menuItemData.image && (
                     <div className="relative inline-block mt-1">
                        <img src={menuItemData.image} alt="Preview" className="h-20 w-auto rounded-lg object-contain border border-white/10 shadow-sm bg-black/40" />
                        <button type="button" onClick={removeMenuImage} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors" title="Resmi Kaldır">
                           <X size={12}/>
                        </button>
                     </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3 mt-3">
                     <label className="flex items-center gap-3 cursor-pointer bg-white/5 p-3 rounded-xl border border-white/10 shadow-sm hover:border-[#c2784f]/40 transition-all">
                        <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${menuItemData.isFeatured ? 'bg-[#c2784f] border-[#c2784f] text-white shadow-sm' : 'bg-transparent border-white/20'}`}>
                           {menuItemData.isFeatured && <Check size={12} />}
                        </div>
                        <input type="checkbox" checked={menuItemData.isFeatured} onChange={(e)=>setMenuItemData({...menuItemData, isFeatured: e.target.checked})} className="hidden" />
                        <span className="font-bold text-xs text-slate-300 block select-none">Vitrin Göster</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer bg-white/5 p-3 rounded-xl border border-white/10 shadow-sm hover:border-red-500/40 transition-all">
                        <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${menuItemData.isSoldOut ? 'bg-red-500 border-red-500 text-white shadow-sm' : 'bg-transparent border-white/20'}`}>
                           {menuItemData.isSoldOut && <Check size={12} />}
                        </div>
                        <input type="checkbox" checked={menuItemData.isSoldOut} onChange={(e)=>setMenuItemData({...menuItemData, isSoldOut: e.target.checked})} className="hidden" />
                        <span className="font-bold text-xs text-slate-300 block select-none">Tükendi Yap</span>
                     </label>
                  </div>
                  
                  <button type="submit" className="w-full btn-premium text-white font-black py-3.5 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 uppercase tracking-widest text-xs mt-3 active-press">
                    {isMenuEditing ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle'}
                  </button>

                  {/* CANLI ÖNİZLEME ALANI (Müşteri Vitrini Stili) */}
                  <div className="mt-6 border-t border-white/10 pt-5">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><MonitorPlay size={14} className="text-[#c2784f]"/> Menü Önizlemesi</h3>
                     <div className="bg-[#12100e] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-[180px] max-w-sm mx-auto relative pointer-events-none">
                        {menuItemData.badges && menuItemData.badges.length > 0 && (
                          <div className="absolute top-2.5 left-2.5 z-10 flex gap-1">
                            {menuItemData.badges.map(b => {
                               const def = BADGE_OPTIONS.find(o=>o.id===b);
                               return def ? <span key={b} className="bg-black/80 backdrop-blur-md text-[#e09f7a] text-[9px] font-bold px-2 py-0.5 rounded border border-white/10">{def.icon}</span> : null;
                            })}
                          </div>
                        )}
                        {menuItemData.isSoldOut && <div className="absolute top-2.5 right-2.5 z-10 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-widest">Tükendi</div>}
                        
                        {menuItemData.image ? (
                          <div className="relative w-full h-36 bg-black/40 flex items-center justify-center overflow-hidden shrink-0 border-b border-white/5">
                            <img src={menuItemData.image} alt={menuItemData.name} className={`w-full h-full object-contain p-2 ${menuItemData.isSoldOut ? 'opacity-40 grayscale' : ''}`} />
                          </div>
                        ) : (
                          <div className={`relative w-full h-20 bg-white/5 flex flex-col items-center justify-center border-b border-white/5 shrink-0 ${menuItemData.isSoldOut ? 'opacity-40 grayscale' : ''}`}>
                            <ImageIcon size={28} className="text-slate-600"/>
                          </div>
                        )}
                        
                        <div className={`p-4 flex flex-col justify-between grow ${menuItemData.isSoldOut ? 'opacity-60 grayscale' : ''}`}>
                           <div className="flex justify-between items-start gap-3">
                              <span className={`font-serif font-light text-sm tracking-wide ${menuItemData.isSoldOut ? 'text-slate-500 line-through' : 'text-white'}`}>{menuItemData.name || 'Örnek Ürün Adı'}</span>
                              {menuItemData.price && <span className="text-[#c2784f] font-serif font-bold whitespace-nowrap text-sm">{menuItemData.price} TL</span>}
                           </div>
                           {menuItemData.description && <p className="text-slate-400 text-xs line-clamp-2 mt-1 leading-relaxed">{menuItemData.description}</p>}
                        </div>
                     </div>
                  </div>

                </form>
              </div>
            </div>

            <div className="lg:col-span-8 xl:col-span-9 w-full">
               <div className="bg-[#14110e]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-5 sm:p-8 min-h-[500px] w-full">
                  <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-8 pb-4 border-b border-white/10 gap-4">
                     <h2 className="text-xl sm:text-2xl font-serif font-light flex items-center gap-3 text-white tracking-wide"><MenuSquare className="text-[#c2784f]" size={26} /> Menü Öğeleri</h2>
                     
                     <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
                        <select value={menuFilterCategory} onChange={(e) => setMenuFilterCategory(e.target.value)} className="w-full sm:w-auto p-2.5 border border-white/10 shadow-sm rounded-xl outline-none font-bold text-xs focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] bg-white/5 text-white transition-all [color-scheme:dark]">
                           <option value="all" className="bg-[#14110e]">Tüm Kategoriler</option>
                           {ALL_CATEGORIES.map(c => <option key={c.id} value={c.id} className="bg-[#14110e]">{c.name}</option>)}
                        </select>
                        <div className="relative w-full sm:w-64">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                           <input type="text" placeholder="Ürün ara..." value={menuSearchTerm} onChange={(e) => setMenuSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/10 shadow-sm focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] text-xs font-medium outline-none transition-all bg-white/5 text-white placeholder-slate-500" />
                        </div>
                        <span className="font-black text-xs text-slate-300 bg-white/5 px-3.5 py-2.5 rounded-xl whitespace-nowrap uppercase tracking-widest border border-white/10 shrink-0">{menuItems.length} Öğe</span>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                     {menuItems
                       .filter(m => menuFilterCategory === 'all' || m.category === menuFilterCategory)
                       .filter(m => !menuSearchTerm || m.name.toLowerCase().includes(menuSearchTerm.toLowerCase()) || m.category.toLowerCase().includes(menuSearchTerm.toLowerCase()))
                       .sort((a,b) => (a.order||999) - (b.order||999) || a.name.localeCompare(b.name))
                       .map((item) => (
                       <div 
                          key={item.id} 
                          draggable
                          onDragStart={(e) => handleDragStart(e, item)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, item)}
                          className={`border p-5 rounded-2xl flex flex-col bg-[#1a1613] ${isMenuEditing===item.id ? 'border-[#c2784f] shadow-[0_0_25px_rgba(194,120,79,0.3)] scale-[1.02] transition-all relative z-10' : 'border-white/10 hover:border-[#c2784f]/50 hover:shadow-lg transition-all cursor-move group'}`}
                       >
                          <div className="flex justify-between items-start mb-3">
                             <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-[#c2784f]/15 text-[#e09f7a] border border-[#c2784f]/30 px-2.5 py-1 rounded flex items-center gap-1.5 shadow-sm">
                               <GripVertical size={12} className="text-[#c2784f]/60"/>
                               {ALL_CATEGORIES.find(c=>c.id===item.category)?.name || item.category}
                             </span>
                             {item.isSoldOut && <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">Tükendi</span>}
                          </div>

                          <div className="flex gap-3.5 items-center mb-4">
                            {item.image ? (
                               <div className="w-16 h-16 rounded-xl bg-black/40 shrink-0 flex items-center justify-center p-1 border border-white/10 shadow-sm">
                                 <img src={item.image} className={`w-full h-full object-contain ${item.isSoldOut ? 'opacity-40 grayscale' : ''}`} alt="" onError={(e)=>{e.currentTarget.style.display='none'}} />
                               </div>
                            ) : (
                               <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 shrink-0 shadow-sm border border-white/10"><ImageIcon size={22}/></div>
                            )}
                            <div>
                              <h3 className={`font-serif font-light text-base leading-tight line-clamp-2 transition-colors group-hover:text-[#c2784f] ${item.isSoldOut ? 'text-slate-500 line-through' : 'text-white'}`}>{item.name}</h3>
                              <span className="font-bold text-[#e09f7a] text-sm block mt-1">{item.price ? `${item.price} TL` : '-'}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-auto pt-3 border-t border-white/10">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Sıra: {item.order || 999}</span>
                            <div className="flex gap-1.5">
                              <button type="button" onClick={() => toggleSoldOut(item)} className={`p-2 rounded-xl transition-all shadow-sm border active-press ${item.isSoldOut ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border-white/10'}`} title={item.isSoldOut ? "Satışa Aç" : "Tükendi Yap"}>
                                 {item.isSoldOut ? <CheckCircle size={15}/> : <X size={15}/>}
                              </button>
                              <button type="button" onClick={() => duplicateMenuItem(item)} className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-xl transition-all shadow-sm active-press" title="Kopyala">
                                 <Plus size={15}/>
                              </button>
                              <button type="button" onClick={()=>{setMenuItemData({category: item.category, name: item.name, price: item.price||'', description: item.description||'', image: item.image||'', isFeatured: item.isFeatured||false, order: item.order||999, badges: item.badges||[], isSoldOut: item.isSoldOut||false, prepTime: item.prepTime||'', calories: item.calories||''}); setIsMenuEditing(item.id); window.scrollTo({top:0, behavior:'smooth'});}} className="p-2 bg-white/5 hover:bg-[#c2784f]/20 hover:text-[#e09f7a] text-slate-300 border border-white/10 rounded-xl transition-all shadow-sm active-press" title="Düzenle">
                                 <Edit2 size={15}/>
                              </button>
                              <button type="button" onClick={()=>{if(window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) executeDelete(item.id, 'menuItems');}} className="p-2 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 rounded-xl transition-all shadow-sm active-press" title="Sil">
                                 <Trash2 size={15}/>
                              </button>
                            </div>
                          </div>
                       </div>
                     ))}
                     {menuItems.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 font-medium">Veritabanında henüz bir menü öğesi yok.</div>}
                  </div>
               </div>
            </div>
          </div>
        ) : activeAdminTab === 'personel' ? (
          /* PERSONEL YÖNETİMİ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 w-full col-span-12">
            <div className="lg:col-span-4 xl:col-span-3 space-y-6 w-full">
              <div className={`bg-[#14110e]/95 backdrop-blur-xl rounded-3xl shadow-2xl border w-full transition-colors overflow-hidden ${isPersonnelEditing ? 'border-[#c2784f]' : 'border-white/10'}`}>
                <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isPersonnelEditing ? 'bg-[#c2784f]/20 text-[#e09f7a]' : 'bg-white/5 text-slate-400'}`}>{isPersonnelEditing ? <Edit2 size={18} /> : <Plus size={18} />}</div>
                    <h2 className="font-serif font-light text-base sm:text-lg text-white">{isPersonnelEditing ? 'Personel Düzenle' : 'Yeni Personel'}</h2>
                  </div>
                  {isPersonnelEditing && <button type="button" onClick={()=>{setIsPersonnelEditing(null); setPersonnelData(initialPersonnelState); setPersonnelErrorMsg('');}} className="text-slate-400 p-1.5 hover:bg-white/10 rounded-full transition-colors"><X size={18}/></button>}
                </div>
                <form onSubmit={handlePersonnelSubmit} className="p-6 space-y-4">
                  {personnelErrorMsg && <div className="text-red-400 font-bold text-xs bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-2"><X size={16}/> {personnelErrorMsg}</div>}
                  
                  <div className="flex gap-3">
                     <div className="flex-1">
                        <label className="block text-[10px] font-black text-[#c2784f] mb-1.5 uppercase tracking-widest">Ad *</label>
                        <input type="text" name="name" value={personnelData.name} onChange={handlePersonnelChange} className="w-full p-3 rounded-xl border border-white/10 shadow-sm font-bold focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white/5 text-white placeholder-slate-600 transition-all text-sm" required placeholder="Örn: Ahmet" />
                     </div>
                     <div className="flex-1">
                        <label className="block text-[10px] font-black text-[#c2784f] mb-1.5 uppercase tracking-widest">Soyad *</label>
                        <input type="text" name="surname" value={personnelData.surname} onChange={handlePersonnelChange} className="w-full p-3 rounded-xl border border-white/10 shadow-sm font-bold focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white/5 text-white placeholder-slate-600 transition-all text-sm" required placeholder="Örn: Yılmaz" />
                     </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-[#c2784f] mb-1.5 uppercase tracking-widest">Lakap (Opsiyonel)</label>
                    <input type="text" name="nickname" value={personnelData.nickname} onChange={handlePersonnelChange} className="w-full p-3 rounded-xl border border-white/10 shadow-sm font-bold focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white/5 text-white placeholder-slate-600 transition-all text-sm" placeholder="Örn: Hızlı Şef" />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-[#c2784f] mb-1.5 uppercase tracking-widest">Yetenekler & Uzmanlık</label>
                    <textarea name="skills" value={personnelData.skills} onChange={handlePersonnelChange} rows={3} className="w-full p-3 rounded-xl border border-white/10 shadow-sm font-medium resize-y focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white/5 text-white placeholder-slate-600 transition-all text-xs" placeholder="Örn: Dünya mutfağında 10 yıllık deneyim..."></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-[10px] font-black text-[#c2784f] mb-1.5 uppercase tracking-widest">Fotoğraf</label>
                      <label className="flex items-center justify-center px-3 py-2.5 bg-white/5 border border-white/10 shadow-sm rounded-xl cursor-pointer hover:bg-white/10 transition-colors text-xs font-bold text-slate-300 w-full text-center">
                        {uploadingPersonnelImage ? <Loader2 className="animate-spin mr-2" size={15} /> : <UploadCloud className="mr-2 text-[#c2784f]" size={15} />}
                        Dosya Seç
                        <input type="file" accept="image/*" onChange={handlePersonnelImageUpload} className="hidden" disabled={uploadingPersonnelImage} />
                      </label>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#c2784f] mb-1.5 uppercase tracking-widest">Sıra</label>
                      <input type="number" name="order" value={personnelData.order} onChange={handlePersonnelChange} className="w-full p-2.5 rounded-xl border border-white/10 shadow-sm font-bold focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] outline-none bg-white/5 text-white transition-all text-sm" placeholder="999" />
                    </div>
                  </div>
                  
                  {personnelData.image && (
                     <div className="relative inline-block mt-1">
                        <img src={personnelData.image} alt="Preview" className="h-20 w-20 rounded-full object-cover border-2 border-[#c2784f]/40 shadow-sm bg-black/40" />
                        <button type="button" onClick={removePersonnelImage} className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors" title="Resmi Kaldır">
                           <X size={12}/>
                        </button>
                     </div>
                  )}
                  
                  <button type="submit" className="w-full btn-premium text-white font-black py-3.5 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 uppercase tracking-widest text-xs mt-3 active-press">
                    {isPersonnelEditing ? 'Güncelle' : 'Personel Ekle'}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-8 xl:col-span-9 w-full">
               <div className="bg-[#14110e]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-5 sm:p-8 min-h-[500px] w-full">
                  <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-8 pb-4 border-b border-white/10 gap-4">
                     <h2 className="text-xl sm:text-2xl font-serif font-light flex items-center gap-3 text-white tracking-wide"><Users className="text-[#c2784f]" size={26} /> Ekibimiz ({personnelList.length})</h2>
                  </div>
                  
                  {personnelList.length === 0 ? (
                     <div className="text-center py-16 text-slate-400 flex flex-col items-center"><Users size={48} className="mb-4 opacity-30 text-[#c2784f]" /><p className="font-serif font-light text-2xl text-white tracking-wide">Henüz personel eklenmedi.</p><span className="text-xs text-slate-400 mt-2">Sol taraftan kayıt oluşturabilirsiniz.</span></div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                       {personnelList.sort((a,b) => (a.order||999) - (b.order||999)).map((person) => {
                         const avg = person.reviews?.length > 0 ? (person.reviews.reduce((acc,curr)=>acc+curr.rating,0)/person.reviews.length).toFixed(1) : 0;
                         return (
                           <div key={person.id} className={`border p-6 rounded-2xl flex flex-col bg-[#1a1613] hover:shadow-xl transition-all relative shadow-md group ${isPersonnelEditing === person.id ? 'border-[#c2784f] shadow-[0_0_25px_rgba(194,120,79,0.3)] scale-[1.02]' : 'border-white/10 hover:border-[#c2784f]/50'}`}>
                              <div className="flex gap-4 items-start mb-4">
                                <div className="w-16 h-16 rounded-full bg-black/40 shrink-0 overflow-hidden border border-white/15 shadow-sm">
                                  {person.image ? <img src={person.image} className="w-full h-full object-cover" alt={person.name} /> : <UserSquare size={36} className="w-full h-full p-3 text-slate-500" />}
                                </div>
                                <div>
                                  <h3 className="font-serif font-bold text-white text-lg leading-none mb-1 group-hover:text-[#c2784f] transition-colors">{person.name} {person.surname}</h3>
                                  {person.nickname && <p className="text-[#e09f7a] font-serif italic text-xs tracking-wide mt-1">"{person.nickname}"</p>}
                                  <span className="text-[10px] font-mono text-slate-400 block mt-2 uppercase tracking-widest">
                                     Sıra: {person.order || 999} • <Star size={10} className="inline fill-[#c2784f] text-[#c2784f] -mt-0.5 ml-1"/> {avg} ({person.reviews?.length || 0} Yorum)
                                  </span>
                                </div>
                              </div>
                              {person.skills && (
                                <p className="text-[11px] text-slate-300 line-clamp-2 mb-5 italic font-light leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">{person.skills}</p>
                              )}
                              <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-white/10">
                                <button type="button" onClick={() => setManagingReviewsFor(person)} className="p-2 bg-blue-500/15 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded-xl transition-all font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 flex-1 shadow-sm active-press"><MessageSquareText size={14}/> Yorumlar ({person.reviews?.length || 0})</button>
                                <button type="button" onClick={()=>{setPersonnelData({name: person.name, surname: person.surname, nickname: person.nickname||'', skills: person.skills||'', image: person.image||'', order: person.order||'', reviews: person.reviews||[]}); setIsPersonnelEditing(person.id); window.scrollTo({top:0, behavior:'smooth'});}} className="p-2 bg-white/5 hover:bg-[#c2784f] hover:text-white border border-white/10 text-slate-300 rounded-xl transition-all flex items-center justify-center shadow-sm active-press"><Edit2 size={15}/></button>
                                <button type="button" onClick={() => setPersonnelDeleteConfirmId(person.id)} className="p-2 bg-white/5 hover:bg-red-500 hover:text-white border border-white/10 text-slate-400 rounded-xl transition-all flex items-center justify-center shadow-sm active-press"><Trash2 size={15}/></button>
                              </div>
                           </div>
                         );
                       })}
                    </div>
                  )}
               </div>
            </div>
          </div>
        ) : activeAdminTab === 'gecmis' ? (
          /* GEÇMİŞ KAYITLAR */
          <div className="bg-[#14110e]/95 backdrop-blur-xl rounded-3xl p-5 sm:p-8 shadow-2xl border border-white/10 w-full min-h-[500px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-white/10 gap-4">
               <h2 className="text-xl sm:text-2xl font-serif font-light text-white flex items-center gap-3 tracking-wide"><History className="text-[#c2784f]" size={26}/> Geçmiş Rezervasyon Kayıtları</h2>
               <div className="flex gap-2 w-full md:w-auto"><input type="date" value={historyDateFilter} onChange={(e)=>setHistoryDateFilter(e.target.value)} className="p-2.5 w-full md:w-auto border border-white/10 shadow-sm rounded-xl outline-none font-bold text-xs focus:border-[#c2784f] focus:ring-1 focus:ring-[#c2784f] transition-all bg-white/5 text-white [color-scheme:dark]" /></div>
            </div>
            
            {historyStats.list.length === 0 ? (
               <div className="py-16 text-center text-slate-400 flex flex-col items-center"><History size={48} className="mb-4 opacity-30 text-[#c2784f]" /><p className="font-serif font-light text-2xl text-white tracking-wide">Kayıt bulunamadı.</p></div>
            ) : (
            <div className="overflow-x-auto w-full border border-white/10 rounded-2xl shadow-sm">
              <table className="w-full text-left">
                 <thead><tr className="border-b border-white/10 bg-white/5"><th className="py-3.5 px-4 font-black text-[10px] text-[#c2784f] uppercase tracking-widest">Tarih</th><th className="py-3.5 px-4 font-black text-[10px] text-[#c2784f] uppercase tracking-widest">Müşteri</th><th className="py-3.5 px-4 font-black text-[10px] text-[#c2784f] uppercase tracking-widest text-center">Kişi</th><th className="py-3.5 px-4 font-black text-[10px] text-[#c2784f] uppercase tracking-widest text-center">Durum</th></tr></thead>
                 <tbody>
                    {historyStats.list.map((res, i) => (
                       <tr key={res.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i%2===0 ? 'bg-transparent' : 'bg-white/[0.02]'}`}>
                          <td className="py-3.5 px-4 font-bold text-slate-200 text-xs sm:text-sm">{res.date} <span className="text-[9px] uppercase tracking-widest bg-white/10 text-[#e09f7a] px-2 py-0.5 rounded-md ml-2 font-black border border-white/10">{res.eventType}</span></td>
                          <td className="py-3.5 px-4 font-bold text-white text-xs sm:text-sm">{res.name} <span className="block text-[11px] font-mono text-slate-400 tracking-wider mt-0.5">{res.phone}</span></td>
                          <td className="py-3.5 px-4 text-center font-black text-slate-200 text-sm">{res.peopleCount}</td>
                          <td className="py-3.5 px-4 text-center">{res.isArrived ? <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm">Geldi</span> : <span className="bg-white/5 border border-white/10 shadow-sm text-slate-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">Gelmedi</span>}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
            </div>
            )}
          </div>
        ) : null}
      </main>

      {/* MOBİL YÖNETİM ALTTAN ERİŞİM DOCKU (1-THUMB APP DOCK) */}
      <aside className="fixed bottom-3 left-3 right-3 z-40 md:hidden print:hidden" aria-label="Mobil Yönetim Menüsü">
        <nav className="bg-[#0e0c0a]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] p-1.5 flex items-center justify-around pb-safe">
          <button 
            onClick={() => { setActiveAdminTab('talepler'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all ${activeAdminTab === 'talepler' ? 'text-emerald-400 bg-emerald-500/15' : 'text-slate-400 hover:text-white'}`}
          >
            <Inbox size={18} />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">Talepler</span>
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-pulse border border-white/30">
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => { setActiveAdminTab('restoran'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${activeAdminTab === 'restoran' ? 'text-[#e09f7a] bg-[#c2784f]/20' : 'text-slate-400 hover:text-white'}`}
          >
            <UtensilsCrossed size={18} />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">Restoran</span>
          </button>
          <button 
            onClick={() => { setActiveAdminTab('mac'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${activeAdminTab === 'mac' ? 'text-blue-400 bg-blue-500/20' : 'text-slate-400 hover:text-white'}`}
          >
            <MonitorPlay size={18} />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">Maç</span>
          </button>
          <button 
            onClick={() => { setActiveAdminTab('menu'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${activeAdminTab === 'menu' ? 'text-[#e09f7a] bg-[#c2784f]/20' : 'text-slate-400 hover:text-white'}`}
          >
            <MenuSquare size={18} />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">Menü</span>
          </button>
          <button 
            onClick={() => { setActiveAdminTab('personel'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${activeAdminTab === 'personel' ? 'text-[#e09f7a] bg-[#c2784f]/20' : 'text-slate-400 hover:text-white'}`}
          >
            <Users size={18} />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">Personel</span>
          </button>
          <button 
            onClick={() => { setActiveAdminTab('gecmis'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${activeAdminTab === 'gecmis' ? 'text-white bg-white/20' : 'text-slate-400 hover:text-white'}`}
          >
            <History size={18} />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">Geçmiş</span>
          </button>
        </nav>
      </aside>
      
      {renderModals()}
    </div>
  );
}
