/**
 * A night sky and one sentence, lit brighter than white on an HDR screen.
 *
 * Nothing here is a CSS HDR colour — those are still a draft. The light comes
 * from /blog/hdr-white.avif: a 16x16 patch of white encoded in BT.2100 PQ at
 * 1000 nits, painted through text with background-clip and used as the fill of
 * the moon and half the stars. Everything is gated on (dynamic-range: high), so an
 * SDR screen gets plain white and the caption says so.
 *
 * The limit switch is plain radios and :has() — dynamic-range-limit is the
 * only thing it changes, so there is no state to hydrate.
 */
/* Half the stars are lit, half are plain #fff at the same sizes, so on an HDR
   screen the panel is its own before-and-after. */
const STARS = [
  { x: 6, y: 18, s: 3, hdr: true },
  { x: 14, y: 62, s: 3, hdr: false },
  { x: 21, y: 30, s: 4, hdr: false },
  { x: 29, y: 78, s: 4, hdr: true },
  { x: 36, y: 12, s: 2, hdr: false },
  { x: 43, y: 48, s: 3, hdr: true },
  { x: 52, y: 22, s: 3, hdr: false },
  { x: 58, y: 70, s: 3, hdr: true },
  { x: 66, y: 40, s: 2, hdr: true },
  { x: 74, y: 76, s: 2, hdr: false },
  { x: 88, y: 64, s: 3, hdr: false },
  { x: 94, y: 14, s: 2, hdr: true },
]

const LIMITS = ['standard', 'constrained', 'no-limit'] as const

export function HdrDemo() {
  return (
    <figure className="hdr-demo">
      <div className="hdr-sky" aria-hidden="true">
        {STARS.map((star, i) => (
          <span
            key={i}
            className={star.hdr ? 'hdr-star is-lit' : 'hdr-star'}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.s,
              height: star.s,
            }}
          />
        ))}
        <span className="hdr-moon" />
      </div>

      <p className="hdr-line">
        Nothing here is bigger, bolder or moving. Half the stars are plain
        white; the rest, like <span className="hdr-glow">these words</span>,
        are simply <span className="hdr-glow">brighter than white</span>.
      </p>

      <fieldset className="hdr-limit">
        <legend>dynamic-range-limit</legend>
        {LIMITS.map((limit) => (
          <label key={limit}>
            <input
              type="radio"
              name="hdr-limit"
              value={limit}
              defaultChecked={limit === 'no-limit'}
            />{' '}
            {limit}
          </label>
        ))}
      </fieldset>

      <figcaption>
        <span className="hdr-only">
          Switch to <code>standard</code> and the lit words and stars drop back
          to the same white as the others.
        </span>
        <span className="sdr-only">
          Your screen or browser reports no HDR, so everything above is plain
          white — which is exactly what an SDR photo of the night sky looks like.
        </span>
      </figcaption>
    </figure>
  )
}
