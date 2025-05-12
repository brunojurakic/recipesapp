interface BasicRecipeInfoProps {
  title: string;
  description: string;
  servings: number;
  preparationTime: number;
  onUpdate: (field: string, value: string | number) => void;
}

export function BasicRecipeInfo({
  title,
  description,
  servings,
  preparationTime,
  onUpdate,
}: BasicRecipeInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-700">
          Recipe Title
        </label>
        <input
          type="text"
          id="title"
          required
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 sm:text-sm text-zinc-900 placeholder:text-zinc-500"
          value={title}
          onChange={(e) => onUpdate('title', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 sm:text-sm text-zinc-900 placeholder:text-zinc-500"
          value={description}
          onChange={(e) => onUpdate('description', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="servings" className="block text-sm font-medium text-zinc-700">
            Servings
          </label>
          <input
            type="number"
            id="servings"
            min="1"
            required
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 sm:text-sm text-zinc-900 placeholder:text-zinc-500"
            value={servings}
            onChange={(e) => onUpdate('servings', parseInt(e.target.value) || 1)}
          />
        </div>

        <div>
          <label htmlFor="preparationTime" className="block text-sm font-medium text-zinc-700">
            Preparation Time (minutes)
          </label>
          <input
            type="number"
            id="preparationTime"
            min="1"
            required
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 sm:text-sm text-zinc-900 placeholder:text-zinc-500"
            value={preparationTime}
            onChange={(e) => onUpdate('preparationTime', parseInt(e.target.value) || 30)}
          />
        </div>
      </div>
    </div>
  );
}
