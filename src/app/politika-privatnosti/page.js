import PageHeroSection from "@/components/Hero/pageOwl";
import PrivacyPolicyContent from "@/components/Legal/PrivacyPolicyContent";

export const metadata = {
  title: 'Politika privatnosti — Novosadski noćni bazar',
  robots: { index: false, follow: false },
}

/**
 * Tekst dolazi iz `PrivacyPolicyContent` — istog izvora koji koriste i modali
 * na registraciji i prijavi na događaj. Ranije je stranica imala svoju kopiju,
 * pa su se verzije razilazile.
 */
export default function PolitikaPrivatnostiPage() {
  return (
    <>
      <PageHeroSection
        title="Politika privatnosti"
        type="description"
        icons={false}
        description="Novosadski noćni bazar, Novi Sad, Vase Stajića br. 6/III"
      />

      <div className="w-full bg-[#F0F0F0]">
        {/* Po dizajnu je tekstualna kolona 1067px široka i usredišćena
             (x 426–1493 na okviru od 1920). Ovde je bilo 860. */}
        <div className="max-w-[1115px] mx-auto px-6 py-16">
          <PrivacyPolicyContent compact={false} />
        </div>
      </div>
    </>
  )
}
