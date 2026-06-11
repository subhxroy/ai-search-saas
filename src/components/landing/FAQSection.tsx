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
      "Nexus uses multiple state-of-the-art AI models, dynamically selecting the best model for each query type. This ensures optimal accuracy whether you're researching science, business, or creative topics.",
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
    <div className="feature-card-bordered p-0 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
        style={{ background: 'transparent', border: 'none' }}
        aria-expanded={isOpen}
      >
        <span className="heading-sm pr-4" style={{ fontSize: '18px' }}>
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="shrink-0"
        >
          <ChevronDown
            className="h-5 w-5"
            style={{ color: 'var(--ash)' }}
          />
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
            <div className="px-6 pb-6 pt-0">
              <div style={{ height: '1px', background: 'var(--hairline)', marginBottom: '16px' }} />
              <p className="body-sm">
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
    <section className="relative px-4 sm:px-6 overflow-hidden" style={{ paddingTop: 'var(--spacing-section)', paddingBottom: 'var(--spacing-section)' }}>
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="display-xl mb-4">Common questions</h2>
          <p className="body-md" style={{ color: 'var(--charcoal)' }}>
            Everything you need to know.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {FAQ_DATA.map((item, index) => (
            <motion.div
              key={item.question}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: index * 0.05 }}
            >
              <FAQAccordionItem
                item={item}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
