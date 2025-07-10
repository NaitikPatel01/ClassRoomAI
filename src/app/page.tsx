import Link from "next/link"
import { Logo } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { BookOpen, BrainCircuit, MessageSquare } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Link href="#" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">ClassroomAI</span>
          </Link>
          <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
            {/* Future nav links can go here */}
          </nav>
          <div className="flex items-center justify-end space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Interactive AI Learning for the Modern Classroom
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  ClassroomAI provides students with instant, personalized help across any subject, making learning more accessible and engaging.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/signup">Get Started for Free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Unlock Your Potential</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is equipped with powerful features to help you succeed in your studies. From complex math problems to historical analysis, get the support you need, when you need it.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg">
                <BrainCircuit className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Multi-Modal Learning</h3>
                <p className="text-muted-foreground">Ask questions using text, voice, or even by uploading an image of a problem.</p>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg">
                <BookOpen className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Any Subject, Anytime</h3>
                <p className="text-muted-foreground">Get expert-level assistance in math, science, literature, history, and more.</p>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg">
                <MessageSquare className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Interactive Chat</h3>
                <p className="text-muted-foreground">Engage in natural conversations to deepen your understanding of complex topics.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Revolutionize Your Learning?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Create an account and start exploring a new way to learn today.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button asChild size="lg" className="w-full">
                <Link href="/signup">Sign Up Now</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 ClassroomAI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
