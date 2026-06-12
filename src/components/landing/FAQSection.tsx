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
      'Nexus AI searches the web in real-time and provides cited, verifiable answers. Unlike ChatGPT, every response includes source citations you can click to verify — from RBI reports to Supreme Court judgments. Our multi-model approach cross-references information for accuracy.',
  },
  {
    question: 'Where do the citations come from?',
    answer:
      'Citations come from real web sources found through our search engine. Each claim is linked to its original source — academic papers, government portals like India Code and PRS India, news articles, documentation, and trusted websites.',
  },
  {
    question: 'Which AI models power Nexus?',
    answer:
      "Nexus uses multiple state-of-the-art AI models, dynamically selecting the best model for each query type. This ensures optimal accuracy whether you're researching GST compliance, UPSC topics, or technical documentation.",
  },
  {
    question: 'Is there a free plan?',
    answer:
      'Yes! Our free plan includes 10 searches per day with standard AI models and basic citations. No credit card or UPI required. Upgrade to Pro anytime for just ₹499/month with unlimited searches and premium features.',
  },
  {
    question: 'Can I upload files for analysis?',
    answer:
      'Pro and Enterprise users can upload documents, PDFs, images, and data files. Our AI will analyze the content and incorporate it into your research alongside web sources — great for CA audit reports, legal case files, or research papers.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept UPI (GPay, PhonePe, Paytm), credit/debit cards, net banking, and international cards. All Pro and Enterprise plans are billed in INR with no hidden conversion fees.',
  },
  {
    question: 'Is my data stored in India?',
    answer:
      'Yes. We comply with India\'s Digital Personal Data Protection Act (DPDP) 2023. Your data is processed and stored with enterprise-grade encryption. We never use your conversations to train AI models.',
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
    <div
      className="feature-card-bordered p-0 overflow-hidden"
      style={{
        borderColor: isOpen ? 'rgba(255,255,255,0.2)' : 'var(--hairline-strong)',
        transition: 'border-color 0.2s ease',
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer"
        style={{ background: 'transparent', border: 'none' }}
        aria-expanded={isOpen}
      >
        <span className="heading-sm pr-4" style={{ fontSize: '16px' }}>
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
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
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
          className="text-center mb-10 sm:mb-14"
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
        <div className="space-y-3 sm:space-y-4">
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
