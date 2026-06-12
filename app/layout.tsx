import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Buddy Script",
  icons: { icon: "/assets/images/logo-copy.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
          precedence="default"
        />
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" precedence="default" />
        <link rel="stylesheet" href="/assets/css/common.css" precedence="default" />
        <link rel="stylesheet" href="/assets/css/main.css" precedence="default" />
        <link rel="stylesheet" href="/assets/css/responsive.css" precedence="default" />
      </head>
      <body>
        {children}
        <Script src="/assets/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
