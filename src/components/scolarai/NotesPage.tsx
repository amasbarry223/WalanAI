'use client'

import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  FileText,
  Search,
  Plus,
  Star,
  Pin,
  Sparkles,
  Brain,
  Clock,
  Tag,
  BookOpen,
  Eye,
  Edit3,
  Trash2,
  MoreVertical,
  LayoutGrid,
  List,
  X,
  ArrowRight,
} from 'lucide-react'
import { useState, useMemo } from 'react'

// ─── Types ───────────────────────────────────────────────────────────

interface Note {
  id: number
  title: string
  subject: string
  tags: string[]
  createdAt: string
  updatedAt: string
  pinned: boolean
  favorite: boolean
  preview: string
  content: string
}

type ViewMode = 'split' | 'grid'
type SubjectFilter = 'Tous' | string

// ─── Subject colors ──────────────────────────────────────────────────

const subjectColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Droit: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-l-blue-500',
    dot: 'bg-blue-500',
  },
  Économie: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-l-amber-500',
    dot: 'bg-amber-500',
  },
  Informatique: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-l-emerald-500',
    dot: 'bg-emerald-500',
  },
  Histoire: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-l-purple-500',
    dot: 'bg-purple-500',
  },
  Mathématiques: {
    bg: 'bg-rose-100',
    text: 'text-rose-700',
    border: 'border-l-rose-500',
    dot: 'bg-rose-500',
  },
  Gestion: {
    bg: 'bg-teal-100',
    text: 'text-teal-700',
    border: 'border-l-teal-500',
    dot: 'bg-teal-500',
  },
}

// ─── Mock Data ───────────────────────────────────────────────────────

