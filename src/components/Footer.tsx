'use client'

export default function Footer() {
  return (
    <footer className="bg-grunge-dark border-t border-grunge-medium mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-emo-pink mb-4">FOREVER THURSDAY</h3>
            <p className="text-gray-300 text-sm">
              Emo lifestyle products for the soul. Pillow sprays, wax melts, and prints that speak to your inner darkness.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-emo-purple mb-4">QUICK LINKS</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/products" className="text-gray-300 hover:text-emo-pink transition-colors duration-300">Products</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-emo-pink transition-colors duration-300">About</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-emo-pink transition-colors duration-300">Contact</a></li>
              <li><a href="/shipping" className="text-gray-300 hover:text-emo-pink transition-colors duration-300">Shipping</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-emo-purple mb-4">FOLLOW US</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-emo-pink transition-colors duration-300">Instagram</a>
              <a href="#" className="text-gray-300 hover:text-emo-pink transition-colors duration-300">TikTok</a>
              <a href="#" className="text-gray-300 hover:text-emo-pink transition-colors duration-300">Twitter</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-grunge-medium mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Forever Thursday. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
