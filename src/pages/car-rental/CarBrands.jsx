import React, { useRef, useEffect, useState } from "react";
import toyotaLogo from '../../assets/brands/toyota.png';
import fordLogo from '../../assets/brands/ford.png';
import mercedesLogo from '../../assets/brands/mercedes.png';
import jeepLogo from '../../assets/brands/jeep.png';
import bmwLogo from '../../assets/brands/bmw.png';
import audiLogo from '../../assets/brands/audi.png';

const brands = [
  { name: "Toyota", img: toyotaLogo },
  { name: "Ford", img: fordLogo },
  { name: "Mercedes", img: mercedesLogo },
  { name: "Jeep", img: jeepLogo },
  { name: "BMW", img: bmwLogo },
  { name: "Audi", img: audiLogo },
];

const ITEMS_PER_PAGE = 6;

const CarBrands = ({ interval = 2300 }) => {
  const [current, setCurrent] = useState(0);
  const totalPages = Math.ceil(brands.length / ITEMS_PER_PAGE);
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % totalPages);
    }, interval); // auto-scroll using dynamic interval
    return () => clearInterval(intervalRef.current);
  }, [totalPages, interval]);

  const startIdx = current * ITEMS_PER_PAGE;
  const visibleBrands = brands.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center gap-12 w-full overflow-hidden">
          {visibleBrands.map((brand) => (
            <div key={brand.name} className="flex flex-col items-center min-w-[160px]">
              <img
                src={brand.img}
                alt={brand.name + 'logo'}
                className="w-[160px] h-[110px] object-contain rounded-lg shadow-md"
              />
              <div className="mt-4 text-2xl font-bold text-red-600 text-center">{brand.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarBrands;
