import Link from "next/link";
import PageHeroSection from "@/components/Hero/pageOwl";
import ExhibitionTermsContent from "@/components/Legal/ExhibitionTermsContent";

export const metadata = {
  title: 'Opšti uslovi izlaganja — Novosadski noćni bazar',
  robots: { index: false, follow: false },
}

/**
 * Opšta pravila izlaganja — deo koji važi za sve događaje.
 *
 * Podaci vezani za konkretan događaj (cene, datumi, satnica) nisu ovde; izlagač
 * ih dobija u Opštim uslovima uz prijavu na taj događaj.
 */
export default function UsloviKoriscenjaPage() {
  return (
    <>
      <PageHeroSection
        title="Opšti uslovi izlaganja"
        type="description"
        icons={false}
        description="Pravila koja važe za sve događaje u organizaciji Novosadskog noćnog bazara"
      />

      <div className="w-full bg-[#F0F0F0]">
        <div className="max-w-[860px] mx-auto px-6 py-16">
          <ExhibitionTermsContent />

          <div className="mt-10 pt-6 border-t border-[#d9d9d9]">
            <p className="text-base leading-relaxed" style={{ color: '#333333' }}>
              Obrada vaših podataka o ličnosti opisana je u{' '}
              <Link href="/politika-privatnosti" className="underline text-[#56C4CF]">
                Politici privatnosti
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