const mockNotes: Note[] = [
  {
    id: 1,
    title: 'Cours Droit Civil - Les Contrats',
    subject: 'Droit',
    tags: ['contrats', 'obligations', 'droit civil'],
    createdAt: '10 Mai 2026',
    updatedAt: '15 Mai 2026',
    pinned: true,
    favorite: true,
    preview: 'Les contrats sont des conventions par lesquelles une ou plusieurs personnes s\'obligent...',
    content: `# Les Contrats en Droit Civil

## Définition

Un contrat est une **convention** par laquelle une ou plusieurs personnes s'obligent, envers une ou plusieurs autres, à donner, à faire ou à ne pas faire quelque chose (Art. 1101 Code civil).

## Conditions de validité

Pour qu'un contrat soit valable, il faut réunir **4 conditions essentielles** :

1. **Le consentement** des parties — Le consentement doit être libre et éclairé. Le dol, la violence ou l'erreur vicient le consentement.
2. **La capacité** de contracter — Les mineurs non émancipés et les majeurs protégés ont une capacité limitée.
3. **L'objet** du contrat — L'objet doit être déterminé, possible et licite.
4. **La cause** — La cause doit être licite et réelle.

## Classification des contrats

| Type | Description |
|------|------------|
| **Synallagmatique** | Chaque partie s'oblige envers l'autre (vente, louage) |
| **Unilatéral** | Une seule partie s'oblige (donation, prêt) |
| **À titre onéreux** | Chaque partie reçoit un avantage en contrepartie |
| **À titre gratuit** | Une partie procure un avantage sans contrepartie |

## La formation du contrat

### L'offre (pollicitation)
L'offre est une proposition ferme et précise de contracter. Elle peut être révoquée tant qu'elle n'a pas été acceptée, sauf si l'offrant s'est engagé à la maintenir.

### L'acceptation
L'acceptation doit être **parfaite** c'est-à-dire conforme à l'offre. Le silence ne vaut pas acceptation, sauf cas exceptionnels.

### La rencontre des volontés
Le contrat se forme au moment où l'acceptation parvient à l'offrant (théorie de la réception).

## Exécution et inexécution

- Le contrat est la **loi des parties** (force obligatoire)
- L'inexécution peut donner lieu à :
  - **L'exécution forcée**
  - **La résolution** du contrat
  - **Des dommages et intérêts**

> *"Les conventions légalement formées tiennent lieu de loi à ceux qui les ont faites."* — Art. 1103 Code civil`,
  },
  {
    id: 2,
    title: 'Résumé Microéconomie Ch.3',
    subject: 'Économie',
    tags: ['microéconomie', 'offre', 'demande', 'équilibre'],
    createdAt: '8 Mai 2026',
    updatedAt: '12 Mai 2026',
    pinned: false,
    favorite: true,
    preview: 'Le marché est un mécanisme par lequel les acheteurs et les vendeurs interagissent...',
    content: `# Microéconomie — Chapitre 3 : L'Offre et la Demande

## La demande

La courbe de demande représente la relation entre le **prix** d'un bien et la **quantité demandée**, toutes choses égales par ailleurs (*ceteris paribus*).

### Loi de la demande
> Lorsque le prix d'un bien augmente, la quantité demandée diminue (et inversement).

**Déterminants de la demande :**
- Le prix du bien
- Le revenu des consommateurs
- Les prix des biens substituts et compléments
- Les goûts et préférences
- Les anticipations

### Élasticité-prix de la demande
$$e_p = \\frac{\\%\\Delta Q_d}{\\%\\Delta P}$$

- |e_p| > 1 → demande **élastique**
- |e_p| < 1 → demande **inélastique**
- |e_p| = 1 → demande **unitaire**

## L'offre

La courbe d'offre montre la relation entre le prix et la quantité offerte.

### Loi de l'offre
> Lorsque le prix augmente, la quantité offerte augmente.

**Déterminants de l'offre :**
- Le prix du bien
- Les coûts de production
- La technologie
- Le nombre d'entreprises
- Les anticipations des producteurs

## L'équilibre du marché

L'équilibre est atteint au point d'intersection des courbes d'offre et de demande.

- **Prix d'équilibre (P*)** : prix pour lequel Qd = Qo
- **Quantité d'équilibre (Q*)** : quantité échangée à l'équilibre

### Déplacements vs mouvements
- Un changement de prix → **mouvement le long** de la courbe
- Un changement des déterminants → **déplacement** de la courbe

## Rôle des prix

Les prix remplissent trois fonctions essentielles :
1. **Fonction de signal** — Indiquent la rareté relative
2. **Fonction d'incitation** — Motivent les agents économiques
3. **Fonction de rationnement** — Allouent les ressources rares`,
  },
  {
    id: 3,
    title: 'Notes Algorithmes - Arbres Binaires',
    subject: 'Informatique',
    tags: ['algorithmes', 'arbres', 'parcours', 'complexité'],
    createdAt: '5 Mai 2026',
    updatedAt: '10 Mai 2026',
    pinned: true,
    favorite: false,
    preview: 'Un arbre binaire est une structure de données hiérarchique où chaque nœud a au plus deux enfants...',
    content: `# Arbres Binaires — Notes d'Algorithmes

## Définition

Un **arbre binaire** est une structure de données hiérarchique dans laquelle chaque nœud possède au plus deux enfants :
- **Fils gauche** (left child)
- **Fils droit** (right child)

### Terminologie
- **Racine** : nœud sans parent (sommet de l'arbre)
- **Feuille** : nœud sans enfant
- **Hauteur** : nombre d'arêtes du chemin le plus long de la racine à une feuille
- **Profondeur** : nombre d'arêtes de la racine au nœud
- **Taille** : nombre total de nœuds

## Types d'arbres binaires

1. **Arbre binaire complet** — Chaque niveau est entièrement rempli
2. **Arbre binaire parfait** — Tous les niveaux sont remplis sauf le dernier (rempli de gauche à droite)
3. **Arbre binaire de recherche (ABR)** — Pour chaque nœud : gauche < parent < droit
4. **Arbre équilibré** — La différence de hauteur entre les sous-arbres est ≤ 1

## Parcours d'arbres

### Parcours en profondeur (DFS)
\`\`\`
Préfixe  : Racine → Gauche → Droite
Infixe   : Gauche → Racine → Droite
Postfixe : Gauche → Droite → Racine
\`\`\`

### Parcours en largeur (BFS)
On visite les nœuds niveau par niveau, de gauche à droite.

## Complexités

| Opération | ABR (moyen) | ABR (pire) | Arbre équilibré |
|-----------|------------|------------|----------------|
| Recherche | O(log n) | O(n) | O(log n) |
| Insertion | O(log n) | O(n) | O(log n) |
| Suppression | O(log n) | O(n) | O(log n) |

## Arbres AVL

Un **arbre AVL** est un ABR équilibré où pour chaque nœud :
|hauteur(gauche) - hauteur(droite)| ≤ 1

**Rotations de rééquilibrage :**
- Rotation simple droite (LL)
- Rotation simple gauche (RR)
- Rotation double gauche-droite (LR)
- Rotation double droite-gauche (RL)

> 💡 Les AVL garantissent des opérations en **O(log n)** même dans le pire des cas.`,
  },
  {
    id: 4,
    title: 'Timeline Révolution Française',
    subject: 'Histoire',
    tags: ['révolution', 'timeline', '1789', 'Napoléon'],
    createdAt: '3 Mai 2026',
    updatedAt: '8 Mai 2026',
    pinned: false,
    favorite: false,
    preview: 'La Révolution française (1789-1799) est un événement majeur qui a transformé la France...',
    content: `# Timeline — La Révolution Française (1789-1799)

## Les causes

### Crise financière
- Déficit colossal de l'État français
- Coût des guerres (Guerre d'Indépendance américaine)
- Système fiscal inéquitable (privilèges de la noblesse)

### Crise sociale
- **Trois ordres** : Clergé (0,5%), Noblesse (1,5%), Tiers-État (98%)
- Mécontentement croissant du Tiers-État

### Crise intellectuelle
- Influence des **Lumières** (Rousseau, Voltaire, Montesquieu)

---

## Chronologie

### 1789 — Le déclenchement
- **5 mai** : Ouverture des États Généraux à Versailles
- **17 juin** : Le Tiers-État se proclame Assemblée nationale
- **20 juin** : Serment du Jeu de Paume
- **14 juillet** : **Prise de la Bastille** 🏛️
- **4 août** : Abolition des privilèges féodaux
- **26 août** : Déclaration des droits de l'homme et du citoyen

### 1791-1792 — La monarchie constitutionnelle
- **1791** : Constitution civile du clergé
- **20 juin 1791** : Fuite à Varennes
- **10 août 1792** : Chute de la monarchie

### 1793-1794 — La Terreur
- **21 janvier 1793** : Exécution de Louis XVI
- **1793-1794** : La Terreur sous Robespierre
- **Septembre 1793** : Loi des suspects

### 1794 — La chute de Robespierre
- **9 thermidor (27 juillet)** : Chute de Robespierre
- Fin de la Terreur

### 1795-1799 — Le Directoire
- Instauration du Directoire (5 directeurs)
- Instabilité politique

### 1799 — Fin de la Révolution
- **18 brumaire (9 novembre)** : Coup d'État de Napoléon Bonaparte
- Fin de la Révolution

---

> *"La Révolution française est le plus grand événement de l'histoire."* — Jules Michelet`,
  },
  {
    id: 5,
    title: 'Formules Statistiques',
    subject: 'Mathématiques',
    tags: ['statistiques', 'formules', 'variance', 'écart-type'],
    createdAt: '1 Mai 2026',
    updatedAt: '5 Mai 2026',
    pinned: false,
    favorite: true,
    preview: 'Les statistiques descriptives permettent de résumer et d\'analyser un ensemble de données...',
    content: `# Formules Statistiques

## Statistiques descriptives de base

### Mesures de tendance centrale

**Moyenne arithmétique :**
$$\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i$$

**Médiane :**
Valeur qui divise la série ordonnée en deux parties égales.

**Mode :**
Valeur la plus fréquente dans la série.

### Mesures de dispersion

**Variance :**
$$s^2 = \\frac{1}{n} \\sum_{i=1}^{n} (x_i - \\bar{x})^2$$

**Écart-type :**
$$s = \\sqrt{\\frac{1}{n} \\sum_{i=1}^{n} (x_i - \\bar{x})^2}$$

**Coefficient de variation :**
$$CV = \\frac{s}{\\bar{x}} \\times 100$$

### Mesures de position

**Quartiles :**
- Q1 : 25e percentile
- Q2 = Médiane : 50e percentile
- Q3 : 75e percentile

**Écart interquartile :**
$$IQR = Q_3 - Q_1$$

## Probabilités

**Loi binomiale :**
$$P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}$$

**Espérance :** E(X) = np
**Variance :** V(X) = np(1-p)

## Loi Normale (Gaussienne)

$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$$

**Propriétés :**
- Symétrique autour de μ
- 68% des valeurs dans [μ-σ, μ+σ]
- 95% des valeurs dans [μ-2σ, μ+2σ]
- 99,7% des valeurs dans [μ-3σ, μ+3σ]

> 💡 *Pour passer de la variance d'échantillon à la variance estimée, on divise par (n-1) au lieu de n (estimateur sans biais de Bessel).*`,
  },
  {
    id: 6,
    title: 'Méthodologie Dissertation',
    subject: 'Droit',
    tags: ['méthodologie', 'dissertation', 'plan', 'rédaction'],
    createdAt: '28 Avril 2026',
    updatedAt: '2 Mai 2026',
    pinned: false,
    favorite: false,
    preview: 'La dissertation juridique est un exercice fondamental qui exige une méthode rigoureuse...',
    content: `# Méthodologie de la Dissertation Juridique

## Introduction

La dissertation juridique est un exercice **fondamental** qui exige une méthode rigoureuse et une pensée structurée. Contrairement à la dissertation littéraire, elle repose sur le raisonnement logique et l'argumentation juridique.

---

## Structure de la dissertation

### I. L'Introduction (≈1/3 du devoir)

L'introduction suit la méthode de **l'entonnoir** :

1. **Amorce** (phrase d'accroche) — Contextualiser le sujet
2. **Définition des termes** du sujet — Préciser le vocabulaire juridique
3. **Intérêt du sujet** — Pourquoi cette question est-elle pertinente ?
4. **Problématique** — La question centrale posée par le sujet
5. **Annonce du plan** — Présentation des deux parties

> ⚠️ La problématique doit être une **question ouverte**, jamais une question fermée (oui/non).

### II. Le Développement (≈2/3 du devoir)

#### Structure obligatoire : 2 parties, 2 sous-parties

\`\`\`
I. Première idée principale
   A. Premier argument
   B. Deuxième argument

II. Deuxième idée principale
   A. Premier argument
   B. Deuxième argument
\`\`\`

#### Règles d'or :
- **Pas de plan thématique** — Le plan doit être dialectique ou analytique
- **Transitions** entre les parties — Assurer la fluidité du raisonnement
- **Chaque sous-partie** doit contenir : Idée → Argument → Exemple

### III. La Conclusion

- **Bilan** des deux parties
- **Ouverture** — Lier le sujet à une question plus large

## Types de plans

| Type | Structure | Quand l'utiliser |
|------|-----------|-----------------|
| **Dialectique** | Thèse / Antithèse / Synthèse | Sujet controversé |
| **Analytique** | Causes / Conséquences | Sujet descriptif |
| **Thématique** | Aspects du sujet | Rarement en droit |

## Erreurs fréquentes à éviter

1. ❌ Ne pas répondre à la problématique
2. ❌ Réciter le cours sans argumenter
3. ❌ Confondre exemple et argument
4. ❌ Oublier les transitions
5. ❌ Faire un plan thématique`,
  },
  {
    id: 7,
    title: 'TP Base de Données',
    subject: 'Informatique',
    tags: ['SQL', 'base de données', 'jointures', 'TP'],
    createdAt: '25 Avril 2026',
    updatedAt: '30 Avril 2026',
    pinned: false,
    favorite: false,
    preview: 'Ce TP porte sur la manipulation de bases de données relationnelles avec SQL...',
    content: `# TP — Base de Données Relationnelles

## Objectifs du TP

- Maîtriser les **requêtes SQL** de base et avancées
- Comprendre les **jointures** entre tables
- Implémenter un **schéma relationnel**

---

## Modèle de données

### Tables du TP

**Étudiants** (id, nom, prénom, email, formation)
**Cours** (id, intitulé, crédits, département)
**Inscriptions** (etudiant_id, cours_id, note, semestre)

### Clés
- **Clé primaire** : id pour chaque table
- **Clé étrangère** : etudiant_id, cours_id dans Inscriptions

---

## Requêtes SQL

### Requêtes de base

\`\`\`sql
-- Sélection simple
SELECT nom, prenom FROM Etudiants WHERE formation = 'Licence Droit';

-- Agrégation
SELECT formation, COUNT(*) AS nb_etudiants
FROM Etudiants
GROUP BY formation;
\`\`\`

### Jointures

\`\`\`sql
-- Jointure interne (INNER JOIN)
SELECT e.nom, c.intitule, i.note
FROM Etudiants e
INNER JOIN Inscriptions i ON e.id = i.etudiant_id
INNER JOIN Cours c ON c.id = i.cours_id
WHERE i.note >= 10;

-- Jointure externe gauche (LEFT JOIN)
SELECT e.nom, COUNT(i.cours_id) AS nb_cours
FROM Etudiants e
LEFT JOIN Inscriptions i ON e.id = i.etudiant_id
GROUP BY e.nom;
\`\`\`

### Sous-requêtes

\`\`\`sql
-- Étudiants ayant une note supérieure à la moyenne
SELECT e.nom, i.note
FROM Etudiants e
JOIN Inscriptions i ON e.id = i.etudiant_id
WHERE i.note > (SELECT AVG(note) FROM Inscriptions);
\`\`\`

## Exercices

1. Trouver les étudiants inscrits à au moins 3 cours
2. Calculer la moyenne par cours
3. Lister les cours sans aucun inscrit
4. Trouver le top 5 des meilleures notes

> 💡 *Attention aux valeurs NULL dans les jointures externes !*`,
  },
  {
    id: 8,
    title: 'Révision Comptabilité',
    subject: 'Gestion',
    tags: ['comptabilité', 'bilan', 'compte de résultat', 'révision'],
    createdAt: '20 Avril 2026',
    updatedAt: '28 Avril 2026',
    pinned: false,
    favorite: true,
    preview: 'La comptabilité générale est le système d\'information qui permet de traduire la réalité économique...',
    content: `# Révision — Comptabilité Générale

## Principes fondamentaux

La comptabilité générale est le **système d'information** qui permet de traduire la réalité économique de l'entreprise en termes financiers.

### Principes comptables
1. **Principe de prudence** — Ne pas anticiper les profits, mais provisionner les pertes
2. **Principe de continuité d'exploitation** — L'entreprise continuera son activité
3. **Principe du coût historique** — Les biens sont enregistrés à leur prix d'acquisition
4. **Principe de permanence des méthodes** — Stabilité des méthodes d'évaluation
5. **Principe d'indépendance des exercices** — Rattachement des charges et produits au bon exercice

---

## Le Bilan

Le bilan est une **photographie du patrimoine** de l'entreprise à un instant donné.

### Structure

| ACTIF | PASSIF |
|-------|--------|
| Actif immobilisé | Capitaux propres |
| Actif circulant | Dettes |
| Trésorerie | | |

**Équation fondamentale :**
> Actif = Passif (ou : Emplois = Ressources)

## Le Compte de Résultat

Il récapitule les **produits** et les **charges** de l'exercice.

### Résultat = Produits - Charges

- **Résultat positif** → Bénéfice
- **Résultat négatif** → Perte

## L'enregistrement comptable

### Le mécanisme de la partie double

Toute écriture comptable affecte au moins **deux comptes** :

- Un compte **débité**
- Un compte **crédité**

**Règle :** Total des débits = Total des crédits

### Exemple
\`\`\`
Achat de marchandises 1000€ par chèque :
  Débit : 607 Achats de marchandises    1000€
  Crédit : 512 Banque                    1000€
\`\`\`

## Les amortissements

L'amortissement est la **constatation comptable** de la dépréciation d'une immobilisation.

### Amortissement linéaire
$$\\text{Dotation} = \\frac{\\text{Valeur d'origine}}{\\text{Durée d'utilisation}}$$

### Amortissement dégressif
$$\\text{Dotation} = \\text{VNC} \\times \\frac{\\text{Coeff. dégressif}}{\\text{Durée}}$$

> 💡 *Coefficients dégressifs : 1,25 (3-4 ans), 1,75 (5-6 ans), 2,25 (7+ ans)*`,
  },
]

