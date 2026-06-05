import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  CakeSlice,
  ChevronRight,
  Edit3,
  Eye,
  GalleryHorizontalEnd,
  Home,
  ImagePlus,
  Instagram,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageSquareQuote,
  PackagePlus,
  Phone,
  Plus,
  Save,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import catalogSeed from '../data/catalog.json';
import './styles.css';

const STORAGE_KEY = 'gally_bakery_catalog_v3';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'gally062026';
const REQUESTS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1OCYrc2V3IM1HqL3jadGNBk65GcPZclYKNXPMkWpHMyI/edit?gid=0#gid=0';
const DEFAULT_APPS_SCRIPT_URL =
  import.meta.env.VITE_APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbyb_ngktqiXqceXihrB2kOaSAsQvdBsys6yNNgCUtv9gfT1MNi3-sqbZWbdrblisVswcg/exec';

const PAGE_LABELS = {
  cakes: 'Cakes',
  macarons: 'Macarons',
  desserts: 'Desserts',
  portfolio: 'Portfolio',
  about: 'About Us',
};

const navItems = [
  ['Cakes', '#/cakes'],
  ['Macarons', '#/macarons'],
  ['Desserts', '#/desserts'],
  ['Portfolio', '#/portfolio'],
  ['About Us', '#/about'],
  ['Order', '#contact'],
];

const emptyProduct = {
  id: '',
  categoryId: 'cakes',
  name: '',
  description: '',
  flavors: [],
  formats: [],
  price: '',
  image: '/assets/pdf-page07-01.webp',
  featured: false,
};

const emptyCategory = {
  id: '',
  name: '',
  short: '',
  image: '/assets/pdf-page07-01.webp',
  route: '#/cakes',
};

const emptyPortfolioItem = {
  id: '',
  title: 'New gallery photo',
  type: 'Cakes',
  image: '/assets/pdf-page07-01.webp',
};

const emptyReview = {
  id: '',
  name: 'Client',
  text: 'Add review text here.',
  caption: 'Custom order',
  rating: '5.0',
  image: '/assets/pdf-page07-01.webp',
};

const asset = (path) => {
  const value = String(path || '');
  if (!value) return '';
  if (value.startsWith('http') || value.startsWith('data:')) return value;
  return `${import.meta.env.BASE_URL}${value.replace(/^\/+/, '')}`;
};

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeCatalog(source) {
  const seed = catalogSeed;
  return {
    ...seed,
    ...source,
    business: { ...seed.business, ...(source?.business || {}) },
    home: { ...seed.home, ...(source?.home || {}) },
    pages: { ...seed.pages, ...(source?.pages || {}) },
    categories: source?.categories?.length ? source.categories : seed.categories,
    products: source?.products?.length ? source.products : seed.products,
    portfolio: source?.portfolio?.length ? source.portfolio : seed.portfolio,
    reviews: source?.reviews?.length ? source.reviews : seed.reviews,
  };
}

function readCatalog() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return normalizeCatalog(stored ? JSON.parse(stored) : catalogSeed);
  } catch {
    return normalizeCatalog(catalogSeed);
  }
}

function saveCatalog(catalog) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
}

function getRoute() {
  const hash = location.hash || '';
  if (hash.startsWith('#/')) return hash.slice(2) || 'home';
  if (location.pathname.startsWith('/admin')) return 'admin';
  if (location.pathname.startsWith('/privacy')) return 'privacy';
  return 'home';
}

function App() {
  const [route, setRoute] = useState(getRoute);
  const [catalog, setCatalogState] = useState(readCatalog);

  const setCatalog = (next) => {
    const value = typeof next === 'function' ? next(catalog) : next;
    setCatalogState(normalizeCatalog({ ...value, updatedAt: new Date().toISOString().slice(0, 10) }));
  };

  useEffect(() => {
    const onRoute = () => setRoute(getRoute());
    addEventListener('hashchange', onRoute);
    addEventListener('popstate', onRoute);
    return () => {
      removeEventListener('hashchange', onRoute);
      removeEventListener('popstate', onRoute);
    };
  }, []);

  useEffect(() => saveCatalog(catalog), [catalog]);

  useEffect(() => {
    const { seoTitle, name, seoDescription } = catalog.business;
    document.title = seoTitle || name || 'Gally Family Bakery';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && seoDescription) metaDesc.setAttribute('content', seoDescription);
  }, [catalog.business]);

  if (route === 'admin') return <AdminPage catalog={catalog} setCatalog={setCatalog} />;
  if (route === 'privacy') return <PrivacyPage business={catalog.business} />;

  return (
    <div className="site">
      <SiteHeader />
      {route === 'cakes' && <CakesPage catalog={catalog} />}
      {route === 'macarons' && <MacaronsPage catalog={catalog} />}
      {route === 'desserts' && <DessertsPage catalog={catalog} />}
      {route === 'portfolio' && <PortfolioPage catalog={catalog} />}
      {route === 'about' && <AboutPage catalog={catalog} />}
      {!['cakes', 'macarons', 'desserts', 'portfolio', 'about'].includes(route) && <HomePage catalog={catalog} setCatalog={setCatalog} />}
      <SiteFooter business={catalog.business} />
    </div>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className={menuOpen ? 'site-header menu-active' : 'site-header'}>
      <a className="brand" href="#/" aria-label="Gally Family Bakery home">
        <span className="brand-mark">G</span>
        <span>Gally Bakery</span>
      </a>
      <button
        className="icon-button mobile-only"
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-controls="site-nav"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <button className="nav-backdrop" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
      <nav id="site-nav" className={menuOpen ? 'nav open' : 'nav'} aria-label="Main navigation" onClick={() => setMenuOpen(false)}>
        {navItems.map(([label, href]) => (
          <a key={label} href={href}>{label}</a>
        ))}
      </nav>
    </header>
  );
}

