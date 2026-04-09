import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { getSiteSettings } from '../api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState({
    logo_url: null,
    site_title: 'Shield Foundation',
    site_description: 'Adding Life to Years'
  });
  const location = useLocation();

  useEffect(() => {
    const loadSiteSettings = async () => {
      try {
        const settings = await getSiteSettings();
        setSiteSettings(settings);
      } catch (error) {
        console.log('Using default site settings');
      }
    };
    
    loadSiteSettings();
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Programs', href: '/programs' },
    { name: 'Impact', href: '/impact' },
    { name: 'Government Schemes', href: '/government-schemes' },
    { name: 'Blog & News', href: '/blog' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Apply', href: '/apply' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-4 py-3 min-w-0">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0 min-w-0">
            {siteSettings.logo_url ? (
              <img 
                src={siteSettings.logo_url} 
                alt="Logo" 
                className="h-10 w-auto mr-2 object-contain"
              />
            ) : (
              <Heart className="h-7 w-7 text-blue-600 mr-2 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-blue-600 truncate">{siteSettings.site_title}</h1>
              <p className="text-xs text-gray-600 truncate">{siteSettings.site_description}</p>
            </div>
          </Link>

          {/* Desktop Navigation - evenly distributed, larger text */}
          <nav className="hidden lg:flex flex-1 items-center justify-evenly min-w-0">
            {navigation.map((item) => (
              item.name === 'Contact' ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-yellow-400 text-black shadow-sm'
                      : 'bg-yellow-400 hover:bg-yellow-500 text-black'
                  }`}
                >
                  {item.name}
                </Link>
              ) : item.name === 'Apply' ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </nav>

          {/* Mobile menu button - show on screens smaller than lg */}
          <button
            className="lg:hidden flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    item.name === 'Contact'
                      ? isActive(item.href)
                        ? 'bg-yellow-400 text-black'
                        : 'bg-yellow-400 hover:bg-yellow-500 text-black'
                      : isActive(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
    <div className="h-14 flex-shrink-0" aria-hidden="true" />
    </>
  );
};

export default Header;
