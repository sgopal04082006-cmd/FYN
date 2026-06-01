import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

function Signup() {
  const { role } = useParams()
  const isOwner = role === 'owner'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (isOwner && (!phoneNumber || !address)) {
      setError('Owner signup requires phone number and address.')
      return
    }

    setLoading(true)

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      const endpoint = isOwner ? '/api/owners/register' : '/api/users/register'
      const body = isOwner
        ? { name, email, password, phoneNumber, address }
        : { name, email, password }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data.message || 'Signup failed. Please try again.')
        return
      }

      const data = await response.json()
      if (data.token) {
        localStorage.setItem('fyn_token', data.token)
        if (isOwner && data.owner) {
          localStorage.setItem('fyn_user', JSON.stringify({ ...data.owner, role: 'owner' }))
          localStorage.setItem('fyn_role', 'owner')
          navigate('/owner/add')
        } else if (!isOwner && data.user) {
          localStorage.setItem('fyn_user', JSON.stringify({ ...data.user, role: 'tenant' }))
          localStorage.setItem('fyn_role', 'tenant')
          navigate('/home')
        } else {
          navigate(isOwner ? '/login/owner' : '/login/tenant')
        }
      } else {
        navigate(isOwner ? '/login/owner' : '/login/tenant')
      }
    } catch (fetchError) {
      setError('Unable to connect. Please try again later.')
      console.error(fetchError)
    } finally {
      setLoading(false)
    }
  }

  const title = isOwner ? 'Create owner account' : 'Create tenant account'
  const subtitle = isOwner
    ? 'Register as an owner to add home details and manage your portal.'
    : 'Create a tenant account to browse homes and access the tenant portal.'
  const loginLink = isOwner ? '/login/owner' : '/login/tenant'
  const alternateLink = isOwner ? '/signup/tenant' : '/signup/owner'
  const alternateText = isOwner ? 'Sign up as tenant instead' : 'Sign up as owner instead'

  return (
    <main className="screen">
      <div className="phone">
        <header className="top">
          <div className="logo-wrap">
            <img src="/fynlogo.jpeg" alt="FYN logo" className="logo" />
          </div>
        </header>

        <section className="intro">
          <p className="tagline">Welcome to FYN</p>
          <h1 className="title">{title}</h1>
          <p className="subtitle">{subtitle}</p>
        </section>

        <section className="card">
          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field" htmlFor="name">
              <span className="label">Full name</span>
              <div className="input-group">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>
            </label>

            <label className="field" htmlFor="email">
              <span className="label">Email address</span>
              <div className="input-group">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </label>

            {isOwner && (
              <>
                <label className="field" htmlFor="phone">
                  <span className="label">Phone number</span>
                  <div className="input-group">
                    <input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(event) => setPhoneNumber(event.target.value)}
                      placeholder="Enter your phone number"
                      autoComplete="tel"
                    />
                  </div>
                </label>

                <label className="field" htmlFor="address">
                  <span className="label">Address</span>
                  <div className="input-group">
                    <input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      placeholder="Street, city, state"
                      autoComplete="street-address"
                    />
                  </div>
                </label>
              </>
            )}

            <label className="field" htmlFor="password">
              <span className="label">Password</span>
              <div className="input-group">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
              </div>
            </label>

            <label className="field" htmlFor="confirm-password">
              <span className="label">Confirm password</span>
              <div className="input-group">
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
              </div>
            </label>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="bottom">
            Already have an account?{' '}
            <Link to={loginLink} className="register">
              Sign in
            </Link>
          </div>

          <div className="bottom">
            <Link to={alternateLink} className="register">
              {alternateText}
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Signup
