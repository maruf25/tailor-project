import SidebarComponent from "@/components/sidebar";

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
      <SidebarComponent />
      <div className="p-4 sm:ml-64">{children}</div>
    </section>
  );
}
