import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { CreateRecipeFormData } from '@/lib/validations/recipe-zod'
import { FieldArrayWithId } from 'react-hook-form'
import { Plus, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

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
        <Button variant={'outline'} onClick={() => appendInstruction({ stepNumber: instructionFields.length + 1, content: '' })}>
          <Plus />
        </Button>
      </div>

      {instructionFields.map((field, index) => (
        <div key={field.id} className="flex gap-4 items-start">
          <div className="w-16 text-center pt-2">Step {index + 1}</div>
          <div className="flex-1">
            <Input {...register(`instructions.${index}.content`)} placeholder={`Step ${index + 1} instruction`} />
            {errors.instructions?.[index]?.content && (
              <p className="text-red-500 text">{errors.instructions[index].content?.message}</p>
            )}
          </div>
          <Button onClick={() => removeInstruction(index)} variant={'outline'}>
            <X className='text-red-500'/>
          </Button>
        </div>
      ))}

      {errors.instructions && <p className='text-red-500'>{errors.instructions.message}</p>}
    </div>
  )
}

export default InstructionsForm