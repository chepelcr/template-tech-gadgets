import { Link } from 'wouter';
import { Zap, Facebook, Instagram, Twitter, Mail, MapPin, MessageCircle } from 'lucide-react';
import { formatPhone, whatsappPhone, whatsappUrl } from '@chepelcr/tsuru-storefront-sdk';
import { useContact, useHomePageSections } from '@/hooks/useContent';
import { useTheme } from '@/hooks/useContent';
import { useSubdomainContext } from '@/contexts/SubdomainContext';
import { getSectionByType } from '@/lib/pageUtils';

export default function Footer() {
  const { data: contact } = useContact();
  const { organization } = useSubdomainContext();
  const { data: theme } = useTheme();
  const { data: sections = [] } = useHomePageSections();
  const newsletter = getSectionByType(sections, 'newsletter')?.content || {};
  const storeWhatsapp = whatsappPhone(contact);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container-tech py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center space-x-2 mb-4 group">
              <div className="relative">
                
                {theme?.logoUrl ? (
                  <img src={theme.logoUrl} alt="Logo" className="h-6 w-6" />
                ) : (
                  <Zap className="h-6 w-6 text-tech-cyan group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all" />
                )}
                <div className="absolute inset-0 bg-tech-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-bold text-lg animated-gradient-text">{organization?.name}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your destination for cutting-edge technology and premium electronics.
              We bring you the latest innovations in the tech world.
            </p>
            {/* Social Links */}
            <div className="flex items-center space-x-3">
              {contact?.facebookUrl && (
                <a
                  href={contact.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-background hover:bg-tech-cyan/20 rounded-sm transition-all group relative"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4 group-hover:text-tech-cyan transition-colors" />
                  <div className="absolute inset-0 bg-tech-cyan/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                </a>
              )}
              {contact?.instagramUrl && (
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-background hover:bg-tech-cyan/20 rounded-sm transition-all group relative"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4 group-hover:text-tech-cyan transition-colors" />
                  <div className="absolute inset-0 bg-tech-cyan/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                </a>
              )}
              {contact?.twitterUrl && (
                <a
                  href={contact.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-background hover:bg-tech-cyan/20 rounded-sm transition-all group relative"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4 group-hover:text-tech-cyan transition-colors" />
                  <div className="absolute inset-0 bg-tech-cyan/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                </a>
              )}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-tech-cyan transition-colors inline-block">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?filter=new" className="hover:text-tech-cyan transition-colors inline-block">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?filter=bestsellers" className="hover:text-tech-cyan transition-colors inline-block">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-tech-cyan transition-colors inline-block">
                  Deals & Offers
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-tech-cyan transition-colors inline-block">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-tech-cyan transition-colors inline-block">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-tech-cyan transition-colors inline-block">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-tech-cyan transition-colors inline-block">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-tech-cyan transition-colors inline-block">
                  Warranty Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-tech-cyan transition-colors inline-block">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contáctanos</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {contact?.address && (
                <li className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-tech-cyan" />
                  <span>{contact.address}</span>
                </li>
              )}
              {storeWhatsapp && (
                <li className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 flex-shrink-0 text-tech-cyan" />
                  <a href={whatsappUrl(storeWhatsapp, 'Hola, me gustaría obtener más información')} target="_blank" rel="noopener noreferrer" className="hover:text-tech-cyan transition-colors">
                    {formatPhone(storeWhatsapp)}
                  </a>
                </li>
              )}
              {contact?.email && (
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 flex-shrink-0 text-tech-cyan" />
                  <a href={`mailto:${contact.email}`} className="hover:text-tech-cyan transition-colors">
                    {contact.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="font-semibold mb-2 text-foreground">{newsletter.title || 'Stay Connected'}</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {newsletter.description || 'Subscribe to our newsletter for exclusive deals and tech updates'}
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder={newsletter.placeholder || 'Ingresa tu correo'}
                className="flex-1 px-4 py-2 bg-background border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-tech-cyan text-foreground placeholder:text-muted-foreground text-sm"
              />
              <button className="btn-tech-accent px-6">
                {newsletter.buttonText || 'Subscribe'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {currentYear} {organization?.name}. All rights reserved. Built with cutting-edge technology.
            </p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-tech-cyan transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terms" className="hover:text-tech-cyan transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-tech-cyan transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Gradient */}
      <div className="h-1 tech-gradient" />
    </footer>
  );
}
