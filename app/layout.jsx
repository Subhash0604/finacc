import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });
const currentYear = new Date().getFullYear();

export const metadata = {
  title: "Finac",
  description: "Here accuracy meets financial intelligence",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en"  className={inter.className}>
        <body>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors/>
          <footer className="bg-red-50">
            <div className="container mx-auto py-12 text-center text-gray-600">
              <p>&copy; {currentYear} Finac. All rights reserved.</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
