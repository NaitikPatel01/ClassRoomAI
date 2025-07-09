"use client"

import {
  BookText,
  BrainCircuit,
  Calculator,
  Globe,
  PlusCircle,
} from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import type { ChatSession } from "@/lib/types"

const chatHistory: ChatSession[] = [
  {
    id: "1",
    title: "Photosynthesis Explained",
    timestamp: "2 hours ago",
    icon: BrainCircuit,
  },
  {
    id: "2",
    title: "Solving Quadratic Equations",
    timestamp: "1 day ago",
    icon: Calculator,
  },
  {
    id: "3",
    title: "The French Revolution",
    timestamp: "3 days ago",
    icon: Globe,
  },
  {
    id: "4",
    title: "Shakespearean Sonnets",
    timestamp: "1 week ago",
    icon: BookText,
  },
]

export function ChatHistory() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <SidebarGroup>
        <SidebarGroupContent>
          <Button className="w-full justify-start" variant="ghost">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Recent</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {chatHistory.map((session, index) => (
              <SidebarMenuItem key={session.id}>
                <SidebarMenuButton
                  isActive={index === 0}
                  className="truncate"
                  tooltip={session.title}
                >
                  <session.icon />
                  <span>{session.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  )
}
