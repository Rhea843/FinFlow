import { useNavigate } from 'react-router-dom'

const GetStarted = () => {
  const navigate = useNavigate()

  return (
    <div id="about" className="bg-[#fafafa] px-6 py-10 text-center">
      <div className="max-w-2xl mx-auto">
       <h2 className="text-4xl md:text-5xl font-bold text-[#2e2e2e] mb-6">
          Your Financial Future Starts
          <span className="block text-[#3A6EA5] mt-2">With Better Visibility</span>
        </h2>
        <p className="text-[#2e2e2e] mb-10 leading-relaxed">
          Stop relying on memory and spreadsheets. Track your income,
          understand your spending, and make every financial decision with confidence.
        </p>

        <button
            onClick={() => navigate('/register')}
            className="bg-[#3A6EA5] text-white px-10 py-4 rounded-md font-medium hover:bg-[#2a4b75] transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
          >
            Get started today
          </button>
      </div>
    </div>
  )
}

export default GetStarted
