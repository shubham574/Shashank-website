import "./globals.css";
import Nav from "@/components/Nav";
import { Geist } from "next/font/google";
import { ViewTransitions} from "next-view-transitions";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Portfolio",
  description: "Shashank's Notion Expert Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
    <html lang="en" className={`${geistSans.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased" >
          
        <Nav />
        {children}
        
              </body>
    </html>
    </ViewTransitions>
  );
}
