import Navbar from "./Navbar";

export default function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f5faf6]">{children}</main>
    </>
  );
}
