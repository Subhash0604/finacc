import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import { Toaster } from "sonner";
import { ThemeProvider } from '@/app/component/themeProvider'

const inter = Inter({ subsets: ["latin"] });
const currentYear = new Date().getFullYear();

export const metadata = {
  title: "Finac",
  description: "Here accuracy meets financial intelligence",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.className}`}>

        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <Header />
          <main className="pt-30 min-h-screen">{children}</main>
          <Toaster richColors/>
          <footer className="bg:red-500 dark:bg-black">
            <div className="container mx-auto py-12 dark:text-center dark:text-white">
              <p>&copy; {currentYear} Finac. All rights reserved.</p>
            </div>
          </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

