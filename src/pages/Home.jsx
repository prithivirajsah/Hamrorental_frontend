import Header from '../components/Header'
import Footer from '../components/Footer'
import Hero from './car-rental/Hero';
import Features from './car-rental/Features';
import CarListing from './car-rental/CarListing';
import CarBrands from './car-rental/CarBrands';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      <Header />
      <Hero />
      <Features />
      <CarListing />
      <CarBrands />
      <Footer />
    </div>
  )
}
