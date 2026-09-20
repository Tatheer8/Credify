import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "CrediWise AI | Intelligent Loan Assessment",
  description:
    "AI-powered loan eligibility analysis using K-Nearest Neighbors machine learning. Real-time predictive underwriting, risk scoring, and explainable decision factors.",
  keywords: [
    "CrediWise AI",
    "loan assessment",
    "KNN",
    "machine learning",
    "fintech",
    "credit risk",
    "loan underwriting",
    "intelligent lending",
  ],
  authors: [{ name: "CrediWise AI Team" }],
  openGraph: {
    title: "CrediWise AI | Intelligent Loan Assessment",
    description: "AI-powered loan eligibility analysis using K-Nearest Neighbors machine learning.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        {/* Animated background mesh: Dark navy → black → emerald/teal glow */}
        <div className="mesh-bg">
          <div className="mesh-blob" />
          <div className="mesh-blob" />
          <div className="mesh-blob" />
        </div>
        {children}
      </body>
    </html>
  );
}
