import "./globals.css";

export const metadata = {
  title: "MedTracker",
  description: "Organisation médecine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}