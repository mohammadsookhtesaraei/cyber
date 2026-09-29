import type { Metadata } from "next";


import {Vazirmatn} from "next/font/google";
import "./globals.css";


const vazirmatn=Vazirmatn({
  subsets:["arabic","latin"],
  display:"swap",
  variable:"--font-vazir"
})

export const metadata: Metadata = {
  title: "Cyper",
  description: "an commerce website ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
