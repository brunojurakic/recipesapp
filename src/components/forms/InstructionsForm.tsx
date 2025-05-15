import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { CreateRecipeFormData } from '@/lib/validations/recipe-zod'
import { FieldArrayWithId } from 'react-hook-form'
import { Plus } from 'lucide-react'

interface InstructionsFormProps {
  register: UseFormRegister<CreateRecipeFormData>
  errors: FieldErrors<CreateRecipeFormData>
  instructionFields: FieldArrayWithId<CreateRecipeFormData, 'instructions', 'id'>[]
  appendInstruction: (value: { stepNumber: number; content: string }) => void
  removeInstruction: (index: number) => void
}

const InstructionsForm = ({
  register,
  errors,
  instructionFields,
  appendInstruction,
  removeInstruction
}: InstructionsFormProps) => {
  return (
    <div className="space-y-4 mb-10">
      <div className='flex justify-between'>
        <h2 className="text-xl font-semibold">Instructions</h2>
        <button onClick={() => appendInstruction({ stepNumber: instructionFields.length + 1, content: '' })}
          className="bg-zinc-200 text-black p-1 rounded-md hover:bg-zinc-300 hover:cursor-pointer">
          <Plus />
        </button>
      </div>

      {instructionFields.map((field, index) => (
        <div key={field.id} className="flex gap-4 items-start">
          <div className="w-16 text-center pt-2">Step {index + 1}</div>
          <div className="flex-1">
            <input
              {...register(`instructions.${index}.content`)}
              placeholder={`Step ${index + 1} instruction`}
              className="border rounded-md p-2 w-full focus:outline-1"
            />
            {errors.instructions?.[index]?.content && (
              <p className="text-red-500 text">{errors.instructions[index].content?.message}</p>
            )}
          </div>
          <button onClick={() => removeInstruction(index)}
            className="text-red-500 text-center pt-2 hover:cursor-pointer p-2 rounded-md">
            Remove
          </button>
        </div>
      ))}

      {errors.instructions && <p className='text-red-500'>{errors.instructions.message}</p>}
    </div>
  )
}

export default InstructionsForm