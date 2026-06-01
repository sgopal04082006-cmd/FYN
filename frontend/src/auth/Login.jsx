import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../pages/home.css';

const Login = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const loginType = role === 'owner' ? 'Owner' : 'Tenant';
  const subtitleText =
    loginType === 'Owner'
      ? 'Owner dashboard access. Manage your rentals and tenant requests.'
      : 'Welcome back! Please login to continue.';
  const ariaLabel = `FYN ${loginType} Login`;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', show: false });

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const showToast = (message) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: '', show: false }), 2500);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = formData.email.trim();
    const password = formData.password;

    if (!validateEmail(email)) {
      showToast('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      const endpoint = role === 'owner' ? '/api/owners/login' : '/api/users/login'
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      let data = {}
      try { data = await response.json() } catch { data = {} }
      if (!response.ok) {
        showToast(data.message || 'Login failed')
        return
      }

      // store token and user data by role
      if (data.token) {
        localStorage.setItem('fyn_token', data.token)
      }
      if (role === 'owner' && data.owner) {
        localStorage.setItem('fyn_user', JSON.stringify({ ...data.owner, role: 'owner' }))
        localStorage.setItem('fyn_role', 'owner')
      } else if (data.user) {
        localStorage.setItem('fyn_user', JSON.stringify({ ...data.user, role: 'tenant' }))
        localStorage.setItem('fyn_role', 'tenant')
      }

      showToast('Welcome back!')
      setFormData({ email: '', password: '', rememberMe: false })
      navigate(role === 'owner' ? '/owner/dashboard' : '/home')
    } catch (error) {
      showToast('Login failed. Please try again.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleSignUp = () => {
    navigate(`/signup/${role === 'owner' ? 'owner' : 'tenant'}`);
  };

  return (
    <main className="screen">
      <div className="phone" role="application" aria-label={ariaLabel}>
        {/* Header */}
        <header className="top">
          <button
            className="back"
            aria-label="Back"
            onClick={handleBackClick}
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="url(#g)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0%" stopColor="#5B21B6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </button>
          <div className="logo-wrap">
            <img src="/assets/logo.svg" alt="FYN logo" className="logo" />
          </div>
        </header>

        {/* Intro Section */}
        <section className="intro">
          <p className="tagline">
            It's <span className="accent">F</span>ind <span className="accent">Y</span>our{' '}
            <span className="accent">N</span>est
          </p>
          <h1 className="title">{loginType} Login</h1>
          <p className="subtitle">{subtitleText}</p>
        </section>

        {/* Login Form */}
        <section className="card" aria-labelledby="login-heading">
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email Field */}
            <label className="field">
              <span className="label">Email Address</span>
              <div className="input-group">
                <span className="icon" aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 7.5L12 13L21 7.5"
                      stroke="#7C3AED"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="3"
                      stroke="#E6E6F9"
                      strokeWidth="1.2"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  aria-label="Email address"
                />
              </div>
            </label>

            {/* Password Field */}
            <label className="field">
              <span className="label">Password</span>
              <div className="input-group">
                <span className="icon" aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="10"
                      rx="2"
                      stroke="#7C3AED"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M7 11V8a5 5 0 0110 0v3"
                      stroke="#7C3AED"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  aria-label="Password"
                />
                <button
                  type="button"
                  className="eye"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.94 17.94A10.94 10.94 0 0112 19c-6 0-10-7-10-7 .9-1.6 2.2-3 3.8-4.2"
                        stroke="#8B5CF6"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 1l22 22"
                        stroke="#8B5CF6"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
                        stroke="#8B5CF6"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#8B5CF6"
                        strokeWidth="1.3"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            {/* Remember Me & Forgot Password */}
            <div className="row between small">
              <label className="remember">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <span>Remember Me</span>
              </label>
              <button
                type="button"
                className="forgot"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              className="btn primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            {/* Divider */}
            <div className="divider">
              <span>OR</span>
            </div>

          </form>
        </section>

        {/* Footer */}
        <footer className="bottom">
          <p>
            Don't have an account?{' '}
            <button
              className="register"
              type="button"
              onClick={handleSignUp}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            >
              Register Now
            </button>
          </p>
        </footer>

        {/* Toast Notification */}
        {toast.show && (
          <div
            className="toast show"
            role="status"
            aria-live="polite"
          >
            {toast.message}
          </div>
        )}
      </div>
    </main>
  );
};

export default Login;
