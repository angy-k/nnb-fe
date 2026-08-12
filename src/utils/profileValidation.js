/**
 * Checks if a user's profile has all required fields for event application.
 *
 * Required: first name, last name, brand name, email, phone number, address, activity category.
 * Conditional: facebook + instagram when marketing option is selected.
 *
 * @param {object|null} user - user object from useUser()
 * @param {object} [opts]
 * @param {boolean} [opts.withMarketing] - true when user selected a marketing option
 * @returns {{ ok: boolean, missing: string[] }}
 */
export function checkProfileReady(user, { withMarketing = false } = {}) {
  if (!user) return { ok: false, missing: [] }

  const missing = []

  if (!user.first_name?.trim()) missing.push('ime')
  if (!user.last_name?.trim()) missing.push('prezime')
  if (!user.brand_name?.trim()) missing.push('naziv brenda')
  if (!user.email?.trim()) missing.push('email adresa')
  if (!user.phone_number?.trim()) missing.push('broj telefona')
  if (!user.address?.trim()) missing.push('adresa')
  if (!user.activity_group?.id && !user.activity?.id) missing.push('kategorija delatnosti')

  if (withMarketing) {
    if (!user.facebook?.trim()) missing.push('Facebook link')
    if (!user.instagram?.trim()) missing.push('Instagram link')
  }

  return { ok: missing.length === 0, missing }
}
