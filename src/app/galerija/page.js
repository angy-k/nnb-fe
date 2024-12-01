'use client';
import PageHeroSection from "@/components/Hero/pageOwl";
import Link from 'next/link';
import Image from 'next/image';
import Modal from "@/components/Gallery/Modal";
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from "react";
import { useLastViewedPhoto } from "@/utils/gallery/use-last-viewed-photo";

const GalleryPage = ({
  images = []
}) => {
  const router = useRouter();
  const { photoId } = router.query || {};

  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <div className="grid place-items-center w-full pt-64 md:pt-80">
      <PageHeroSection 
        title={`Galerija`}
        type="icons"
        icons={true}
      />
      <div className="w-full grid place-items-center pb-48 bg-[#F0F0F0]">
        <div className="blog-container">
        {(images && images?.length > 0) ? (images?.map(({ id, url }) => (
            <Link
              key={id}
              href={`/?photoId=${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              as={`/p/${id}`}
              shallow
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image src={url}
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                // src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
           />
            </Link>
          ))) : (
          <p>{`Trenutno nema slika u galeriji.`}</p>
        )}

        </div>
      </div>
      {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
    </div>
  );
}

export default GalleryPage;