'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import PageHeroSection from '@/components/Hero/pageOwl';
import CardComponent from '@/components/CardComponent';
import blogService from '@/services/blogService';
import { formatTitleForUri } from '@/utils/transform-helper';
import Image from 'next/image';
import Link from 'next/link';
import HomeIcon from '@/icons/home-icon.svg';
// Naša sova umesto zatečenog avatara iz šablona dizajna.
import OwlIcon from '@/icons/owl-icon.svg';
import { teamAnchorId, findTeamMemberByName } from '@/utils/team';

const BlogDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { title } = params;
  const [blog, setBlog] = useState(null);
  const [similarBlogs, setSimilarBlogs] = useState([]);
  const [prevBlog, setPrevBlog] = useState(null);
  const [nextBlog, setNextBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Tim se dovlači da bi se autorka objave mogla povezati sa svojom karticom na
  // stranici „O nama". Ako poziv ne uspe, lista ostaje prazna i autor se
  // prikazuje kao običan tekst — objava se zbog toga ne kvari.
  const [team, setTeam] = useState([]);

  useEffect(() => {
    fetchBlogData();
  }, [title]);

  useEffect(() => {
    let otkazano = false;

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/index/about-us`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!otkazano) setTeam(data?.data?.team ?? []);
      })
      .catch(() => {});

    return () => { otkazano = true };
  }, []);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      setError(null);

      const titleParam = Array.isArray(title) ? title[0] : title;
      const slug = decodeURIComponent((titleParam ?? '').toString());
      if (!slug) {
        throw new Error('Missing blog title');
      }

      const listResponse = await blogService.getBlogs();
      if (!listResponse.ok) {
        throw new Error('Failed to fetch blogs');
      }

      const listJson = await listResponse.json();
      if (!listJson.success || !Array.isArray(listJson.data)) {
        throw new Error(listJson.message || 'Failed to fetch blogs');
      }

      const matchedIndex = listJson.data.findIndex((b) => {
        const candidateSlug = formatTitleForUri((b?.title ?? '').toString());
        return candidateSlug === slug;
      });

      if (matchedIndex === -1 || !listJson.data[matchedIndex]?.id) {
        throw new Error('Blog not found');
      }

      const matched = listJson.data[matchedIndex];

      // Prev / next from the list
      setPrevBlog(matchedIndex > 0 ? listJson.data[matchedIndex - 1] : null);
      setNextBlog(matchedIndex < listJson.data.length - 1 ? listJson.data[matchedIndex + 1] : null);

      const response = await blogService.getBlog(matched.id);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBlog(data.data.blog);
          setSimilarBlogs(data.data.similarBlogs || []);
        } else {
          throw new Error(data.message || 'Failed to fetch blog');
        }
      } else {
        throw new Error('Failed to fetch blog');
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const navBtnStyle = {
    border: '1.5px solid #261A54',
    borderRadius: '30px',
    padding: '10px 24px',
    background: 'transparent',
    color: '#261A54',
    fontSize: '15px',
    lineHeight: '20px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  }

  if (loading) {
    return (
      <>
        <PageHeroSection title={"Blog"} />
        {/* `relative` je ovde uslov, ne ukras: bez njega je element statičan, pa
            mu z-index ništa ne znači i hero sekcija (relative, z-index 1) se crta
            preko sadržaja — sova je zbog toga padala preko naslova objave. */}
        <div className="relative z-[2] w-full pt-24 grid place-items-center pb-48 bg-[#F0F0F0]">
          <div className="text-center">Učitavanje objave...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeroSection title="Blog" />
      {/* `relative` je ovde uslov, ne ukras. Na stranicama sa listom hero i
          sadržaj su ćelije iste mreže, gde z-index važi i bez pozicioniranja, pa
          sadržaj prekriva sovu koja se preliva. Ovde su oba obično deca `main`
          elementa, pa z-index na statičnom sadržaju ne znači ništa i sova pada
          preko naslova objave. */}
      <div className="relative z-[2] w-full pt-24 grid place-items-center pb-48 bg-[#F0F0F0]">
        {error && (
          <div className="text-red-500 text-center mb-4">
            Greška prilikom učitavanja objave.
          </div>
        )}
        {/* Odmak sa strane treba na uskim ekranima, ali bi na širokom uvukao
            sadržaj na x 264 umesto na 240. Zato je najveća širina za dvostruki
            odmak veća, pa sam sadržaj ispadne tačno 1440 širok i počne na levoj
            ivici kolone — a kako je odmak sada promenljiva zajednička celom
            sajtu (`--nnb-odmak`), i ova mera je prati. */}
        <div className="mx-auto nnb-gutter w-full" style={{ maxWidth: 'calc(var(--nnb-kolona) + 2 * var(--nnb-odmak))' }}>
          {/* ── White card ── */}
          {/* Bez bele kartice: po dizajnu sadržaj objave stoji direktno na
              svetloj podlozi stranice, a naslov i datum počinju na levoj ivici
              kolone (x 240). Kartica ih je uvlačila još 136px udesno. */}
          <div className="mb-6">
            {blog && (
              <>
                {/* Breadcrumb and Publication Date */}
                {/* `md:` u ovom projektu znači 600–1299px, a ne „od 600 naviše" —
                    tako su podešene prelomne tačke u `tailwind.config`. Zbog toga
                    su se ovi redovi na 1440 slagali u kolonu, pa su datum, autor
                    i bočna kolona završavali levo ispod naslova umesto desno.
                    Zato je red podrazumevano vodoravan, a `sm:` ga slaže samo na
                    mobilnom. */}
                <div className="flex flex-row sm:flex-col justify-between items-center sm:items-start gap-4 mb-8">
                  {/* Datum i mrvice su u izvozu sivi (`#808080`), a kućica
                      tamnoplava — odatle i utisak da je ikonica „teža" od
                      teksta. Ranije je i tekst bio skoro crn. */}
                  <div style={{ fontSize: '18px', lineHeight: '25px', color: '#808080' }}>
                    Objavljeno: {blog.creationDate}
                  </div>
                  <nav className="flex flex-wrap items-center" style={{ fontSize: '18px', lineHeight: '25px', color: '#808080' }}>
                    <button
                      onClick={() => router.push('/')}
                      className="hover:opacity-70 cursor-pointer"
                    >
                      {/* U izvozu je kućica 32 × 32 na (1310, 693). Ovde je 25,
                          koliko je i red teksta, da ne nadjača mrvice. */}
                      <Image
                        src={HomeIcon}
                        alt="Početna"
                        width={25}
                        height={25}
                      />
                    </button>
                    <span className="mx-2">/</span>
                    <button
                      onClick={() => router.push('/blog')}
                      className="hover:text-[#1B1B1B] cursor-pointer"
                    >
                      Sve objave
                    </button>
                    <span className="mx-2">/</span>
                    {/* U izvozu ovde stoji „Trenutna objava", ne skraćen naslov
                        objave — naslov je ionako odmah ispod, velikim slovima. */}
                    <span>Trenutna objava</span>
                  </nav>
                </div>

                {/* Title and Author */}
                <div className="flex flex-row sm:flex-col justify-between items-end sm:items-start mb-8 gap-18 sm:gap-4">
                  <h1 className="single-blog-title flex-1 min-w-0" style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>
                    {blog.title}
                  </h1>
                  {/* U izvozu autor stoji 19px iznad donje ivice naslova
                      (avatar 836–909, naslov 754–928), ne poravnat s njom. */}
                  <AuthorBadge author={blog.author} team={team} />
                </div>

                <div className="pb-10">
                  {/* Cover image */}
                  <img
                    src={blog.coverImage || blog.heroImage || '/card-component-default-image.png'}
                    alt={blog.title}
                    /* Po dizajnu 1440 × 411 sa zaobljenjem od 30px — preko
                       cele kolone. Ranije 320px visine i zaobljenje 8px. */
                    className="w-full object-cover mb-8 single-blog-cover"
                    style={{ height: '411px', borderRadius: '30px' }}
                  />

                  {/* Content + sidebar */}
                  <div className="flex flex-row sm:flex-col gap-8">
                    {/* Blog Content */}
                    <div className="flex-1">
                      {/* Klase `prose`/`prose-lg` su ovde bile bez dejstva —
                          @tailwindcss/typography nije instaliran, pa su samo
                          ostavljale utisak da je oblikovanje teksta rešeno.
                          Stil nosi `.single-blog-content` u global.css. */}
                      <div className="pb-8">
                        <div
                          className="text-gray-700 leading-relaxed text-lg single-blog-content"
                          dangerouslySetInnerHTML={{ __html: blog.content || '' }}
                        />
                      </div>
                    </div>

                    {/* Similar Blogs Sidebar */}
                    {similarBlogs && similarBlogs.length > 0 && (
                      /* `max-w-full` je ovde uslov, ne ukras: `sm:w-full` ne
                         može da pobedi inline `width: 345px`, pa je bočna
                         kolona na telefonu ostajala 345px široka i sa odmakom
                         od 2 × 24 razvlačila stranicu na 393px. */
                      <div className="sm:w-full max-w-full flex-shrink-0" style={{ width: '345px' }}>
                        <h3 className="font-semibold text-[#1B1B1B] mb-3" style={{ fontSize: '17px', lineHeight: '23px' }}>Pročitaj još:</h3>
                        {/* Po dizajnu: ploča 345 × 223 sa zaobljenjem od 30px, a stavke u njoj
                            stoje 62px od bočnih i 47px od gornje ivice. Ranije 288 široka,
                            zaobljenje 12, odmak 20. */}
                        <div className="bg-[#261A54] md:sticky md:top-28 blog-slicne-ploca" style={{ borderRadius: '30px', padding: '47px 62px' }}>
                          <ul className="flex flex-col gap-2">
                            {similarBlogs.map((similarBlog, index) => (
                              <li key={index}>
                                <button
                                  onClick={() => router.push(`/blog/${formatTitleForUri(similarBlog.title)}`)}
                                  className="text-white hover:opacity-70 font-medium text-left w-full transition-opacity duration-200"
                                  style={{ fontSize: '17px', lineHeight: '23px' }}
                                >
                                  {similarBlog.title}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            {!blog && !error && (
              <div className="p-8">
                <p className="text-gray-600">Sadržaj objave će biti prikazan ovde.</p>
              </div>
            )}
          </div>

          {/* ── Prev / Next navigation ── */}
          {blog && (prevBlog || nextBlog) && (
            <div className="flex justify-between items-center mt-2 mb-2">
              {prevBlog ? (
                <button
                  type="button"
                  onClick={() => router.push(`/blog/${formatTitleForUri(prevBlog.title)}`)}
                  style={navBtnStyle}
                  onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
                  onMouseOut={e => e.currentTarget.style.opacity = '1'}
                >
                  Prethodna objava
                </button>
              ) : <div />}
              {nextBlog && (
                <button
                  type="button"
                  onClick={() => router.push(`/blog/${formatTitleForUri(nextBlog.title)}`)}
                  style={navBtnStyle}
                  onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
                  onMouseOut={e => e.currentTarget.style.opacity = '1'}
                >
                  Sledeća objava
                </button>
              )}
            </div>
          )}

          {/* ── "Pročitaj još" bottom section ── */}
          {blog && similarBlogs && similarBlogs.length > 0 && (
            <>
              <div style={{ borderTop: '1px solid #d0d0d0', margin: '32px 0 0' }} />
              <div className="pt-8 pb-4">
                <span className="blog-title">Pročitaj još</span>
              </div>
              <div className="blog-container grid sm:grid-template-1 md:grid-template-2 mb-8">
                {similarBlogs.slice(0, 3).map((similarBlog, index) => (
                  <div className="blog-card" key={`similar-${index}`}>
                    <CardComponent
                      {...(similarBlog.coverImage && { imageSrc: similarBlog.coverImage })}
                      imageWidth={438}
                      imageHeight={344}
                      imageRadius={"30px"}
                      imageAltText={`Blog post - ${similarBlog.title}`}
                      sectionType={'blog'}
                      author={similarBlog.author}
                      title={similarBlog.title}
                      creationDate={similarBlog.creationDate}
                      buttonAction={() => router.push(`/blog/${formatTitleForUri(similarBlog.title)}`)}
                      buttonText="Pročitaj više"
                buttonSmallText
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

/**
 * Ime autorke uz malu sliku. Kad se ime poklopi sa članom tima, ceo blok postaje
 * link do njene kartice na stranici „O nama" — čitalac odatle može da vidi ko je
 * pisao objavu. Kad se ne poklopi, ostaje običan tekst, bez linka koji ne vodi
 * nikuda.
 */
const AuthorBadge = ({ author, team }) => {
  if (!author) return null;

  const clan = findTeamMemberByName(team, author);
  const slika = clan?.photo || null;

  const sadrzaj = (
    <>
      <span className="text-[#1B1B1B] whitespace-nowrap" style={{ fontSize: '18px', lineHeight: '25px' }}>
        Autor: {author}
      </span>
      {slika ? (
        <img
          src={slika}
          alt={author}
          width={73}
          height={73}
          style={{ width: 73, height: 73, borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : (
        <Image src={OwlIcon} alt={author} width={73} height={73} />
      )}
    </>
  );

  /* U izvozu autor ne naleže na donju ivicu naslova nego stoji 19px iznad nje:
     avatar je 836–909, a naslov 754–928. */
  const klase = 'flex items-center gap-2 self-end sm:self-start mb-[19px] sm:mb-0';

  if (!clan) {
    return <div className={klase}>{sadrzaj}</div>;
  }

  return (
    <Link
      href={`/o-nama#${teamAnchorId(author)}`}
      className={`${klase} hover:opacity-70 transition-opacity`}
      title={`Pogledaj ${author} u našem timu`}
    >
      {sadrzaj}
    </Link>
  );
};

export default BlogDetailPage;
