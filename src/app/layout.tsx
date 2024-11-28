import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import Link from "next/link"
import { PlayersProvider } from "@/playerscontext"
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
  title: "Turkey Bowl Drafting App",
  description: "Draft players for your Turkey Bowl team",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PlayersProvider>
          <nav className="bg-zinc-900 text-white p-4">
            <ul className="flex space-x-4 justify-center">
              <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
              {/* <li><Link href="/players" className="hover:text-gray-300">Players</Link></li> */}
              <li><Link href="/stats" className="hover:text-gray-300">Stats</Link></li>
              {/* <li><Link href="/scouting" className="hover:text-gray-300">Scouting Portal</Link></li> */}
              <li><Link href="/teams" className="hover:text-gray-300">Teams</Link></li>

            </ul>
          </nav>
          <main className="container mx-auto p-4">
            {children}
          </main>
        </PlayersProvider>
      </body>
    </html>
  )
}