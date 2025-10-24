'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="mb-8 w-full max-w-2xl mx-auto">
              <Image
                src="/logo-forever-february.svg"
                alt="Forever February"
                width={600}
                height={300}
                className="w-full h-auto object-contain"
                style={{ aspectRatio: '2/1' }}
                priority
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold sketchy-font-alt text-black mb-6">
              ABOUT US
            </h1>
            <p className="text-xl text-gray-700 sketchy-font-alt">
              Crafted with love by elder emos in the UK
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <h2 className="text-3xl font-bold text-black mb-6 sketchy-font-alt">
                OUR STORY
              </h2>
              <p className="text-lg text-gray-700 mb-4 sketchy-font-alt leading-relaxed">
                We're a couple of elder emos from the UK who've been crafting products for the emo community for over a decade. 
                What started as a small passion project has grown into Forever February - a brand dedicated to creating 
                authentic, high-quality products that speak to the emo soul.
              </p>
              <p className="text-lg text-gray-700 sketchy-font-alt leading-relaxed">
                Every product is handmade in our small workshop, using only the finest ingredients and materials. 
                We believe in quality over quantity, and every item is crafted with the same care and attention 
                we'd want for ourselves.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <h2 className="text-3xl font-bold text-black mb-6 sketchy-font-alt">
                ETHICAL PRACTICES
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-black mb-3 sketchy-font-alt">
                    🌱 SUSTAINABLE INGREDIENTS
                  </h3>
                  <p className="text-gray-700 sketchy-font-alt">
                    All our pillow sprays and wax melts use only natural, sustainably sourced ingredients. 
                    No harmful chemicals, no animal testing, just pure, natural goodness.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black mb-3 sketchy-font-alt">
                    🏠 HANDMADE IN THE UK
                  </h3>
                  <p className="text-gray-700 sketchy-font-alt">
                    Every product is handmade in our small UK workshop. We don't outsource, we don't mass produce - 
                    just authentic craftsmanship from start to finish.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black mb-3 sketchy-font-alt">
                    ♻️ ECO-FRIENDLY PACKAGING
                  </h3>
                  <p className="text-gray-700 sketchy-font-alt">
                    We use only recyclable and biodegradable packaging materials. 
                    Our commitment to the environment is as strong as our commitment to quality.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black mb-3 sketchy-font-alt">
                    💝 FAIR TRADE MATERIALS
                  </h3>
                  <p className="text-gray-700 sketchy-font-alt">
                    All our materials are sourced from fair trade suppliers. 
                    We believe in supporting ethical businesses and ensuring fair wages for all workers.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <h2 className="text-3xl font-bold text-black mb-6 sketchy-font-alt">
                OUR COMMITMENT
              </h2>
              <p className="text-lg text-gray-700 mb-4 sketchy-font-alt leading-relaxed">
                As elder emos who've been part of this community for decades, we understand what it means to be authentic. 
                That's why every product we create is made with genuine care and attention to detail.
              </p>
              <p className="text-lg text-gray-700 sketchy-font-alt leading-relaxed">
                We're not a big corporation trying to cash in on a trend. We're real people who love this community 
                and want to create products that truly resonate with the emo lifestyle. From our pillow sprays that help 
                you sleep peacefully to our prints that celebrate the culture we love - everything is made with heart.
              </p>
            </div>

            <div className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <a
                  href="/products"
                  className="inline-block px-8 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors duration-300 sketchy-font-alt"
                >
                  SHOP OUR PRODUCTS
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
