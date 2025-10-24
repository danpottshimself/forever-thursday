'use client'

import { motion } from 'framer-motion'
import LogoAnimation from './LogoAnimation'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-grunge-dark to-white" />
      
      {/* Animated background elements */}
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 opacity-10"
      >
        <div className="w-full h-full bg-gradient-conic from-emo-pink via-emo-purple to-emo-red" />
      </motion.div>
      
      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <LogoAnimation />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xl md:text-2xl mt-8 text-gray-700 font-light sketchy-font-alt"
        >
          Pillow Sprays • Wax Melts • Prints
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12"
        >
          <a
            href="/products"
            className="inline-block px-8 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors duration-300 transform hover:scale-105 sketchy-font-alt"
          >
            SHOP NOW
          </a>
        </motion.div>
      </div>
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-emo-pink rounded-full opacity-30"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </section>
  )
}
