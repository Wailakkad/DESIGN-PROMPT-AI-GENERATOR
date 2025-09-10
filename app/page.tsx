'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

// Animation variants
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const cardHover = {
  scale: 1.02,
  transition: { duration: 0.2 }
}

// Types
interface Feature {
  icon: string
  title: string
  description: string
  color: string
}

interface FAQItem {
  question: string
  answer: string
}





// Data
const features: Feature[] = [
  {
    icon: '⚡',
    title: 'Prompts in Seconds',
    description: 'No complex setup — just type your idea and get a professional AI prompt instantly.',
    color: 'bg-purple-600'
  },
  {
    icon: '🎨',
    title: 'Made for POD & Creators',
    description: 'Built with designers in mind. Pre-defined prompts for POD, Midjourney, DALL·E, and more platforms.',
    color: 'bg-green-600'
  },
  {
    icon: '⭐',
    title: 'Trusted Quality',
    description: 'No guesswork output — just type your idea and get a professional AI prompt instantly.',
    color: 'bg-amber-600'
  }
]

const faqItems: FAQItem[] = [
  {
    question: "What makes your prompts different?",
    answer: "Our prompts are specifically crafted for designers and POD sellers, with pre-tested formulas that consistently produce high-quality, commercially viable results across multiple AI platforms."
  },
  {
    question: "Can I use prompts for POD and commercial work?",
    answer: "Yes! Our prompts are designed specifically for commercial use. All generated content can be used for print-on-demand, client work, and any commercial applications without restrictions."
  },
  {
    question: "Do you offer a free trial?",
    answer: "Absolutely! You can generate your first prompt completely free to test our platform. No credit card required to get started."
  },
  {
    question: "How do credits/pricing work?",
    answer: "We offer flexible credit-based pricing. Each prompt generation uses one credit, and we have plans ranging from individual creators to large teams. Unused credits never expire."
  },
  {
    question: "Do you support Midjourney, SDXL, and DALL·E?",
    answer: "Yes! Our platform is optimized for all major AI art generators including Midjourney, Stable Diffusion XL, DALL·E 3, and many others. Each prompt is tailored for the specific platform you choose."
  },
  {
    question: "What's your refund policy?",
    answer: "We offer a 30-day money-back guarantee. If you're not satisfied with our service within the first 30 days, we'll provide a full refund, no questions asked."
  }
]

const whyItems = [
  {
    title: "Save Hours of Trial & Error",
    description: "Stop wasting time on prompt engineering. Get professional results instantly."
  },
  {
    title: "Consistent Quality Output",
    description: "Every prompt is tested and optimized for commercial-grade AI art generation."
  },
  {
    title: "Built for Creators",
    description: "Made specifically for POD sellers, designers, and content creators who need results fast."
  },
  {
    title: "Platform Agnostic",
    description: "Works seamlessly across Midjourney, DALL·E, Stable Diffusion, and more."
  }
]

