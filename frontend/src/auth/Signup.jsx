import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      const response = await fetch(`${API_BASE}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data.message || 'Signup failed. Please try again.')
        return
      }

      const data = await response.json()
      console.log('Signup successful', data)
      // if the backend returned a token, store it and auto-login
      if (data.token) {
        localStorage.setItem('fyn_token', data.token)
        if (data.user) localStorage.setItem('fyn_user', JSON.stringify(data.user))
        navigate('/home')
      } else {
        navigate('/login')
      }
    } catch (fetchError) {
      setError('Unable to connect. Please try again later.')
      console.error(fetchError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create your account</h1>
        <p style={styles.subtitle}>Join now and start managing your listings.</p>

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
          <Link to="/login" style={styles.link}>
            Sign in
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
    maxWidth: '460px',
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
