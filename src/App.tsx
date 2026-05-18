import { MainLayout } from "./components/MainLayout";
import { Header } from "./components/Header";

function App() {
  return (
    <div className="relative min-h-screen w-full bg-[#F8FAFC] selection:bg-[#3B82F6]/20 selection:text-[#0F172A] overflow-x-hidden flex flex-col">
      <Header />
      
      {/* Workspace Padding */}
      <main className="w-full px-[24px] md:px-[48px] xl:px-[80px] max-w-[1400px] mx-auto pt-16 pb-32">
        <MainLayout />
      </main>
    </div>
  );
}

export default App;
