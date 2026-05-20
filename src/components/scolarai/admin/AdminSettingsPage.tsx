'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Globe,
  Target,
  Brain,
  Zap,
  Save,
  Trash2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function AdminSettingsPage() {
  // Général
  const [platformName, setPlatformName] = useState('ScolarAI')
  const [platformUrl, setPlatformUrl] = useState('https://scolarai.fr')
  const [platformDescription, setPlatformDescription] = useState('')
  const [contactEmail, setContactEmail] = useState('contact@scolarai.fr')

  // Limites
  const [freeMaxDocs, setFreeMaxDocs] = useState(3)
  const [freeMaxQuiz, setFreeMaxQuiz] = useState(10)
  const [freeMaxStorage, setFreeMaxStorage] = useState(50)

  // Intelligence Artificielle
  const [defaultModel, setDefaultModel] = useState('gpt-4o')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(4096)

  // Fonctionnalités
  const [flashcardsIA, setFlashcardsIA] = useState(true)
  const [coachIA, setCoachIA] = useState(true)
  const [groupesEtude, setGroupesEtude] = useState(true)
  const [pomodoro, setPomodoro] = useState(true)
  const [modeSombre, setModeSombre] = useState(false)

  // Maintenance
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState('')

  const handleClearCache = () => {
    // Placeholder action
  }

  const handleSave = () => {
    // Placeholder action
  }

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-emerald-500" />
          Configuration
        </h1>
        <p className="text-sm text-gray-500 mt-1">Paramètres globaux de la plateforme</p>
      </motion.div>

      <div className="space-y-6">
        {/* ─── Général ─────────────────────────────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-5 w-5 text-emerald-500" />
                Général
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Nom de la plateforme</Label>
                  <Input
                    id="platform-name"
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform-url">URL</Label>
                  <Input
                    id="platform-url"
                    value={platformUrl}
                    onChange={(e) => setPlatformUrl(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform-desc">Description</Label>
                <Textarea
                  id="platform-desc"
                  placeholder="Décrivez votre plateforme..."
                  value={platformDescription}
                  onChange={(e) => setPlatformDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email de contact</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Limites ─────────────────────────────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-emerald-500" />
                Limites
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Gratuit */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Plan Gratuit</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="free-max-docs">Documents max</Label>
                    <Input
                      id="free-max-docs"
                      type="number"
                      min={0}
                      value={freeMaxDocs}
                      onChange={(e) => setFreeMaxDocs(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="free-max-quiz">Quiz max/mois</Label>
                    <Input
                      id="free-max-quiz"
                      type="number"
                      min={0}
                      value={freeMaxQuiz}
                      onChange={(e) => setFreeMaxQuiz(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="free-max-storage">Stockage max (MB)</Label>
                    <Input
                      id="free-max-storage"
                      type="number"
                      min={0}
                      value={freeMaxStorage}
                      onChange={(e) => setFreeMaxStorage(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Pro */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Plan Pro</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Documents max</Label>
                    <div className="flex items-center h-9 px-3 rounded-md border bg-gray-50">
                      <span className="text-sm text-gray-600">Illimité</span>
                      <Badge className="ml-auto bg-emerald-100 text-emerald-700 text-[10px] border-0">Pro</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Quiz max/mois</Label>
                    <div className="flex items-center h-9 px-3 rounded-md border bg-gray-50">
                      <span className="text-sm text-gray-600">Illimité</span>
                      <Badge className="ml-auto bg-emerald-100 text-emerald-700 text-[10px] border-0">Pro</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Intelligence Artificielle ───────────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="h-5 w-5 text-emerald-500" />
                Intelligence Artificielle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-model">Modèle par défaut</Label>
                  <Select value={defaultModel} onValueChange={setDefaultModel}>
                    <SelectTrigger id="default-model">
                      <SelectValue placeholder="Sélectionner un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
                      <SelectItem value="claude-3.5">Claude 3.5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Température</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min={0}
                    max={2}
                    step={0.1}
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                  />
                  <p className="text-[11px] text-gray-400">Entre 0 et 2</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-tokens">Max tokens</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    min={1}
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Fonctionnalités ─────────────────────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-5 w-5 text-emerald-500" />
                Fonctionnalités
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'flashcards-ia', label: 'Flashcards IA', description: 'Génération automatique de flashcards par l\'IA', checked: flashcardsIA, onChange: setFlashcardsIA },
                { id: 'coach-ia', label: 'Coach IA', description: 'Assistant personnel d\'apprentissage intelligent', checked: coachIA, onChange: setCoachIA },
                { id: 'groupes-etude', label: 'Groupes d\'étude', description: 'Collaboration et groupes de révision', checked: groupesEtude, onChange: setGroupesEtude },
                { id: 'pomodoro', label: 'Pomodoro', description: 'Minuteur et gestion du temps d\'étude', checked: pomodoro, onChange: setPomodoro },
                { id: 'mode-sombre', label: 'Mode sombre', description: 'Thème sombre pour l\'interface', checked: modeSombre, onChange: setModeSombre, comingSoon: true },
              ].map((feature, index) => (
                <div key={feature.id}>
                  {index > 0 && <Separator className="mb-4" />}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={feature.id} className="text-sm font-medium text-gray-900 cursor-pointer">
                          {feature.label}
                        </Label>
                        {feature.comingSoon && (
                          <Badge className="bg-amber-100 text-amber-700 text-[10px] border-0">Bientôt</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
                    </div>
                    <Switch
                      id={feature.id}
                      checked={feature.checked}
                      onCheckedChange={feature.onChange}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Maintenance ─────────────────────────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="h-5 w-5 text-emerald-500" />
                Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <Label htmlFor="maintenance-mode" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Mode maintenance
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Désactive l&apos;accès à la plateforme pour les utilisateurs
                  </p>
                </div>
                <Switch
                  id="maintenance-mode"
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>

              {maintenanceMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="maintenance-msg">Message personnalisé</Label>
                  <Textarea
                    id="maintenance-msg"
                    placeholder="Nous effectuons une maintenance programmée. Merci de réessayer dans quelques minutes."
                    value={maintenanceMessage}
                    onChange={(e) => setMaintenanceMessage(e.target.value)}
                    rows={3}
                  />
                </motion.div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Vider le cache</p>
                  <p className="text-xs text-gray-500 mt-0.5">Supprime le cache des données temporaires</p>
                </div>
                <Button
                  variant="outline"
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={handleClearCache}
                >
                  <Trash2 className="h-4 w-4" />
                  Vider le cache
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ─── Save Button ─────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="mt-6 flex justify-end">
        <Button
          className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 px-6"
          onClick={handleSave}
        >
          <Save className="h-4 w-4" />
          Enregistrer la configuration
        </Button>
      </motion.div>
    </motion.div>
  )
}
