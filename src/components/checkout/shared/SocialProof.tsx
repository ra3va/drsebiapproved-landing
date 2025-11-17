export function SocialProof() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3 mb-3 shadow-sm">
      <div className="flex items-center gap-2 text-xs">
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-green-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
            ✓
          </div>
          <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
            ✓
          </div>
          <div className="w-6 h-6 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
            ✓
          </div>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">
            <span className="text-green-600">23 people</span> are viewing this right now
          </p>
          <p className="text-gray-600 text-[10px]">
            Join 1,200+ customers who've transformed their health
          </p>
        </div>
      </div>
    </div>
  )
}
