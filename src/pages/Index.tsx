import React from "react"
import { Dashboard } from "@/components/Dashboard"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

const IndexPage = () => {
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  })

  const userName = "John"
  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
      {/* Section 1: Welcome */}
      <section className="h-screen snap-start bg-[url('/hero-bg.png')] bg-cover bg-no-repeat bg-center text-white px-6 flex flex-col items-center relative">
        <div className="flex-grow flex flex-col justify-center items-center text-center z-10">
          <p className="text-base text-white/80">{formattedDate}</p>
          <h1 className="mt-6 text-5xl font-bold">Hi, {userName}!</h1>
          <p className="mt-4 text-xl font-light">How was your sleep last night?</p>
          <Link to="/log">
            <Button className="mt-6 bg-sleep-medium hover:bg-sleep-deep px-6 py-3 text-base">
              → Log My Sleep
            </Button>
          </Link>
        </div>

        {/* Bottom Scroll Prompt */}
        <div className="text-sm text-white opacity-80 animate-bounce text-center mb-6">
          <ChevronDown className="mx-auto mb-1" />
          Check your sleep data
        </div>
      </section>

      {/* Section 2: Dashboard - scrollable content */}
      <section className="min-h-screen snap-start px-4 sm:px-6 md:px-12 pt-8 pb-16">
        <Dashboard />
      </section>
    </div>
  )
}

export default IndexPage
