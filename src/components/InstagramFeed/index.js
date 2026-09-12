'use client';
import React, { useEffect, useState } from 'react';

const InstagramPosts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiFailed, setApiFailed] = useState(false)

  /*
   * Objave stižu iz administracije, ne sa Instagrama.
   *
   * Instagramov API traži token koji važi 60 dana i mora se obnoviti dok je još
   * živ; kad jednom istekne, obnova više ne prolazi nego treba nova autorizacija
   * naloga. Tako je sekcija i utihnula — token je istekao 24. avgusta 2026.
   * Skidanje javnog profila sa servera nije zamena: Instagram blokira serverske
   * IP adrese, a i kad prođe, kvari se na svakih par nedelja.
   *
   * Zato slike i linkove unosi administrator, a ovde se samo prikazuju. Ranija
   * ruta `/api/instagram` i dalje stoji u projektu — ako se jednom dođe do
   * tokena, dovoljno je vratiti adresu ispod na nju, oblik odgovora je isti.
   */
  useEffect(() => {
    let isActive = true

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/instagram`, { cache: 'no-store' })
      .then((res) => res.json().catch(() => null))
      .then((data) => {
        if (!isActive) return
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          setPosts(data.data.slice(0, 9))
        } else {
          setApiFailed(true)
        }
      })
      .catch(() => { if (isActive) setApiFailed(true) })
      .finally(() => { if (isActive) setLoading(false) })

    return () => { isActive = false }
  }, []);

  // Mere sekcije (luk vrha tamne zone, odmaci, mreža) stoje u `global.css`,
  // pod `.pocetna-instagram` — sve su izmerene sa izvoza dizajna.

  // Skeleton dok se učitava
  if (loading) {
    return (
      <section className="pocetna-instagram">
        <div className="instagram-grid">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="instagram-post" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="instagram-post-inner" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  // API nije vratio podatke — sakrij sekciju
  if (apiFailed || !posts.length) return null;

  return (
    <section className="pocetna-instagram">
      <div className="instagram-grid">
        {posts.map((post) => {
          // thumbnail_url je uvek JPEG (za VIDEO); media_url može biti .heic/.mp4
          // Koristimo thumbnail_url ako postoji, inače media_url
          const mediaUrl = post?.thumbnail_url || post?.media_url
          const permalink = post?.permalink

          if (!mediaUrl) return null

          /* Link ka objavi nije obavezan u administraciji. Bez njega je pločica
             običan `div`, a ne `<a href="#">` — takva veza ne vodi nikuda nego
             skoči na vrh stranice, a čitač ekrana je svejedno najavi kao vezu.
             Slika je bez opisa jer ga nema odakle uzeti (sekcija je namerno bez
             ijednog slova), pa naziv veze nosi `aria-label`. */
          const Plocica = permalink ? 'a' : 'div'
          const vezaProps = permalink
            ? { href: permalink, target: '_blank', rel: 'noreferrer', 'aria-label': 'Objava na Instagramu' }
            : {}

          return (
            <Plocica
              key={post?.id || mediaUrl}
              {...vezaProps}
              className="instagram-post"
            >
              <div className="instagram-post-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    const parent = e.currentTarget?.closest?.('.instagram-post')
                    if (parent) parent.style.display = 'none'
                  }}
                />
              </div>
            </Plocica>
          )
        })}
      </div>
    </section>
  );
};

export default InstagramPosts;
