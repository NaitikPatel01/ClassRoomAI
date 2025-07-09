"use client"

import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  Paperclip,
  Mic,
  Send,
  FileText,
  Upload,
  X,
  LoaderCircle,
  Square,
  File,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ChatMessage } from "./chat-message"
import type { ChatMessage as ChatMessageType } from "@/lib/types"
import { getTextResponse, getImageResponse, getVoiceResponse, getDocumentResponse } from "@/lib/actions"
import { cn } from "@/lib/utils"

const welcomeMessage: ChatMessageType = {
  id: "welcome",
  role: "assistant",
  content: "Hello! I'm your AI learning assistant. How can I help you today? You can ask me a question using text, voice, or an image.",
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageType[]>([welcomeMessage])
  const [input, setInput] = useState("")
  const [image, setImage] = useState<{ file: File; preview: string } | null>(null)
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage({ file, preview: URL.createObjectURL(file) })
    }
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocumentFile(file);
    }
  };

  const fileToDataUri = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioDataUri = await fileToDataUri(audioBlob);
            
            const userMessage: ChatMessageType = { id: Date.now().toString(), role: 'user', content: 'Voice message' };
            setMessages(prev => [...prev, userMessage, { id: 'loading', role: 'assistant', isLoading: true, content: '' }]);
            setIsLoading(true);
            
            try {
              const chatHistory = messages.map(m => `${m.role}: ${typeof m.content === 'string' ? m.content : '[complex content]'}`).join('\n');
              const res = await getVoiceResponse({ audioDataUri, chatHistory });
              const assistantMessage: ChatMessageType = { id: Date.now().toString(), role: 'assistant', content: res.textResponse, audio: res.audioResponse };
              setMessages(prev => [...prev.filter(m => !m.isLoading), assistantMessage]);
            } catch (error) {
              toast({ variant: 'destructive', title: 'Error', description: 'Failed to process voice query.' });
              setMessages(prev => prev.filter(m => !m.isLoading));
            } finally {
              setIsLoading(false);
            }
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        recordingIntervalRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    } catch (err) {
        toast({ variant: 'destructive', title: 'Error', description: 'Microphone access denied.' });
    }
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          setIsRecording(false);
          if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
          setRecordingTime(0);
      }
  };

  const handleSubmit = async (e: React.FormEvent, mode: 'text' | 'image' | 'document') => {
    e.preventDefault();
    if (isLoading) return;

    let userMessage: ChatMessageType;
    const queryInput = input;

    if (mode === 'text') {
      if (!queryInput.trim()) return;
      userMessage = { id: Date.now().toString(), role: 'user', content: queryInput };
    } else if (mode === 'image') {
      if (!image) return;
      userMessage = { 
        id: Date.now().toString(), 
        role: 'user', 
        content: (
          <div className="space-y-2">
            <p>{queryInput || "Here's an image:"}</p>
            <Image src={image.preview} alt="User upload" width={200} height={200} className="rounded-lg border" />
          </div>
        )
      };
    } else if (mode === 'document') {
      if (!documentFile) return;
      userMessage = { 
        id: Date.now().toString(), 
        role: 'user', 
        content: (
          <div className="space-y-2">
            <p>{queryInput || `Question about ${documentFile.name}`}</p>
            <div className="p-2 rounded-md border bg-muted text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>{documentFile.name}</span>
            </div>
          </div>
        )
      };
    } else {
      return;
    }

    setMessages(prev => [...prev, userMessage, { id: 'loading', role: 'assistant', isLoading: true, content: '' }]);
    setIsLoading(true);
    
    const imageFile = image;
    const docFile = documentFile;

    setInput('');
    setImage(null);
    setDocumentFile(null);

    try {
      const chatHistory = messages.map(m => `${m.role}: ${typeof m.content === 'string' ? m.content : '[complex content]'}`).join('\n');
      let res;

      if (mode === 'text') {
        res = await getTextResponse({ query: queryInput, chatHistory });
      } else if (mode === 'image' && imageFile) {
        const imageDataUri = await fileToDataUri(imageFile.file);
        res = await getImageResponse({ question: queryInput, imageDataUri, chatHistory });
      } else if (mode === 'document' && docFile) {
        const documentDataUri = await fileToDataUri(docFile);
        res = await getDocumentResponse({ question: queryInput, documentDataUri, chatHistory });
      }

      if (res && 'answer' in res) {
        const assistantMessage: ChatMessageType = { id: Date.now().toString(), role: 'assistant', content: res.answer };
        setMessages(prev => [...prev.filter(m => !m.isLoading), assistantMessage]);
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to get response from AI.' });
      setMessages(prev => prev.filter(m => !m.isLoading));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
                {messages.map((msg) => <ChatMessage key={msg.id} {...msg} />)}
            </div>
        </ScrollArea>
        <div className="border-t p-4 bg-background/80 backdrop-blur-sm">
            <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-2">
                    <TabsTrigger value="text"><FileText className="h-4 w-4 mr-2"/>Text</TabsTrigger>
                    <TabsTrigger value="voice"><Mic className="h-4 w-4 mr-2"/>Voice</TabsTrigger>
                    <TabsTrigger value="image"><Paperclip className="h-4 w-4 mr-2"/>Image</TabsTrigger>
                    <TabsTrigger value="document"><File className="h-4 w-4 mr-2"/>Document</TabsTrigger>
                </TabsList>
                <TabsContent value="text">
                    <form onSubmit={(e) => handleSubmit(e, 'text')} className="flex items-start gap-2">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your question here..."
                            className="min-h-0 flex-1 resize-none"
                            rows={1}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e, 'text');
                                }
                            }}
                        />
                        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                            {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </form>
                </TabsContent>
                <TabsContent value="voice">
                    <div className="flex flex-col items-center justify-center gap-4 p-4 rounded-lg border border-dashed">
                       {isRecording ? (
                           <>
                             <Button onClick={stopRecording} variant="destructive" size="icon" className="w-16 h-16 rounded-full">
                                <Square className="h-6 w-6 fill-white" />
                             </Button>
                             <p className="text-sm font-mono">{formatTime(recordingTime)}</p>
                           </>
                       ) : (
                           <>
                             <Button onClick={startRecording} size="icon" className="w-16 h-16 rounded-full">
                                <Mic className="h-6 w-6" />
                             </Button>
                             <p className="text-sm text-muted-foreground">Click to start recording</p>
                           </>
                       )}
                    </div>
                </TabsContent>
                <TabsContent value="image">
                    <form onSubmit={(e) => handleSubmit(e, 'image')} className="space-y-4">
                        <div className="space-y-2">
                            {image && (
                                <div className="relative w-fit">
                                    <Image src={image.preview} alt="Preview" width={100} height={100} className="rounded-lg border" />
                                    <Button onClick={() => setImage(null)} variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full"><X className="h-4 w-4"/></Button>
                                </div>
                            )}
                            <div className={cn("flex items-center justify-center w-full p-4 rounded-lg border border-dashed", image && "hidden")}>
                                <label htmlFor="image-upload" className="flex flex-col items-center gap-2 cursor-pointer">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Click to upload an image</span>
                                </label>
                                <Input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question about the image..."
                                className="min-h-0 flex-1 resize-none"
                                rows={1}
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !image}>
                                {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </div>
                    </form>
                </TabsContent>
                <TabsContent value="document">
                    <form onSubmit={(e) => handleSubmit(e, 'document')} className="space-y-4">
                        <div className="space-y-2">
                            {documentFile && (
                                <div className="relative w-fit p-2 rounded-lg border bg-muted text-sm flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span>{documentFile.name}</span>
                                    <Button onClick={() => setDocumentFile(null)} variant="ghost" size="icon" className="h-6 w-6 rounded-full"><X className="h-4 w-4"/></Button>
                                </div>
                            )}
                            <div className={cn("flex items-center justify-center w-full p-4 rounded-lg border border-dashed", documentFile && "hidden")}>
                                <label htmlFor="doc-upload" className="flex flex-col items-center gap-2 cursor-pointer">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Click to upload a document</span>
                                </label>
                                <Input id="doc-upload" type="file" className="hidden" onChange={handleDocumentChange} />
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question about the document..."
                                className="min-h-0 flex-1 resize-none"
                                rows={1}
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !documentFile}>
                                {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </div>
                    </form>
                </TabsContent>
            </Tabs>
            <p className="text-xs text-center text-muted-foreground mt-2">ClassroomAI can make mistakes. Consider checking important information.</p>
        </div>
    </div>
  )
}
