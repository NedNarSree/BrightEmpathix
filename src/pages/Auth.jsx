import { useState } from 'react'
import { Check, Circle } from 'lucide-react'

// UI only: wire onSubmit to Supabase Auth (signUp, signInWithPassword, resetPasswordForEmail).
const rules = [
  ['More than 8 characters', (p) => p.length > 8],
  ['An uppercase letter', (p) => /[A-Z]/.test(p)],
  ['A lowercase letter', (p) => /[a-z]/.test(p)],
  ['A special character', (p) => /[^A-Za-z0-9]/.test(p)],
]

const Field = ({ label, ...props }) => (
  <label className="block">
    <span className="text-sm text-ink/70">{label}</span>
    <input {...props} className="mt-1 w-full rounded-md border border-ink/20 bg-surface px-3 py-2.5 outline-none focus:border-accent" />
  </label>
)

export default function Auth({ go, enter }) {
  const [mode, setMode] = useState('signin') // signin | signup | reset
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sent, setSent] = useState(false)

  const passwordOk = rules.every(([, test]) => test(password))
  const emailOk = /^\S+@\S+\.\S+$/.test(email)
  const canSubmit = mode === 'reset' ? emailOk : mode === 'signup' ? emailOk && passwordOk : emailOk && password.length > 0

  const submit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    if (mode === 'reset') return setSent(true)
    enter(mode === 'signup' ? 'Customer' : 'Admin')
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-14">
        <button onClick={() => go('landing')} className="self-start font-display text-xl font-semibold text-primary">BrightEmpathix</button>
        <div className="m-auto w-full max-w-sm py-10">
          <h1 className="font-display text-4xl text-primary">
            {mode === 'signin' ? 'Welcome back.' : mode === 'signup' ? 'Create your account.' : 'Reset your password.'}
          </h1>
          <p className="mt-2 text-ink/60">
            {mode === 'reset' ? 'We’ll email a reset link to the address on your account.' : mode === 'signin' ? 'Sign in to see your subscriptions and invoices.' : 'Each email can belong to only one account.'}
          </p>

          {sent ? (
            <p className="mt-8 rounded-md bg-highlight/50 p-4 text-primary">If {email} has an account, a reset link is on its way.</p>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-4">
              <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              {mode !== 'reset' && (
                <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
              )}
              {mode === 'signup' && (
                <ul className="space-y-1 text-sm">
                  {rules.map(([label, test]) => {
                    const ok = test(password)
                    return (
                      <li key={label} className={`flex items-center gap-2 ${ok ? 'text-secondary' : 'text-ink/50'}`}>
                        {ok ? <Check size={14} /> : <Circle size={14} />} {label}
                      </li>
                    )
                  })}
                </ul>
              )}
              <button type="submit" disabled={!canSubmit} className="w-full rounded-md bg-secondary py-3 font-medium text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40">
                {mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
              </button>
            </form>
          )}

          <div className="mt-6 flex justify-between text-sm">
            {mode === 'signin' && <button onClick={() => setMode('reset')} className="text-accent hover:underline">Forgot your password?</button>}
            {mode === 'signin' && <button onClick={() => setMode('signup')} className="text-accent hover:underline">Create an account</button>}
            {mode !== 'signin' && <button onClick={() => { setMode('signin'); setSent(false) }} className="text-accent hover:underline">Back to sign in</button>}
          </div>
          <p className="mt-10 text-xs text-ink/40">Demo build: signing in opens the admin view, creating an account opens the customer portal.</p>
        </div>
      </div>

      <div className="hidden flex-col justify-end bg-primary p-14 text-white lg:flex">
        <p className="font-display text-5xl leading-tight">Nothing gets billed twice. Nothing gets skipped.</p>
        <p className="mt-4 max-w-md text-white/60">Every invoice comes from a subscription, every payment lands on an invoice, and the dashboard is just the sum of the two.</p>
      </div>
    </div>
  )
}