// ─── Animation variants ──────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

// ─── Simple Markdown-like renderer ───────────────────────────────────

function renderNoteContent(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let inCodeBlock = false
  let codeLines: string[] = []
  let inTable = false
  let tableRows: string[][] = []
  let tableHeaders: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${i}`}
            className="bg-gray-900 text-emerald-400 rounded-lg p-4 my-3 text-xs sm:text-sm overflow-x-auto font-mono leading-relaxed"
          >
            {codeLines.join('\n')}
          </pre>
        )
        codeLines = []
        inCodeBlock = false
      } else {
        inCodeBlock = true
      }
      continue
    }

    if (inCodeBlock) {
      codeLines.push(line)
      continue
    }

    // Table detection
    if (line.includes('|') && line.trim().startsWith('|')) {
      const cells = line.split('|').filter(c => c.trim() !== '')
      if (!inTable) {
        inTable = true
        tableHeaders = cells.map(c => c.trim())
        tableRows = []
        continue
      }
      // Skip separator row
      if (cells.every(c => /^[\s-:]+$/.test(c))) continue
      tableRows.push(cells.map(c => c.trim()))
      // Check if next line is not a table row
      const nextLine = lines[i + 1]
      if (!nextLine || !nextLine.includes('|') || !nextLine.trim().startsWith('|')) {
        elements.push(
          <div key={`table-${i}`} className="overflow-x-auto my-3">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-emerald-200">
                  {tableHeaders.map((h, hi) => (
                    <th key={hi} className="text-left py-2 px-3 font-semibold text-gray-700 bg-emerald-50">
                      {renderInlineMarkdown(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, ri) => (
                  <tr key={ri} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className="py-2 px-3 text-gray-600">
                        {renderInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        inTable = false
        tableHeaders = []
        tableRows = []
      }
      continue
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-base font-bold text-gray-800 mt-5 mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {renderInlineMarkdown(line.slice(4))}
        </h3>
      )
      continue
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-2 pb-1 border-b border-emerald-100">
          {renderInlineMarkdown(line.slice(3))}
        </h2>
      )
      continue
    }
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-xl font-bold text-emerald-700 mb-3">
          {renderInlineMarkdown(line.slice(2))}
        </h1>
      )
      continue
    }

    // Horizontal rule
    if (line.match(/^---+$/)) {
      elements.push(<Separator key={i} className="my-4" />)
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote
          key={i}
          className="border-l-4 border-emerald-400 pl-4 py-2 my-3 bg-emerald-50 rounded-r-lg text-gray-700 italic text-sm"
        >
          {renderInlineMarkdown(line.slice(2))}
        </blockquote>
      )
      continue
    }

    // Ordered list
    if (line.match(/^\d+\.\s/)) {
      elements.push(
        <li key={i} className="ml-5 list-decimal text-gray-700 text-sm mb-1">
          {renderInlineMarkdown(line.replace(/^\d+\.\s/, ''))}
        </li>
      )
      continue
    }

    // Unordered list
    if (line.startsWith('- ')) {
      elements.push(
        <li key={i} className="ml-5 list-disc text-gray-700 text-sm mb-1">
          {renderInlineMarkdown(line.slice(2))}
        </li>
      )
      continue
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />)
      continue
    }

    // Paragraph
    elements.push(
      <p key={i} className="text-gray-700 text-sm leading-relaxed mb-1">
        {renderInlineMarkdown(line)}
      </p>
    )
  }

  return elements
}

function renderInlineMarkdown(text: string): React.ReactNode {
  // Simple inline markdown: **bold**, *italic*, `code`
  const parts: React.ReactNode[] = []
  let remaining = text
  let keyIndex = 0

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    // Inline code
    const codeMatch = remaining.match(/`(.+?)`/)
    // Italic
    const italicMatch = remaining.match(/(?<!\*)\*([^*]+?)\*(?!\*)/)

    let firstMatch: { index: number; length: number; node: React.ReactNode } | null = null

    if (boldMatch && boldMatch.index !== undefined) {
      const candidate = { index: boldMatch.index, length: boldMatch[0].length, node: <strong key={`b-${keyIndex++}`} className="font-semibold text-gray-900">{boldMatch[1]}</strong> }
      if (!firstMatch || candidate.index < firstMatch.index) firstMatch = candidate
    }
    if (codeMatch && codeMatch.index !== undefined) {
      const candidate = { index: codeMatch.index, length: codeMatch[0].length, node: <code key={`c-${keyIndex++}`} className="bg-gray-100 text-emerald-700 px-1.5 py-0.5 rounded text-xs font-mono">{codeMatch[1]}</code> }
      if (!firstMatch || candidate.index < firstMatch.index) firstMatch = candidate
    }
    if (italicMatch && italicMatch.index !== undefined) {
      const candidate = { index: italicMatch.index, length: italicMatch[0].length, node: <em key={`i-${keyIndex++}`} className="italic text-gray-600">{italicMatch[1]}</em> }
      if (!firstMatch || candidate.index < firstMatch.index) firstMatch = candidate
    }

    if (firstMatch) {
      if (firstMatch.index > 0) {
        parts.push(remaining.slice(0, firstMatch.index))
      }
      parts.push(firstMatch.node)
      remaining = remaining.slice(firstMatch.index + firstMatch.length)
    } else {
      parts.push(remaining)
      break
    }
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>
}

// ─── Main Component ──────────────────────────────────────────────────

export default function NotesPage() {
  const { setCurrentPage } = useAppStore()
  const [notes, setNotes] = useState<Note[]>(mockNotes)
  const [selectedNoteId, setSelectedNoteId] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSubject, setActiveSubject] = useState<SubjectFilter>('Tous')
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [mobileShowEditor, setMobileShowEditor] = useState(false)

  // Subjects from notes
  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(new Set(notes.map(n => n.subject)))
    return ['Tous', ...uniqueSubjects]
  }, [notes])

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return notes
      .filter(note => {
        if (activeSubject !== 'Tous' && note.subject !== activeSubject) return false
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          return (
            note.title.toLowerCase().includes(q) ||
            note.subject.toLowerCase().includes(q) ||
            note.tags.some(t => t.toLowerCase().includes(q)) ||
            note.preview.toLowerCase().includes(q)
          )
        }
        return true
      })
      .sort((a, b) => {
        // Pinned first
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        // Then favorites
        if (a.favorite && !b.favorite) return -1
        if (!a.favorite && b.favorite) return 1
        return 0
      })
  }, [notes, activeSubject, searchQuery])

  const selectedNote = notes.find(n => n.id === selectedNoteId) ?? null

  // Toggle favorite
  const toggleFavorite = (noteId: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, favorite: !n.favorite } : n))
  }

  // Toggle pinned
  const togglePinned = (noteId: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, pinned: !n.pinned } : n))
  }

  // Select a note
  const selectNote = (noteId: number) => {
    setSelectedNoteId(noteId)
    setMobileShowEditor(true)
  }

  // Create a new note
  const createNote = () => {
    const newId = Math.max(...notes.map(n => n.id)) + 1
    const newNote: Note = {
      id: newId,
      title: 'Nouvelle note',
      subject: 'Droit',
      tags: ['nouveau'],
      createdAt: '19 Mai 2026',
      updatedAt: '19 Mai 2026',
      pinned: false,
      favorite: false,
      preview: 'Commencez à écrire votre note ici...',
      content: '# Nouvelle note\n\nCommencez à écrire votre note ici...',
    }
    setNotes(prev => [newNote, ...prev])
    setSelectedNoteId(newId)
    setMobileShowEditor(true)
  }

  // Delete a note
  const deleteNote = (noteId: number) => {
    setNotes(prev => prev.filter(n => n.id !== noteId))
    if (selectedNoteId === noteId) {
      const remaining = notes.filter(n => n.id !== noteId)
      if (remaining.length > 0) {
        setSelectedNoteId(remaining[0].id)
      } else {
        setSelectedNoteId(-1)
      }
    }
  }

  // Count notes per subject
  const subjectCount = useMemo(() => {
    const counts: Record<string, number> = { Tous: notes.length }
    notes.forEach(n => {
      counts[n.subject] = (counts[n.subject] || 0) + 1
    })
    return counts
  }, [notes])

  return (
    <motion.div
      className="p-4 md:p-6 max-w-[1400px] mx-auto min-h-screen flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setCurrentPage('dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-emerald-500" />
              Carnets de notes
            </h1>
            <p className="text-xs md:text-sm text-gray-500">Prenez des notes intelligentes avec l&apos;IA</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="hidden sm:flex border rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => setViewMode('split')}
              className={`p-2 transition-colors ${viewMode === 'split' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:bg-gray-50'}`}
              title="Vue détaillée"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 border-l transition-colors ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:bg-gray-50'}`}
              title="Vue grille"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
            onClick={createNote}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nouvelle note</span>
          </Button>
        </div>
      </motion.div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Search for grid */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans les notes..."
                className="pl-10 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Subject tabs for grid */}
          <motion.div variants={itemVariants} className="mb-6 overflow-x-auto">
            <Tabs value={activeSubject} onValueChange={(v) => setActiveSubject(v)}>
              <TabsList className="bg-gray-100 h-auto flex-wrap">
                {subjects.map(subject => (
                  <TabsTrigger
                    key={subject}
                    value={subject}
                    className="text-xs gap-1.5 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                  >
                    {subject}
                    <span className="text-[10px] opacity-60">({subjectCount[subject] || 0})</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Card
                    className={`cursor-pointer hover:shadow-lg transition-all group border-l-4 ${subjectColors[note.subject]?.border || 'border-l-gray-300'}`}
                    onClick={() => { setSelectedNoteId(note.id); setViewMode('split'); setMobileShowEditor(true); }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          {note.pinned && <Pin className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500" />}
                          <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${subjectColors[note.subject]?.bg || 'bg-gray-100'} ${subjectColors[note.subject]?.text || 'text-gray-600'}`}>
                            {note.subject}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={(e) => toggleFavorite(note.id, e)}
                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                          >
                            <Star className={`h-3.5 w-3.5 ${note.favorite ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2 group-hover:text-emerald-700 transition-colors">
                        {note.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{note.preview}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[11px] text-gray-400">
                          <Clock className="h-3 w-3" />
                          {note.updatedAt}
                        </div>
                        <div className="flex items-center gap-1">
                          {note.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredNotes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="p-4 bg-gray-50 rounded-full mb-4">
                <FileText className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune note trouvée</h3>
              <p className="text-gray-500 text-sm text-center">Essayez de modifier vos filtres ou créez une nouvelle note</p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Split View */}
      {viewMode === 'split' && (
        <motion.div variants={itemVariants} className="flex-1 flex gap-4 md:gap-6 min-h-0">
          {/* Sidebar - Notes List */}
          <div className={`${mobileShowEditor ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[380px] lg:w-[400px] shrink-0`}>
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans les notes..."
                className="pl-10 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Subject filter */}
            <div className="mb-3 overflow-x-auto pb-1">
              <Tabs value={activeSubject} onValueChange={(v) => setActiveSubject(v)}>
                <TabsList className="bg-gray-100 h-auto p-1 flex-nowrap">
                  {subjects.map(subject => (
                    <TabsTrigger
                      key={subject}
                      value={subject}
                      className="text-xs px-2.5 data-[state=active]:bg-emerald-500 data-[state=active]:text-white shrink-0"
                    >
                      {subject}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Notes list */}
            <ScrollArea className="flex-1 rounded-lg">
              <div className="space-y-1.5 pr-1">
                <AnimatePresence>
                  {filteredNotes.map((note, index) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${
                          selectedNoteId === note.id
                            ? `${subjectColors[note.subject]?.border || 'border-l-emerald-500'} bg-emerald-50/50 shadow-sm`
                            : `${subjectColors[note.subject]?.border || 'border-l-gray-300'} hover:bg-gray-50`
                        }`}
                        onClick={() => selectNote(note.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-1">
                                {note.pinned && <Pin className="h-3 w-3 text-emerald-500 shrink-0" />}
                                <h4 className="text-sm font-medium text-gray-900 truncate flex-1">{note.title}</h4>
                              </div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <Badge
                                  variant="secondary"
                                  className={`text-[10px] px-1.5 py-0 h-4 ${subjectColors[note.subject]?.bg || 'bg-gray-100'} ${subjectColors[note.subject]?.text || 'text-gray-600'}`}
                                >
                                  {note.subject}
                                </Badge>
                                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                  <Clock className="h-2.5 w-2.5" />
                                  {note.updatedAt}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{note.preview}</p>
                            </div>
                            <div className="flex flex-col items-center gap-0.5 shrink-0">
                              <button
                                onClick={(e) => toggleFavorite(note.id, e)}
                                className="p-1 rounded hover:bg-gray-100 transition-colors"
                              >
                                <Star className={`h-3.5 w-3.5 ${note.favorite ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                              </button>
                              <button
                                onClick={(e) => togglePinned(note.id, e)}
                                className="p-1 rounded hover:bg-gray-100 transition-colors"
                              >
                                <Pin className={`h-3.5 w-3.5 ${note.pinned ? 'text-emerald-500 fill-emerald-500' : 'text-gray-300'}`} />
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredNotes.length === 0 && (
                  <div className="flex flex-col items-center py-12">
                    <FileText className="h-10 w-10 text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500 text-center">Aucune note trouvée</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Editor area */}
          <div className={`${!mobileShowEditor ? 'hidden md:flex' : 'flex'} flex-col flex-1 min-w-0 bg-white rounded-xl border shadow-sm`}>
            {selectedNote ? (
              <>
                {/* Note header */}
                <div className="p-4 md:p-6 border-b">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Mobile back button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="md:hidden mb-2 gap-1 text-gray-500 -ml-2"
                        onClick={() => setMobileShowEditor(false)}
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Retour
                      </Button>
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{selectedNote.title}</h2>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={`${subjectColors[selectedNote.subject]?.bg || 'bg-gray-100'} ${subjectColors[selectedNote.subject]?.text || 'text-gray-600'} border-0`}>
                          <BookOpen className="h-3 w-3 mr-1" />
                          {selectedNote.subject}
                        </Badge>
                        {selectedNote.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-[11px] gap-1 text-gray-500">
                            <Tag className="h-2.5 w-2.5" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Créé le {selectedNote.createdAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <Edit3 className="h-3 w-3" />
                          Modifié le {selectedNote.updatedAt}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleFavorite(selectedNote.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title={selectedNote.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      >
                        <Star className={`h-4 w-4 ${selectedNote.favorite ? 'text-amber-400 fill-amber-400' : 'text-gray-400'}`} />
                      </button>
                      <button
                        onClick={() => togglePinned(selectedNote.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title={selectedNote.pinned ? 'Désépingler' : 'Épingler'}
                      >
                        <Pin className={`h-4 w-4 ${selectedNote.pinned ? 'text-emerald-500 fill-emerald-500' : 'text-gray-400'}`} />
                      </button>
                      <button
                        onClick={() => deleteNote(selectedNote.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* AI Actions */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <Button
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Résumer avec l&apos;IA
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Brain className="h-3.5 w-3.5" />
                      Générer des flashcards
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-2 text-gray-500"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Aperçu
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-2 text-gray-500"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Modifier
                    </Button>
                  </div>
                </div>

                {/* Note content */}
                <ScrollArea className="flex-1">
                  <div className="p-4 md:p-6 max-w-none">
                    {renderNoteContent(selectedNote.content)}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="p-4 bg-gray-50 rounded-full mb-4">
                  <FileText className="h-12 w-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sélectionnez une note</h3>
                <p className="text-gray-500 text-sm text-center mb-4">
                  Choisissez une note dans la liste ou créez-en une nouvelle
                </p>
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
                  onClick={createNote}
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle note
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Mobile FAB */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <Button
          className="h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
          size="icon"
          onClick={createNote}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </motion.div>
  )
}
