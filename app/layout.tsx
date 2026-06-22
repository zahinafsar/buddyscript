import type { Metadata } from "next";
import Script from "next/script";
import { QueryProvider } from "@/providers/query-provider";

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
        <QueryProvider>{children}</QueryProvider>
        <Script src="/assets/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "xav2vsgeas");`}
        </Script>
      </body>
    </html>
  );
}
