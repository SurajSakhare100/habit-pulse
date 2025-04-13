import Footer from "@/components/landing/footer";
import HeroHome from "@/components/landing/Hero";
import LargeTestimonial from "@/components/landing/large-testimonial";
import WorkFloW from "@/components/landing/WorkFlow";
import Header from "@/components/landing/Nav";
import React from "react";
import PricingSection from "@/components/Pricing";
import Section from "@/components/Section";
export default function page() {
  return (
    <div>
      <Header />
      <HeroHome />
      <Section />
      <WorkFloW />
      <PricingSection />
      <LargeTestimonial />
      <Footer />
    </div>
  );
}
