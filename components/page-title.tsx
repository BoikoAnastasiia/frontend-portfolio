/**
 * The masthead every inner page opens with: a full-width rule, then the page
 * title set at poster scale. Mirrors the "A CATALOGUE OF WORK" treatment.
 */
export function PageTitle({
  children,
  /** A whole sentence rather than a one- or two-word label, so it sets smaller. */
  statement = false,
}: {
  children: React.ReactNode
  statement?: boolean
}) {
  return (
    <section className="px-5 pt-24 md:px-8 md:pt-40">
      <hr className="rule" />
      <h1 className={`poster pt-2${statement ? ' poster-statement' : ''}`}>
        {children}
      </h1>
    </section>
  )
}
