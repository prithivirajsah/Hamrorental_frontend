import React from "react";
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

const CarBrands = () => (
  <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex justify-around items-center bg-[#fcfcfc] rounded-[48px] py-10 px-4 my-8 shadow-md gap-8 max-w-none overflow-x-auto sm:gap-4 sm:py-6 sm:px-2 sm:rounded-[24px] sm:flex-wrap">
    {brands.map((brand) => (
      <div
        className="flex items-center justify-center min-w-[64px] min-h-[48px] opacity-80 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-200 sm:min-w-[48px] sm:min-h-[32px]"
        key={brand.name}
        title={brand.name}
      >
        <img
          src={brand.img}
          alt={brand.name + ' logo'}
          className="max-h-12 max-w-[100px] w-auto h-auto sm:max-h-8 sm:max-w-[64px]"
        />
      </div>
    ))}
  </div>
);

export default CarBrands;
