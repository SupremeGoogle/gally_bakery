import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  CakeSlice,
  Check,
  ChevronRight,
  Download,
  Edit3,
  Eye,
  FileText,
  Github,
  Instagram,
  Lock,
  Mail,
  MapPin,
  Menu,
  PackagePlus,
  Phone,
  Plus,
  Sparkles,
  Trash2,
  Truck,
  Upload,
  X,
} from 'lucide-react';
import catalogSeed from '../data/catalog.json';
import './styles.css';

const STORAGE_KEY = 'gally_bakery_catalog_v1';
const SETTINGS_KEY = 'gally_bakery_admin_settings_v1';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'gally062026';
const DEFAULT_APPS_SCRIPT_URL =
  import.meta.env.VITE_APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbwWFpv1tk_aRmyad2Lahv30yX_3KDeNzc0fI1gHHlD59Mk7pmYF7c5tSGy8SH_h04lc/exec';

const emptyProduct = {
  id: '',
  categoryId: 'cheesecakes',
  name: '',
  description: '',
  flavors: [],
  formats: [],
  price: '',
  image: '/assets/pdf-page03-01.webp',
  featured: false,
};

const imageOptions = [
  '/assets/pdf-page01-01.webp',
  '/assets/pdf-page02-01.webp',
  '/assets/pdf-page02-02.webp',
  '/assets/pdf-page02-03.webp',
  '/assets/pdf-page02-04.webp',
  '/assets/pdf-page03-01.webp',
  '/assets/pdf-page04-01.webp',
  '/assets/pdf-page04-02.webp',
  '/assets/pdf-page04-03.webp',
  '/assets/pdf-page04-04.webp',
  '/assets/pdf-page05-01.webp',
  '/assets/pdf-page06-01.webp',
  '/assets/pdf-page07-01.webp',
  '/assets/pdf-page07-02.webp',
];

const asset = (path) => `${import.meta.env.BASE_URL}${String(path || '').replace(/^\/+/, '')}`;

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function readCatalog() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : catalogSeed;
  } catch {
    return catalogSeed;
  }
}

function saveCatalog(catalog) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
}

function readSettings() {
  try {
    return {
      owner: 'SupremeGoogle',
      repo: 'gally_bakery',
      branch: 'main',
      token: '',
      appsScriptUrl: DEFAULT_APPS_SCRIPT_URL,
      ...(JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}),
    };
  } catch {
    return { owner: 'SupremeGoogle', repo: 'gally_bakery', branch: 'main', token: '', appsScriptUrl: DEFAULT_APPS_SCRIPT_URL };
  }
}

