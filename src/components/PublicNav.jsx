export default function PublicNav({ go, enter }) {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
      <button onClick={() => go('landing')} className="font-display text-xl font-semibold text-primary">BrightEmpathix</button>
      <nav className="flex items-center gap-6 text-sm">
        <button onClick={() => go('pricing')} className="text-ink/70 hover:text-primary">Pricing</button>
        <button onClick={() => go('login')} className="text-ink/70 hover:text-primary">Sign in</button>
        <button onClick={() => enter('Admin')} className="rounded-md bg-secondary px-4 py-2 font-medium text-white transition hover:bg-primary">Open the demo</button>
      </nav>
    </header>
  )
}
