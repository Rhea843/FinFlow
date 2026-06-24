import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Mail, Star } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const handleGetStarted = () => {
    if (email) {
      navigate(`/register?email=${encodeURIComponent(email)}`)
    } else {
      navigate('/register')
    }
  }
  return (
    <div id="Home" className="md:px-12 md:py-15 py-10 px-6"
    style={{
    background: `
      linear-gradient(
        240deg,
        rgba(58,110,165,1) 0%,
        rgba(58,110,165,0.01) 75%
      ),
      linear-gradient(
        260deg,
        #fafafa 0%,
        #f4f6f8 50%,
        #e8eef5 80%,
        #d6e3f0 100%
      )
    `,
  }}
    >
      {/* Hero Section */}
      <section>
        <h1 className="text-5xl md:text-6xl font-bold text-[#2e2e2e] leading-tight mb-6">
          Your <span className="text-[#3A6EA5]">money goals</span><br />deserve a plan.
        </h1>
        <p className="text-[#2e2e2e] text-base max-w-lg mb-10">
          Track income, monitor expenses, and uncover spending patterns —
          all from one powerful financial dashboard designed to help you
          make smarter money decisions.
        </p>

        <div className="flex items-center gap-3 max-w-md">
          <div className="flex items-center gap-2 flex-1 bg-white border border-slate-200 rounded-md px-4 py-3 shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            <Mail className="text-slate-400 w-4 h-4" />
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 text-sm outline-none text-[#2e2e2e] placeholder-slate-400 "
            />
          </div>

           <button
              onClick={handleGetStarted}
              className="bg-[#3A6EA5] text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-[#2a4b75] transition-colors whitespace-nowrap shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
            >
              Get Started
            </button>
        </div>
      </section>

      {/* stats section */}
      <section className="max-w-6xl mx-auto md:px-6 md:py-20 pt-15 ">
        <div className="grid md:grid-cols-4 grid-cols-2 gap-x-4 gap-y-4">
         {[
            { value: '50k+', label: 'Users managing their finances smarter' },
            { value: '₦10M+', label: 'Tracked monthly across expenses and saving goals' },
            { value: '4.9', label: 'Average rating from happy users', icon: <Star className="text-yellow-400 w-4 h-4 inline-block ml-1 fill-yellow-400" /> },
            { value: 'Encrypted', label: 'Your financial data stays private and protected' },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-[#3A6EA5] rounded-md p-6 text-center shadow-[0_2px_4px_rgba(0,0,0,0.3)] h-40 flex flex-col justify-center items-center">
              <p className="text-2xl font-bold text-[#3A6EA5] mb-2">
                {stat.value}
                <span className="-ml-1">{stat.icon}</span>
              </p>
              <p className="text-slate-500 text-sm leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>

      </section>

    </div>
  )
}

export default Home

