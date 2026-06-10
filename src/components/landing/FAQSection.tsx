'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const FAQ_DATA: FAQItem[] = [
  {
    question: 'How is Nexus AI different from ChatGPT?',
    answer:
      'Nexus AI searches the web in real-time and provides cited, verifiable answers. Unlike ChatGPT, every response includes source citations you can click to verify. Our multi-model approach cross-references information for accuracy.',
  },
  {
    question: 'Where do the citations come from?',
    answer:
      'Citations come from real web sources found through our search engine. Each claim in our answers is linked to its original source—academic papers, news articles, documentation, and trusted websites.',
  },
  {
    question: 'Which AI models power Nexus?',
    answer:
      'Nexus uses multiple state-of-the-art AI models, dynamically selecting the best model for each query type. This ensures optimal accuracy whether you\'re researching science, business, or creative topics.',
  },
  {
    question: 'Is there a free plan?',
    answer:
      'Yes! Our free plan includes 10 searches per day with standard AI models and basic citations. No credit card required. Upgrade to Pro anytime for unlimited searches and premium features.',
  },
  {
    question: 'Can I upload files for analysis?',
    answer:
      'Pro and Enterprise users can upload documents, PDFs, images, and data files. Our AI will analyze the content and incorporate it into your research alongside web sources.',
  },
]

const headerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="glass feature-card rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-sm sm:text-base font-semibold text-foreground pr-4 group-hover:text-cyan-400 transition-colors duration-300">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-cyan-400 transition-colors duration-300" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
              opacity: { duration: 0.25, ease: 'easeInOut' },
            }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
              <div className="h-px bg-white/5 mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background accents */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-8 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(103,232,249,0.15) 0%, rgba(167,139,250,0.1) 50%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-14"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Frequently Asked{' '}
            <span className="gradient-text">Questions</span>
          </h2>
          <div
            className="mx-auto w-32 h-1 rounded-full mb-5 animate-gradient"
            style={{
              background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #06b6d4)',
              backgroundSize: '200% 100%',
            }}
          />
          <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
            Everything you need to know.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          className="space-y-3 sm:space-y-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {FAQ_DATA.map((item, index) => (
            <motion.div key={item.question} variants={itemVariants}>
              <FAQAccordionItem
                item={item}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
