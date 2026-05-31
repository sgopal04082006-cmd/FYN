import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../pages/home.css'

function Dashboard() {
  const navigate = useNavigate()
  const [houses, setHouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('fyn_token')
    const role = localStorage.getItem('fyn_role')
    if (!token || role !== 'owner') {
      navigate('/login/owner')
      return
    }

    fetchHouses()
  }, [navigate])

  const fetchHouses = async () => {
    try {
      setLoading(true)
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      const token = localStorage.getItem('fyn_token')
      const response = await fetch(`${API_BASE}/api/houses/myHouses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))
      if (response.ok && Array.isArray(data.data)) {
        setHouses(data.data)
      } else {
        setError(data.message || 'Failed to load houses')
      }
    } catch (err) {
      setError('Failed to load houses')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id)
      return
    }

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      const token = localStorage.getItem('fyn_token')
      const response = await fetch(`${API_BASE}/api/houses/deleteHouse/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setHouses(houses.filter(h => h._id !== id))
        setDeleteConfirm(null)
      } else {
        const data = await response.json().catch(() => ({}))
        setError(data.message || 'Failed to delete house')
      }
    } catch (err) {
      setError('Failed to delete house')
      console.error(err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('fyn_token')
    localStorage.removeItem('fyn_user')
    localStorage.removeItem('fyn_role')
    navigate('/')
  }

  if (loading) {
    return (
      <div className="owner-dashboard-page">
        <p>Loading your houses...</p>
      </div>
    )
  }

  return (
    <div className="owner-dashboard-page">
      <header className="owner-dashboard-header">
        <div className="dashboard-header-left">
          <h1>Owner Dashboard</h1>
          <p>Manage your rental listings</p>
        </div>
        <div className="dashboard-header-right">
          <Link to="/owner/add" className="btn-primary">
            + Add New House
          </Link>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="owner-dashboard-content">
        {houses.length === 0 ? (
          <div className="empty-state">
            <h2>No houses listed yet</h2>
            <p>Start by adding your first property to the platform.</p>
            <Link to="/owner/add" className="btn-primary">
              Add Your First House
            </Link>
          </div>
        ) : (
          <div className="houses-list">
            {houses.map(house => (
              <div key={house._id} className="house-card-dashboard">
                <div className="house-image-section">
                  <img
                    src={house.housePhotos?.[0] || ''}
                    alt={house.houseTitle}
                    className="house-thumbnail"
                  />
                </div>

                <div className="house-info-section">
                  <h3>{house.houseTitle}</h3>
                  <p className="house-location">📍 {house.location}</p>
                  <p className="house-address">{house.houseAddress}</p>

                  <div className="house-meta">
                    <span className="meta-item">{house.bhk}</span>
                    <span className="meta-item">{house.furnished} Furnished</span>
                    <span className="meta-item">{house.balcony} Balcony</span>
                    <span className="meta-item">{house.floorType}</span>
                  </div>

                  <div className="house-pricing">
                    <strong>₹{house.rentAmount.toLocaleString()}</strong>
                    <span>Advance: ₹{house.advanceAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="house-actions">
                  <Link
                    to={`/owner/edit/${house._id}`}
                    className="btn-edit"
                  >
                    Edit
                  </Link>
                  <button
                    className={`btn-delete ${deleteConfirm === house._id ? 'confirm' : ''}`}
                    onClick={() => handleDelete(house._id)}
                  >
                    {deleteConfirm === house._id ? 'Confirm Delete' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .owner-dashboard-page {
          min-height: 100vh;
          background: #f8f9fa;
          padding: 24px;
        }

        .owner-dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding: 24px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .dashboard-header-left h1 {
          margin: 0;
          font-size: 1.8rem;
          color: #111827;
        }

        .dashboard-header-left p {
          margin: 4px 0 0;
          color: #6b7280;
          font-size: 0.95rem;
        }

        .dashboard-header-right {
          display: flex;
          gap: 12px;
        }

        .btn-primary {
          padding: 12px 20px;
          border-radius: 12px;
          background: #2563eb;
          color: white;
          text-decoration: none;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-primary:hover {
          background: #1d4ed8;
        }

        .btn-secondary {
          padding: 12px 20px;
          border-radius: 12px;
          background: white;
          color: #2563eb;
          border: 1px solid #2563eb;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #f3f4f6;
        }

        .error-message {
          padding: 16px;
          border-radius: 12px;
          background: #fee2e2;
          color: #b91c1c;
          margin-bottom: 24px;
        }

        .owner-dashboard-content {
          max-width: 1200px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 24px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .empty-state h2 {
          margin: 0 0 12px;
          color: #111827;
          font-size: 1.5rem;
        }

        .empty-state p {
          margin: 0 0 24px;
          color: #6b7280;
        }

        .houses-list {
          display: grid;
          gap: 20px;
        }

        .house-card-dashboard {
          display: grid;
          grid-template-columns: 200px 1fr 200px;
          gap: 24px;
          padding: 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          align-items: start;
        }

        .house-image-section {
          overflow: hidden;
          border-radius: 12px;
          height: 180px;
        }

        .house-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .house-info-section h3 {
          margin: 0 0 8px;
          font-size: 1.2rem;
          color: #111827;
        }

        .house-location {
          margin: 0 0 4px;
          color: #6b7280;
          font-size: 0.95rem;
        }

        .house-address {
          margin: 0 0 12px;
          color: #4b5563;
          font-size: 0.9rem;
        }

        .house-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
        }

        .meta-item {
          display: inline-block;
          padding: 4px 12px;
          background: #f3f4f6;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #374151;
        }

        .house-pricing {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .house-pricing strong {
          font-size: 1.2rem;
          color: #111827;
        }

        .house-pricing span {
          font-size: 0.85rem;
          color: #6b7280;
        }

        .house-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .btn-edit, .btn-delete {
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          text-align: center;
          font-size: 0.9rem;
        }

        .btn-edit {
          background: #3b82f6;
          color: white;
        }

        .btn-edit:hover {
          background: #2563eb;
        }

        .btn-delete {
          background: #ef4444;
          color: white;
        }

        .btn-delete:hover {
          background: #dc2626;
        }

        .btn-delete.confirm {
          background: #7c2d12;
        }

        @media (max-width: 768px) {
          .owner-dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .dashboard-header-right {
            width: 100%;
            flex-direction: column;
          }

          .dashboard-header-right > * {
            width: 100%;
          }

          .house-card-dashboard {
            grid-template-columns: 1fr;
          }

          .house-image-section {
            height: 250px;
          }

          .house-actions {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  )
}

export default Dashboard