function HomePage({ catalog, setCatalog }) {
  const { business, home, categories, reviews } = catalog;
  const contactBusiness = { ...business, appsScriptUrl: DEFAULT_APPS_SCRIPT_URL || business.appsScriptUrl };

  useEffect(() => {
    if (location.hash === '#contact') {
      requestAnimationFrame(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }));
    }
  }, []);

  return (
    <main id="top">
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-kicker">Family bakery | Florida</p>
          <h1>
            <span>{home.heroTitleBefore}</span>
            <span className="hero-word">{home.heroAnimatedWord}</span>
            <span>{home.heroTitleAfter}</span>
          </h1>
          <div className="hero-stats" aria-label="Bakery highlights">
            {(home.stats || []).map((stat) => (
              <span key={`${stat.value}-${stat.label}`}>
                <strong>{stat.value}</strong>
                {stat.label}
              </span>
            ))}
          </div>
          <div className="hero-actions">
            <a className="button primary" href="#contact">Order now <ChevronRight size={18} /></a>
            <a className="button ghost" href={business.instagram} target="_blank" rel="noreferrer">Instagram <Instagram size={18} /></a>
          </div>
          <div className="hero-contact" aria-label="Contact details">
            <a href={business.instagram} target="_blank" rel="noreferrer"><Instagram size={16} /> @gally_bakery</a>
            <a href={`mailto:${business.email}`}><Mail size={16} /> {business.email}</a>
            <a href={`tel:${business.phone}`}><Phone size={16} /> {business.displayPhone}</a>
          </div>
        </div>
        <div className="hero-media">
          <img src={asset(home.heroImage)} alt={home.heroImageAlt || 'Gally Family Bakery'} fetchPriority="high" decoding="async" />
        </div>
      </section>

      <section className="section about-teaser reveal-band">
        <div>
          <p className="eyebrow">{home.aboutEyebrow}</p>
          <h2>{home.aboutTitle}</h2>
        </div>
        <div className="text-block">
          <p>{home.aboutText}</p>
          <a className="text-link" href="#/about">Read more <ChevronRight size={18} /></a>
        </div>
      </section>

      <section className="section" id="menu">
        <div className="section-heading">
          <p className="eyebrow">Signature Categories</p>
          <h2>Cakes, macarons and desserts without the noise.</h2>
        </div>
        <div className="category-list">
          {categories.map((category, index) => (
            <a className="category-card" href={category.route || `#/${category.id}`} key={category.id}>
              <img src={asset(category.image)} alt={`${category.name} by Gally Bakery`} loading="lazy" decoding="async" />
              <div>
                <small>{String(index + 1).padStart(2, '0')}</small>
                <span>{category.name}</span>
                <p>{category.short}</p>
              </div>
              <ChevronRight size={22} />
            </a>
          ))}
        </div>
      </section>

      <section className="section reviews-section">
        <div className="section-heading compact">
          <p className="eyebrow">Reviews</p>
          <h2>Kind notes from recent orders.</h2>
        </div>
        <div className="review-grid">
          {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
        </div>
      </section>

      <section className="section work-with-us">
        <div>
          <p className="eyebrow">Working With Us</p>
          <h2>{home.workingTitle}</h2>
          <p>{home.workingText}</p>
        </div>
        <div className="benefit-grid">
          {['Custom cakes', 'Macarons', 'Dessert tables', 'Pickup or delivery'].map((label, index) => (
            <div className="benefit" key={label}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="contact-copy">
          <p className="eyebrow">Order</p>
          <h2>Tell us what you are celebrating.</h2>
          <div className="contact-list">
            <a href={`tel:${business.phone}`}><Phone size={18} /> {business.displayPhone}</a>
            <a href={`mailto:${business.email}`}><Mail size={18} /> {business.email}</a>
            <a href={business.instagram} target="_blank" rel="noreferrer"><Instagram size={18} /> @gally_bakery</a>
            <span><MapPin size={18} /> {business.serviceArea}</span>
          </div>
        </div>
        <ContactForm catalog={catalog} setCatalog={setCatalog} business={contactBusiness} />
      </section>
    </main>
  );
}

function CakesPage({ catalog }) {
  const page = catalog.pages.cakes;
  return (
    <InnerPageShell page={page} eyebrow="Custom Orders">
      <div className="split-section">
        {(page.sections || []).map((section) => (
          <article className="detail-panel" key={section.id}>
            <h2>{section.title}</h2>
            <p>{section.description}</p>
            <FlavorList flavors={section.flavors} />
          </article>
        ))}
      </div>
    </InnerPageShell>
  );
}

function MacaronsPage({ catalog }) {
  const page = catalog.pages.macarons;
  return (
    <InnerPageShell page={page} eyebrow="Macarons">
      <div className="detail-panel wide-panel">
        <h2>Main flavors</h2>
        <FlavorList flavors={page.flavors} />
      </div>
    </InnerPageShell>
  );
}

function DessertsPage({ catalog }) {
  const page = catalog.pages.desserts;
  return (
    <InnerPageShell page={page} eyebrow="Desserts">
      <div className="dessert-grid">
        {(page.items || []).map((item) => (
          <article className="dessert-card" key={item.id}>
            <img src={asset(item.image)} alt={item.name} loading="lazy" decoding="async" />
            <h2>{item.name}</h2>
          </article>
        ))}
      </div>
    </InnerPageShell>
  );
}

function PortfolioPage({ catalog }) {
  const page = catalog.pages.portfolio;
  const [filter, setFilter] = useState('All');
  const filters = ['All', ...Array.from(new Set(catalog.portfolio.map((item) => item.type).filter(Boolean)))];
  const items = filter === 'All' ? catalog.portfolio : catalog.portfolio.filter((item) => item.type === filter);
  return (
    <InnerPageShell page={page} eyebrow="Portfolio">
      <div className="filter-row" aria-label="Portfolio filters">
        {filters.map((item) => (
          <button className={item === filter ? 'filter-chip active' : 'filter-chip'} type="button" key={item} onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="portfolio-grid">
        {items.map((item) => (
          <figure className="portfolio-item" key={item.id}>
            <img src={asset(item.image)} alt={item.title} loading="lazy" decoding="async" />
            <figcaption>
              <span>{item.type}</span>
              {item.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </InnerPageShell>
  );
}

function AboutPage({ catalog }) {
  const page = catalog.pages.about;
  return (
    <InnerPageShell page={page} eyebrow="About Us">
      <div className="about-story">
        <img src={asset(page.image)} alt="Gally Family Bakery family placeholder" loading="lazy" decoding="async" />
        <div className="detail-panel">
          <h2>Rooted in NY</h2>
          <p>{page.body}</p>
        </div>
      </div>
    </InnerPageShell>
  );
}

function InnerPageShell({ page, eyebrow, children }) {
  return (
    <main>
      <section className="inner-hero">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
          <a className="button primary" href="#contact">Start an order <ChevronRight size={18} /></a>
        </div>
        <img src={asset(page.image)} alt={`${page.title} by Gally Family Bakery`} fetchPriority="high" decoding="async" />
      </section>
      <section className="section inner-content">{children}</section>
      <a className="floating-contact" href="#contact" aria-label="Contact"><Mail size={18} /> <span>Contact</span></a>
    </main>
  );
}

function FlavorList({ flavors = [] }) {
  return (
    <div className="flavor-list">
      {flavors.map((flavor) => <span key={flavor}>{flavor}</span>)}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <article className="review-card">
      {review.image && <img src={asset(review.image)} alt="" loading="lazy" decoding="async" />}
      <div>
        <div className="stars" aria-label={`${review.rating || '5.0'} star review`}>
          {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={15} fill="currentColor" />)}
          <span>{review.rating}</span>
        </div>
        <p>{review.text}</p>
        <strong>{review.name}</strong>
        <span>{review.caption}</span>
      </div>
    </article>
  );
}

function ContactForm({ catalog, setCatalog }) {
  const [status, setStatus] = useState('');
  const [accepted, setAccepted] = useState(false);

  async function submitForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!accepted) {
      setStatus('Please accept the personal data processing consent.');
      return;
    }
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.createdAt = new Date().toISOString();
    payload.source = 'gally_bakery_site';

    setStatus('Sending...');
    try {
      const response = await fetch('/api/submit-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Could not send request');
      form.reset();
      setAccepted(false);
      setCatalog({ ...catalog });
      setStatus('Thank you. Your request has been sent.');
    } catch (error) {
      setStatus(`Could not send the request: ${error.message}`);
    }
  }

  return (
    <form className="contact-form" onSubmit={submitForm}>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" autoComplete="name" required />
      </div>
      <div className="field-grid">
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="interest">Interested in</label>
        <select id="interest" name="interest" defaultValue="Custom order">
          {catalog.categories.map((category) => <option key={category.id}>{category.name}</option>)}
          <option>Custom order</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="5" placeholder="Date, servings, flavor or inspiration" required />
      </div>
      <label className="consent">
        <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
        <span>I agree to personal data processing and have read the <a href="#/privacy">consent page</a>.</span>
      </label>
      <button className="button primary full" type="submit">Send request <Mail size={18} /></button>
      <p className="form-status" aria-live="polite">{status}</p>
    </form>
  );
}

function SiteFooter({ business }) {
  return (
    <footer className="footer">
      <div>
        <a className="brand footer-brand" href="#/">
          <span className="brand-mark">G</span>
          <span>{business.name}</span>
        </a>
        <p>{business.tagline}</p>
      </div>
      <nav aria-label="Footer navigation">
        {navItems.slice(0, 5).map(([label, href]) => <a key={label} href={href}>{label}</a>)}
      </nav>
      <div className="footer-contact">
        <a href={`tel:${business.phone}`}>{business.displayPhone}</a>
        <a href={`mailto:${business.email}`}>{business.email}</a>
        <a href={business.instagram} target="_blank" rel="noreferrer">Instagram</a>
        <a href="#/privacy">Privacy consent</a>
      </div>
    </footer>
  );
}

function PrivacyPage({ business }) {
  return (
    <main className="legal-page">
      <a className="back-link" href="#/"><ChevronRight size={18} /> Back to site</a>
      <section className="legal-card">
        <p className="eyebrow">Personal Data Consent</p>
        <h1>Consent to personal data processing</h1>
        <p>By submitting a request through this website, you consent to Gally Family Bakery collecting and processing the information you provide for order communication, delivery or pickup coordination, customer support and service improvement.</p>
        <h2>Data we may collect</h2>
        <p>Name, phone number, email address, order details, preferred products, message text and submission date.</p>
        <h2>How we use it</h2>
        <p>Your information is used only to respond to your request, prepare an order proposal, arrange delivery or pickup, and keep necessary order records.</p>
        <h2>Storage and access</h2>
        <p>Requests may be stored in a Google Sheet controlled by the bakery owner. Access should be limited to people who help process customer requests.</p>
        <h2>Withdrawal</h2>
        <p>You may request deletion or correction by contacting Gally Family Bakery at {business.displayPhone} or {business.email}.</p>
        <p className="legal-note">Last updated: June 5, 2026.</p>
      </section>
    </main>
  );
}

function AdminPage({ catalog, setCatalog }) {
  const [unlocked, setUnlocked] = useState(sessionStorage.getItem('gally_admin') === 'true');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState('home');
  const [status, setStatus] = useState('');

  function unlock(event) {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('gally_admin', 'true');
      setUnlocked(true);
    }
  }

  async function saveChanges() {
    setStatus('Saving changes...');
    try {
      const serverResponse = await fetch('/api/update-catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ADMIN_PASSWORD}`,
        },
        body: JSON.stringify({ catalog }),
      });
      const serverJson = await serverResponse.json();
      if (serverResponse.ok) {
        setStatus('Saved. The site will update automatically after deployment.');
        return;
      }
      throw new Error(serverJson.error || 'Save failed');
    } catch (error) {
      setStatus(`Could not save: ${error.message.slice(0, 180)}`);
    }
  }

  if (!unlocked) {
    return (
      <main className="admin-login">
        <form className="login-card" onSubmit={unlock}>
          <span className="brand-mark">G</span>
          <h1>Gally admin</h1>
          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
          <button className="button primary full" type="submit"><Lock size={18} /> Open admin</button>
          <a href="#/">Back to site</a>
        </form>
      </main>
    );
  }

  const tabs = [
    ['home', 'Home', Home],
    ['pages', 'Pages', Edit3],
    ['catalog', 'Products/Categories', CakeSlice],
    ['portfolio', 'Portfolio', GalleryHorizontalEnd],
    ['reviews', 'Reviews', MessageSquareQuote],
    ['business', 'Business', PackagePlus],
    ['requests', 'Requests', Mail],
  ];

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="brand admin-brand" href="#/"><span className="brand-mark">G</span><span>Gally Admin</span></a>
        {tabs.map(([id, label, Icon]) => (
          <button className={tab === id ? 'admin-tab active' : 'admin-tab'} key={id} onClick={() => setTab(id)}>
            <Icon size={18} /> {label}
          </button>
        ))}
      </aside>
      <section className="admin-panel">
        <div className="admin-topbar">
          <div>
            <p className="eyebrow">Content Control</p>
            <h1>{tabs.find(([id]) => id === tab)?.[1]}</h1>
          </div>
          <a className="button ghost" href="#/" target="_blank" rel="noreferrer"><Eye size={18} /> View site</a>
          <button className="button primary" onClick={saveChanges}><Save size={18} /> Save changes</button>
        </div>

        {tab === 'home' && <HomeEditor catalog={catalog} setCatalog={setCatalog} setStatus={setStatus} />}
        {tab === 'pages' && <PagesEditor catalog={catalog} setCatalog={setCatalog} setStatus={setStatus} />}
        {tab === 'catalog' && <CatalogEditor catalog={catalog} setCatalog={setCatalog} setStatus={setStatus} />}
        {tab === 'portfolio' && <PortfolioEditor catalog={catalog} setCatalog={setCatalog} setStatus={setStatus} />}
        {tab === 'reviews' && <ReviewsEditor catalog={catalog} setCatalog={setCatalog} setStatus={setStatus} />}
        {tab === 'business' && <BusinessEditor catalog={catalog} setCatalog={setCatalog} />}
        {tab === 'requests' && <RequestsPanel />}

        <p className="admin-status" aria-live="polite">{status}</p>
      </section>
    </main>
  );
}

function HomeEditor({ catalog, setCatalog, setStatus }) {
  const home = catalog.home;
  const update = (patch) => setCatalog({ ...catalog, home: { ...home, ...patch } });
  return (
    <div className="editor-card wide">
      <h2>Home page</h2>
      <div className="field-grid three">
        <TextInput label="Hero before" value={home.heroTitleBefore} onChange={(heroTitleBefore) => update({ heroTitleBefore })} />
        <TextInput label="Animated word" value={home.heroAnimatedWord} onChange={(heroAnimatedWord) => update({ heroAnimatedWord })} />
        <TextInput label="Hero after" value={home.heroTitleAfter} onChange={(heroTitleAfter) => update({ heroTitleAfter })} />
      </div>
      <ImageInput label="Hero photo" value={home.heroImage} onChange={(heroImage) => update({ heroImage })} setStatus={setStatus} />
      <TextInput label="About eyebrow" value={home.aboutEyebrow} onChange={(aboutEyebrow) => update({ aboutEyebrow })} />
      <TextInput label="About title" value={home.aboutTitle} onChange={(aboutTitle) => update({ aboutTitle })} />
      <TextArea label="About teaser text" value={home.aboutText} onChange={(aboutText) => update({ aboutText })} />
      <TextInput label="Working title" value={home.workingTitle} onChange={(workingTitle) => update({ workingTitle })} />
      <TextArea label="Working text" value={home.workingText} onChange={(workingText) => update({ workingText })} />
      <StatEditor stats={home.stats || []} onChange={(stats) => update({ stats })} />
    </div>
  );
}

function PagesEditor({ catalog, setCatalog, setStatus }) {
  const [selected, setSelected] = useState('cakes');
  const page = catalog.pages[selected];
  const updatePage = (patch) => setCatalog({ ...catalog, pages: { ...catalog.pages, [selected]: { ...page, ...patch } } });
  return (
    <div className="editor-layout">
      <div className="item-list">
        {Object.keys(PAGE_LABELS).map((id) => (
          <button key={id} className={selected === id ? 'item-row active text-only' : 'item-row text-only'} onClick={() => setSelected(id)}>
            <span>{PAGE_LABELS[id]}</span>
          </button>
        ))}
      </div>
      <div className="editor-card">
        <h2>{PAGE_LABELS[selected]}</h2>
        <TextInput label="Title" value={page.title} onChange={(title) => updatePage({ title })} />
        <TextArea label="Intro" value={page.intro} onChange={(intro) => updatePage({ intro })} />
        {'body' in page && <TextArea label="Body" value={page.body} onChange={(body) => updatePage({ body })} />}
        <ImageInput label="Page photo" value={page.image} onChange={(image) => updatePage({ image })} setStatus={setStatus} />
        {selected === 'cakes' && <CakeSectionsEditor sections={page.sections || []} onChange={(sections) => updatePage({ sections })} />}
        {selected === 'macarons' && <TagEditor label="Flavors" values={page.flavors || []} onChange={(flavors) => updatePage({ flavors })} />}
        {selected === 'desserts' && <DessertItemsEditor items={page.items || []} onChange={(items) => updatePage({ items })} setStatus={setStatus} />}
      </div>
    </div>
  );
}

function CatalogEditor({ catalog, setCatalog, setStatus }) {
  const [mode, setMode] = useState('categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState(catalog.categories[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(catalog.products[0]?.id || '');
  const selectedCategory = catalog.categories.find((category) => category.id === selectedCategoryId) || catalog.categories[0] || emptyCategory;
  const selectedProduct = catalog.products.find((product) => product.id === selectedProductId) || catalog.products[0] || emptyProduct;

  const updateCategory = (patch) => setCatalog({
    ...catalog,
    categories: catalog.categories.map((category) => (category.id === selectedCategory.id ? { ...category, ...patch } : category)),
  });
  const updateProduct = (patch) => setCatalog({
    ...catalog,
    products: catalog.products.map((product) => (product.id === selectedProduct.id ? { ...product, ...patch } : product)),
  });

  function addCategory() {
    const category = { ...emptyCategory, id: `category-${Date.now()}`, name: 'New category' };
    setCatalog({ ...catalog, categories: [category, ...catalog.categories] });
    setSelectedCategoryId(category.id);
  }

  function deleteCategory() {
    const next = catalog.categories.filter((category) => category.id !== selectedCategory.id);
    setCatalog({ ...catalog, categories: next });
    setSelectedCategoryId(next[0]?.id || '');
  }

  function addProduct() {
    const product = { ...emptyProduct, id: `product-${Date.now()}`, name: 'New product', categoryId: catalog.categories[0]?.id || 'cakes' };
    setCatalog({ ...catalog, products: [product, ...catalog.products] });
    setSelectedProductId(product.id);
  }

  function deleteProduct() {
    const next = catalog.products.filter((product) => product.id !== selectedProduct.id);
    setCatalog({ ...catalog, products: next });
    setSelectedProductId(next[0]?.id || '');
  }

  return (
    <div className="editor-card wide">
      <div className="segmented">
        <button className={mode === 'categories' ? 'active' : ''} onClick={() => setMode('categories')}>Categories</button>
        <button className={mode === 'products' ? 'active' : ''} onClick={() => setMode('products')}>Products</button>
      </div>
      {mode === 'categories' && (
        <div className="editor-layout nested">
          <div className="item-list">
            <button className="button primary full" onClick={addCategory}><Plus size={18} /> Add category</button>
            {catalog.categories.map((category) => <AdminImageRow key={category.id} item={category} active={category.id === selectedCategory.id} onClick={() => setSelectedCategoryId(category.id)} />)}
          </div>
          <div className="editor-card flat">
            <EditorHeader title="Edit category" onDelete={deleteCategory} />
            <TextInput label="Name" value={selectedCategory.name} onChange={(name) => updateCategory({ name, id: selectedCategory.id.startsWith('category-') ? slugify(name) || selectedCategory.id : selectedCategory.id })} />
            <TextArea label="Short text" value={selectedCategory.short} onChange={(short) => updateCategory({ short })} />
            <TextInput label="Route" value={selectedCategory.route} onChange={(route) => updateCategory({ route })} />
            <ImageInput label="Category photo" value={selectedCategory.image} onChange={(image) => updateCategory({ image })} setStatus={setStatus} />
          </div>
        </div>
      )}
      {mode === 'products' && (
        <div className="editor-layout nested">
          <div className="item-list">
            <button className="button primary full" onClick={addProduct}><Plus size={18} /> Add product</button>
            {catalog.products.map((product) => <AdminImageRow key={product.id} item={product} active={product.id === selectedProduct.id} onClick={() => setSelectedProductId(product.id)} />)}
          </div>
          <ProductEditor product={selectedProduct} categories={catalog.categories} updateProduct={updateProduct} deleteProduct={deleteProduct} setStatus={setStatus} />
        </div>
      )}
    </div>
  );
}

function ProductEditor({ product, categories, updateProduct, deleteProduct, setStatus }) {
  return (
    <div className="editor-card flat">
      <EditorHeader title="Edit product" onDelete={deleteProduct} />
      <TextInput label="Name" value={product.name} onChange={(name) => updateProduct({ name, id: product.id.startsWith('product-') ? slugify(name) || product.id : product.id })} />
      <label className="field">
        <span>Category</span>
        <select value={product.categoryId} onChange={(event) => updateProduct({ categoryId: event.target.value })}>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
      </label>
      <TextArea label="Description" value={product.description} onChange={(description) => updateProduct({ description })} />
      <TextInput label="Price" value={product.price} onChange={(price) => updateProduct({ price })} />
      <TagEditor label="Flavors" values={product.flavors || []} onChange={(flavors) => updateProduct({ flavors })} />
      <TagEditor label="Formats" values={product.formats || []} onChange={(formats) => updateProduct({ formats })} />
      <ImageInput label="Product photo" value={product.image} onChange={(image) => updateProduct({ image })} setStatus={setStatus} />
      <label className="switch"><input type="checkbox" checked={Boolean(product.featured)} onChange={(event) => updateProduct({ featured: event.target.checked })} /> Featured</label>
    </div>
  );
}

function PortfolioEditor({ catalog, setCatalog, setStatus }) {
  const [selectedId, setSelectedId] = useState(catalog.portfolio[0]?.id || '');
  const selected = catalog.portfolio.find((item) => item.id === selectedId) || catalog.portfolio[0] || emptyPortfolioItem;
  const update = (patch) => setCatalog({ ...catalog, portfolio: catalog.portfolio.map((item) => (item.id === selected.id ? { ...item, ...patch } : item)) });
  function addItem() {
    const item = { ...emptyPortfolioItem, id: `portfolio-${Date.now()}` };
    setCatalog({ ...catalog, portfolio: [item, ...catalog.portfolio] });
    setSelectedId(item.id);
  }
  function deleteItem() {
    const next = catalog.portfolio.filter((item) => item.id !== selected.id);
    setCatalog({ ...catalog, portfolio: next });
    setSelectedId(next[0]?.id || '');
  }
  return <ListEditor title="Portfolio item" items={catalog.portfolio} selected={selected} setSelectedId={setSelectedId} addItem={addItem} deleteItem={deleteItem} renderEditor={() => (
    <>
      <TextInput label="Title" value={selected.title} onChange={(title) => update({ title })} />
      <TextInput label="Type" value={selected.type} onChange={(type) => update({ type })} />
      <ImageInput label="Photo" value={selected.image} onChange={(image) => update({ image })} setStatus={setStatus} />
    </>
  )} />;
}

function ReviewsEditor({ catalog, setCatalog, setStatus }) {
  const [selectedId, setSelectedId] = useState(catalog.reviews[0]?.id || '');
  const selected = catalog.reviews.find((item) => item.id === selectedId) || catalog.reviews[0] || emptyReview;
  const update = (patch) => setCatalog({ ...catalog, reviews: catalog.reviews.map((item) => (item.id === selected.id ? { ...item, ...patch } : item)) });
  function addItem() {
    const item = { ...emptyReview, id: `review-${Date.now()}` };
    setCatalog({ ...catalog, reviews: [item, ...catalog.reviews] });
    setSelectedId(item.id);
  }
  function deleteItem() {
    const next = catalog.reviews.filter((item) => item.id !== selected.id);
    setCatalog({ ...catalog, reviews: next });
    setSelectedId(next[0]?.id || '');
  }
  return <ListEditor title="Review" items={catalog.reviews} selected={selected} setSelectedId={setSelectedId} addItem={addItem} deleteItem={deleteItem} renderEditor={() => (
    <>
      <TextInput label="Name" value={selected.name} onChange={(name) => update({ name })} />
      <TextArea label="Review text" value={selected.text} onChange={(text) => update({ text })} />
      <TextInput label="Caption" value={selected.caption} onChange={(caption) => update({ caption })} />
      <TextInput label="Rating" value={selected.rating} onChange={(rating) => update({ rating })} />
      <ImageInput label="Review photo or screenshot" value={selected.image} onChange={(image) => update({ image })} setStatus={setStatus} />
    </>
  )} />;
}

function ListEditor({ title, items, selected, setSelectedId, addItem, deleteItem, renderEditor }) {
  return (
    <div className="editor-layout">
      <div className="item-list">
        <button className="button primary full" onClick={addItem}><Plus size={18} /> Add</button>
        {items.map((item) => <AdminImageRow key={item.id} item={item} active={item.id === selected.id} onClick={() => setSelectedId(item.id)} />)}
      </div>
      <div className="editor-card">
        <EditorHeader title={title} onDelete={deleteItem} />
        {renderEditor()}
      </div>
    </div>
  );
}

function CakeSectionsEditor({ sections, onChange }) {
  const update = (index, patch) => onChange(sections.map((section, itemIndex) => (itemIndex === index ? { ...section, ...patch } : section)));
  return (
    <div className="nested-editor">
      <h3>Cake sections</h3>
      {sections.map((section, index) => (
        <div className="mini-card" key={section.id || index}>
          <TextInput label="Title" value={section.title} onChange={(title) => update(index, { title })} />
          <TextArea label="Description" value={section.description} onChange={(description) => update(index, { description })} />
          <TagEditor label="Flavors" values={section.flavors || []} onChange={(flavors) => update(index, { flavors })} />
        </div>
      ))}
    </div>
  );
}

function DessertItemsEditor({ items, onChange, setStatus }) {
  const update = (index, patch) => onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  const add = () => onChange([{ id: `dessert-${Date.now()}`, name: 'New dessert', image: '/assets/pdf-page02-03.webp' }, ...items]);
  const remove = (index) => onChange(items.filter((_, itemIndex) => itemIndex !== index));
  return (
    <div className="nested-editor">
      <div className="editor-actions"><h3>Dessert items</h3><button className="button ghost" onClick={add}><Plus size={18} /> Add</button></div>
      {items.map((item, index) => (
        <div className="mini-card" key={item.id || index}>
          <EditorHeader title={item.name} onDelete={() => remove(index)} />
          <TextInput label="Name" value={item.name} onChange={(name) => update(index, { name, id: item.id.startsWith('dessert-') ? slugify(name) || item.id : item.id })} />
          <ImageInput label="Photo" value={item.image} onChange={(image) => update(index, { image })} setStatus={setStatus} />
        </div>
      ))}
    </div>
  );
}

function StatEditor({ stats, onChange }) {
  const update = (index, patch) => onChange(stats.map((stat, itemIndex) => (itemIndex === index ? { ...stat, ...patch } : stat)));
  return (
    <div className="nested-editor">
      <h3>Hero stats</h3>
      <div className="field-grid three">
        {stats.map((stat, index) => (
          <div className="mini-card" key={index}>
            <TextInput label="Value" value={stat.value} onChange={(value) => update(index, { value })} />
            <TextInput label="Label" value={stat.label} onChange={(label) => update(index, { label })} />
          </div>
        ))}
      </div>
    </div>
  );
}

function BusinessEditor({ catalog, setCatalog }) {
  const business = catalog.business;
  const update = (patch) => setCatalog({ ...catalog, business: { ...business, ...patch } });
  return (
    <div className="editor-card wide">
      <h2>Business info</h2>
      <TextInput label="Name" value={business.name} onChange={(name) => update({ name })} />
      <TextInput label="Tagline" value={business.tagline} onChange={(tagline) => update({ tagline })} />
      <TextInput label="SEO title" value={business.seoTitle} onChange={(seoTitle) => update({ seoTitle })} />
      <TextArea label="SEO description" value={business.seoDescription} onChange={(seoDescription) => update({ seoDescription })} />
      <TextInput label="Instagram" value={business.instagram} onChange={(instagram) => update({ instagram })} />
      <TextInput label="Email" value={business.email} onChange={(email) => update({ email })} />
      <TextInput label="Phone for links" value={business.phone} onChange={(phone) => update({ phone })} />
      <TextInput label="Display phone" value={business.displayPhone} onChange={(displayPhone) => update({ displayPhone })} />
      <TextInput label="Service area" value={business.serviceArea} onChange={(serviceArea) => update({ serviceArea })} />
      <TextInput label="Delivery text" value={business.delivery} onChange={(delivery) => update({ delivery })} />
    </div>
  );
}

function RequestsPanel() {
  return (
    <div className="editor-card wide requests-card">
      <div className="editor-actions">
        <div>
          <h2>Customer requests</h2>
          <p>All form submissions are saved in Google Sheets.</p>
        </div>
        <a className="button primary" href={REQUESTS_SHEET_URL} target="_blank" rel="noreferrer">Open table <ChevronRight size={18} /></a>
      </div>
      <iframe className="requests-frame" title="Gally Bakery requests sheet" src={REQUESTS_SHEET_URL.replace('/edit?gid=0#gid=0', '/preview')} />
    </div>
  );
}

function EditorHeader({ title, onDelete }) {
  return (
    <div className="editor-actions">
      <h2>{title}</h2>
      {onDelete && <button className="danger-button" onClick={onDelete}><Trash2 size={18} /> Delete</button>}
    </div>
  );
}

function AdminImageRow({ item, active, onClick }) {
  return (
    <button className={active ? 'item-row active' : 'item-row'} onClick={onClick}>
      <img src={asset(item.image)} alt="" />
      <span>{item.name || item.title}</span>
    </button>
  );
}

function TextInput({ label, value, onChange, type = 'text' }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value || ''} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea rows="4" value={value || ''} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TagEditor({ label, values, onChange }) {
  const [draft, setDraft] = useState('');
  function add() {
    if (!draft.trim()) return;
    onChange([...(values || []), draft.trim()]);
    setDraft('');
  }
  return (
    <div className="field">
      <span>{label}</span>
      <div className="tag-editor">
        {(values || []).map((value) => (
          <button key={value} type="button" onClick={() => onChange(values.filter((item) => item !== value))}>
            {value} <X size={14} />
          </button>
        ))}
      </div>
      <div className="inline-add">
        <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && (event.preventDefault(), add())} />
        <button className="icon-button" type="button" onClick={add} aria-label={`Add ${label}`}><Plus size={18} /></button>
      </div>
    </div>
  );
}

function ImageInput({ label, value, onChange, setStatus }) {
  const [urlDraft, setUrlDraft] = useState('');

  async function uploadFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus('Uploading image...');
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Could not read image file'));
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ADMIN_PASSWORD}`,
        },
        body: JSON.stringify({
          filename: file.name,
          mimeType: file.type,
          data: dataUrl,
        }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Upload failed');
      onChange(json.path);
      setStatus('Image uploaded. Click Save changes to publish it.');
    } catch (error) {
      setStatus(`Image upload failed: ${error.message.slice(0, 160)}`);
    } finally {
      event.target.value = '';
    }
  }

  function applyUrl() {
    const next = urlDraft.trim();
    if (!next) return;
    onChange(next);
    setUrlDraft('');
    setStatus('Image URL added. Click Save changes to publish it.');
  }

  return (
    <div className="field">
      <span>{label}</span>
      {value && (
        <div className="image-preview">
          <img src={asset(value)} alt="" />
          <span>{value}</span>
        </div>
      )}
      <label className="upload-button">
        <ImagePlus size={18} /> Upload from device
        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadFile} />
      </label>
      <div className="inline-add">
        <input value={urlDraft} onChange={(event) => setUrlDraft(event.target.value)} placeholder="Paste image URL" />
        <button className="button ghost" type="button" onClick={applyUrl}>Use URL</button>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
