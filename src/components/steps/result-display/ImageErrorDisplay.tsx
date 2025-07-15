
interface ImageErrorDisplayProps {
  showApiError: boolean;
  errorMessage?: string;
}

export const ImageErrorDisplay = ({ showApiError, errorMessage }: ImageErrorDisplayProps) => {
  const isServerError = errorMessage?.includes('server issues') || errorMessage?.includes('500');
  const isRateLimit = errorMessage?.includes('rate limit') || errorMessage?.includes('429');
  const isPaymentError = errorMessage?.includes('payment') || errorMessage?.includes('402');

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg">
      <div className="text-center p-4 max-w-xs">
        {showApiError ? (
          <>
            <div className="text-4xl mb-3">
              {isServerError ? "🔧" : isRateLimit ? "⏱️" : isPaymentError ? "💳" : "🎨"}
            </div>
            <p className="text-sm text-red-600 font-medium mb-2">
              {isServerError && "OpenAI server issues"}
              {isRateLimit && "Rate limit exceeded"}
              {isPaymentError && "Payment required"}
              {!isServerError && !isRateLimit && !isPaymentError && "Image generation unavailable"}
            </p>
            <p className="text-xs text-red-500 leading-relaxed">
              {isServerError && "DALL-E service is experiencing temporary server issues. This should resolve in a few minutes."}
              {isRateLimit && "Too many requests. Please wait a moment and try again."}
              {isPaymentError && "Please check your OpenAI billing settings."}
              {!isServerError && !isRateLimit && !isPaymentError && (
                errorMessage?.includes('500') 
                  ? "OpenAI DALL-E service is experiencing issues. Please try again in a few minutes."
                  : "DALL-E API error - Check your OpenAI account status and billing."
              )}
            </p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-3">📷</div>
            <p className="text-sm text-gray-600 font-medium mb-2">No image available</p>
            <p className="text-xs text-gray-500">Image generation is disabled</p>
          </>
        )}
      </div>
    </div>
  );
};
