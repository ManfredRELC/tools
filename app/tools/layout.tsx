import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <div className="wrap" style={{ paddingTop: 0, paddingBottom: 40 }}>
        <Footer />
      </div>
    </>
  );
}
