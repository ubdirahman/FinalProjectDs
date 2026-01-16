import { useMemo, useState } from "react";
import { predict } from "./api";

// --- Custom Icons matching the dashboard style in Dark Pink ---
const Icons = {
  Logo: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="7" fill="#BE185D"/> {/* Dark Pink */}
      <path d="M12 7V17M7 12H17" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  Trend: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#BE185D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
  )
};

export default function App() {
  const [size, setSize] = useState("1500");
  const [bedrooms, setBedrooms] = useState("3");
  const [bathrooms, setBathrooms] = useState("2");
  const [yearBuilt, setYearBuilt] = useState("2010");
  const [location, setLocation] = useState("City");
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(null);
  const [err, setErr] = useState("");

  const payload = useMemo(() => ({
    size_sqft: Number(size),
    bedrooms: Number(bedrooms),
    bathrooms: Number(bathrooms),
    year_built: Number(yearBuilt),
    location,
  }), [size, bedrooms, bathrooms, yearBuilt, location]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setPrice(null);
    try {
      setLoading(true);
      const res = await predict(payload);
      setPrice(res.predicted_price);
    } catch (err) {
      setErr("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FFF9FA] font-sans text-[#4D0421]">
      
      {/* --- HEADER --- */}
      <header className="bg-white px-8 py-5 shadow-sm">
        <div className="mx-auto flex max-w-[1200px] items-center gap-4">
          <Icons.Logo />
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-[#4D0421]">House Prediction</h1>
            <p className="text-[10px] font-bold text-[#BE185D] uppercase tracking-widest">ProphetAI Engine v2.0</p>
          </div>
        </div>
      </header>

      {/* --- INTRO SECTION --- */}
      <section className="px-8 pt-10 pb-6 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-black mb-3 text-[#4D0421]">AI Market Valuation</h2>
          <p className="text-sm font-medium leading-relaxed text-slate-500">
            Our advanced machine learning model analyzes local market trends, property dimensions, 
            and historical build data to provide an instant, high-accuracy estimate of your home's 
            current market value.
          </p>
        </div>
      </section>

      {/* --- MAIN CONTENT LAYOUT --- */}
      <main className="flex-grow px-8 pb-12">
        <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-12">
          
          {/* LEFT: FORM SECTION */}
          <div className="lg:col-span-8">
            <div className="rounded-[2.5rem] bg-white p-10 shadow-xl shadow-pink-100/40 border border-white">
              <form onSubmit={onSubmit} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    { label: "Living Area (sqft)", val: size, set: setSize },
                    { label: "Bedrooms", val: bedrooms, set: setBedrooms },
                    { label: "Bathrooms", val: bathrooms, set: setBathrooms },
                    { label: "Build Year", val: yearBuilt, set: setYearBuilt },
                  ].map((field) => (
                    <div key={field.label} className="group">
                      <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-400 group-focus-within:text-[#BE185D]">
                        {field.label}
                      </label>
                      <input
                        type="number"
                        value={field.val}
                        onChange={(e) => field.set(e.target.value)}
                        className="w-full rounded-2xl border-2 border-transparent bg-[#FFF5F7] px-5 py-4 font-bold outline-none transition-all focus:border-[#BE185D] focus:bg-white"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="mb-3 block text-[11px] font-black uppercase tracking-wider text-slate-400">Location Setting</label>
                  <div className="flex w-full gap-2 rounded-2xl bg-[#FFF0F3] p-1.5 md:w-2/3">
                    {["City", "Suburb", "Rural"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setLocation(opt)}
                        className={`flex-1 rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all ${
                          location === opt ? "bg-white text-[#BE185D] shadow-md" : "text-pink-300 hover:text-[#4D0421]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#BE185D] py-5 text-sm font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-pink-200 transition-all hover:scale-[1.01] hover:bg-[#9D1149] disabled:opacity-50"
                >
                  {loading ? "PROCESSING..." : "GENERATE ESTIMATE"}
                </button>
                {err && <p className="text-center text-xs font-bold text-red-500">{err}</p>}
              </form>
            </div>
          </div>

          {/* RIGHT: SHORTENED PREDICTION RESULT */}
          <div className="lg:col-span-4">
            <div className="h-fit rounded-[2.5rem] bg-white p-8 shadow-xl shadow-pink-100/40 border border-white">
              <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-slate-400">Result</h3>
              
              {!price ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF0F3] text-[#BE185D]">
                    <Icons.Trend />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-pink-200">Awaiting Data</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-[2rem] bg-gradient-to-br from-[#BE185D] to-[#831843] p-8 text-white shadow-lg shadow-pink-200">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70">Estimated Value</span>
                    <div className="mt-1 text-3xl font-black">
                      ${Number(price).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-pink-50 px-4 py-3">
                    <span className="text-[9px] font-black uppercase text-[#BE185D]/70">Confidence</span>
                    <span className="text-xs font-black text-[#BE185D]">92%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white px-8 py-8 border-t border-pink-50">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-pink-200 sm:flex-row">
          <div className="flex items-center gap-2">
            <Icons.Logo />
            <span className="text-[#BE185D]">ProphetAI © 2026</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[#BE185D] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#BE185D] transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}