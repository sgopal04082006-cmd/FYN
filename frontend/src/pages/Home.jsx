import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './home.css'

// navbar will show a bookmark icon and a Logout action

// recentLocations will be derived from fetched homes to avoid showing fake data

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
  const [homes, setHomes] = useState([])
  const [activeSlides, setActiveSlides] = useState({})
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate()

  // bookmarked home ids (persisted)
  const [bookmarked, setBookmarked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fyn_bookmarks') || '[]')
    } catch {
      return []
    }
  })

  const [showBookmarks, setShowBookmarks] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('fyn_token')
    const role = localStorage.getItem('fyn_role')
    if (!token) {
      navigate('/login/tenant')
      return
    }
    if (role === 'owner') {
      navigate('/owner/add')
      return
    }
    if (role !== 'tenant') {
      navigate('/login/tenant')
    }
  }, [navigate])

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
        const response = await fetch(`${API_BASE}/api/houses/getHouse`)
        const data = await response.json().catch(() => ({}))
        if (response.ok && Array.isArray(data.data)) {
          setHomes(data.data)
          setActiveSlides(Object.fromEntries(data.data.map(home => [String(home._id), 0])))
        }
      } catch (error) {
        console.error('Failed to load homes', error)
      }
    }

    fetchHomes()
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('fyn_bookmarks', JSON.stringify(bookmarked))
    } catch {
      // ignore local storage write failures
    }
  }, [bookmarked])
  

  const applyFilters = () => {
    setQuery(searchInput)
    setAppliedRentRange(pendingRentRange)
    setAppliedFilters(pendingFilters)
    setOpenFilter('')
  }

  const filteredHomes = useMemo(() => {
    const searchValue = query.trim().toLowerCase()
    const base = homes.filter(home => {
      if (typeof home.rentAmount !== 'number') return false
      if (home.rentAmount < appliedRentRange.min || home.rentAmount > appliedRentRange.max) {
        return false
      }

      if (appliedFilters.balcony !== 'any') {
        const balconyValue = home.balcony?.toLowerCase()
        if (appliedFilters.balcony === 'with' && balconyValue !== 'yes') return false
        if (appliedFilters.balcony === 'without' && balconyValue !== 'no') return false
      }

      if (appliedFilters.furnished !== 'any') {
        const furnishedValue = home.furnished?.toLowerCase()
        if (appliedFilters.furnished === 'yes' && furnishedValue !== 'yes') return false
        if (appliedFilters.furnished === 'no' && furnishedValue !== 'no') return false
      }

      if (appliedFilters.bhkType !== 'any') {
        const targetBhk = appliedFilters.bhkType === 'studio' ? 'studio' : `${appliedFilters.bhkType} bhk`
        if (!home.bhk?.toLowerCase().includes(targetBhk)) return false
      }

      if (appliedFilters.floorType !== 'any' && home.floorType !== appliedFilters.floorType) {
        return false
      }

      if (!searchValue) return true
      const text = `${home.houseTitle} ${home.location} ${home.houseDescription} ${home.houseAddress} ${home.ownerName}`.toLowerCase()
      return text.includes(searchValue)
    })

    if (showBookmarks) {
      return base.filter(h => bookmarked.includes(String(h._id)))
    }

    return base
  }, [homes, query, appliedRentRange, appliedFilters, showBookmarks, bookmarked])

  const recentLocationsFromHomes = useMemo(() => {
    const counts = {}
    homes.forEach(h => {
      const loc = (h.location || '').trim()
      if (!loc) return
      counts[loc] = (counts[loc] || 0) + 1
    })

    const list = Object.entries(counts).map(([name, count]) => ({ name, count }))
    list.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    return list.slice(0, 8)
  }, [homes])

  const changeSlide = (id, direction) => {
    setActiveSlides(current => {
      const home = homes.find(h => String(h._id) === String(id))
      if (!home) return current
      const total = home.housePhotos?.length || 1
      const nextIndex = (Number(current[String(id)] || 0) + direction + total) % total
      return { ...current, [String(id)]: nextIndex }
    })
  }

  return (
    <div className="fyn-homepage">
      {/* NAVBAR */}
      <header className="fyn-navbar">
        <div className="brand-row">
          <img src="/fynlogo.jpeg" alt="FYN logo" className="logo-img" />
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
            <div key={String(home._id)} className="property-card">
              {/* Image Section */}
              <div className="card-image-wrapper">
                <img src={home.housePhotos?.[activeSlides[String(home._id)] || 0] || ''} alt={home.houseTitle} className="card-image" />

                <div className="image-nav">
                  <button onClick={() => changeSlide(home._id, -1)}>‹</button>
                  <button onClick={() => changeSlide(home._id, 1)}>›</button>
                </div>

                <button
                  className={`wishlist-btn ${bookmarked.includes(String(home._id)) ? 'bookmarked' : ''}`}
                  aria-label={bookmarked.includes(String(home._id)) ? 'Remove bookmark' : 'Add bookmark'}
                  onClick={() => {
                    setBookmarked(prev => {
                      const key = String(home._id)
                      if (prev.includes(key)) return prev.filter(id => id !== key)
                      return [...prev, key]
                    })
                  }}
                >
                  {bookmarked.includes(String(home._id)) ? '🔖' : '♡'}
                </button>

                <div className="rating-badge">{home.bhk} • {home.floorType}</div>
              </div>

              {/* Content Section */}
              <div className="card-content">
                <div className="card-header">
                  <h3>{home.houseTitle}</h3>
                  <span className="verified-badge">✓ Verified</span>
                </div>

                <p className="card-location">📍 {home.location}</p>

                <div className="amenities">
                  <span className="amenity-tag">{home.furnished} Furnished</span>
                  <span className="amenity-tag">{home.balcony} Balcony</span>
                </div>

                <div className="card-footer">
                  <div className="price-info">
                    <strong>₹{home.rentAmount.toLocaleString()}</strong>
                    <span>Advance: ₹{home.advanceAmount.toLocaleString()}</span>
                  </div>
                  <Link to={`/${home._id}`} className="link">
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT LOCATIONS SECTION: render only when we have real data */}
      {recentLocationsFromHomes.length > 0 && (
        <section id="recently-added" className="section">
          <div className="section-header">
            <span className="section-tag">Recently Added</span>
            <h2>New Listings Trending Now</h2>
            <p>Check out the newest rental properties in popular neighborhoods.</p>
          </div>

          <div className="locations-grid">
            {recentLocationsFromHomes.map(location => (
              <div key={location.name} className="location-card">
                <strong>{location.name}</strong>
                <p>{location.count} new homes</p>
              </div>
            ))}
          </div>
        </section>
      )}

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
