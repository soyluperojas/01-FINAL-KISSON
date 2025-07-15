
export const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 no-print">
      <p className="text-muted-foreground text-center mb-4 font-display">
        Creating your recipe...
      </p>
      <div className="h-8 w-8 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
    </div>
  );
};
