// app/layout.js
export const metadata = {
  title: "V Ramanan — Children's Book Author | Nature Rituals",
  description: "V Ramanan is a Toronto-based children's book author. Author of Nature Rituals: Emotional Recipes for Children.",
  openGraph: {
    title: "V Ramanan — Children's Book Author",
    description: "Where Nature Meets a Child's Heart. Two published books.",
    url: "https://www.vramanan.org",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=Caveat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
