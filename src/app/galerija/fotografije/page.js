'use client';
import PageHeroSection from "@/components/Hero/pageOwl";
import Image from 'next/image'

const PhotosPage = ({
  // images = []
}) => {
  return (
    <div className="grid place-items-center w-full pt-64 md:pt-80">
      <PageHeroSection 
        title={`Galerija`}
        type="icons"
        icons={true}
      />
      <div className="w-full grid place-items-center pt-24 pb-48 bg-[#F0F0F0]">
        <div className="blog-container">
        {/* {images.length ? (images?.map(({ id, url }) => (
            // <Link
            //   key={id}
            //   href={`/?photoId=${id}`}
            //   as={`/p/${id}`}
            //   shallow
            //   className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            // >
              <Image src={url}
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder="blur"
                alt={`gallery-image-${id}`}
                // blurDataURL={blurDataUrl}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
           />
            // </Link>
          ))): ( */}
          <p className="text-[darkBlue] our-team-title">{` Ne brinite, fotografije uskoro stižu.`}</p>
        {/* )} */}
        </div>
      </div>
    </div>
  );
}

export default PhotosPage;