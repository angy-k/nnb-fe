'use client';
import Link from 'next/link';
import Image from 'next/image';
import owls from '@/../public/owls.svg';

const ErrorPage = () => {
  return (
    <div className="mt-24 grid place-items-center mb-24">
      <Image
          // className="md:w-3/12 lg:w-2/12 2xl:x-2/12"
          src="/logo-dark.svg"
          alt="logo"
          width={'264px'}
          height={'83px'}
      />
      <div className='not-found-section mt-24'>
        <div 
          className='place-items-center justify-center'
          style={{display: 'flex', flexDirection: 'column', textAlign: 'start', alignItems: 'flex-start'}}
        >
          <h2 className="mt-6 mb-2.5">Greška 404 - Stranica nije pronađena.</h2>
          <h6 className="mb-7 text-start text-section-color">
            Ne brinite, ovakve stvari se ponekad dešavaju. Možda ste pogrešili URL ili je stranica premeštena?
          </h6>
          <Link
            prefetch={false}
            href={"/"}
            className='button bg-[#EC4923] px-16 py-4 text-white text-center mb-20'
            style={{borderRadius: '30.5px'}}
          >
            Vrati se na početnu stranicu
          </Link>
        </div>
        <Image
          className='top-227 left-1047 owls-image'
          maxwidth={'1005px'}
          maxheight={'609px'}
          src={owls}
          alt="owls"
        />
      </div>
    </div>
    );
}

export default ErrorPage;