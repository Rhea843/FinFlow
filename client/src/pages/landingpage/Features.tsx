import { Wallet, ChartNoAxesCombined, Shield,} from 'lucide-react';


const Features = () => {
  return (
    <div id="features" className="bg-[#3A6EA5] px-6 py-10">
      <div className="max-w-6xl mx-auto">
       <h2 className="text-3xl font-bold text-white text-center mb-8">Features</h2> 

       <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Wallet className="w-7 h-7 text-[#3A6EA5]" />,
              title: 'Smart expense tracking',
              desc: 'Automatically categorize your spending and see exactly where your money goes.',
            },
            {
              icon: <ChartNoAxesCombined className="w-7 h-7 text-[#3A6EA5]" />,
              title: 'Saving goals',
              desc: 'Set goals, track progress and celebrate milestones as you build your future.',
            },
            {
              icon: <Shield className="w-7 h-7 text-[#3A6EA5]" />,
              title: 'Secure and private',
              desc: 'Your financial data is encrypted and protected with bank-level security.',
            },
          ].map((feature, i) => (
            <div key={i} className="bg-[#FAFAFA] backdrop-blur rounded-sm p-8 text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-[#3A6EA5] font-semibold text-lg mb-3">{feature.title}</h3>
              <p className="text-[#2e2e2e] text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
       </div>
        
      </div>
      
    </div>
  )
}

export default Features
