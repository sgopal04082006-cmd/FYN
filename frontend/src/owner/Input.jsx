import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../pages/home.css'

function Input() {
  const [formData, setFormData] = useState({
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerAddress: '',
    houseTitle: '',
    houseBhk: '2 BHK',
    furnished: 'Yes',
    balcony: 'Yes',
    floorType: 'Upper Floor',
    houseAddress: '',
    houseDescription: '',
  })
  const [ownerPhoto, setOwnerPhoto] = useState(null)
  const [housePhoto, setHousePhoto] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const { name, files } = event.target
    if (!files || files.length === 0) return

    if (name === 'ownerPhoto') {
      setOwnerPhoto(files[0])
    } else if (name === 'housePhoto') {
      setHousePhoto(files[0])
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (
      !formData.ownerName ||
      !formData.ownerEmail ||
      !formData.ownerPhone ||
      !formData.ownerAddress ||
      !formData.houseAddress ||
      !formData.houseBhk
    ) {
      setError('Please fill in the required fields for owner and house details.')
      return
    }

    const payload = {
      ...formData,
      ownerPhoto: ownerPhoto ? ownerPhoto.name : 'No owner photo selected',
      housePhoto: housePhoto ? housePhoto.name : 'No house photo selected',
    }

    console.log('Owner listing submitted:', payload)
    setSuccess('House details submitted successfully. Thank you!')
  }

  return (
    <div className="owner-input-page">
      <div className="search-panel owner-input-card">
        <div className="owner-input-header">
          <div>
            <h1 className="section-header-title">Add Your House Details</h1>
            <p className="section-description">
              Share information about your house and yourself so tenants can connect with you.
            </p>
          </div>
          <Link to="/" className="btn-secondary">
            Back to Home
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
            <label htmlFor="ownerEmail">Owner Gmail ID</label>
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
                placeholder="+91 90000 00000"
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

          <div className="owner-input-grid">
            <div className="search-input-wrapper">
              <label htmlFor="ownerPhoto">Owner photo</label>
              <input
                id="ownerPhoto"
                name="ownerPhoto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {ownerPhoto && <p className="file-note">{ownerPhoto.name}</p>}
            </div>

            <div className="search-input-wrapper">
              <label htmlFor="housePhoto">Photo of the house</label>
              <input
                id="housePhoto"
                name="housePhoto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {housePhoto && <p className="file-note">{housePhoto.name}</p>}
            </div>
          </div>

          {error && <div className="field-error">{error}</div>}
          {success && <div className="field-success">{success}</div>}

          <button type="submit" className="btn-primary">
            Submit house details
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '24px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '900px',
    padding: '32px',
    borderRadius: '24px',
    backgroundColor: '#ffffff',
    boxShadow: '0 30px 90px rgba(15, 23, 42, 0.08)',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '24px',
    marginBottom: '28px',
  },
  title: {
    margin: 0,
    fontSize: '2rem',
    fontWeight: 700,
    color: '#111827',
  },
  subtitle: {
    margin: '10px 0 0',
    color: '#4b5563',
    lineHeight: 1.6,
  },
  topLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: 600,
  },
  form: {
    display: 'grid',
    gap: '20px',
  },
  fieldGroup: {
    display: 'grid',
    gap: '10px',
  },
  label: {
    color: '#374151',
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '14px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '14px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
    resize: 'vertical',
  },
  fileInput: {
    width: '100%',
  },
  fileNote: {
    margin: '8px 0 0',
    color: '#6b7280',
    fontSize: '0.95rem',
  },
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  error: {
    padding: '14px',
    borderRadius: '14px',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    fontSize: '0.95rem',
  },
  success: {
    padding: '14px',
    borderRadius: '14px',
    backgroundColor: '#d1fae5',
    color: '#166534',
    fontSize: '0.95rem',
  },
  button: {
    width: '100%',
    padding: '16px',
    borderRadius: '14px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
}

export default Input
