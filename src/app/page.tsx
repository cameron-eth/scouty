import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Trophy, BarChart2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white py-12">
      <div className="text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-amber-400">
          Welcome to The 2025 Meyer Invitational Turkey Bowl
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-amber-400">
          Draft your team, compete, and track stats<br />
          for the ultimate Thanksgiving football experience!
        </p>
        <Link 
          href="/teams"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-colors duration-200 mb-16"
        >
          View Teams
        </Link>

        <h2 className="text-3xl font-bold mb-12 text-amber-400">How It Works</h2>
        
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          <Card className="bg-[#8B4513] border-none text-amber-100">
            <CardHeader className="text-center pb-4">
              <Users className="w-12 h-12 mx-auto mb-4 text-amber-400" />
              <CardTitle className="text-xl text-amber-400">Coming Winter 2025</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p>Draft players for your ultimate Thanksgiving football team.</p>
              <Button variant="outline" className="mt-4 w-full border-amber-400 text-amber-400 hover:bg-amber-400/10">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#8B4513] border-none text-amber-100">
            <CardHeader className="text-center pb-4">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-amber-400" />
              <CardTitle className="text-xl text-amber-400">Compete</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p>Go head-to-head with other teams in exciting matchups.</p>
              <Button variant="outline" className="mt-4 w-full border-amber-400 text-amber-400 hover:bg-amber-400/10">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#8B4513] border-none text-amber-100">
            <CardHeader className="text-center pb-4">
              <BarChart2 className="w-12 h-12 mx-auto mb-4 text-amber-400" />
              <CardTitle className="text-xl text-amber-400">Track Stats</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p>Monitor your team's performance with statistics.</p>
              <Button variant="outline" className="mt-4 w-full border-amber-400 text-amber-400 hover:bg-amber-400/10">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

