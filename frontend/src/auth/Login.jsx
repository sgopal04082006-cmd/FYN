import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data.message || 'Login failed. Please check your credentials.')
        return
      }

      const data = await response.json()
      console.log('Login successful', data)
      navigate('/')
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
        <h1 style={styles.title}>Sign in to your account</h1>
        <p style={styles.subtitle}>Enter your email and password to continue.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
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
            placeholder="Enter your password"
            style={styles.input}
            autoComplete="current-password"
          />

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          <Link to="/forgot-password" style={styles.link}>
            Forgot password?
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
    maxWidth: '420px',
    padding: '32px',
    borderRadius: '18px',
    backgroundColor: '#ffffff',
    boxShadow: '0 24px 80px rgba(15, 23, 42, 0.08)',
  },
  title: {
    margin: 0,
    fontSize: '1.9rem',
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
    textAlign: 'right',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: 600,
  },
}

export default Login
