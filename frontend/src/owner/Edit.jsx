import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import '../pages/home.css'

function EditHouse() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerAddress: '',
    houseTitle: '',
    location: '',
    houseBhk: '2 BHK',
    furnished: 'Yes',
    balcony: 'Yes',
    floorType: 'Upper Floor',
    rentAmount: '',
    advanceAmount: '',
    houseAddress: '',
    houseDescription: '',
  })

  useEffect(() => {
    const token = localStorage.getItem('fyn_token')
    const role = localStorage.getItem('fyn_role')
    if (!token || role !== 'owner') {
      navigate('/login/owner')
      return
    }

    const fetchHouse = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
        const response = await fetch(`${API_BASE}/api/houses/getHouse/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json().catch(() => ({}))
        if (response.ok && data.data) {
          const house = data.data
          setFormData({
            ownerName: house.ownerName || '',
            ownerEmail: house.ownerEmail || '',
            ownerPhone: house.ownerPhone || '',
            ownerAddress: house.ownerAddress || '',
            houseTitle: house.houseTitle || '',
            location: house.location || '',
            houseBhk: house.bhk || '2 BHK',
            furnished: house.furnished || 'Yes',
            balcony: house.balcony || 'Yes',
            floorType: house.floorType || 'Upper Floor',
            rentAmount: house.rentAmount?.toString() || '',
            advanceAmount: house.advanceAmount?.toString() || '',
            houseAddress: house.houseAddress || '',
            houseDescription: house.houseDescription || '',
          })
        } else {
          setError(data.message || 'Failed to load house data')
        }
      } catch (err) {
        setError('Failed to load house data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchHouse()
  }, [id, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (
      !formData.ownerName ||
      !formData.ownerEmail ||
      !formData.ownerPhone ||
      !formData.ownerAddress ||
      !formData.houseTitle ||
      !formData.location ||
      !formData.rentAmount ||
      !formData.advanceAmount ||
      !formData.houseAddress ||
      !formData.houseBhk ||
      !formData.furnished ||
      !formData.balcony ||
      !formData.floorType
    ) {
      setError('Please fill in all required fields.')
      return
    }

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      const token = localStorage.getItem('fyn_token')
      const response = await fetch(`${API_BASE}/api/houses/updateHouse/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ownerName: formData.ownerName,
          ownerEmail: formData.ownerEmail,
          ownerPhone: formData.ownerPhone,
          ownerAddress: formData.ownerAddress,
          houseTitle: formData.houseTitle,
          location: formData.location,
          houseAddress: formData.houseAddress,
          houseDescription: formData.houseDescription,
          bhk: formData.houseBhk,
          furnished: formData.furnished,
          balcony: formData.balcony,
          floorType: formData.floorType,
          rentAmount: Number(formData.rentAmount),
          advanceAmount: Number(formData.advanceAmount),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(data.message || 'Failed to update house')
        return
      }

      setSuccess('House updated successfully!')
      setTimeout(() => navigate('/owner/dashboard'), 1200)
    } catch (err) {
      setError('Failed to update house')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="owner-input-page">
        <p>Loading house details...</p>
      </div>
    )
  }

  return (
    <div className="owner-input-page">
      <div className="search-panel owner-input-card">
        <div className="owner-input-header">
          <div>
            <h1 className="section-header-title">Edit House Details</h1>
            <p className="section-description">
              Update your rental listing information below.
            </p>
          </div>
          <Link to="/owner/dashboard" className="btn-secondary">
            Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="owner-input-form">
          <div className="search-input-wrapper">
            <label htmlFor="ownerName">Owner name</label>
            <input
              id="ownerName"
              name="ownerName"
              type="text"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="Your full name"
              autoComplete="name"
            />
          </div>

          <div className="search-input-wrapper">
            <label htmlFor="ownerEmail">Owner email</label>
            <input
              id="ownerEmail"
              name="ownerEmail"
              type="email"
              value={formData.ownerEmail}
              onChange={handleChange}
              placeholder="you@gmail.com"
              autoComplete="email"
            />
          </div>

          <div className="owner-input-grid">
            <div className="search-input-wrapper">
              <label htmlFor="ownerPhone">Phone number</label>
              <input
                id="ownerPhone"
                name="ownerPhone"
                type="tel"
                value={formData.ownerPhone}
                onChange={handleChange}
                placeholder="Your phone number"
                autoComplete="tel"
              />
            </div>

            <div className="search-input-wrapper">
              <label htmlFor="ownerAddress">Owner address</label>
              <input
                id="ownerAddress"
                name="ownerAddress"
                type="text"
                value={formData.ownerAddress}
                onChange={handleChange}
                placeholder="Street, city, state"
                autoComplete="street-address"
              />
            </div>
          </div>

          <div className="search-input-wrapper">
            <label htmlFor="houseTitle">House title</label>
            <input
              id="houseTitle"
              name="houseTitle"
              type="text"
              value={formData.houseTitle}
              onChange={handleChange}
              placeholder="Example: Spacious 2BHK near lake"
            />
          </div>

          <div className="search-input-wrapper">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, neighborhood or landmark"
            />
          </div>

          <div className="owner-input-grid">
            <div className="search-input-wrapper">
              <label htmlFor="rentAmount">Monthly rent</label>
              <input
                id="rentAmount"
                name="rentAmount"
                type="number"
                min="0"
                value={formData.rentAmount}
                onChange={handleChange}
                placeholder="Rent amount"
              />
            </div>

            <div className="search-input-wrapper">
              <label htmlFor="advanceAmount">Advance amount</label>
              <input
                id="advanceAmount"
                name="advanceAmount"
                type="number"
                min="0"
                value={formData.advanceAmount}
                onChange={handleChange}
                placeholder="Advance amount"
              />
            </div>
          </div>

          <div className="owner-input-grid">
            <div className="search-input-wrapper">
              <label htmlFor="houseBhk">BHK</label>
              <select
                id="houseBhk"
                name="houseBhk"
                value={formData.houseBhk}
                onChange={handleChange}
              >
                <option>Studio</option>
                <option>1 BHK</option>
                <option>2 BHK</option>
                <option>3 BHK</option>
                <option>4 BHK</option>
              </select>
            </div>

            <div className="search-input-wrapper">
              <label htmlFor="furnished">Furnished</label>
              <select
                id="furnished"
                name="furnished"
                value={formData.furnished}
                onChange={handleChange}
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>

          <div className="owner-input-grid">
            <div className="search-input-wrapper">
              <label htmlFor="balcony">Balcony</label>
              <select
                id="balcony"
                name="balcony"
                value={formData.balcony}
                onChange={handleChange}
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            <div className="search-input-wrapper">
              <label htmlFor="floorType">Floor type</label>
              <select
                id="floorType"
                name="floorType"
                value={formData.floorType}
                onChange={handleChange}
              >
                <option>Ground Floor</option>
                <option>Upper Floor</option>
                <option>Top Floor</option>
                <option>Duplex</option>
              </select>
            </div>
          </div>

          <div className="search-input-wrapper">
            <label htmlFor="houseAddress">House address</label>
            <input
              id="houseAddress"
              name="houseAddress"
              type="text"
              value={formData.houseAddress}
              onChange={handleChange}
              placeholder="House no. 12, MG Road, Bangalore"
              autoComplete="street-address"
            />
          </div>

          <div className="search-input-wrapper">
            <label htmlFor="houseDescription">House description</label>
            <textarea
              id="houseDescription"
              name="houseDescription"
              value={formData.houseDescription}
              onChange={handleChange}
              placeholder="Add a short description for your house"
              className="owner-input-textarea"
              rows={4}
            />
          </div>

          {error && <div className="field-error">{error}</div>}
          {success && <div className="field-success">{success}</div>}

          <button type="submit" className="btn-primary">
            Save changes
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditHouse
