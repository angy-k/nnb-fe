'use client';
import PageHeroSection from "@/components/Hero/pageOwl";

const GalleryPage = () => {
  return (
    <div className="grid place-items-center w-full pt-64 md:pt-80">
      <PageHeroSection 
        title={`Galerija`}
        type="icons"
        icons={true}
      />
      <div className="w-full grid place-items-center pb-48 bg-[#F0F0F0]">
        <div className="blog-container"></div>
      </div>
    </div>
  );
}

export default GalleryPage;