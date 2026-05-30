import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { featuredHomes } from '../data/homes'
import './home.css'

// navbar will show a bookmark icon and a Logout action

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
  const [searchInput, setSearchInput] = useState('')
  const [query, setQuery] = useState('')
  const [pendingRentRange, setPendingRentRange] = useState({ min: 0, max: 25000 })
  const [pendingFilters, setPendingFilters] = useState({ balcony: 'any', furnished: 'any', bhkType: 'any', floorType: 'any' })
  const [appliedRentRange, setAppliedRentRange] = useState({ min: 0, max: 25000 })
  const [appliedFilters, setAppliedFilters] = useState({ balcony: 'any', furnished: 'any', bhkType: 'any', floorType: 'any' })
  const [openFilter, setOpenFilter] = useState('')
  const [activeSlides, setActiveSlides] = useState(() =>
    Object.fromEntries(featuredHomes.map(home => [home.id, 0]))
  )
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [page, setPage] = useState('login');
  const navigate = useNavigate()

  // bookmarked home ids (persisted)
  const [bookmarked, setBookmarked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fyn_bookmarks') || '[]')
    } catch (e) {
      return []
    }
  })

  const [showBookmarks, setShowBookmarks] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('fyn_bookmarks', JSON.stringify(bookmarked))
    } catch (e) {}
  }, [bookmarked])
  

  const applyFilters = () => {
    setQuery(searchInput)
    setAppliedRentRange(pendingRentRange)
    setAppliedFilters(pendingFilters)
    setOpenFilter('')
  }

  const filteredHomes = useMemo(() => {
    const searchValue = query.trim().toLowerCase()
    const base = featuredHomes.filter(home => {
      const priceValue = Number(home.price.replace(/[^0-9]/g, ''))
      if (priceValue < appliedRentRange.min || priceValue > appliedRentRange.max) {
        return false
      }

      if (appliedFilters.balcony === 'with' && !home.amenities.some(a => /balcony/i.test(a))) {
        return false
      }
      if (appliedFilters.balcony === 'without' && home.amenities.some(a => /balcony/i.test(a))) {
        return false
      }

      if (appliedFilters.furnished === 'yes' && !home.amenities.some(a => /furnished/i.test(a))) {
        return false
      }
      if (appliedFilters.furnished === 'no' && home.amenities.some(a => /furnished/i.test(a))) {
        return false
      }

      if (appliedFilters.bhkType !== 'any') {
        const bhkKey = appliedFilters.bhkType === 'studio' ? 'studio' : `${appliedFilters.bhkType} bhk`
        if (!home.amenities.some(a => a.toLowerCase().includes(bhkKey))) {
          return false
        }
      }

      if (appliedFilters.floorType !== 'any' && home.floorType !== appliedFilters.floorType) {
        return false
      }

      if (!searchValue) return true
      const text = `${home.title} ${home.location} ${home.description} ${home.address} ${home.houseType} ${home.owner.name}`.toLowerCase()
      const amenities = home.amenities.join(' ').toLowerCase()
      return text.includes(searchValue) || amenities.includes(searchValue)
    })

    if (showBookmarks) {
      return base.filter(h => bookmarked.includes(h.id))
    }

    return base
  }, [query, appliedRentRange, appliedFilters, showBookmarks, bookmarked])

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
          <button
            className={`nav-bookmark ${showBookmarks ? 'active' : ''}`}
            title="Show bookmarked homes"
            onClick={() => setShowBookmarks(s => !s)}
          >
            🔖
          </button>

          <p
            onClick={() => {
              localStorage.removeItem('fyn_token')
              localStorage.removeItem('fyn_user')
              navigate('/')
            }}
            className={`nav-link logout-link`}
          >
            Logout
          </p>
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
            <button
              className={`mobile-bookmark ${showBookmarks ? 'active' : ''}`}
              onClick={() => setShowBookmarks(s => !s)}
            >
              🔖 Bookmarks
            </button>
            <a href="#" onClick={() => { localStorage.removeItem('fyn_token'); localStorage.removeItem('fyn_user'); navigate('/')}}>Logout</a>
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
              <label htmlFor="location">Location, owner, or keyword</label>
              <input
                id="location"
                type="text"
                placeholder="Enter city, district, or owner name"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyFilters()}
              />
            </div>

            <div className="filter-buttons">
              <button
                type="button"
                className={`filter-btn ${openFilter === 'rent' ? 'active' : ''}`}
                onClick={() => setOpenFilter(openFilter === 'rent' ? '' : 'rent')}
              >
                Rent Range{pendingRentRange.min !== 0 || pendingRentRange.max !== 25000 ? `: ₹${pendingRentRange.min} - ₹${pendingRentRange.max}` : ''}
              </button>
              <button
                type="button"
                className={`filter-btn ${openFilter === 'balcony' ? 'active' : ''}`}
                onClick={() => setOpenFilter(openFilter === 'balcony' ? '' : 'balcony')}
              >
                Balcony{pendingFilters.balcony !== 'any' ? `: ${pendingFilters.balcony === 'with' ? 'With' : 'Without'}` : ''}
              </button>
              <button
                type="button"
                className={`filter-btn ${openFilter === 'furnished' ? 'active' : ''}`}
                onClick={() => setOpenFilter(openFilter === 'furnished' ? '' : 'furnished')}
              >
                Furnished{pendingFilters.furnished !== 'any' ? `: ${pendingFilters.furnished === 'yes' ? 'Yes' : 'No'}` : ''}
              </button>
              <button
                type="button"
                className={`filter-btn ${openFilter === 'bhk' ? 'active' : ''}`}
                onClick={() => setOpenFilter(openFilter === 'bhk' ? '' : 'bhk')}
              >
                BHK Type{pendingFilters.bhkType !== 'any' ? `: ${pendingFilters.bhkType === 'studio' ? 'Studio' : `${pendingFilters.bhkType} BHK`}` : ''}
              </button>
              <button
                type="button"
                className={`filter-btn ${openFilter === 'floor' ? 'active' : ''}`}
                onClick={() => setOpenFilter(openFilter === 'floor' ? '' : 'floor')}
              >
                Floor Type{pendingFilters.floorType !== 'any' ? `: ${pendingFilters.floorType}` : ''}
              </button>
              <button
                type="button"
                className="filter-btn"
                onClick={() => {
                  setPendingFilters({ balcony: 'any', furnished: 'any', bhkType: 'any', floorType: 'any' })
                  setPendingRentRange({ min: 0, max: 25000 })
                  setAppliedFilters({ balcony: 'any', furnished: 'any', bhkType: 'any', floorType: 'any' })
                  setAppliedRentRange({ min: 0, max: 25000 })
                  setQuery('')
                  setSearchInput('')
                  setOpenFilter('')
                }}
              >
                Clear Filters
              </button>
            </div>

            {openFilter === 'rent' && (
              <div className="filter-panel">
                <div className="filter-row">
                  <label htmlFor="minRent">Min Rent</label>
                  <input
                    id="minRent"
                    type="number"
                    min="0"
                    value={pendingRentRange.min}
                    onChange={e => {
                      const normalized = e.target.value.replace(/^0+(?=\d)/, '')
                      setPendingRentRange(prev => ({
                        ...prev,
                        min: normalized === '' ? 0 : Number(normalized),
                      }))
                    }}
                  />
                </div>
                <div className="filter-row">
                  <label htmlFor="maxRent">Max Rent</label>
                  <input
                    id="maxRent"
                    type="number"
                    min="0"
                    value={pendingRentRange.max}
                    onChange={e => {
                      const normalized = e.target.value.replace(/^0+(?=\d)/, '')
                      setPendingRentRange(prev => ({
                        ...prev,
                        max: normalized === '' ? 0 : Number(normalized),
                      }))
                    }}
                  />
                </div>
                <p className="filter-note">
                  Only homes with rent between ₹{pendingRentRange.min.toLocaleString()} and ₹{pendingRentRange.max.toLocaleString()} will show after pressing Search Homes.
                </p>
              </div>
            )}

            {openFilter === 'balcony' && (
              <div className="filter-panel">
                <span className="filter-label">Balcony</span>
                <div className="filter-options">
                  {['any', 'with', 'without'].map(option => (
                    <button
                      key={option}
                      type="button"
                      className={`filter-option ${pendingFilters.balcony === option ? 'selected' : ''}`}
                      onClick={() => setPendingFilters(prev => ({ ...prev, balcony: option }))}
                    >
                      {option === 'any' ? 'Any' : option === 'with' ? 'With Balcony' : 'Without Balcony'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {openFilter === 'furnished' && (
              <div className="filter-panel">
                <span className="filter-label">Furnished</span>
                <div className="filter-options">
                  {['any', 'yes', 'no'].map(option => (
                    <button
                      key={option}
                      type="button"
                      className={`filter-option ${pendingFilters.furnished === option ? 'selected' : ''}`}
                      onClick={() => setPendingFilters(prev => ({ ...prev, furnished: option }))}
                    >
                      {option === 'any' ? 'Any' : option === 'yes' ? 'Furnished' : 'Unfurnished'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {openFilter === 'bhk' && (
              <div className="filter-panel">
                <span className="filter-label">BHK Type</span>
                <div className="filter-options">
                  {[
                    { value: 'any', label: 'Any' },
                    { value: 'studio', label: 'Studio' },
                    { value: '1', label: '1 BHK' },
                    { value: '2', label: '2 BHK' },
                    { value: '3', label: '3 BHK' },
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      className={`filter-option ${pendingFilters.bhkType === option.value ? 'selected' : ''}`}
                      onClick={() => setPendingFilters(prev => ({ ...prev, bhkType: option.value }))}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {openFilter === 'floor' && (
              <div className="filter-panel">
                <span className="filter-label">Floor Type</span>
                <div className="filter-options">
                  {['any', 'Ground Floor', 'Upper Floor', 'Top Floor', 'Duplex'].map(option => (
                    <button
                      key={option}
                      type="button"
                      className={`filter-option ${pendingFilters.floorType === option ? 'selected' : ''}`}
                      onClick={() => setPendingFilters(prev => ({ ...prev, floorType: option }))}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%' }}
              onClick={applyFilters}
            >
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

                <button
                  className={`wishlist-btn ${bookmarked.includes(home.id) ? 'bookmarked' : ''}`}
                  aria-label={bookmarked.includes(home.id) ? 'Remove bookmark' : 'Add bookmark'}
                  onClick={() => {
                    setBookmarked(prev => {
                      if (prev.includes(home.id)) return prev.filter(id => id !== home.id)
                      return [...prev, home.id]
                    })
                  }}
                >
                  {bookmarked.includes(home.id) ? '🔖' : '♡'}
                </button>

                <div className="rating-badge">{home.rating} ★ ({home.reviews})</div>

                
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
