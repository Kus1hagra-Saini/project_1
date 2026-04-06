import { useState, useCallback } from 'react';
import { LogIn, UserPlus, MapPin, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, Key } from 'lucide-react';
import Modal from './ui/Modal';
import { useAuth } from '../context/AuthContext';
import { signIn, signUp, confirmSignUp, fetchUserAttributes, getCurrentUser, signOut } from 'aws-amplify/auth';

/* ── small reusable field ─────────────────────────────────────────── */
function Field({ label, id, type = 'text', value, onChange, placeholder, required, hint, rightSlot }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-sm transition-all pr-10"
        />
        {rightSlot && <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</span>}
      </div>
      {hint && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{hint}</p>}
    </div>
  );
}

/* ── location button ──────────────────────────────────────────────── */
function LocationButton({ locState, coords, onRequest }) {
  const icon = {
    idle: <MapPin className="w-4 h-4" />,
    fetching: <Loader2 className="w-4 h-4 animate-spin" />,
    granted: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    denied: <AlertCircle className="w-4 h-4 text-amber-500" />,
  }[locState];

  const label = {
    idle: 'Use my location',
    fetching: 'Getting location…',
    granted: `Location saved (${coords.lat?.toFixed(2)}°, ${coords.lng?.toFixed(2)}°)`,
    denied: 'Location denied (optional)',
  }[locState];

  return (
    <div>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
        Location <span className="text-slate-400 font-normal">(optional — helps show distance)</span>
      </p>
      <button
        type="button"
        onClick={onRequest}
        disabled={locState === 'fetching' || locState === 'granted'}
        className={`flex items-center gap-2 w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
          locState === 'granted'
            ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 cursor-default'
            : locState === 'denied'
            ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    </div>
  );
}

/* ── main modal ───────────────────────────────────────────────────── */
export default function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup' | 'confirm'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sign-in fields
  const [siUsername, setSiUsername] = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [siShowPw, setSiShowPw] = useState(false);

  // Sign-up fields
  const [suName, setSuName] = useState('');
  const [suUsername, setSuUsername] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suConfirm, setSuConfirm] = useState('');
  const [suShowPw, setSuShowPw] = useState(false);
  const [locState, setLocState] = useState('idle');
  const [coords, setCoords] = useState({ lat: null, lng: null });

  // Confirm field
  const [confirmCode, setConfirmCode] = useState('');

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) { setLocState('denied'); return; }
    setLocState('fetching');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocState('granted'); },
      () => setLocState('denied'),
      { timeout: 10000 }
    );
  }, []);

  const resetAll = useCallback(() => {
    setSiUsername(''); setSiPassword(''); setSiShowPw(false);
    setSuName(''); setSuUsername(''); setSuEmail(''); setSuPassword(''); setSuConfirm(''); setSuShowPw(false);
    setConfirmCode(''); setTab('signin');
    setLocState('idle'); setCoords({ lat: null, lng: null });
    setError(''); setLoading(false);
  }, []);

  const handleClose = useCallback(() => { resetAll(); onClose(); }, [resetAll, onClose]);

  const handleSignIn = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    if (!siUsername.trim()) { setError('Username is required.'); return; }
    if (!siPassword) { setError('Password is required.'); return; }
    setLoading(true);
    try {
      await signOut().catch(() => {}); // Clear dirty state
      const { isSignedIn, nextStep } = await signIn({ username: siUsername.trim(), password: siPassword });
      
      if (nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        // Rare edge case: they signed up but didn't confirm yet
        setSuUsername(siUsername.trim());
        setSuPassword(siPassword);
        setTab('confirm');
        return;
      }
      
      if (isSignedIn) {
        const { username, userId } = await getCurrentUser();
        const attrs = await fetchUserAttributes();
        login({ id: userId, username, name: attrs.name || username, email: attrs.email });
        handleClose();
      }
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }, [siUsername, siPassword, login, handleClose]);

  const handleSignUp = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate Display Name (only alphabet and spaces)
    if (!suName.trim()) { setError('Display name is required.'); return; }
    if (!/^[a-zA-Z\s]+$/.test(suName)) { setError('Display name can only contain letters and spaces.'); return; }
    
    // Validate Username
    if (!suUsername.trim()) { setError('Username is required.'); return; }
    if (!/^[a-z0-9_]+$/.test(suUsername)) { setError('Username can only contain lowercase letters, numbers, and underscores.'); return; }
    
    // Validate Email
    if (!suEmail.trim()) { setError('Email is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(suEmail.trim())) { setError('Please enter a valid email address.'); return; }
    
    // Validate Password
    if (suPassword.length < 8) { setError('Password must be at least 8 characters long.'); return; }
    if (!/[A-Z]/.test(suPassword)) { setError('Password must contain at least one uppercase letter.'); return; }
    if (!/[a-z]/.test(suPassword)) { setError('Password must contain at least one lowercase letter.'); return; }
    if (!/[0-9]/.test(suPassword)) { setError('Password must contain at least one number.'); return; }
    
    if (suPassword !== suConfirm) { setError('Passwords do not match.'); return; }
    
    setLoading(true);
    try {
      await signOut().catch(() => {}); // Clear dirty state
      const { nextStep } = await signUp({
        username: suUsername.trim(),
        password: suPassword,
        options: {
          userAttributes: {
            email: suEmail.trim(),
            name: suName.trim(),
          },
        }
      });
      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setTab('confirm');
      } else {
        // If auto-confirmed
        await signIn({ username: suUsername.trim(), password: suPassword });
        const { username, userId } = await getCurrentUser();
        const attrs = await fetchUserAttributes();
        login({ id: userId, username, name: attrs.name || username, email: attrs.email });
        handleClose();
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }, [suName, suUsername, suEmail, suPassword, suConfirm, login, handleClose]);

  const handleConfirm = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    if (!confirmCode.trim()) { setError('Code is required.'); return; }
    setLoading(true);
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: suUsername.trim(),
        confirmationCode: confirmCode.trim()
      });
      if (isSignUpComplete) {
        await signIn({ username: suUsername.trim(), password: suPassword });
        const { username, userId } = await getCurrentUser();
        const attrs = await fetchUserAttributes();
        login({ id: userId, username, name: attrs.name || username, email: attrs.email });
        handleClose();
      }
    } catch (err) {
      setError(err.message || 'Confirmation failed.');
    } finally {
      setLoading(false);
    }
  }, [suUsername, confirmCode, suPassword, login, handleClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="" size="sm" showCloseButton={false}>
      {/* Tab header */}
      {tab !== 'confirm' && (
        <div className="-mt-2 mb-5">
          <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => { setTab('signin'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors ${
                tab === 'signin'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('signup'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors ${
                tab === 'signup'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Sign Up
            </button>
          </div>
        </div>
      )}

      {/* ── Sign In ──────────────────────────────────────────────────── */}
      {tab === 'signin' && (
        <form onSubmit={handleSignIn} className="space-y-4">
          <Field
            id="si-username" label="Username or Email" value={siUsername}
            onChange={(e) => setSiUsername(e.target.value)}
            placeholder="username or user@email.com" required
          />
          <Field
            id="si-password" label="Password" type={siShowPw ? 'text' : 'password'}
            value={siPassword} onChange={(e) => setSiPassword(e.target.value)}
            placeholder="••••••••" required
            rightSlot={
              <button type="button" onClick={() => setSiShowPw((v) => !v)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                {siShowPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={handleClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>
          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            No account?{' '}
            <button type="button" onClick={() => { setTab('signup'); setError(''); }}
              className="text-primary-500 hover:underline font-medium">Sign up</button>
          </p>
        </form>
      )}

      {/* ── Sign Up ──────────────────────────────────────────────────── */}
      {tab === 'signup' && (
        <form onSubmit={handleSignUp} className="space-y-4">
          <Field
            id="su-name" label="Display Name" value={suName}
            onChange={(e) => setSuName(e.target.value)}
            placeholder="e.g. Rahul Sharma" required
          />
          <Field
            id="su-username" label="Username" value={suUsername}
            onChange={(e) => setSuUsername(e.target.value.toLowerCase().replace(/\s/g, '_'))}
            placeholder="rahul_sharma" required
            hint="Lowercase only, no spaces"
          />
          <Field
            id="su-email" label="Email" type="email" value={suEmail}
            onChange={(e) => setSuEmail(e.target.value)}
            placeholder="your@email.com" required
          />
          <Field
            id="su-password" label="Password" type={suShowPw ? 'text' : 'password'}
            value={suPassword} onChange={(e) => setSuPassword(e.target.value)}
            placeholder="Min. 8 chars (Upper, lower, & number)" required
            rightSlot={
              <button type="button" onClick={() => setSuShowPw((v) => !v)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                {suShowPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
          <Field
            id="su-confirm" label="Confirm Password" type={suShowPw ? 'text' : 'password'}
            value={suConfirm} onChange={(e) => setSuConfirm(e.target.value)}
            placeholder="Repeat password" required
          />
          <LocationButton locState={locState} coords={coords} onRequest={requestLocation} />
          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={handleClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {loading ? 'Creating…' : 'Create Account'}
            </button>
          </div>
          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            Already have an account?{' '}
            <button type="button" onClick={() => { setTab('signin'); setError(''); }}
              className="text-primary-500 hover:underline font-medium">Sign in</button>
          </p>
        </form>
      )}

      {/* ── Confirm ──────────────────────────────────────────────────── */}
      {tab === 'confirm' && (
        <form onSubmit={handleConfirm} className="space-y-4">
          <div className="text-center text-sm text-slate-600 dark:text-slate-300 mb-2">
            We sent a verification code to your email. Enter it below to complete registration.
          </div>
          <Field
            id="co-code" label="Verification Code" value={confirmCode}
            onChange={(e) => setConfirmCode(e.target.value.replace(/\D/g, ''))}
            placeholder="123456" required
          />
          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => { setTab('signup'); setError(''); }}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Back
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
              {loading ? 'Verifying…' : 'Verify'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
