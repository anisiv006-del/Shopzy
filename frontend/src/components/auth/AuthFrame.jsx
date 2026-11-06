import Logo from "../ui/Logo";

export default function AuthFrame({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm lg:grid-cols-[1.1fr_1fr]">
        <section className="hidden bg-[var(--panel-soft)] p-10 lg:flex lg:flex-col lg:justify-between">
          <Logo />

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Thoughtful essentials
            </p>
            <h1 className="max-w-xl text-4xl font-extrabold leading-tight text-slate-900">
              Clean living,
              <span className="block text-primary">well managed.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
              Shop everyday essentials with a simpler, calmer digital experience.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            Secure access · Reliable checkout
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Logo />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
