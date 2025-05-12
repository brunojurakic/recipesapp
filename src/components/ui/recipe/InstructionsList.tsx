interface Instruction {
  content: string;
}

interface InstructionsListProps {
  instructions: Instruction[];
  onInstructionChange: (index: number, content: string) => void;
  onAddInstruction: () => void;
}

export function InstructionsList({ instructions, onInstructionChange, onAddInstruction }: InstructionsListProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-zinc-700">Instructions</label>
        <button
          type="button"
          onClick={onAddInstruction}
          className="text-sm text-zinc-600 hover:text-zinc-900"
        >
          + Add Step
        </button>
      </div>
      {instructions.map((instruction, index) => (
        <div key={index} className="mb-4">
          <div className="flex items-start gap-4">
            <span className="mt-2 text-sm font-medium text-zinc-500">
              {index + 1}.
            </span>
            <textarea
              rows={2}
              placeholder={`Step ${index + 1}`}
              className="flex-1 rounded-md border border-zinc-300 px-3 py-2 focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 sm:text-sm text-zinc-900 placeholder:text-zinc-500"
              value={instruction.content}
              onChange={(e) => onInstructionChange(index, e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
