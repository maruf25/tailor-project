import Footer from "@/components/Footer";
import NavbarComponent from "@/components/navbar";

export const metadata = {
  title: {
    template: "%s",
    default: "ERROR NOT FOUND",
  },
  description: {
    template: "%s",
  },
};

export default function RootLayout({ children }) {
  return (
    <section>
      <NavbarComponent />
      <main>{children}</main>
      <Footer />
    </section>
  );
}
