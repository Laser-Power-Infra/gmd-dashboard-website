import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Products from './components/Products';
import WhyChooseUs from './components/WhyChooseUs';
import VisionMission from './components/VisionMission';
import Clients from './components/Clients';
import Footer from './components/Footer';
import GetQuoteModal from './components/GetQuoteModal';
import AboutPage from './components/AboutPage';
import ValvesPage from './components/ValvesPage';
import Purchase from './components/Purchase';
import ValveDetailPage from './components/ValveDetailPage';
import FeedbackPage from './components/FeedbackPage';
import OtherValvesPage from './components/OtherValvesPage';
import OtherProductsPage from './components/OtherProductsPage';
import WarrantyPage from './components/WarrantyPage';
import IndustryPage from './components/IndustryPage';
import ContactPage from './components/ContactPage';
import RiskManagementPage from './components/RiskManagementPage';
import ProductIndustryPage from './components/ProductIndustryPage';
import SafetyPlanPage from './components/SafetyPlanPage';
import DevelopmentPage from './components/DevelopmentPage';
import CmcPage from './components/CmcPage';
import AmcPage from './components/AmcPage';
import ComplaintsPage from './components/ComplaintsPage';
import PerformanceReviewPage from './components/PerformanceReviewPage';
import ApplyAmcPage from './components/ApplyAmcPage';
import './App.css';

