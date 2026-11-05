import Navbar from "./Navbar";
export default function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
