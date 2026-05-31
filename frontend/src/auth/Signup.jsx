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
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>{subtitle}</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label} htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your full name"
            style={styles.input}
            autoComplete="name"
          />

          <label style={styles.label} htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            style={styles.input}
            autoComplete="email"
          />

          {isOwner && (
            <>
              <label style={styles.label} htmlFor="phone">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="Enter your phone number"
                style={styles.input}
                autoComplete="tel"
              />

              <label style={styles.label} htmlFor="address">
                Address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Street, city, state"
                style={styles.input}
                autoComplete="street-address"
              />
            </>
          )}

          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a password"
            style={styles.input}
            autoComplete="new-password"
          />

          <label style={styles.label} htmlFor="confirm-password">
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm your password"
            style={styles.input}
            autoComplete="new-password"
          />

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.text}>Already have an account?</span>
          <Link to={loginLink} style={styles.link}>
            Sign in
          </Link>
        </div>
        <div style={styles.altFooter}>
          <Link to={alternateLink} style={styles.link}>
            {alternateText}
          </Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#f3f4f6',
  },
  card: {
    width: '100%',
    maxWidth: '520px',
    padding: '36px',
    borderRadius: '18px',
    backgroundColor: '#ffffff',
    boxShadow: '0 24px 80px rgba(15, 23, 42, 0.08)',
  },
  title: {
    margin: 0,
    fontSize: '1.95rem',
    fontWeight: 700,
    color: '#111827',
  },
  subtitle: {
    marginTop: '10px',
    marginBottom: '24px',
    color: '#6b7280',
    lineHeight: 1.6,
  },
  form: {
    display: 'grid',
    gap: '16px',
  },
  label: {
    color: '#374151',
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  error: {
    padding: '12px',
    borderRadius: '12px',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    fontSize: '0.95rem',
  },
  footer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  altFooter: {
    marginTop: '14px',
    textAlign: 'center',
  },
  text: {
    color: '#6b7280',
    fontSize: '0.95rem',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: 600,
  },
}

export default Signup
