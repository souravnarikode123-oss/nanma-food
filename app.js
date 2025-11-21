const { useEffect, useState } = React;

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTOohYzDFNPM85VJkRvXI9IJRA5VYVHo3edp9U7FDQeeZfuInFYQbXEaZaHaYnt885FLOm2XjG64K6b/pub?output=csv";

/**
 * Manage your catalogue directly inside Google Sheets:
 * 1. Add columns named: name, description, price, tag, image.
 * 2. File → Share → Publish to web → CSV, then replace the URL above.
 */
const fallbackProducts = [
  {
    id: 1,
    name: "Kerala Banana Chips",
    description:
      "Crispy, sun-ripened nendran bananas thinly sliced and fried in cold-pressed coconut oil.",
    price: "₹180 / 250g pack",
    tag: "House Favourite",
  },
  {
    id: 2,
    name: "Jackfruit Treats",
    description:
      "Naturally sweet jackfruit pieces slow-roasted to lock in aroma and fiber.",
    price: "₹220 / 200g jar",
    tag: "Seasonal",
  },
  {
    id: 3,
    name: "Coconut Jaggery Balls",
    description:
      "Hand-rolled laddus with roasted coconut, palm jaggery, and cardamom.",
    price: "₹150 / box (12 pcs)",
    tag: "Traditional",
  },
  {
    id: 4,
    name: "Spiced Tapioca Chips",
    description:
      "Thin slices of tapioca tossed in roasted chili flakes and curry leaves.",
    price: "₹160 / 200g pack",
    tag: "Snack Time",
  },
  {
    id: 5,
    name: "Banana Halwa",
    description:
      "Slow-cooked pazham halwa finished with ghee-roasted cashews for a glossy finish.",
    price: "₹240 / 400g slab",
    tag: "Festive",
  },
];

const splitCsvRow = (row) => {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i += 1) {
    const char = row[i];

    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
};

const csvTextToProducts = (csvText) => {
  if (!csvText || !csvText.trim()) {
    return [];
  }

  const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) {
    return [];
  }

  const headers = splitCsvRow(lines[0]).map((header, index) =>
    (header || `column_${index}`).trim().toLowerCase()
  );

  return lines.slice(1).reduce((acc, line, rowIndex) => {
    const cells = splitCsvRow(line);
    const record = headers.reduce((obj, header, cellIndex) => {
      if (!header) {
        return obj;
      }
      return { ...obj, [header]: cells[cellIndex] || "" };
    }, {});

    if (!record.name && !record.description) {
      return acc;
    }

    acc.push({
      id: record.id || `${rowIndex}-${record.name || "product"}`,
      name: record.name || `Product ${rowIndex + 1}`,
      description:
        record.description ||
        "Freshly prepared Nanma special straight from Kerala.",
      price: record.price || "Price on request",
      tag: record.tag || "New",
      image: record.image || "",
    });

    return acc;
  }, []);
};

const BrandMark = ({ text }) => (
  <span className="hero-nav__brand" aria-label={text}>
    {text.split("").map((char, index) =>
      char === " " ? (
        <span key={`space-${index}`} className="hero-nav__brand-space"></span>
      ) : (
        <span key={index} className="hero-nav__brand-box">
          {char}
        </span>
      )
    )}
  </span>
);

