import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/icons"
import { ChatHistory } from "@/components/chat/chat-history"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Settings, LogOut } from "lucide-react"
import Link from "next/link"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-lg font-semibold">ClassroomAI</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <ChatHistory />
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Student</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link href="#"><Settings size={16} /></Link>
              </Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" asChild>
                <Link href="/login"><LogOut size={16} /></Link>
              </Button>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:pl-2">
          <SidebarTrigger className="md:hidden" />
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold">AI Assistant</h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="#">New Chat</Link>
          </Button>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