export default function HomePage() {  


    
    

  

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.20),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.25),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(167,139,250,0.25),transparent_60%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                Improve your
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-balance">
                <span className="text-neutral-900">Prompt Generation</span>
                <br />
                <span className="text-blue-600">with AI</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-lg">
                Tailored prompts for your audience. Generate, iterate, and ship faster.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="#generate"
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Generate a Free Prompt
                </motion.a>
                <motion.button
                  className="inline-flex items-center justify-center border-2 border-neutral-200 hover:border-neutral-300 text-neutral-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-neutral-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="ml-auto text-sm font-medium text-neutral-600">DP Prompt Generator</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">Prompt</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">Rule</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">Style</span>
                  </div>
                  
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <div className="h-2 bg-neutral-200 rounded mb-2"></div>
                    <div className="h-2 bg-neutral-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-blue-600 rounded w-1/2"></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-neutral-900">$2,403</div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      🎨
                    </div>
                  </div>
                </div>
              </div>
              
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 border"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm">
                    AI
                  </div>
                  <div className="text-xs font-medium">Active</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Trust logos */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 lg:mt-24"
          >
            <p className="text-center text-sm text-slate-500 mb-8">Trusted by creators worldwide</p>
            <div className="flex items-center justify-center gap-8 lg:gap-12 opacity-40">
              <div className="font-bold text-xl">Etsy</div>
              <div className="font-bold text-xl">Shopify</div>
              <div className="font-bold text-xl">Redbubble</div>
              <div className="font-bold text-xl">Society6</div>
              <div className="font-bold text-xl">Printful</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        id="features"
        className="py-20 lg:py-28"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={cardHover}
                className="bg-neutral-900 text-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} rounded-xl mb-6 text-xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-neutral-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Generate Section */}
      <motion.section
        id="generate"
        className="py-20 lg:py-28 bg-neutral-50"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-medium mb-6">
                ⚡ Generate
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 text-balance">
                Turn ideas into professional AI prompts instantly
              </h2>
              
              <p className="text-lg text-slate-600 mb-8 max-w-lg">
                Our advanced AI understands your creative vision and generates precise, professional prompts that work across all major platforms.
              </p>
              
              <motion.button
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Generate My First Prompt
              </motion.button>
              
              {/* Testimonial */}
              <motion.div
                variants={fadeUp}
                className="mt-12 bg-white rounded-xl p-6 shadow-md border max-w-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full"></div>
                  <div>
                    <div className="font-medium text-neutral-900">Sarah L.</div>
                    <div className="text-sm text-slate-600">POD Designer</div>
                  </div>
                </div>
                <p className="text-slate-700 italic">
                  "This tool saves me hours every week. The results are always on point."
                </p>
              </motion.div>
            </motion.div>
            
            <motion.div
              variants={fadeUp}
              className="relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.15),transparent_70%)] -m-8"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Describe your vision
                    </label>
                    <textarea
                      className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-600 outline-none"
                      rows={3}
                      placeholder="A cute cat wearing a superhero costume..."
                      readOnly
                    ></textarea>
                  </div>
                  
                  <div className="bg-neutral-900 rounded-lg p-4 text-green-400 font-mono text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white">Generated Prompt:</span>
                    </div>
                    <p>
                      "Professional digital art of an adorable tabby kitten wearing a bright red superhero cape and mask, heroic pose, detailed fur texture, vibrant colors, studio lighting, 4K resolution --ar 1:1 --style raw"
                    </p>
                  </div>
                  
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors">
                    Generate
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

    {/* Gallery Section */}
      <motion.section
        id="gallery"
        className="py-20 lg:py-28"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold text-neutral-900"
            >
              See the Quality of Our Prompts
            </motion.h2>
            <motion.a
              variants={fadeUp}
              href="#generate"
              className="hidden sm:inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
            >
              Generate My First Prompt
            </motion.a>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Sweet Dessert Art",
                prompt: "A vibrant illustration of a layered ice cream sundae with colorful sprinkles, chocolate sauce dripping, retro diner aesthetic, bright pastel colors, detailed textures, commercial photography style, high resolution",
                category: "Food & Beverage",
                image: "img1.jpeg"
              },
              {
                title: "Modern Tech Design",
                prompt: "Sleek smartphone mockup with geometric patterns, minimalist design, gradient backgrounds, professional product photography, clean lines, modern aesthetic, commercial quality",
                category: "Technology",
                image: "img2.jpeg"
              },
              {
                title: "Cute Pet Illustration",
                prompt: "Adorable tabby kitten with floral wreath, watercolor style, soft pastels, whimsical design, detailed fur texture, commercial illustration, POD ready, high quality artwork",
                category: "Animals & Pets",
                image: "img3.jpeg"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={cardHover}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div className=" overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs font-medium text-blue-600 mb-2">{item.category}</div>
                  <h3 className="font-semibold text-neutral-900 mb-3">{item.title}</h3>
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">Prompt:</span>
                    <p className="mt-1 leading-relaxed">{item.prompt}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Section */}
      <motion.section
        className="py-20 lg:py-28 bg-neutral-50"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-16"
          >
            Why it's important
          </motion.h2>
          
          <motion.div
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {whyItems.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl text-blue-600">
                    {index === 0 ? '⚡' : index === 1 ? '🎯' : index === 2 ? '🚀' : '🔧'}
                  </div>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        id="faq"
        className="py-20 lg:py-28"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about our AI prompt generation platform
            </p>
          </motion.div>
          
          <motion.div variants={stagger} className="space-y-4">
            {faqItems.map((item, index) => (
              <FAQItem key={index} item={item} index={index} />
            ))}
          </motion.div>
        </div>
      </motion.section>

     
    </main>
  )
}

// FAQ Item Component
function FAQItem({ item, index }: { item: FAQItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      variants={fadeUp}
      className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-inset"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <span className="font-semibold text-neutral-900">{item.question}</span>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      <motion.div
        id={`faq-answer-${index}`}
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-4 text-slate-600 leading-relaxed">
          {item.answer}
        </div>
      </motion.div>
    </motion.div>
  )
}