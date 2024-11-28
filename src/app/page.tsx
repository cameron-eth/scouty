"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Trophy, BarChart2 } from 'lucide-react'
import { motion } from "framer-motion"

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  const cardVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  }

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="text-center max-w-4xl mx-auto px-4">
        <motion.h1 
          className="text-5xl md:text-6xl font-extrabold mb-6 text-amber-400"
          variants={itemVariants}
        >
          Welcome to The 2025 Meyer Invitational Turkey Bowl
        </motion.h1>
        <motion.p 
          className="text-lg md:text-lg mb-12 text-amber-400"
          variants={itemVariants}
        >
          Scout, Compete, Leave a legacy<br />
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link 
            href="/teams"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold p-2 rounded-full text-md transition-colors duration-200 mb-16"
          >
            View Teams
          </Link>
        </motion.div>

        <motion.div 
          className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} whileHover="hover">
            <motion.div variants={cardVariants}>
              <Card className="bg-[#8B4513] border-none text-amber-100">
                <CardHeader className="text-center pb-4">
                  <Users className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                  <CardTitle className="text-xl text-amber-400">Drafting</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Draft players for your ultimate Thanksgiving football team.</p>
                  <Button variant="outline" className="mt-4 w-full border-amber-400 text-amber-400 hover:bg-amber-400/10">
                    Coming Winter 2025
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover="hover">
            <motion.div variants={cardVariants}>
              <Card className="bg-[#8B4513] border-none text-amber-100">
                <CardHeader className="text-center pb-4">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                  <CardTitle className="text-xl text-amber-400">Compete</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Go head-to-head with other teams in exciting matchups.</p>
                  <Button variant="outline" className="mt-4 w-full border-amber-400 text-amber-400 hover:bg-amber-400/10">
                    Coming Winter 2025
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover="hover">
            <motion.div variants={cardVariants}>
              <Card className="bg-[#8B4513] border-none text-amber-100">
                <CardHeader className="text-center pb-4">
                  <BarChart2 className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                  <CardTitle className="text-xl text-amber-400">Track Stats</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Monitor your team's performance with statistics.</p>
                  <Button variant="outline" className="mt-4 w-full border-amber-400 text-amber-400 hover:bg-amber-400/10">
                    Coming Winter 2025
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

