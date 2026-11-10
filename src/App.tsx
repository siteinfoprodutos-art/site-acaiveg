/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroScrollCanvas } from './components/HeroScrollCanvas';
import { MenuSection } from './components/MenuSection';
import { HowItWorks } from './components/HowItWorks';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { OrderModal } from './components/OrderModal';
import { MenuItem } from './config';

export default function App() {
  const [selectedCupForOrder, setSelectedCupForOrder] = useState<MenuItem | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleOpenOrder = (item: MenuItem) => {
    setSelectedCupForOrder(item);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#1A0B2E] text-[#FFF4E0] flex flex-col selection:bg-[#3E9B3A] selection:text-white">
      {/* Fixed Navigation Header */}
      <Header />

      {/* Main One-Page Content */}
      <main className="flex-grow">
        {/* 1. Hero with Scroll-driven Frame Animation (Sticky Canvas 500vh) */}
        <HeroScrollCanvas />

        {/* 2. Menu Section: 300ml and 500ml cups with photos & prices */}
        <MenuSection onSelectCup={handleOpenOrder} />

        {/* 3. How It Works: 3 short steps */}
        <HowItWorks />

        {/* 4. Contact & Location: WhatsApp & Laranjeiras Store */}
        <ContactSection />
      </main>

      {/* Simple Footer with Logo */}
      <Footer />

      {/* Fixed Floating WhatsApp Button (Bottom Right) */}
      <FloatingWhatsApp />

      {/* Quick Interactive Order Customization Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialItem={selectedCupForOrder}
      />
    </div>
  );
}
