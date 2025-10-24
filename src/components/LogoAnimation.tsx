'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function LogoAnimation() {
  return (
    <div className="relative">
      {/* Main logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative"
      >
        <div className="relative w-full max-w-4xl mx-auto">
          <Image
            src="/logo-forever-february.svg"
            alt="Forever February"
            width={800}
            height={400}
            className="w-full h-auto object-contain"
            style={{ aspectRatio: '2/1' }}
            priority
          />
        </div>
      </motion.div>
      
      {/* Grunge effects */}
      <motion.div
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-gradient-to-r from-emo-pink/20 via-emo-purple/20 to-emo-red/20 blur-xl"
      />
      
      {/* Large splatter effects */}
      {new Array(8).fill(0).map((_, i) => (
        <motion.div
          key={`large-splatter-${i}`}
          className="absolute bg-black rounded-full opacity-60"
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
          style={{
            width: `${3 + Math.random() * 8}px`,
            height: `${3 + Math.random() * 8}px`,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
        />
      ))}
      
      {/* Medium splatter effects */}
      {new Array(12).fill(0).map((_, i) => (
        <motion.div
          key={`medium-splatter-${i}`}
          className="absolute bg-black rounded-full opacity-40"
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            width: `${1 + Math.random() * 3}px`,
            height: `${1 + Math.random() * 3}px`,
            left: `${15 + Math.random() * 70}%`,
            top: `${15 + Math.random() * 70}%`,
          }}
        />
      ))}
      
      {/* Small splatter effects */}
      {new Array(20).fill(0).map((_, i) => (
        <motion.div
          key={`small-splatter-${i}`}
          className="absolute bg-black rounded-full opacity-30"
          animate={{
            opacity: [0, 0.4, 0],
            scale: [0, 0.8, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: Math.random() * 1.5,
          }}
          style={{
            width: `${0.5 + Math.random() * 1}px`,
            height: `${0.5 + Math.random() * 1}px`,
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
        />
      ))}
    </div>
  )
}
