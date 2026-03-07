import { useEffect, useState } from 'react';
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Hero from './Hero';
import Features from './Features';
import CarListing from './CarListing';
import CarBrands from './CarBrands';
import BookingSteps from './BookingSteps';
import api from '../../api';

export default function Home() {
  const [homeData, setHomeData] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      try {
        const data = await api.getHomePage();
        if (isMounted) {
          setHomeData(data);
        }
      } catch (error) {
        console.error("Failed to load home page data:", error);
      }
    };

    const loadPosts = async () => {
      try {
        const data = await api.getPosts({ limit: 12 });
        if (isMounted) {
          setPosts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to load posts:", error);
        if (isMounted) {
          setPosts([]);
        }
      }
    };

    loadHomeData();
    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen h-auto bg-[#F3F2F2]">
      <Header />
      <Hero
        title={homeData?.hero_title}
        subtitle={homeData?.hero_subtitle}
        ctaText={homeData?.cta_text}
      />
      <Features items={homeData?.features} />
      <CarListing vehicles={posts.length > 0 ? posts : homeData?.featured_vehicles} />
      <CarBrands />
      <BookingSteps />
      <Footer />
    </div>
  )
}
