/**
 * The masthead every inner page opens with: a full-width rule, then the page
 * title set at poster scale. Mirrors the "A CATALOGUE OF WORK" treatment.
 */
export function PageTitle({
  children,
  /** A whole sentence rather than a one- or two-word label, so it sets smaller. */
  statement = false,
  /** Rendered above the rule; used by pages that sit below another. */
  back,
}: {
  children: React.ReactNode
  statement?: boolean
  back?: React.ReactNode
}) {
  return (
    <section
      className={`px-5 md:px-8 ${back ? 'pt-10 md:pt-20' : 'pt-24 md:pt-40'}`}
    >
      {back && <div className="pb-8 md:pb-14">{back}</div>}
      <hr className="rule" />
      <h1 className={`poster pt-2${statement ? ' poster-statement' : ''}`}>
        {children}
      </h1>
    </section>
  )
}
