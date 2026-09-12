'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { formatTitleForUri } from '@/utils/transform-helper';
import projectService from '@/services/projectService';
import Image from 'next/image';
import HomeIcon from '@/icons/home-icon.svg';

const ProjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { title } = params;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Prethodni i sledeći projekat po redosledu sa spiska — za strelice na dnu.
  const [susedi, setSusedi] = useState({ prethodni: null, sledeci: null });

  useEffect(() => {
    fetchProjectData();
  }, [title]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError(null);

      const titleParam = Array.isArray(title) ? title[0] : title;
      const slug = decodeURIComponent((titleParam ?? '').toString());
      if (!slug) throw new Error('Missing project title');

      const listResponse = await projectService.getProjects();
      if (!listResponse.ok) throw new Error('Failed to fetch projects');

      const listJson = await listResponse.json();
      if (!listJson.success || !Array.isArray(listJson.data)) {
        throw new Error(listJson.message || 'Failed to fetch projects');
      }

      const matched = listJson.data.find((p) => {
        const candidateSlug = formatTitleForUri((p?.title ?? '').toString());
        return candidateSlug === slug;
      });

      if (!matched?.id) throw new Error('Project not found');

      // Spisak je već ovde jer se preko njega traži projekat — susedi se
      // uzimaju odatle, bez dodatnog poziva.
      const redosled = listJson.data;
      const gde = redosled.findIndex((p) => p?.id === matched.id);
      const naslovU = (p) => formatTitleForUri((p?.title ?? '').toString());
      setSusedi({
        prethodni: gde > 0 ? naslovU(redosled[gde - 1]) : null,
        sledeci: gde >= 0 && gde < redosled.length - 1 ? naslovU(redosled[gde + 1]) : null,
      });

      const response = await projectService.getProject(matched.id);
      if (!response.ok) throw new Error('Failed to fetch project');

      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to fetch project');

      setProject(data.data.project);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Dva izgleda stranice projekta.
   *
   * Nov dizajn (bedž, logotipi, slike u paru, galerija) stoji sam za sebe i
   * nema mrvice — naslov u tamnom zaglavlju već kaže gde si. Projekat koji ima
   * samo naslovnu sliku, naslov i tekst zadržava stari izgled, sličan objavi na
   * blogu, gde su mrvice korisne.
   */
  const bogataStranica = !!(
    project?.gallery?.length ||
    project?.introImages?.length ||
    project?.partnerLogos?.length ||
    project?.featureImage ||
    project?.funderBadge ||
    project?.subtitle
  );


  const heroTitle = loading
    ? 'Projekat'
    : project
      ? `Projekat "${project.title}"`
      : 'Projekat';

  return (
    <>
      {/* ── Tamni deo: bedž, naslov, podnaslov, logotipi, slike, uvodni tekst ── */}
      {/* Tamna zona projekta ima svoj razred, bez `overflow: hidden` koje nosi
          `page-hero-section`. To odsecanje je tu zbog sove koja viri iz hero
          trake na drugim stranicama, ali je ovde seklo glavnu sliku tačno na
          ivici — pa je izgledalo kao da se slika i svetla zona dodiruju. */}
      <div className="w-full bg-[#261A54] projekat-tamna-zona" style={{ display: 'flex' }}>
        <div
          /* Odmak sa strane je bio zakucan na 60px, pa je na telefonu od 375
             ostajalo 255 za sadržaj — dvostruko više nego bilo gde drugde.
             `projekat-kolona` drži 60 na desktopu, a niže zajedničku meru. */
          className="mx-auto w-full pt-[352px] sm:pt-[120px] projekat-kolona"
          style={{ maxWidth: 'var(--nnb-kolona)', paddingBottom: '80px' }}
        >
          {project?.funderBadge && (
            <img
              src={project.funderBadge}
              alt="Program koji finansira projekat"
              style={{ height: '64px', width: 'auto', marginBottom: '32px' }}
            />
          )}

          <div className="page-hero-section-title" style={{ paddingTop: '25px' }}>
            {heroTitle}
          </div>

          {project?.subtitle && (
            <p className="text-white" style={{ fontSize: '28px', marginTop: '16px' }}>
              {project.subtitle}
            </p>
          )}

          {project?.partnerLogos?.length > 0 && (
            <div className="flex flex-wrap items-center" style={{ gap: '24px', marginTop: '40px' }}>
              {project.partnerLogos.map((src, i) => (
                <img key={i} src={src} alt="Logotip partnera" style={{ height: '40px', width: 'auto' }} />
              ))}
            </div>
          )}

          {/* Na dizajnu su dve slike spojene u jednu ploču — bez razmaka među
              njima, a zaobljene su samo spoljne ivice. */}
          {project?.introImages?.length > 0 && (
            <div
              className="projekat-uvodne-slike"
              style={{ marginTop: '48px', '--broj-slika': Math.min(project.introImages.length, 2) }}
            >
              {project.introImages.map((src, i) => (
                <img key={i} src={src} alt="" />
              ))}
            </div>
          )}

          {/* I uvodni tekst dolazi iz uređivača, pa se ispisuje kao HTML. */}
          {project?.introText && (
            <div
              className="projekat-tekst projekat-tekst--tamna"
              style={{ marginTop: '48px' }}
              dangerouslySetInnerHTML={{ __html: project.introText }}
            />
          )}

          {/* Glavna slika u dizajnu prelazi preko donje ivice tamne zone: ona se
              završava na 2812, a slika (1440 × 751 na y 2106) tek na 2857 —
              dakle poslednjih 45px slike stoji na svetloj podlozi. Do sada je
              cela bila unutar tamnog dela. */}
          {project?.featureImage && (
            <img
              src={project.featureImage}
              alt=""
              className="projekat-glavna-slika"
              style={{ width: '100%', height: 'auto', borderRadius: '30px', marginTop: '48px' }}
            />
          )}
        </div>
      </div>

      {/* ── Svetli deo: glavni tekst, događaji, rezultati ── */}
      <div className="w-full pt-24 pb-24 grid place-items-center bg-[#F0F0F0] projekat-svetli-deo">
        {loading && <div className="text-center text-[#261A54]">Učitavanje projekta...</div>}
        {error && <div className="text-[#EC4923] text-center mb-4">Greška: {error}</div>}

        {project && (
          <div className="w-full projekat-kolona" style={{ maxWidth: 'var(--nnb-kolona)' }}>
            {/* Mrvice samo na starijem, blogovskom izgledu — vidi `bogataStranica`. */}
            {!bogataStranica && (
            <nav className="text-sm text-[#1B1B1B] flex flex-wrap items-center mb-10">
              <button onClick={() => router.push('/')} className="hover:opacity-70 cursor-pointer">
                <Image src={HomeIcon} alt="Početna" width={16} height={16} />
              </button>
              <span className="mx-2">/</span>
              <button onClick={() => router.push('/projekti')} className="hover:opacity-70 cursor-pointer">
                svi projekti
              </button>
              <span className="mx-2">/</span>
              <span>{project.title}</span>
            </nav>
            )}

            {/* Tekst dolazi iz uređivača u administraciji, dakle kao HTML.
                Sadržaj upisuje organizator kroz admin panel, isto kao i ranije
                `about_project` koji se ovako prikazivao. */}
            <div
              className="projekat-tekst"
              dangerouslySetInnerHTML={{ __html: project.bodyHtml || '' }}
            />

            {/* Galerija je mreža od četiri u redu, koja se prelama u nov red —
                četiri tačno popune kolonu sadržaja, pa se desna ivica poklapa
                sa desnom strelicom ispod nje. */}
            {project.gallery?.length > 0 && (
              <div style={{ marginTop: '56px' }}>
                <div className="projekat-galerija">
                  {project.gallery.map((src, i) => (
                    <img key={i} src={src} alt="" />
                  ))}
                </div>

              </div>
            )}

            {/* Strelice vode na prethodni i sledeći projekat, ne listaju slike:
                stoje na krajevima, na dnu stranice, i uvek imaju šta da urade.
                Stoje van galerije, jer ih inače projekat bez nje ne bi imao. */}
            {bogataStranica && (
                <div className="flex items-center justify-between" style={{ marginTop: '28px' }}>
                  <button
                    type="button"
                    onClick={() => susedi.prethodni && router.push(`/projekti/${susedi.prethodni}`)}
                    disabled={!susedi.prethodni}
                    className="projekat-strelica"
                    aria-label="Prethodni projekat"
                  >
                    <svg width="26" height="14" viewBox="0 0 26 14" fill="none" aria-hidden="true">
                      <path d="M25 7H1M1 7l6-6M1 7l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => susedi.sledeci && router.push(`/projekti/${susedi.sledeci}`)}
                    disabled={!susedi.sledeci}
                    className="projekat-strelica"
                    aria-label="Sledeći projekat"
                  >
                    <svg width="26" height="14" viewBox="0 0 26 14" fill="none" aria-hidden="true">
                      <path d="M1 7h24M25 7l-6-6M25 7l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
              </div>
            )}

            <div style={{ marginTop: '48px' }}>
              <button
                onClick={() => router.push('/projekti')}
                className="text-[#261A54] hover:opacity-70 cursor-pointer font-medium"
              >
                ← Nazad na projekte
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectDetailPage;
