import { useNavigate } from 'react-router-dom'

const RoleSelect = () => {
  const navigate = useNavigate()

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>FYN</div>
          <div>
            <p style={styles.overline}>Welcome to FYN</p>
            <h1 style={styles.title}>Choose your login type</h1>
          </div>
        </div>

        <p style={styles.description}>
          Select whether you are a tenant or an owner to continue to the right sign-in page.
        </p>

        <div style={styles.options}>
          <button
            type="button"
            style={styles.buttonPrimary}
            onClick={() => navigate('/login/tenant')}
          >
            I am a tenant
          </button>
          <button
            type="button"
            style={styles.buttonSecondary}
            onClick={() => navigate('/login/owner')}
          >
            I am an owner
          </button>
        </div>

        <div style={styles.note}>
          If you already have an account, pick the correct role and sign in.
        </div>
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: '24px',
    background: 'radial-gradient(circle at top left, rgba(124, 58, 237, 0.18), transparent 22%),\n      radial-gradient(circle at 80% 20%, rgba(167, 139, 250, 0.22), transparent 18%),\n      linear-gradient(180deg, #f8f4ff 0%, #ede7ff 100%)',
  },
  card: {
    width: '100%',
    maxWidth: '480px',
    padding: '36px',
    borderRadius: '30px',
    background: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 30px 100px rgba(109, 40, 217, 0.16)',
    border: '1px solid rgba(124, 58, 237, 0.12)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    marginBottom: '28px',
  },
  logo: {
    width: '60px',
    height: '60px',
    borderRadius: '18px',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    color: '#fff',
    fontWeight: 800,
    fontSize: '1.25rem',
  },
  overline: {
    margin: 0,
    color: '#7c3aed',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  title: {
    margin: '8px 0 0',
    fontSize: '2rem',
    lineHeight: 1.1,
    color: '#1f2937',
  },
  description: {
    margin: '0 0 28px',
    color: '#4b5563',
    lineHeight: 1.75,
    fontSize: '1rem',
  },
  options: {
    display: 'grid',
    gap: '16px',
  },
  buttonPrimary: {
    width: '100%',
    padding: '16px 20px',
    borderRadius: '16px',
    border: 'none',
    background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  buttonSecondary: {
    width: '100%',
    padding: '16px 20px',
    borderRadius: '16px',
    border: '1px solid rgba(124, 58, 237, 0.24)',
    background: 'white',
    color: '#5b21b6',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  note: {
    marginTop: '24px',
    color: '#6b7280',
    fontSize: '0.95rem',
    lineHeight: 1.7,
  },
}

export default RoleSelect
