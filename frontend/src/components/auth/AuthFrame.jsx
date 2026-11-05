import Logo from "../ui/Logo";
export default function AuthFrame({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden bg-gradient-to-br from-primary via-violet to-fuchsia-500 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo />
        <div>
          <p className="mb-4 font-semibold text-indigo-100">
            THE CONSIDERED COLLECTION
          </p>
          <h1 className="max-w-xl text-6xl font-extrabold leading-[1.05]">
            Good design, made daily.
          </h1>
          <p className="mt-6 max-w-md text-lg text-indigo-100">
            A premium storefront for products that fit beautifully into your
            life.
          </p>
        </div>
        <p className="text-sm text-indigo-100">
          Secure checkout · Thoughtful delivery
        </p>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-3xl font-extrabold">{title}</h1>
          <p className="mt-2 text-slate-500">{subtitle}</p>
          {children}
        </div>
      </section>
    </div>
  );
}
