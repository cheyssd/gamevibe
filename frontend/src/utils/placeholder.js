export function placeholderImage(width, height, text = 'GameVibe') {
  const fontSize = Math.round(height * 0.12);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#1A1A2E"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#8B8FA3" font-family="sans-serif" font-size="${fontSize}">${text}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
