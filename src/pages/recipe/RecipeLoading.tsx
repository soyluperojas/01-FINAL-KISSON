
export const RecipeLoading = () => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="h-8 w-8 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mx-auto mb-4"></div>
        <p className="text-white/80">Loading recipe...</p>
      </div>
    </div>
  );
};
