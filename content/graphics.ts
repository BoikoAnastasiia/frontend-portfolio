export type GraphicItem = {
  src: string
  width: number
  height: number
  alt: string
}

/**
 * Ships empty on purpose. The gallery below it is complete and renders nothing
 * while this is empty, so adding work is: drop files into public/graphics/ and
 * append an entry here. No other change is needed.
 */
export const GRAPHICS: GraphicItem[] = []
