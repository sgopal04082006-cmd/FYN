import { useState } from 'react'
import { Link } from 'react-router-dom'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!email) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data.message || 'Unable to send reset instructions.')
        return
      }

      setMessage('If this email is registered, a password reset link has been sent.')
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
        <h1 style={styles.title}>Forgot your password?</h1>
        <p style={styles.subtitle}>
          Enter your email and we’ll send you instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label} htmlFor="forgot-email">
            Email address
          </label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            style={styles.input}
            autoComplete="email"
          />

          {error && <div style={styles.error}>{error}</div>}
          {message && <div style={styles.success}>{message}</div>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Sending…' : 'Send reset instructions'}
          </button>
        </form>

        <div style={styles.footer}>
          <Link to="/login" style={styles.link}>
            Back to login
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
  success: {
    padding: '12px',
    borderRadius: '12px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
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

export default ForgotPassword
