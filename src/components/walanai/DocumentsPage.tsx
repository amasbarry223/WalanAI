'use client'

import { useAppStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Plus,
  Bell,
  Search,
  Star,
  Archive,
  FileText,
  FolderOpen,
  Upload,
  LayoutGrid,
  List,
  MoreVertical,
  Clock,
  Brain,
  File,
  FileType2,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { useToast } from '@/hooks/use-toast'

type FilterType = 'tous' | 'favoris' | 'archives'
type ViewMode = 'grid' | 'list'

const subjectColors: Record<string, string> = {
  Droit: 'bg-blue-100 text-blue-700',
  Économie: 'bg-amber-100 text-amber-700',
  Informatique: 'bg-emerald-100 text-emerald-700',
  Histoire: 'bg-purple-100 text-purple-700',
  Mathématiques: 'bg-rose-100 text-rose-700',
  Gestion: 'bg-teal-100 text-teal-700',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

const typeColors: Record<string, string> = {
  PDF: 'bg-red-500',
  DOC: 'bg-blue-500',
  DOCX: 'bg-blue-500',
  PPT: 'bg-orange-500',
  PPTX: 'bg-orange-500',
  XLS: 'bg-green-600',
  XLSX: 'bg-green-600',
  TXT: 'bg-gray-500',
}

export default function DocumentsPage() {
  const { setCurrentPage, documents, addDocument, toggleDocumentFavorite } = useAppStore()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeFilter, setActiveFilter] = useState<FilterType>('tous')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const handleImportFiles = (files: FileList | null) => {
    if (!files?.length) return
    Array.from(files).forEach((file) => {
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF'
      const title = file.name.replace(/\.[^.]+$/, '')
      addDocument({
        title,
        subject: 'Importé',
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
        flashcards: 0,
        type: ext.slice(0, 4),
        favorite: false,
        archived: false,
        color: typeColors[ext] || 'bg-emerald-500',
        fileName: file.name,
        sizeLabel: `${(file.size / 1024).toFixed(0)} Ko`,
      })
    })
    toast({
      title: `${files.length} document(s) importé(s)`,
      description: 'Fichiers enregistrés localement dans votre navigateur.',
    })
  }

  const filteredDocs = documents.filter((doc) => {
    if (activeFilter === 'favoris' && !doc.favorite) return false
    if (activeFilter === 'archives' && !doc.archived) return false
    if (activeFilter === 'tous' && doc.archived) return false
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'tous', label: 'Tous', icon: null },
    { key: 'favoris', label: 'Favoris', icon: <Star className="h-3.5 w-3.5" /> },
    { key: 'archives', label: 'Archivés', icon: <Archive className="h-3.5 w-3.5" /> },
  ]

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setCurrentPage('dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Mes Documents</h1>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
            onChange={(e) => {
              handleImportFiles(e.target.files)
              e.target.value = ''
            }}
          />
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Importer</span>
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
          </Button>
        </div>
      </motion.div>

      {/* Filter tabs */}
      <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeFilter === filter.key
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter.icon}
            {filter.label}
          </button>
        ))}
      </motion.div>

      {/* Search and view controls */}
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher dans les documents..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2 text-gray-600 hidden sm:inline-flex">
          <Clock className="h-3.5 w-3.5" />
          Tri : Date
        </Button>
        <div className="flex border rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 border-l transition-colors ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {filteredDocs.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <FolderOpen className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun document</h3>
            <p className="text-gray-500 text-sm mb-6 text-center max-w-md">
              Importez votre premier document pour commencer à étudier
            </p>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredDocs.map((doc) => (
              <motion.div key={doc.id} variants={itemVariants}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${doc.color} bg-opacity-10`}>
                        <FileText className={`h-6 w-6 ${doc.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div className="flex items-center gap-1">
                        {doc.favorite && <Star className="h-4 w-4 text-amber-400 fill-amber-400" />}
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100">
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-2">{doc.title}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${subjectColors[doc.subject] || 'bg-gray-100 text-gray-600'}`}>
                        {doc.subject}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {doc.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {doc.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Brain className="h-3 w-3" />
                        {doc.flashcards} fiches
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {filteredDocs.map((doc) => (
              <motion.div key={doc.id} variants={itemVariants}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg shrink-0 ${doc.color} bg-opacity-10`}>
                        <FileText className={`h-5 w-5 ${doc.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">{doc.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${subjectColors[doc.subject] || 'bg-gray-100 text-gray-600'}`}>
                            {doc.subject}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {doc.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-400 shrink-0">
                        <span className="flex items-center gap-1 hidden sm:inline">
                          <Brain className="h-3 w-3" />
                          {doc.flashcards} fiches
                        </span>
                        <span className="hidden sm:inline">{doc.date}</span>
                        {doc.favorite && <Star className="h-4 w-4 text-amber-400 fill-amber-400" />}
                        <button className="p-1 rounded hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
