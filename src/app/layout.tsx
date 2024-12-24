import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { PlayersProvider } from "@/playerscontext"
import { Navbar } from "@/components/navbar"
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "3rd Annual Garret Meyer Invitational Santa Bowl",
  description: "Where Legends Are Born",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <PlayersProvider>
          <header className="py-4">
            <Navbar />
          </header>
          <main className="container mx-auto p-4">
            {children}
          </main>
        </PlayersProvider>
      </body>
    </html>
  )
}

