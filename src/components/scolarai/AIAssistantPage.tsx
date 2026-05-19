'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Send,
  Paperclip,
  FileText,
  Lightbulb,
  Brain,
  Sparkles,
  User,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useAppStore } from '@/lib/store'

// ── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// ── Mock AI responses ────────────────────────────────────────────────────────

const aiResponses: Record<string, string> = {
  default:
    "C'est une excellente question ! D'après les cours que vous avez uploadés, je peux vous aider à approfondir ce sujet. N'hésitez pas à me poser des questions plus spécifiques pour que je puisse vous fournir une réponse détaillée.",
  resume:
    "Voici un résumé de votre cours : Les points clés couvrent les concepts fondamentaux, les définitions importantes et les applications pratiques. Je vous recommande de réviser les sections sur les méthodologies et les cas d'étude pour une meilleure compréhension.",
  concept:
    "Ce concept est essentiel dans votre programme d'études. En termes simples, il s'agit d'un principe qui relie la théorie à la pratique. L'idée centrale est que chaque élément contribue au fonctionnement global du système. Voulez-vous que j'approfondisse un aspect particulier ?",
  flashcard:
    "J'ai analysé votre cours et je peux générer des flashcards sur les thèmes suivants : \n\n1. Définitions clés\n2. Formules importantes\n3. Dates et événements\n4. Concepts à maîtriser\n\nCombien de flashcards souhaitez-vous que je crée ?",
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('résum') || lower.includes('resume')) return aiResponses.resume
  if (lower.includes('concept') || lower.includes('expliqu')) return aiResponses.concept
  if (lower.includes('flashcard') || lower.includes('carte')) return aiResponses.flashcard
  return aiResponses.default
}

// ── Suggestion chips ─────────────────────────────────────────────────────────

const suggestions = [
  { label: 'Résumer mon cours', icon: FileText, prompt: 'Peux-tu résumer mon cours ?' },
  { label: 'Expliquer un concept', icon: Lightbulb, prompt: "Peux-tu m'expliquer un concept ?" },
  { label: 'Générer des flashcards', icon: Brain, prompt: 'Génère des flashcards à partir de mon cours' },
]

// ── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-emerald-500 text-white">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-white border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <motion.span
            className="h-2 w-2 rounded-full bg-emerald-400"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.span
            className="h-2 w-2 rounded-full bg-emerald-400"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
          />
          <motion.span
            className="h-2 w-2 rounded-full bg-emerald-400"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}

// ── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const time = message.timestamp.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className={
            isUser
              ? 'bg-gray-700 text-white'
              : 'bg-emerald-500 text-white'
          }
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Bubble */}
      <div
        className={`max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
      >
        <span className="text-[11px] font-medium text-gray-400 mb-1 px-1">
          {isUser ? 'Vous' : 'Assistant IA'}
        </span>
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-emerald-500 text-white rounded-2xl rounded-br-sm'
              : 'bg-white border text-gray-800 rounded-2xl rounded-bl-sm shadow-sm'
          }`}
        >
          {message.content}
        </div>
        <span className="text-[10px] text-gray-400 mt-1 px-1">{time}</span>
      </div>
    </motion.div>
  )
}

// ── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onSuggestionClick }: { onSuggestionClick: (prompt: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center flex-1 py-12 px-4"
    >
      {/* Bot avatar */}
      <div className="relative mb-6">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/25">
          <Bot className="h-10 w-10 text-white" />
        </div>
        <motion.div
          className="absolute -top-1 -right-1 flex items-center justify-center w-7 h-7 rounded-full bg-emerald-400 shadow"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="h-4 w-4 text-white" />
        </motion.div>
      </div>

      {/* Greeting */}
      <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
        Bonjour ! Je suis votre assistant IA.
      </h2>
      <p className="text-sm text-gray-500 text-center max-w-md mb-8 leading-relaxed">
        Je peux vous aider à comprendre vos cours, générer des résumés, ou
        répondre à vos questions.
      </p>

      {/* Suggestion chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
        {suggestions.map((s) => (
          <motion.button
            key={s.label}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSuggestionClick(s.prompt)}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3.5 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all text-left group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
              <s.icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">
              {s.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function AIAssistantPage() {
  const { user } = useAppStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [inputText])

  // Send message
  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInputText('')
      setIsLoading(true)

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }

      // Simulate AI response after delay
      setTimeout(() => {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: getAIResponse(trimmed),
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
        setIsLoading(false)
      }, 1500)
    },
    [isLoading]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputText)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputText)
    }
  }

  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="bg-white border-b px-6 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500 shadow-sm shadow-emerald-500/25">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Assistant IA
                <Sparkles className="h-4 w-4 text-emerald-500" />
              </h1>
              <p className="text-xs text-gray-500">
                Posez vos questions sur vos cours
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-600">En ligne</span>
          </div>
        </div>
      </header>

      {/* ── Chat area ─────────────────────────────────────────────────── */}
      <ScrollArea ref={scrollRef} className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          {!hasMessages ? (
            <EmptyState onSuggestionClick={sendMessage} />
          ) : (
            <div className="space-y-5">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <AnimatePresence>
                {isLoading && <TypingIndicator />}
              </AnimatePresence>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* ── Input area ────────────────────────────────────────────────── */}
      <div className="bg-white border-t shrink-0">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto px-4 sm:px-6 py-4"
        >
          <div className="flex items-end gap-3">
            {/* Attachment button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-gray-400 hover:text-gray-600 h-10 w-10"
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            {/* Textarea */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tapez votre message..."
                rows={1}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
              />
            </div>

            {/* Send button */}
            <Button
              type="submit"
              size="icon"
              disabled={!inputText.trim() || isLoading}
              className="shrink-0 h-10 w-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-emerald-500/25"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            L&apos;assistant peut faire des erreurs. Vérifiez les informations importantes.
          </p>
        </form>
      </div>
    </div>
  )
}
