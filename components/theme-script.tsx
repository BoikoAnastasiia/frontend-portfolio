/**
 * Applies the stored theme before first paint. Must stay inline and blocking —
 * moving it to an effect reintroduces a flash of the wrong theme.
 */
const script = `(function(){try{var t=localStorage.getItem('theme');if(t==='mono'||t==='color'){document.documentElement.dataset.theme=t}}catch(e){}})()`

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
