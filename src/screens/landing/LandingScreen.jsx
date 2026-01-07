import React from 'react'
import { useNavigate } from 'react-router-dom'

const heroImage = 'https://static.wixstatic.com/media/7fe594_2ed37e67837b486ab83dc21ec9c5eb14~mv2.jpg/v1/fill/w_786,h_884,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/7fe594_2ed37e67837b486ab83dc21ec9c5eb14~mv2.jpg'

export const LandingScreen = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e7ebf0] to-[#d6dbe3] text-[#1f2a3d] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl overflow-hidden">
        <div className="relative">
          <img
            src={heroImage}
            alt="Event venue interior"
            className="w-full h-[420px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50" />
          <div className="absolute inset-x-0 top-0 flex justify-between items-center px-6 py-5 text-sm text-white/90">
            <span className="font-semibold tracking-wide">FEEP Annual Event</span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs">Community</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <p className="text-lg uppercase tracking-[0.22em] font-medium mb-2">Welcome</p>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight drop-shadow-lg">Get Ready To Connect & Learn</h1>
          </div>
        </div>

        <div className="px-8 py-10 space-y-8">
          <p className="text-xl sm:text-2xl font-semibold leading-relaxed text-[#243046]">
            Join industry leaders, discover masterclasses, and make meaningful connections throughout the event.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 text-sm text-[#455069]">
            <FeaturePill label="Live schedule" />
            <FeaturePill label="Speaker lineup" />
            <FeaturePill label="1:1 networking" />
          </div>

          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto sm:min-w-[220px] inline-flex items-center justify-between gap-4 px-6 py-4 rounded-full bg-gradient-to-r from-[#0f172a] to-[#1f2937] text-white text-lg font-semibold shadow-xl hover:translate-y-[-2px] hover:shadow-2xl transition-transform"
          >
            <span>Start</span>
            <span className="flex items-center gap-1 text-sm font-medium bg-white/15 rounded-full px-3 py-1">Go to app →</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const FeaturePill = ({ label }) => (
  <div className="rounded-xl bg-[#f2f5f9] border border-[#e1e6ef] px-4 py-3 font-semibold">
    {label}
  </div>
)

export default LandingScreen
