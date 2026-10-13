# Brand files

Put the logo here.

- Header logo: `logo.svg` (or `.png` / `.webp`). If you use a different name or format, update `logo.src` in `src/config/site.ts`.
- If the logo already includes the "View Growth Labs" name, leave `logo.showName` as `false`. If it's an icon only, set it to `true` so the name shows beside it.
- Adjust `logo.width` / `logo.height` to match the file's aspect ratio (it displays 40px tall on mobile, 48px on larger screens).

Browser tab icon (favicon): put a square file at `src/app/icon.svg` or `src/app/icon.png`. Next.js picks it up automatically.
