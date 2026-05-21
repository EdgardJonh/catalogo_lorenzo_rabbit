import { Inter } from "next/font/google";
import { AdminProviders } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProviders>
      <div className={inter.className}>
        {children}
      </div>
    </AdminProviders>
  );
}