export default function App() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedValveId, setSelectedValveId] = useState(null);

  const openQuoteModal = () => {
    setIsQuoteOpen(true);
  };

  const closeQuoteModal = () => {
    setIsQuoteOpen(false);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/about') {
        setCurrentPage('about');
        setSelectedValveId(null);
      } else if (hash === '#/valves') {
        setCurrentPage('valves');
        setSelectedValveId(null);
      } else if (hash === '#/other-valves') {
        setCurrentPage('other-valves');
        setSelectedValveId(null);
      } else if (hash === '#/other-products') {
        setCurrentPage('other-products');
        setSelectedValveId(null);
      } else if (hash === '#/usages' || hash.startsWith('#/usages/')) {
        setCurrentPage('usages');
        setSelectedValveId(null);
      } else if (hash === '#/feedback') {
        setCurrentPage('feedback');
        setSelectedValveId(null);
      } else if (hash === '#/contact') {
        setCurrentPage('contact');
        setSelectedValveId(null);
      } else if (hash === '#/manuals' || hash.startsWith('#/manual-of-')) {
        setCurrentPage('manuals');
        setSelectedValveId(null);
      } else if (hash === '#/risk-management' || hash.startsWith('#/risk-management/')) {
        setCurrentPage('risk-management');
        setSelectedValveId(null);
      } else if (hash.startsWith('#/valve-detail/')) {
        const id = hash.replace('#/valve-detail/', '');
        setCurrentPage('valve-detail');
        setSelectedValveId(id);
      } 
      else if (hash === '#/purchase') {
        setCurrentPage('purchase');
        setSelectedValveId(null);
      } else if (hash === '#/product-industry') {
        setCurrentPage('product-industry');
        setSelectedValveId(null);
      } else if (hash === '#/safety-plan') {
        setCurrentPage('safety-plan');
        setSelectedValveId(null);
      } else if (hash === '#/development') {
        setCurrentPage('development');
        setSelectedValveId(null);
      } else if (hash === '#/cmc' || hash.startsWith('#/cmc')) {
        setCurrentPage('cmc');
        setSelectedValveId(null);
      } else if (hash === '#/amc' || hash.startsWith('#/amc')) {
        setCurrentPage('amc');
        setSelectedValveId(null);
      } else if (hash === '#/complaints' || hash.startsWith('#/complaints')) {
        setCurrentPage('complaints');
        setSelectedValveId(null);
      } else if (hash === '#/performance-review' || hash.startsWith('#/performance-review')) {
        setCurrentPage('performance-review');
        setSelectedValveId(null);
      } else if (hash === '#/apply-amc' || hash.startsWith('#/apply-amc')) {
        setCurrentPage('apply-amc');
        setSelectedValveId(null);
      } else {
        setCurrentPage('home');
        setSelectedValveId(null);
        // Extract section ID if any (e.g. #products -> products)
        const sectionId = hash.replace('#', '');
        if (sectionId && sectionId !== 'home' && sectionId !== 'home-section') {
          setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check on mount
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page, sectionId = null, valveId = null) => {
    if (page === 'home') {
      window.location.hash = sectionId ? `#${sectionId}` : '#home-section';
    } else if (page === 'about') {
      window.location.hash = '#/about';
    } else if (page === 'valves') {
      window.location.hash = '#/valves';
    } else if (page === 'other-valves') {
      window.location.hash = '#/other-valves';
    } else if (page === 'other-products') {
      window.location.hash = '#/other-products';
    } else if (page === 'usages') {
      window.location.hash = '#/usages';
    } else if (page === 'feedback') {
      window.location.hash = '#/feedback';
    } else if (page === 'contact') {
      window.location.hash = '#/contact';
    } else if (page === 'manuals') {
      window.location.hash = '#/manuals';
    } else if (page === 'risk-management') {
      window.location.hash = '#/risk-management';
    } else if (page === 'valve-detail' && valveId) {
      window.location.hash = `#/valve-detail/${valveId}`;
    } else if (page === 'purchase') {
      window.location.hash = '#/purchase';
    } else if (page === 'product-industry') {
      window.location.hash = '#/product-industry';
    } else if (page === 'safety-plan') {
      window.location.hash = '#/safety-plan';
    } else if (page === 'development') {
      window.location.hash = '#/development';
    } else if (page === 'cmc') {
      window.location.hash = '#/cmc';
    } else if (page === 'amc') {
      window.location.hash = '#/amc';
    } else if (page === 'complaints') {
      window.location.hash = '#/complaints';
    } else if (page === 'performance-review') {
      window.location.hash = '#/performance-review';
    } else if (page === 'apply-amc') {
      window.location.hash = '#/apply-amc';
    }
  };

  return (
    <div className="app-wrapper">
      {/* Header & Navigation */}
      <Header 
        onOpenQuote={openQuoteModal} 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
      />
      
      {/* Main Page Layout Sections */}
      <main>
        {currentPage === 'home' && (
          <>
            <div id="home">
              <Hero />
            </div>
            <div id="about-us">
              <AboutUs />
            </div>
            <div id="services">
              <Services />
            </div>
            <div id="products">
              <Products />
            </div>
            <div id="why-choose-us">
              <WhyChooseUs />
            </div>
            <div id="vision-mission">
              <VisionMission />
            </div>
            <Clients />
          </>
        )}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'valves' && (
          <ValvesPage onSelectValve={(valveId) => handleNavigate('valve-detail', null, valveId)} />
        )}

        {
          currentPage==='purchase' && <Purchase/>
        }
        {currentPage === 'valve-detail' && (
          <ValveDetailPage 
            valveId={selectedValveId} 
            onBackToCatalog={() => handleNavigate('valves')} 
            onOpenQuote={openQuoteModal}
          />
        )}
        {currentPage === 'feedback' && <FeedbackPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'other-valves' && (
          <OtherValvesPage onOpenQuote={openQuoteModal} />
        )}
        {currentPage === 'other-products' && (
          <OtherProductsPage onOpenQuote={openQuoteModal} />
        )}
        {currentPage === 'usages' && (
          <IndustryPage onOpenQuote={openQuoteModal} />
        )}
        {currentPage === 'manuals' && (
          <WarrantyPage />
        )}
        {currentPage === 'risk-management' && (
          <RiskManagementPage onOpenQuote={openQuoteModal} />
        )}
        {currentPage === 'product-industry' && (
          <ProductIndustryPage onOpenQuote={openQuoteModal} />
        )}
        {currentPage === 'safety-plan' && (
          <SafetyPlanPage onOpenQuote={openQuoteModal} />
        )}
        {currentPage === 'development' && (
          <DevelopmentPage onOpenQuote={openQuoteModal} />
        )}
        {currentPage === 'cmc' && <CmcPage />}
        {currentPage === 'amc' && <AmcPage />}
        {currentPage === 'complaints' && <ComplaintsPage />}
        {currentPage === 'performance-review' && <PerformanceReviewPage />}
        {currentPage === 'apply-amc' && <ApplyAmcPage />}
      </main>

      {/* Footer Details */}
      <Footer />

      {/* Quotation Popup Modal */}
      <GetQuoteModal isOpen={isQuoteOpen} onClose={closeQuoteModal} />
    </div>
  );
}
