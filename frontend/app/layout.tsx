import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/modules/auth/hooks/useAuth";
import { ToastProvider } from "@/shared/hooks/useToast";
import { DialogProvider } from "@/shared/hooks/useConfirm";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alimento Solidário",
  description:
    "Doe alimentos ou peça alimentos para sua entidade. Simples, rápido e sem desperdício.",
};

export const viewport: Viewport = {
  themeColor: "#1e4c2f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ToastProvider>
          <DialogProvider>
            <AuthProvider>{children}</AuthProvider>
          </DialogProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
