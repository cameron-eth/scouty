import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, BarChart } from 'lucide-react'

const features = [
  {
    title: "Create Your Team",
    description: "Draft players for your ultimate Thanksgiving football team.",
    icon: Users,
  },
  {
    title: "Compete",
    description: "Go head-to-head with other teams in exciting matchups.",
    icon: Trophy,
  },
  {
    title: "Track Stats",
    description: "Monitor your team's performance with detailed statistics.",
    icon: BarChart,
  },
]

export function DraftingFeatures() {
  return (
    <div className="grid gap-6 bg-black md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => (
        <Card key={index} className="bg-amber-900 text-amber-100">
          <CardHeader>
            <feature.icon className="h-10 w-10 mb-2 text-amber-400" />
            <CardTitle className="text-amber-200">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-amber-100">{feature.description}</CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full text-amber-200 border-amber-400 hover:bg-amber-800">
              Learn More
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