const Hero = () => {
  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (hero) {
      hero.classList.add("hero--ready");
    }
  }, []);

  return (
    <header className="hero" id="hero">
      <div className="hero__texture" aria-hidden="true"></div>
      <div className="hero__inner">
        <div className="hero-nav">
          <div className="hero-nav__logo">
            <BrandMark text="Nanma Foods" />
          </div>
          <nav className="hero-nav__links" aria-label="primary">
            <a href="#about">About</a>
            <a href="#products">Menu</a>
            <a href="#location">Location</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
        <div className="hero__content">
          <div className="hero__copy">
            <p className="hero__eyebrow">Kerala street-food artisans</p>
            <h1 className="hero__headline">
              You host the party — we bring the crunch.
            </h1>
            <p className="hero__body">
              Nanma Foods batches authentic Kerala snacks with sun-ripened
              bananas, coastal spices, and coconut oil freshness. Cater your
              get-togethers, gifting tables, or café shelves with vibrant
              flavours.
            </p>
            <div className="hero__actions">
              <a className="hero__cta hero__cta--primary" href="tel:+91 6238 210 448">
                Call to order
              </a>
              <a
                className="hero__cta hero__cta--ghost"
                href="#products"
                aria-label="See menu"
              >
                View menu
              </a>
              <div className="hero__contact-card">
                <span>WhatsApp us</span>
                <strong>+91 9496 433 930</strong>
              </div>
            </div>
          </div>
          <div className="hero__visual">
            <img src="./image/food.png" alt="Nanma Food Products platter" loading="lazy" />
            <div className="hero__stamp">
              <span className="hero__stamp-number">100%</span>
              <span className="hero__stamp-label">Kerala Taste</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const AboutSection = () => (
  <section className="about-section" id="about">
    <div className="about-section__text">
      
      <h2>Your Kerala kitchen-on-call.</h2>
      <p>
        Nanma Food Products is rooted in Thrissur, sourcing heirloom
        ingredients directly from growers. Each batch of banana chips, halwa,
        and savouries is fried in small kettles, ensuring uncompromised flavour
        and freshness for your celebrations.
      </p>
    </div>
    <ul className="about-section__stats" aria-label="Highlights">
      <li>
        <strong>45+</strong>
        Signature recipes
      </li>
      <li>
        <strong>500+</strong>
        Party orders served
      </li>
      <li>
        <strong>100%</strong>
        Natural ingredients
      </li>
    </ul>
  </section>
);

const ProductCard = ({ name, description, price, tag, image }) => (
  <article className="product-card">
    <span className="product-card__tag">{tag}</span>
    {image && (
      <div className="product-card__media">
        <img src={image} alt={`${name} by Nanma Foods`} loading="lazy" />
      </div>
    )}
    <h3 className="product-card__title">{name}</h3>
    <p className="product-card__desc">{description}</p>
    <p className="product-card__price">{price}</p>
  </article>
);

const ProductList = ({ items, loading, notice }) => (
  <section className="product-section" id="products">
    <div className="section-header">
      <h2>Fresh from Nanma</h2>
      <p>Explore our most-loved picks straight from Kerala&apos;s heartland.</p>
    </div>
    {notice && !loading && (
      <p
        className={`product-grid__status product-grid__status--${notice.tone}`}
      >
        {notice.message}
      </p>
    )}
    <div id="product-list" className="product-grid">
      {loading && (
        <article className="product-card product-card--placeholder">
          <div className="product-card__shimmer" aria-hidden="true"></div>
          <p>Loading menu from Google Sheets…</p>
        </article>
      )}
      {!loading && items.length === 0 && (
        <p className="product-grid__status product-grid__status--info">
          Menu will appear here as soon as products are added.
        </p>
      )}
      {!loading &&
        items.map((item) => <ProductCard key={item.id} {...item} />)}
    </div>
  </section>
);

const ContactSection = () => (
  <section className="contact-section" id="contact">
    <div>
      <h3>Say hello</h3>
      <p>Call, mail, or drop by for tasting sessions & bulk orders.</p>
    </div>
    <div className="contact-list">
      <div className="contact-item">
        <div className="contact-icon">📧</div>
        <span>hello@nanmafoods.com</span>
      </div>
      <div className="contact-item">
        <div className="contact-icon">📞</div>
        <span>+91 6238 210 448 (sreeraj c v)</span>
      </div>
      <div className="contact-item">
        <div className="contact-icon">📍</div>
        <span id="location">Kannur, taliparamba, Kerala</span>
      </div>
    </div>
    <div className="contact-map">
      <a
        href="https://maps.app.goo.gl/5M1eNLmz4ZBLMi4V7"
        target="_blank"
        rel="noopener noreferrer"
        className="contact-map__frame"
        aria-label="Open Nanma Foods location in Google Maps"
      >
        <iframe
          title="Nanma Foods location"
          src="https://www.google.com/maps?q=Kannur%2C%20Taliparamba%2C%20Kerala&output=embed"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </a>
      <a
        className="contact-map__link"
        href="https://maps.app.goo.gl/5M1eNLmz4ZBLMi4V7"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open live map
      </a>
    </div>
  </section>
);

const NanmaFoodsApp = () => {
  const [products, setProducts] = useState(fallbackProducts);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productNotice, setProductNotice] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const csvText = await response.text();
        const parsedProducts = csvTextToProducts(csvText);

        if (!cancelled) {
          if (parsedProducts.length > 0) {
            setProducts(parsedProducts);
            setProductNotice(null);
          } else {
            setProducts(fallbackProducts);
            setProductNotice({
              message:
                "Add rows to your Google Sheet (name, description, price, tag, image) to replace this sample menu.",
              tone: "info",
            });
          }
        }
      } catch (error) {
        if (!cancelled) {
          setProducts(fallbackProducts);
          setProductNotice({
            message:
              "Unable to reach Google Sheets right now. Showing our signature menu instead.",
            tone: "error",
          });
        }
      } finally {
        if (!cancelled) {
          setLoadingProducts(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="app-shell">
      <Hero />
      <main>
        <AboutSection />
        <ProductList
          items={products}
          loading={loadingProducts}
          notice={productNotice}
        />
        <ContactSection />
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} Nanma Food Products · Crafted with Kerala
        pride.
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<NanmaFoodsApp />);



