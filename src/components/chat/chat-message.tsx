import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/icons"
import type { ChatMessage } from "@/lib/types"
import { Skeleton } from "../ui/skeleton"
import { Button } from "../ui/button"
import { Volume2 } from "lucide-react"

export function ChatMessage({ id, role, content, audio, isLoading }: ChatMessage) {
    const isAssistant = role === "assistant";

    const handlePlayAudio = () => {
        if(audio) {
            const audioPlayer = new Audio(audio);
            audioPlayer.play();
        }
    }

    return (
        <div
            key={id}
            className={cn(
                "flex items-start gap-4 p-4",
                isAssistant && "bg-secondary/50"
            )}
        >
            <Avatar className="h-8 w-8 border">
                {isAssistant ? (
                    <div className="bg-background flex items-center justify-center h-full w-full">
                        <Logo className="h-5 w-5 text-primary" />
                    </div>
                ) : (
                    <>
                        <AvatarImage src="https://placehold.co/100x100.png" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                    </>
                )}
            </Avatar>
            <div className="flex-1 space-y-2 overflow-hidden pt-1">
                <div className="font-semibold text-sm">
                    {isAssistant ? "AI Assistant" : "You"}
                </div>
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-3/5" />
                    </div>
                ) : (
                    <div className="text-sm leading-6 text-foreground/90 prose prose-sm max-w-none">
                        {content}
                        {audio && (
                             <Button onClick={handlePlayAudio} variant="ghost" size="icon" className="mt-2">
                                <Volume2 className="h-4 w-4" />
                             </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
