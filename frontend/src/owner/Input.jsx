import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../pages/home.css'

function Input() {
  const navigate = useNavigate()

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
  const [ownerPhoto, setOwnerPhoto] = useState(null)
  const [housePhoto1, setHousePhoto1] = useState(null)
  const [housePhoto2, setHousePhoto2] = useState(null)
  const [housePhoto3, setHousePhoto3] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const role = localStorage.getItem('fyn_role')
    const token = localStorage.getItem('fyn_token')
    if (!token || role !== 'owner') {
      navigate('/login/owner')
    }
  }, [navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const { name, files } = event.target
    if (!files || files.length === 0) return

    if (name === 'ownerPhoto') {
      setOwnerPhoto(files[0])
    } else if (name === 'housePhoto1') {
      setHousePhoto1(files[0])
    } else if (name === 'housePhoto2') {
      setHousePhoto2(files[0])
    } else if (name === 'housePhoto3') {
      setHousePhoto3(files[0])
    }
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
      !ownerPhoto ||
      !housePhoto1 ||
      !housePhoto2 ||
      !housePhoto3
    ) {
      setError('Please fill in all required fields and upload owner photo plus three home images.')
      return
    }

    const payload = new FormData()
    payload.append('ownerName', formData.ownerName)
    payload.append('ownerEmail', formData.ownerEmail)
    payload.append('ownerPhone', formData.ownerPhone)
    payload.append('ownerAddress', formData.ownerAddress)
    payload.append('houseTitle', formData.houseTitle)
    payload.append('location', formData.location)
    payload.append('houseAddress', formData.houseAddress)
    payload.append('houseDescription', formData.houseDescription)
    payload.append('bhk', formData.houseBhk)
    payload.append('furnished', formData.furnished)
    payload.append('balcony', formData.balcony)
    payload.append('floorType', formData.floorType)
    payload.append('rentAmount', formData.rentAmount)
    payload.append('advanceAmount', formData.advanceAmount)
    payload.append('ownerPhoto', ownerPhoto)
    payload.append('housePhoto1', housePhoto1)
    payload.append('housePhoto2', housePhoto2)
    payload.append('housePhoto3', housePhoto3)

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      const token = localStorage.getItem('fyn_token')
      const response = await fetch(`${API_BASE}/api/houses/createHouse`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(data.message || 'Unable to submit house details.')
        return
      }

      setSuccess('House details submitted successfully. Thank you!')
      setFormData({
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
      setOwnerPhoto(null)
      setHousePhoto1(null)
      setHousePhoto2(null)
      setHousePhoto3(null)
    } catch (err) {
      setError('Unable to submit house details. Please try again later.')
      console.error(err)
    }
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
              <label htmlFor="housePhoto1">Home image 1</label>
              <input
                id="housePhoto1"
                name="housePhoto1"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {housePhoto1 && <p className="file-note">{housePhoto1.name}</p>}
            </div>
          </div>

          <div className="owner-input-grid">
            <div className="search-input-wrapper">
              <label htmlFor="housePhoto2">Home image 2</label>
              <input
                id="housePhoto2"
                name="housePhoto2"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {housePhoto2 && <p className="file-note">{housePhoto2.name}</p>}
            </div>

            <div className="search-input-wrapper">
              <label htmlFor="housePhoto3">Home image 3</label>
              <input
                id="housePhoto3"
                name="housePhoto3"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {housePhoto3 && <p className="file-note">{housePhoto3.name}</p>}
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

export default Input
