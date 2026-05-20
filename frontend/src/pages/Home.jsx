import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './home.css'

const navItems = ['Home', 'Explore Houses', 'Saved', 'Post Property', 'Login']

const featuredHomes = [
  {
    id: 1,
    title: 'Lavender Townhouse',
    location: 'Indira Nagar, Pune',
    price: '₹ 16,500',
    advance: '₹ 20,000 advance',
    rating: 4.9,
    reviews: 62,
    available: true,
    amenities: ['2 BHK', 'Balcony', 'Furnished'],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 2,
    title: 'Premium Studio',
    location: 'Koramangala, Bangalore',
    price: '₹ 12,800',
    advance: '₹ 18,000 advance',
    rating: 4.7,
    reviews: 48,
    available: true,
    amenities: ['Studio', 'Gym Access', 'Furnished'],
    images: [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 3,
    title: 'Family Villa',
    location: 'Whitefield, Bangalore',
    price: '₹ 22,300',
    advance: '₹ 30,000 advance',
    rating: 4.8,
    reviews: 73,
    available: false,
    amenities: ['3 BHK', 'Private Parking', 'Garden'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    ],
  },
]

const recentLocations = [
  { name: 'Banashankari', count: 28 },
  { name: 'Andheri East', count: 21 },
  { name: 'Hitech City', count: 34 },
  { name: 'Jayanagar', count: 19 },
]

const whyChoose = [
  {
    title: 'Verified Owners',
    description: 'Every owner is verified and trusted. Real reviews from real tenants ensure transparency and security.',
  },
  {
    title: 'Easy Advance Management',
    description: 'Flexible advance payment options with clear terms. No hidden charges, just honest deals.',
  },
  {
    title: 'Smarter Renting',
    description: 'Advanced search filters, virtual tours, and instant messaging to find your perfect home faster.',
  },
]

const testimonials = [
  {
    name: 'Ananya Sharma',
    rating: 5,
    text: 'Finding my rental on FYN was effortless. The search experience felt premium and the property listings are genuine.',
  },
  {
    name: 'Rohit Patel',
    rating: 4.8,
    text: 'Beautiful interface, smooth booking flow, and excellent neighborhood recommendations. Highly recommended!',
  },
]

const Home = () => {
  const [query, setQuery] = useState('')
  const [activeSlides, setActiveSlides] = useState(() =>
    Object.fromEntries(featuredHomes.map(home => [home.id, 0]))
  )
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const filteredHomes = useMemo(
    () =>
      featuredHomes.filter(home =>
        `${home.title} ${home.location}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  )

  const changeSlide = (id, direction) => {
    setActiveSlides(current => {
      const home = featuredHomes.find(h => h.id === id)
      if (!home) return current
      const total = home.images.length
      const nextIndex = (current[id] + direction + total) % total
      return { ...current, [id]: nextIndex }
    })
  }

  return (
    <div className="fyn-homepage">
      {/* NAVBAR */}
      <header className="fyn-navbar">
        <div className="brand-row">
          <div className="logo-pill">FYN</div>
          <span className="brand-name">Find Your Nest</span>
        </div>

        <nav className="nav-links">
          {navItems.map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`}>
              {item}
            </a>
          ))}
        </nav>

        <button
          className="nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            {navItems.map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`}>
                {item}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-wrapper">
          {/* Left Copy */}
          <div className="hero-copy">
            <h1>Find Your Perfect Nest</h1>
            <p>Discover affordable homes, verified owners, and smarter renting all in one place. Your ideal rental is just a few clicks away.</p>

            <div className="hero-stats">
              <div className="stat">
                <strong>1.2K+</strong>
                <span>Verified Rentals</span>
              </div>
              <div className="stat">
                <strong>600+</strong>
                <span>Trusted Owners</span>
              </div>
            </div>

            <div className="hero-cta">
              <button className="btn-primary">Explore Homes</button>
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>

          {/* Right Search Panel */}
          <div className="search-panel">
            <h2>Search Rentals</h2>
            <p>Find your home by city, area, or property type</p>

            <div className="search-input-wrapper">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                placeholder="Enter city, district, or locality"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            <div className="filter-buttons">
              <button className="filter-btn">Rent Range</button>
              <button className="filter-btn">District</button>
              <button className="filter-btn">Furnished</button>
              <button className="filter-btn">Balcony</button>
              <button className="filter-btn">BHK Type</button>
              <button className="filter-btn">Floor Type</button>
              <button className="filter-btn">Pet Friendly</button>
              <button className="filter-btn">Shared Owner</button>
            </div>

            <div className="quick-filters">
              <span className="quick-filters-label">Quick Filters</span>
              <div className="filter-chips">
                <span className="chip">Near Me</span>
                <span className="chip">Low Rent</span>
                <span className="chip">No Advance</span>
                <span className="chip">1 BHK</span>
                <span className="chip">2 BHK</span>
                <span className="chip">Family Friendly</span>
                <span className="chip">Bachelor Friendly</span>
                <span className="chip">Pet Friendly</span>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%' }}>
              Search Homes
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED HOMES SECTION */}
      <section id="featured-homes" className="section">
        <div className="section-header">
          <span className="section-tag">Featured Homes</span>
          <h2>Luxury Rentals Designed for Comfort</h2>
          <p>Handpicked properties that offer the best value, location, and amenities.</p>
        </div>

        <div className="card-grid">
          {filteredHomes.map(home => (
            <div key={home.id} className="property-card">
              {/* Image Section */}
              <div className="card-image-wrapper">
                <img src={home.images[activeSlides[home.id]]} alt={home.title} className="card-image" />

                <div className="image-nav">
                  <button onClick={() => changeSlide(home.id, -1)}>‹</button>
                  <button onClick={() => changeSlide(home.id, 1)}>›</button>
                </div>

                <button className="wishlist-btn" aria-label="Add to wishlist">
                  ♥
                </button>

                <div className="rating-badge">{home.rating} ★ ({home.reviews})</div>

                <div className={`availability-badge ${home.available ? '' : 'booked'}`}>
                  {home.available ? '✓ Available Now' : '✗ Booked'}
                </div>
              </div>

              {/* Content Section */}
              <div className="card-content">
                <div className="card-header">
                  <h3>{home.title}</h3>
                  <span className="verified-badge">✓ Verified</span>
                </div>

                <p className="card-location">📍 {home.location}</p>

                <div className="amenities">
                  {home.amenities.map(amenity => (
                    <span key={amenity} className="amenity-tag">
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="card-footer">
                  <div className="price-info">
                    <strong>{home.price}</strong>
                    <span>{home.advance}</span>
                  </div>
                  <Link to={`/${home.id}`} className="link">
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT LOCATIONS SECTION */}
      <section id="recently-added" className="section">
        <div className="section-header">
          <span className="section-tag">Recently Added</span>
          <h2>New Listings Trending Now</h2>
          <p>Check out the newest rental properties in popular neighborhoods.</p>
        </div>

        <div className="locations-grid">
          {recentLocations.map(location => (
            <div key={location.name} className="location-card">
              <strong>{location.name}</strong>
              <p>{location.count} new homes</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE FYN SECTION */}
      <section id="why-fyn" className="section">
        <div className="section-header">
          <span className="section-tag">Why Choose FYN</span>
          <h2>Everything Tailored for Modern Tenants</h2>
          <p>Experience a smarter, simpler way to find your perfect home.</p>
        </div>

        <div className="why-grid">
          {whyChoose.map(item => (
            <div key={item.title} className="why-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="tenant-reviews" className="section">
        <div className="section-header">
          <span className="section-tag">Tenant Reviews</span>
          <h2>Loved by Thousands of Renters</h2>
          <p>See why tenants across the city trust FYN for their rental needs.</p>
        </div>

        <div className="reviews-grid">
          {testimonials.map(review => (
            <div key={review.name} className="review-card">
              <p className="review-text">"{review.text}"</p>
              <div className="review-author">
                <strong>{review.name}</strong>
                <span className="review-stars">{review.rating} ★</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DOWNLOAD SECTION */}
      <section id="download-app" className="section">
        <div className="download-section">
          <h2>Get FYN on Your Phone</h2>
          <p>Browse homes, message owners, and book viewings on the go.</p>
          <button className="download-btn">📱 Download App</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="fyn-footer">
        <strong>FYN - Find Your Nest</strong>
        <p>Making rental homes more accessible, transparent, and affordable for everyone.</p>
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#featured-homes">Featured</a>
          <a href="#recently-added">Recent</a>
          <a href="#why-fyn">Why FYN</a>
          <a href="#tenant-reviews">Reviews</a>
        </div>
      </footer>
    </div>
  )
}

export default Home
