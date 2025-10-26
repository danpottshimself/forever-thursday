import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8 w-full max-w-lg mx-auto">
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
        
        <h1 className="text-6xl md:text-8xl font-bold sketchy-font-alt text-black mb-6">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold sketchy-font-alt text-gray-700 mb-6">
          PAGE NOT FOUND
        </h2>
        
        <p className="text-lg text-gray-600 sketchy-font-alt mb-8">
          Looks like this page got lost in the emo void. 
          <br />
          Don't worry, your soul is still intact.
        </p>
        
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-black text-white font-bold rounded-lg hover:scale-105 transition-transform duration-300 sketchy-font-alt"
        >
          BACK TO HOME
        </Link>
      </div>
    </div>
  )
}

