import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { featuredHomes } from '../data/homes'
import './home.css'

const Detailed = () => {
  const { id } = useParams()
  const home = useMemo(
    () => featuredHomes.find(item => String(item.id) === String(id)),
    [id]
  )
  const [mainImage, setMainImage] = useState('')

  useEffect(() => {
    if (home?.images?.length) {
      setMainImage(home.images[0])
    }
  }, [home])

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
            <img src={mainImage} alt={home.title} className="detail-main-image" />
            <div className="detail-thumbnails">
              {home.images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className={`detail-thumb ${image === mainImage ? 'active' : ''}`}
                  onClick={() => setMainImage(image)}
                >
                  <img src={image} alt={`${home.title} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="detail-meta">
            <div className="detail-badges">
              <span className="detail-badge">{home.available ? 'Available Now' : 'Booked'}</span>
              <span className="detail-badge secondary">{home.rating} ★ ({home.reviews})</span>
            </div>

            <h1>{home.title}</h1>
            <p className="detail-location">📍 {home.location}</p>
            <div className="detail-price-block">
              <strong>{home.price}</strong>
              <span>{home.advance}</span>
            </div>
            <p className="detail-address">{home.address}</p>
            <p className="detail-description">{home.description}</p>

            <div className="detail-amenities">
              {home.amenities.map(amenity => (
                <span key={amenity}>{amenity}</span>
              ))}
            </div>

            {home.extras?.length > 0 && (
              <div className="detail-amenities extra-amenities">
                {home.extras.map(extra => (
                  <span key={extra}>{extra}</span>
                ))}
              </div>
            )}

            <div className="detail-owner-card">
              <h2>Owner Details</h2>
              <p>
                <strong>Name:</strong> {home.owner.name}
              </p>
              <p>
                <strong>Phone:</strong> {home.owner.phone}
              </p>
              <p>
                <strong>Email:</strong> {home.owner.email}
              </p>
              <p>
                <strong>Owner Address:</strong> {home.owner.address}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Detailed
