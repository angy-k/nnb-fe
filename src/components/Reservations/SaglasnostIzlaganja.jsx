'use client'

import { useState } from 'react'
import { CONSENT_PARTICIPATION } from '@/utils/consentTexts'
import LegalDocsModal from '@/components/Modal/LegalDocsModal'

/**
 * Kvačica „Prihvatam opšte uslove izlaganja" uz propisanu saglasnost za obradu
 * podataka o ličnosti.
 *
 * Stoji na dva mesta u toku rezervacije — u modalu sa opcijama i u modalu
 * potvrde — pa je ovde, a ne prepisana dvaput. Stanje **ne drži sama**: dolazi
 * spolja, sa stranice, tako da je kvačica ista na oba mesta i ko je čekirao u
 * opcijama zatiče je čekiranu u potvrdi.
 *
 * Ranije je živela samo u modalu opcija i zaključavala samo njegovo dugme. Ko
 * modal zatvori ili ga uopšte ne otvori, stizao je do slanja prijave bez ijedne
 * kvačice — dugme „Nastavi" na stranici saglasnost nije ni gledalo.
 */
const SaglasnostIzlaganja = ({
  prihvaceno = false,
  naPromenu,
  termsPdfUrl = null,
  className = '',
}) => {
  const [pravniOtvoren, setPravniOtvoren] = useState(false)

  return (
    <>
      <label
        className={`flex items-start gap-3 cursor-pointer ${className}`}
        onClick={() => naPromenu?.(!prihvaceno)}
      >
        <div
          className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
          style={{
            borderColor: prihvaceno ? '#56C4CF' : '#d1d5db',
            backgroundColor: prihvaceno ? '#56C4CF' : 'transparent',
          }}
        >
          {prihvaceno && (
            <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
              <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        <span className="text-sm text-[#261A54] leading-snug select-none text-left">
          Prihvatam{' '}
          {termsPdfUrl ? (
            <a
              href={termsPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[#56C4CF]"
              onClick={(e) => e.stopPropagation()}
            >
              opšte uslove izlaganja
            </a>
          ) : (
            <span>opšte uslove izlaganja</span>
          )}
          {'. '}
          {/* Propisana saglasnost za obradu podataka o ličnosti */}
          {CONSENT_PARTICIPATION.before}
          <button
            type="button"
            className="underline text-[#56C4CF]"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setPravniOtvoren(true)
            }}
          >
            {CONSENT_PARTICIPATION.linkLabel}
          </button>
          {CONSENT_PARTICIPATION.after}
        </span>
      </label>

      {/* Uz opšta pravila ide i dokument sa cenama i satnicom ovog događaja */}
      <LegalDocsModal
        isOpen={pravniOtvoren}
        onOpenChange={setPravniOtvoren}
        termsPdfUrl={termsPdfUrl}
        acceptLabel="Prihvatam"
        onAccept={() => naPromenu?.(true)}
      />
    </>
  )
}

export default SaglasnostIzlaganja
