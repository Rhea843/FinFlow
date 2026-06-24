import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div className="bg-slate-50 sticky top-0 z-50">
      <nav className="px-6 py-2">
        <div className="flex items-center justify-between">
          
          {/*  hamburger + logo */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
             <button
               className="md:hidden" 
               onClick={() => setMenuOpen(!menuOpen)}
             >
                {menuOpen ? <X className="w-6 h-6 text-[#2e2e2e]" /> : <Menu className="w-6 h-6 text-[#2e2e2e]" />}
              </button>
              <h1 className="bg-linear-to-r from-[rgba(58,110,165,0.8)] via-[rgba(154,180,207,0.78)] to-[rgba(58,110,165,0.75)] bg-clip-text text-transparent md:text-2xl text-xl font-bold tracking-wide">
                FinFlow
              </h1>
            </div>
           
            <button
              onClick={() => navigate('/login')}
              className="block md:hidden border border-[#3A6EA5] text-[#3A6EA5] px-5 py-2 rounded-md text-sm font-medium hover:bg-[#3A6EA5] hover:text-white transition-all"
            >
              Login
            </button>
           
          </div>

          {/*  desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-base font-medium text-slate-600">
            <button onClick={() => scrollTo('home')} className="hover:text-[#3A6EA5] transition-colors">Home</button>
            <button onClick={() => scrollTo('about')} className="hover:text-[#3A6EA5] transition-colors">About</button>
            <button onClick={() => scrollTo('features')} className="hover:text-[#3A6EA5] transition-colors">Features</button>
            <button onClick={() => scrollTo('contact')} className="hover:text-[#3A6EA5] transition-colors">Contact</button>
          </div>

          {/* right — login button (desktop only) */}
          <button
            onClick={() => navigate('/login')}
            className="hidden md:block border border-[#3A6EA5] text-[#3A6EA5] px-5 py-2 rounded-md text-sm font-medium hover:bg-[#3A6EA5] hover:text-white transition-all"
          >
            Login
          </button>

        </div>

        {/* mobile menu  */}
        {menuOpen && (

          <>
            {/* dark overlay behind the menu */}
            <div
              className="md:hidden fixed inset-0 z-40 bg-black/50"
              onClick={() => setMenuOpen(false)}
            />

            <div className="md:hidden w-74 fixed top-11 left-0 right-0 bottom-0 z-50 bg-[#3A6EA5]/95 backdrop-blur px-6 py-6 flex flex-col gap-5 text-white text-base shadow-lg">
              <button onClick={() => scrollTo('home')} className="text-left hover:text-white/70 transition-colors">Home</button>
               <hr className="border-white/20" />
              <button onClick={() => scrollTo('about')} className="text-left hover:text-white/70 transition-colors">About</button>
               <hr className="border-white/20" />
              <button onClick={() => scrollTo('features')} className="text-left hover:text-white/70 transition-colors">Features</button>
               <hr className="border-white/20" />
              <button onClick={() => scrollTo('contact')} className="text-left hover:text-white/70 transition-colors">Contact</button>
              <hr className="border-white/20" />
              
            </div>
         </>
      )}

      </nav>
    </div>
  )
}

export default Navbar