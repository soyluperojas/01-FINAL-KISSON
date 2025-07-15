
interface RecipeHeaderProps {
  title: string;
}

export const RecipeHeader = ({ title }: RecipeHeaderProps) => {
  return (
    <div className="text-center border-b border-gray-200 pb-4">
      <h1 className="text-3xl font-bold text-black mb-2">
        {title}
      </h1>
    </div>
  );
};
