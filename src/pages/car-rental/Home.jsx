import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Hero from './Hero';
import Features from './Features';
import CarListing from './CarListing';
import CarBrands from './CarBrands';
import BookingSteps from './BookingSteps';

export default function Home() {
  return (
    <div className="min-h-screen h-auto bg-[#F3F2F2]">
      <Header />
      <Hero />
      <Features />
      <CarListing />
      <CarBrands />
      <BookingSteps />
      <Footer />
    </div>
  )
}
