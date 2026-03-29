import { useState, useRef } from 'react'
import { buildApiResourceUrl } from '../utils/utils'

const ProblemsetView = () => {
  const [currProblemIdx, setCurrProblemIdx] = useState(0)
  const [activeTab, setActiveTab] = useState<'info' | 'submit'>('info')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeProblem = problems[currProblemIdx]

  // Get the URL for the PDF
  const statementUrl = activeProblem?.statement?.[0]?.href
    ? buildApiResourceUrl(appConfig, activeProblem.statement[0].href)
    : null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div>ProblemSet</div>
  )
}

export default ProblemsetView;

/*
    <main className="min-h-[calc(100vh-80px)] bg-primaryWhite p-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

<section className="flex-1 space-y-8">
  <header>
    <h2 className="text-3xl font-black uppercase text-primaryBlack tracking-tight">
      Contest <span className="text-primaryBlue">Tasks</span>
    </h2>
    <p className="text-gray-500 font-bold uppercase text-xs mt-1">Select a task to view details and submit</p>
  </header>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {problems.map((prob, index) => (
      <button
        key={prob.id}
        onClick={() => {
          setCurrProblemIdx(index)
          setSelectedFile(null)
          setActiveTab('info') // Reset to info tab when switching problems
        }}
        className={`text-left p-6 rounded-xl border-2 transition-all relative
                  ${activeProblem?.id === prob.id
            ? 'bg-primaryYellow border-primaryBlack shadow-[4px_4px_0px_0px_rgba(33,31,31,1)]'
            : 'bg-white border-gray-200 hover:border-primaryBlack'
          }`}
      >
        <span className="font-black text-2xl text-primaryBlue mb-1 block">{prob.label}</span>
        <h3 className="font-extrabold text-primaryBlack text-lg uppercase truncate">{prob.name}</h3>
      </button>
    ))}
  </div>
</section>

<aside className="w-full lg:w-110 shrink-0">
  {activeProblem ? (
    <div className="bg-white border-4 border-primaryBlack rounded-2xl shadow-[8px_8px_0px_0px_rgba(33,31,31,1)] sticky top-24 overflow-hidden">

<div className="bg-primaryBlack p-6 text-white">
  <div className="flex justify-between items-start mb-2">
    <span className="bg-primaryYellow text-primaryBlack px-2 py-1 rounded text-[10px] font-black uppercase">
      Task {activeProblem.label}
    </span>
    <div className="flex gap-2">
      <div className="w-3 h-3 rounded-full bg-red-500 border border-white/20"></div>
      <div className="w-3 h-3 rounded-full bg-yellow-500 border border-white/20"></div>
      <div className="w-3 h-3 rounded-full bg-green-500 border border-white/20"></div>
    </div>
  </div>
  <h2 className="text-2xl font-black uppercase leading-tight">{activeProblem.name}</h2>
</div>

      <div className="flex border-b-4 border-primaryBlack bg-gray-100">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-3 font-black uppercase text-xs tracking-widest transition-colors
                    ${activeTab === 'info' ? 'bg-white text-primaryBlue' : 'text-gray-500 hover:text-primaryBlack'}`}
        >
          Problem Info
        </button>
        <button
          onClick={() => setActiveTab('submit')}
          className={`flex-1 py-3 font-black uppercase text-xs tracking-widest border-l-4 border-primaryBlack transition-colors
                    ${activeTab === 'submit' ? 'bg-white text-primaryBlue' : 'text-gray-500 hover:text-primaryBlack'}`}
        >
          Submit Solution
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'info' ? (
<div className="space-y-6">
  <div className="grid grid-cols-2 gap-4">
    <div className="bg-primaryWhite p-4 rounded-xl border-2 border-primaryBlack/5">
      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Time Limit</p>
      <p className="text-lg font-black text-primaryBlack">{activeProblem.time_limit ?? 1}s</p>
    </div>
    <div className="bg-primaryWhite p-4 rounded-xl border-2 border-primaryBlack/5">
      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Memory Limit</p>
      <p className="text-lg font-black text-primaryBlack">{activeProblem.memory_limit ?? 256}MB</p>
    </div>
  </div>

  <div className="py-4 border-t-2 border-dashed border-gray-200">
    <p className="text-[10px] font-black text-gray-400 uppercase mb-3">Documentation</p>
    {statementUrl ? (
      <a
        href={statementUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between bg-primaryBlue text-white p-4 rounded-xl font-black uppercase tracking-tighter hover:bg-primaryBlack transition-all"
      >
        <span>Read Full Statement</span>
        <span className="text-xl group-hover:translate-x-1 transition-transform">↗</span>
      </a>
    ) : (
      <div className="p-4 bg-gray-100 rounded-xl text-center">
        <p className="text-xs font-bold text-gray-500 uppercase italic">No PDF available for this task</p>
      </div>
    )}
  </div>

  <button
    onClick={() => setActiveTab('submit')}
    className="w-full py-3 bg-primaryYellow border-2 border-primaryBlack rounded-xl font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
  >
    Go to Submit →
  </button>
</div>
        ) : (
<div className="space-y-6">
  <div
    onDragOver={(e) => e.preventDefault()}
    onDrop={handleDrop}
    onClick={() => fileInputRef.current?.click()}
    className={`border-4 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all
                        ${selectedFile ? 'border-primaryBlue bg-blue-50' : 'border-gray-200 hover:border-primaryBlack bg-gray-50'}`}
  >
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      className="hidden"
      accept=".cpp,.py,.java,.c,.js"
    />
    {selectedFile ? (
      <div className="text-center">
        <div className="text-5xl mb-3">📄</div>
        <p className="text-sm font-black text-primaryBlack truncate max-w-[200px]">{selectedFile.name}</p>
        <p className="text-[10px] font-bold text-gray-400 uppercase">{(selectedFile.size / 1024).toFixed(1)} KB</p>
        <button
          onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
          className="mt-4 text-[10px] font-black text-red-500 uppercase underline"
        >
          Cancel & Change
        </button>
      </div>
    ) : (
      <div className="text-center">
        <div className="text-5xl mb-3 opacity-20">📤</div>
        <p className="text-sm font-black text-primaryBlack uppercase tracking-tight">Select source file</p>
        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">or drag and drop here</p>
      </div>
    )}
  </div>

  <button
    disabled={!selectedFile}
    onClick={() => selectedFile && onSubmit(selectedFile)}
    className={`w-full font-black py-5 rounded-2xl uppercase tracking-[0.2em] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                        ${selectedFile
        ? 'bg-primaryBlue text-white hover:bg-primaryBlack active:shadow-none active:translate-x-1 active:translate-y-1'
        : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
  >
    Send Submission
  </button>

  {submitStatus !== 'idle' && (
    <div className={`p-4 rounded-xl text-xs font-black uppercase border-2 animate-in fade-in slide-in-from-bottom-2 ${submitStatus === 'ok' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'
      }`}>
      {submitMessage}
    </div>
  )}
</div>
)}
      </div >
    </div >
  ) : (
<div className="h-96 border-4 border-dashed border-gray-200 rounded-2xl flex items-center justify-center grayscale opacity-40 text-center p-10">
  <div>
    <div className="text-6xl mb-4">👈</div>
    <p className="font-black text-gray-400 uppercase text-sm tracking-widest">Pick a problem from the grid to get started</p>
  </div>
</div>
)}
</aside >
      </div >
    </main >
*/