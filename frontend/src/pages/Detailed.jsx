/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './home.css'

const Detailed = () => {
  const { id } = useParams()
  const [home, setHome] = useState(null)
  const [mainImage, setMainImage] = useState('')
  const [limitReached, setLimitReached] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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
    const viewKey = 'fyn_detail_views'
    const currentViews = Number(localStorage.getItem(viewKey) || 0)
    const nextViews = currentViews + 1
    localStorage.setItem(viewKey, String(nextViews))
    if (nextViews >= 50) {
      setLimitReached(true)
      setLoading(false)
      return
    }

    const fetchHome = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
        const response = await fetch(`${API_BASE}/api/houses/getHouse/${id}`)
        const data = await response.json().catch(() => ({}))
        if (response.ok && data.data) {
          setHome(data.data)
          setMainImage(data.data.housePhotos?.[0] || '')
        }
      } catch (error) {
        console.error('Failed to load home details', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHome()
  }, [id])

  if (loading) {
    return (
      <div className="section">
        <p>Loading listing details…</p>
      </div>
    )
  }

  if (limitReached) {
    return (
      <div className="section">
        <Link to="/" className="btn-secondary" style={{ marginBottom: '24px', display: 'inline-block' }}>
          ← Back to Home
        </Link>
        <h1>Free limit reached</h1>
        <p>You have reached the free detail view limit. Please upgrade or return to the home page.</p>
      </div>
    )
  }

  if (!home) {
    return (
      <div className="section">
        <Link to="/" className="btn-secondary" style={{ marginBottom: '24px', display: 'inline-block' }}>
          ← Back to Home
        </Link>
        <h1>Listing Not Found</h1>
        <p>The property you selected could not be found. Please return to the home page and choose another listing.</p>
      </div>
    )
  }

  return (
    <div className="detail-page">
      <section className="section detail-hero">
        <div className="detail-page-header">
          <Link to="/" className="btn-secondary detail-back">
            ← Back to Home
          </Link>
        </div>

        <div className="detail-grid">
          <div className="detail-image-section">
            <img src={mainImage} alt={home.houseTitle} className="detail-main-image" />
            <div className="detail-thumbnails">
              {home.housePhotos?.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className={`detail-thumb ${image === mainImage ? 'active' : ''}`}
                  onClick={() => setMainImage(image)}
                >
                  <img src={image} alt={`${home.houseTitle} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="detail-meta">
            <div className="detail-badges">
              <span className="detail-badge">Tenant view</span>
              <span className="detail-badge secondary">{home.bhk} • {home.floorType}</span>
            </div>

            <h1>{home.houseTitle}</h1>
            <p className="detail-location">📍 {home.location}</p>
            <div className="detail-price-block">
              <strong>₹{home.rentAmount.toLocaleString()}</strong>
              <span>Advance: ₹{home.advanceAmount.toLocaleString()}</span>
            </div>
            <p className="detail-address">{home.houseAddress}</p>
            <p className="detail-description">{home.houseDescription}</p>

            <div className="detail-amenities">
              <span>{home.furnished} furnished</span>
              <span>{home.balcony} balcony</span>
            </div>

            <div className="detail-owner-card">
              <h2>Owner Details</h2>
              <p>
                <strong>Name:</strong> {home.ownerName}
              </p>
              <p>
                <strong>Phone:</strong> {home.ownerPhone}
              </p>
              <p>
                <strong>Email:</strong> {home.ownerEmail}
              </p>
              <p>
                <strong>Owner Address:</strong> {home.ownerAddress}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Detailed
