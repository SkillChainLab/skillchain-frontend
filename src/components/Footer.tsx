import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail, Send, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-t from-slate-900 to-slate-800 border-t border-white/10">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-5"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-5"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold text-white">SkillChain</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              The future of decentralized freelancing. Connecting talent with opportunity through blockchain technology.
            </p>
            <div className="flex gap-4">
              <SocialLink href="https://twitter.com" icon={<Twitter className="w-5 h-5" />} />
              <SocialLink href="https://github.com" icon={<Github className="w-5 h-5" />} />
              <SocialLink href="https://linkedin.com" icon={<Linkedin className="w-5 h-5" />} />
              <SocialLink href="mailto:hello@skillchain.com" icon={<Mail className="w-5 h-5" />} />
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Platform</h4>
            <div className="space-y-2">
              <Link href="/marketplace" className="block text-gray-400 hover:text-white transition-colors">
                Marketplace
              </Link>
              <Link href="/dashboard" className="block text-gray-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/convert" className="block text-gray-400 hover:text-white transition-colors">
                VUSD Converter
              </Link>
              <Link href="/connect" className="block text-gray-400 hover:text-white transition-colors">
                Connect Wallet
              </Link>
            </div>
          </div>

          {/* Features Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Features</h4>
            <div className="space-y-2">
              <Link href="/social" className="block text-gray-400 hover:text-white transition-colors">
                Social Network
              </Link>
              <Link href="/messages" className="block text-gray-400 hover:text-white transition-colors">
                Messaging
              </Link>
              <Link href="/profile" className="block text-gray-400 hover:text-white transition-colors">
                Profile
              </Link>
              <FooterLink href="/docs">Documentation</FooterLink>
              <FooterLink href="/support">Support</FooterLink>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Stay Updated</h4>
            <p className="text-gray-400 mb-4">
              Get the latest updates on SkillChain development and new features.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 p-3 rounded-lg transition-all transform hover:scale-105">
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-400 text-sm">
              © 2024 SkillChain. All rights reserved. Built on blockchain technology.
            </div>
            <div className="flex gap-8 text-sm">
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/cookies">Cookie Policy</FooterLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all transform hover:scale-110"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </Link>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
    >
      {children}
      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  )
} 