function App() {
  const [route, setRoute] = useState(location.hash || '#/');
  const [catalog, setCatalog] = useState(readCatalog);

  useEffect(() => {
    const onHash = () => setRoute(location.hash || '#/');
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => saveCatalog(catalog), [catalog]);

  if (route.startsWith('#/admin')) {
    return <AdminPage catalog={catalog} setCatalog={setCatalog} />;
  }

  if (route.startsWith('#/privacy')) {
    return <PrivacyPage business={catalog.business} />;
  }

  return <HomePage catalog={catalog} setCatalog={setCatalog} />;
}

function HomePage({ catalog, setCatalog }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const featured = catalog.products.filter((product) => product.featured);
  const settings = readSettings();
  const business = {
    ...catalog.business,
    appsScriptUrl: settings.appsScriptUrl || DEFAULT_APPS_SCRIPT_URL || catalog.business.appsScriptUrl,
  };

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Gally Family Bakery home">
          <span className="brand-mark">G</span>
          <span>Gally Bakery</span>
        </a>
        <button className="icon-button mobile-only" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Open menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Main navigation">
          <a href="#menu">Menu</a>
          <a href="#partners">Partners</a>
          <a href="#contact">Order</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy reveal">
            <p className="eyebrow">Est. 2020 | Family Bakery</p>
            <h1>Handmade desserts for cafes, restaurants and sweet celebrations.</h1>
            <p>
              I&apos;m Gally, a pastry enthusiast baking treats with love and a smile. Delivery and free pick up around JAX, Yulee and St. Johns Town Center.
            </p>
            <div className="hero-stats" aria-label="Bakery highlights">
              <span><strong>2020</strong> baking since</span>
              <span><strong>FL</strong> licensed kitchen</span>
              <span><strong>15+</strong> menu options</span>
            </div>
            <div className="hero-actions">
              <a className="button primary" href="#contact">
                Let&apos;s bake it <ChevronRight size={18} />
              </a>
              <a className="button ghost" href={business.instagram} target="_blank" rel="noreferrer">
                Instagram <Instagram size={18} />
              </a>
            </div>
          </div>
          <div className="hero-media reveal delay-1" aria-label="Gally Bakery dessert photo">
            <img className="hero-main-photo" src={asset('/assets/pdf-page05-01.webp')} alt="Assorted eclairs from Gally Bakery" fetchPriority="high" />
            <div className="floating-note">
              <Sparkles size={18} />
              Small-batch, freezer-friendly, menu-ready
            </div>
          </div>
        </section>

        <section className="ticker" aria-label="Service highlights">
          {['French Macarons', 'Cheesecakes', 'Eclairs', 'Grand Cookies', 'Honey Cake', 'Brownies', 'Key Lime Pie'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </section>

        <section className="section about reveal" id="about">
          <div>
            <p className="eyebrow">About Us</p>
            <h2>Rooted in New York, now baking under the Florida sun.</h2>
          </div>
          <div className="about-card">
            <p>
              Gally Bakery is a family-owned business that began in 2020 as a passion for sweet gifts. Since 2023, our family has been based in Florida, creating handcrafted desserts for partners who value quality, freshness and personal collaboration.
            </p>
            <div className="signature-line">Baked with love and a smile.</div>
          </div>
        </section>

        <section className="section" id="menu">
          <div className="section-heading reveal">
            <p className="eyebrow">Signature Categories</p>
            <h2>Built for display cases, dessert menus and repeat orders.</h2>
          </div>
          <div className="category-grid">
            {catalog.categories.map((category, index) => (
              <article className="category-card reveal" style={{ '--delay': `${index * 70}ms` }} key={category.id}>
                <div className="category-media">
                  <img src={asset(category.image)} alt={`${category.name} by Gally Bakery`} loading="lazy" />
                </div>
                <div className="category-content">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{category.name}</h3>
                  <p>{category.short}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section featured-products">
          <div className="section-heading reveal">
            <p className="eyebrow">Menu Highlights</p>
            <h2>Favorite treats with clean service details.</h2>
          </div>
          <div className="shelf-labels" aria-hidden="true">
            <span>ready-to-serve</span>
            <span>small batch</span>
            <span>custom colors</span>
          </div>
          <div className="product-rail" aria-label="Featured products">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="section work-with-us reveal" id="partners">
          <div>
            <p className="eyebrow">Working With Us</p>
            <h2>A thoughtful dessert partner for local cafes and restaurants.</h2>
            <p>
              We work with a limited number of partners so every collaboration receives personal care, consistency and clear communication.
            </p>
          </div>
          <div className="benefit-grid">
            {[
              ['Handmade in small batches', CakeSlice],
              ['Flexible ordering by service needs', PackagePlus],
              ['Freezer-friendly inventory planning', Check],
              ['Delivery and free pick up', Truck],
            ].map(([label, Icon]) => (
              <div className="benefit" key={label}>
                <Icon size={22} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="contact-copy reveal">
            <p className="eyebrow">Let&apos;s Bake It</p>
            <h2>Tell us what you need for your menu, event or sweet table.</h2>
            <div className="contact-list">
              <a href={`tel:${business.phone}`}><Phone size={18} /> {business.displayPhone}</a>
              <a href={business.instagram} target="_blank" rel="noreferrer"><Instagram size={18} /> @gally_bakery</a>
              <span><MapPin size={18} /> {business.serviceArea}</span>
            </div>
          </div>
          <ContactForm business={business} catalog={catalog} setCatalog={setCatalog} />
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <span className="brand-mark">G</span>
            <div>
              <strong>Gally Family Bakery</strong>
              <span>{business.tagline}</span>
            </div>
          </div>
          <p>Handmade desserts for cafes, restaurants and sweet celebrations. Baked with love, consistency and a family touch.</p>
        </div>

        <nav className="footer-column" aria-label="Footer menu">
          <strong>Menu</strong>
          <a href="#menu">Desserts</a>
          <a href="#partners">Partners</a>
          <a href="#contact">Order</a>
        </nav>

        <div className="footer-column">
          <strong>Contact</strong>
          <a href={`tel:${business.phone}`}>{business.displayPhone}</a>
          <a href={business.instagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href="#/privacy">Privacy consent</a>
        </div>

        <div className="footer-column">
          <strong>Service</strong>
          <span>{business.delivery}</span>
          <span>{business.serviceArea}</span>
        </div>

        <div className="footer-bottom">
          <span>Est. 2020</span>
          <span>Licensed commercial kitchen in Florida</span>
          <span>Gally Family Bakery</span>
        </div>
      </footer>
    </>
  );
}

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={asset(product.image)} alt={product.name} loading="lazy" />
      </div>
      <div className="product-body">
        <div>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
        <p className="price">{product.price}</p>
      </div>
    </article>
  );
}

function ContactForm({ business, catalog, setCatalog }) {
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

    if (!business.appsScriptUrl) {
      const mailto = `mailto:gallybakery@example.com?subject=Gally Bakery request&body=${encodeURIComponent(JSON.stringify(payload, null, 2))}`;
      location.href = mailto;
      setStatus('Google Apps Script URL is not connected yet. The request opened as an email draft.');
      return;
    }

    setStatus('Sending...');
    try {
      await fetch(business.appsScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      form.reset();
      setAccepted(false);
      setCatalog({ ...catalog, updatedAt: new Date().toISOString().slice(0, 10) });
      setStatus('Thank you. Your request has been sent.');
    } catch {
      setStatus('Could not send the request. Please call or message us on Instagram.');
    }
  }

  return (
    <form className="contact-form reveal delay-1" onSubmit={submitForm}>
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
          {catalog.products.map((product) => (
            <option key={product.id}>{product.name}</option>
          ))}
          <option>Custom order</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="5" placeholder="Date, quantity, delivery or pickup details" required />
      </div>
      <label className="consent">
        <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
        <span>I agree to personal data processing and have read the <a href="#/privacy">consent page</a>.</span>
      </label>
      <button className="button primary full" type="submit">
        Send request <Mail size={18} />
      </button>
      <p className="form-status" aria-live="polite">{status}</p>
    </form>
  );
}

function PrivacyPage({ business }) {
  return (
    <main className="legal-page">
      <a className="back-link" href="#/"><ChevronRight size={18} /> Back to site</a>
      <section className="legal-card">
        <p className="eyebrow">Personal Data Consent</p>
        <h1>Consent to personal data processing</h1>
        <p>
          By submitting a request through this website, you consent to Gally Family Bakery collecting and processing the information you provide for order communication, delivery or pickup coordination, customer support and service improvement.
        </p>
        <h2>Data we may collect</h2>
        <p>Name, phone number, email address, order details, preferred products, message text and submission date.</p>
        <h2>How we use it</h2>
        <p>Your information is used only to respond to your request, prepare an order proposal, arrange delivery or pickup, and keep necessary order records.</p>
        <h2>Storage and access</h2>
        <p>Requests may be stored in a Google Sheet controlled by the bakery owner. Access should be limited to people who help process customer requests.</p>
        <h2>Withdrawal</h2>
        <p>You may request deletion or correction of your information by contacting Gally Family Bakery at {business.displayPhone} or through Instagram.</p>
        <p className="legal-note">Last updated: June 3, 2026.</p>
      </section>
    </main>
  );
}

function AdminPage({ catalog, setCatalog }) {
  const [unlocked, setUnlocked] = useState(sessionStorage.getItem('gally_admin') === 'true');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState('products');
  const [settings, setSettings] = useState(readSettings);
  const [selectedProductId, setSelectedProductId] = useState(catalog.products[0]?.id || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(catalog.categories[0]?.id || '');
  const [status, setStatus] = useState('');

  const selectedProduct = useMemo(
    () => catalog.products.find((product) => product.id === selectedProductId) || catalog.products[0] || emptyProduct,
    [catalog.products, selectedProductId],
  );
  const selectedCategory = useMemo(
    () => catalog.categories.find((category) => category.id === selectedCategoryId) || catalog.categories[0],
    [catalog.categories, selectedCategoryId],
  );

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  function unlock(event) {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('gally_admin', 'true');
      setUnlocked(true);
    }
  }

  function updateProduct(patch) {
    const next = catalog.products.map((product) => (product.id === selectedProduct.id ? { ...product, ...patch } : product));
    setCatalog({ ...catalog, products: next, updatedAt: new Date().toISOString().slice(0, 10) });
  }

  function addProduct() {
    const product = { ...emptyProduct, id: `new-${Date.now()}`, name: 'New dessert', categoryId: catalog.categories[0]?.id || 'extras' };
    setCatalog({ ...catalog, products: [product, ...catalog.products] });
    setSelectedProductId(product.id);
  }

  function deleteProduct() {
    const next = catalog.products.filter((product) => product.id !== selectedProduct.id);
    setCatalog({ ...catalog, products: next });
    setSelectedProductId(next[0]?.id || '');
  }

  function updateCategory(patch) {
    const next = catalog.categories.map((category) => (category.id === selectedCategory.id ? { ...category, ...patch } : category));
    setCatalog({ ...catalog, categories: next, updatedAt: new Date().toISOString().slice(0, 10) });
  }

  function addCategory() {
    const category = { id: `category-${Date.now()}`, name: 'New category', short: 'Describe this category.', image: '/assets/pdf-page02-03.webp' };
    setCatalog({ ...catalog, categories: [category, ...catalog.categories] });
    setSelectedCategoryId(category.id);
  }

  function deleteCategory() {
    const nextCategories = catalog.categories.filter((category) => category.id !== selectedCategory.id);
    const nextProducts = catalog.products.map((product) =>
      product.categoryId === selectedCategory.id ? { ...product, categoryId: nextCategories[0]?.id || 'extras' } : product,
    );
    setCatalog({ ...catalog, categories: nextCategories, products: nextProducts });
    setSelectedCategoryId(nextCategories[0]?.id || '');
  }

  function downloadCatalog() {
    const blob = new Blob([JSON.stringify(catalog, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'catalog.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importCatalog(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setCatalog(JSON.parse(text));
    setStatus('Catalog imported.');
  }

  async function saveToGithub() {
    try {
      setStatus('Saving through Vercel API...');
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
        setStatus(`Saved to GitHub through Vercel API. Commit: ${serverJson.commit?.slice(0, 7) || 'created'}`);
        return;
      }
      if (serverResponse.status !== 404 && serverResponse.status !== 500) {
        throw new Error(serverJson.error || 'Server publishing failed');
      }
    } catch (error) {
      if (!settings.token) {
        setStatus(`Server publishing is unavailable: ${error.message}. Add Vercel env variables or use a local GitHub token.`);
        return;
      }
    }

    if (!settings.token) {
      setStatus('Add a GitHub token first.');
      return;
    }
    setStatus('Saving to GitHub...');
    const path = 'data/catalog.json';
    const base = `https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${path}`;
    try {
      const current = await fetch(`${base}?ref=${settings.branch}`, {
        headers: { Authorization: `Bearer ${settings.token}`, Accept: 'application/vnd.github+json' },
      });
      const currentJson = current.ok ? await current.json() : {};
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(catalog, null, 2))));
      const response = await fetch(base, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${settings.token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update bakery catalog ${new Date().toISOString()}`,
          content,
          branch: settings.branch,
          sha: currentJson.sha,
        }),
      });
      if (!response.ok) throw new Error(await response.text());
      setStatus('Saved to GitHub.');
    } catch (error) {
      setStatus(`GitHub save failed: ${error.message.slice(0, 180)}`);
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

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="brand admin-brand" href="#/"><span className="brand-mark">G</span><span>Gally Admin</span></a>
        <button className={tab === 'products' ? 'admin-tab active' : 'admin-tab'} onClick={() => setTab('products')}><CakeSlice size={18} /> Products</button>
        <button className={tab === 'categories' ? 'admin-tab active' : 'admin-tab'} onClick={() => setTab('categories')}><PackagePlus size={18} /> Categories</button>
        <button className={tab === 'business' ? 'admin-tab active' : 'admin-tab'} onClick={() => setTab('business')}><Edit3 size={18} /> Business</button>
        <button className={tab === 'publish' ? 'admin-tab active' : 'admin-tab'} onClick={() => setTab('publish')}><Github size={18} /> Publish</button>
      </aside>
      <section className="admin-panel">
        <div className="admin-topbar">
          <div>
            <p className="eyebrow">Catalog Control</p>
            <h1>{tab[0].toUpperCase() + tab.slice(1)}</h1>
          </div>
          <a className="button ghost" href="#/" target="_blank" rel="noreferrer"><Eye size={18} /> View site</a>
        </div>

        {tab === 'products' && (
          <div className="editor-layout">
            <div className="item-list">
              <button className="button primary full" onClick={addProduct}><Plus size={18} /> Add product</button>
              {catalog.products.map((product) => (
                <button key={product.id} className={product.id === selectedProduct.id ? 'item-row active' : 'item-row'} onClick={() => setSelectedProductId(product.id)}>
                  <img src={asset(product.image)} alt="" />
                  <span>{product.name}</span>
                </button>
              ))}
            </div>
            <ProductEditor product={selectedProduct} categories={catalog.categories} updateProduct={updateProduct} deleteProduct={deleteProduct} />
          </div>
        )}

        {tab === 'categories' && selectedCategory && (
          <div className="editor-layout">
            <div className="item-list">
              <button className="button primary full" onClick={addCategory}><Plus size={18} /> Add category</button>
              {catalog.categories.map((category) => (
                <button key={category.id} className={category.id === selectedCategory.id ? 'item-row active' : 'item-row'} onClick={() => setSelectedCategoryId(category.id)}>
                  <img src={asset(category.image)} alt="" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
            <CategoryEditor category={selectedCategory} updateCategory={updateCategory} deleteCategory={deleteCategory} />
          </div>
        )}

        {tab === 'business' && (
          <BusinessEditor catalog={catalog} setCatalog={setCatalog} settings={settings} setSettings={setSettings} />
        )}

        {tab === 'publish' && (
          <div className="publish-grid">
            <div className="editor-card">
              <h2>GitHub save</h2>
              <TextInput label="Owner" value={settings.owner} onChange={(owner) => setSettings({ ...settings, owner })} />
              <TextInput label="Repository" value={settings.repo} onChange={(repo) => setSettings({ ...settings, repo })} />
              <TextInput label="Branch" value={settings.branch} onChange={(branch) => setSettings({ ...settings, branch })} />
              <TextInput label="Fine-grained token" type="password" value={settings.token} onChange={(token) => setSettings({ ...settings, token })} />
              <button className="button primary" onClick={saveToGithub}><Github size={18} /> Save catalog to GitHub</button>
            </div>
            <div className="editor-card">
              <h2>Backup</h2>
              <button className="button ghost" onClick={downloadCatalog}><Download size={18} /> Download JSON</button>
              <label className="upload-button">
                <Upload size={18} /> Import JSON
                <input type="file" accept="application/json" onChange={importCatalog} />
              </label>
              <a className="button ghost" href={asset('/scripts/google-apps-script.js')} download><FileText size={18} /> Apps Script file</a>
            </div>
          </div>
        )}

        <p className="admin-status" aria-live="polite">{status}</p>
      </section>
    </main>
  );
}

function ProductEditor({ product, categories, updateProduct, deleteProduct }) {
  return (
    <div className="editor-card">
      <div className="editor-actions">
        <h2>Edit product</h2>
        <button className="danger-button" onClick={deleteProduct}><Trash2 size={18} /> Delete</button>
      </div>
      <TextInput label="Name" value={product.name} onChange={(name) => updateProduct({ name, id: product.id.startsWith('new-') ? slugify(name) || product.id : product.id })} />
      <TextInput label="Product ID" value={product.id} onChange={(id) => updateProduct({ id: slugify(id) })} />
      <label className="field">
        <span>Category</span>
        <select value={product.categoryId} onChange={(event) => updateProduct({ categoryId: event.target.value })}>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
      </label>
      <TextArea label="Description" value={product.description} onChange={(description) => updateProduct({ description })} />
      <TextInput label="Price" value={product.price} onChange={(price) => updateProduct({ price })} />
      <TagEditor label="Flavors" values={product.flavors} onChange={(flavors) => updateProduct({ flavors })} />
      <TagEditor label="Formats" values={product.formats} onChange={(formats) => updateProduct({ formats })} />
      <ImagePicker value={product.image} onChange={(image) => updateProduct({ image })} />
      <label className="switch"><input type="checkbox" checked={product.featured} onChange={(event) => updateProduct({ featured: event.target.checked })} /> Featured on homepage</label>
    </div>
  );
}

function CategoryEditor({ category, updateCategory, deleteCategory }) {
  return (
    <div className="editor-card">
      <div className="editor-actions">
        <h2>Edit category</h2>
        <button className="danger-button" onClick={deleteCategory}><Trash2 size={18} /> Delete</button>
      </div>
      <TextInput label="Name" value={category.name} onChange={(name) => updateCategory({ name, id: category.id.startsWith('category-') ? slugify(name) || category.id : category.id })} />
      <TextInput label="Category ID" value={category.id} onChange={(id) => updateCategory({ id: slugify(id) })} />
      <TextArea label="Short text" value={category.short} onChange={(short) => updateCategory({ short })} />
      <ImagePicker value={category.image} onChange={(image) => updateCategory({ image })} />
    </div>
  );
}

function BusinessEditor({ catalog, setCatalog, settings, setSettings }) {
  const business = catalog.business;
  const update = (patch) => setCatalog({ ...catalog, business: { ...business, ...patch } });
  return (
    <div className="editor-card wide">
      <h2>Business info</h2>
      <TextInput label="Name" value={business.name} onChange={(name) => update({ name })} />
      <TextInput label="Tagline" value={business.tagline} onChange={(tagline) => update({ tagline })} />
      <TextInput label="Instagram" value={business.instagram} onChange={(instagram) => update({ instagram })} />
      <TextInput label="Phone for links" value={business.phone} onChange={(phone) => update({ phone })} />
      <TextInput label="Display phone" value={business.displayPhone} onChange={(displayPhone) => update({ displayPhone })} />
      <TextInput label="Service area" value={business.serviceArea} onChange={(serviceArea) => update({ serviceArea })} />
      <TextInput label="Delivery text" value={business.delivery} onChange={(delivery) => update({ delivery })} />
      <TextInput label="Google Apps Script Web App URL" value={settings.appsScriptUrl} onChange={(appsScriptUrl) => setSettings({ ...settings, appsScriptUrl })} />
    </div>
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

function ImagePicker({ value, onChange }) {
  return (
    <div className="field">
      <span>Image</span>
      <div className="image-picker">
        {imageOptions.map((src) => (
          <button key={src} className={src === value ? 'active' : ''} type="button" onClick={() => onChange(src)}>
            <img src={asset(src)} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
