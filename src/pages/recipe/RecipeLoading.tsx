
export const RecipeLoading = () => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="h-8 w-8 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mx-auto mb-4"></div>
        <p className="text-white/80 mb-2">Loading recipe...</p>
        <p className="text-white/60 text-sm">This may take a few seconds</p>
        <div className="mt-4 text-xs text-white/40">
          <p>If this takes too long, try refreshing the page</p>
        </div>
      </div>
    </div>
  );
};
