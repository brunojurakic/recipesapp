"use client"

import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { CreateRecipeFormData } from '@/lib/validations/recipe-zod'
import { FieldArrayWithId } from 'react-hook-form'
import { Plus, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

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
    <div className="space-y-6 mb-10">
      <div className='flex justify-between items-center'>
        <h2 className="text-xl font-semibold">Upute</h2>
        <Button variant="outline" 
          onClick={() => appendInstruction({ stepNumber: instructionFields.length + 1, content: '' })}
        >
          <Plus className="mr-2 h-4 w-4" /> Dodaj korak
        </Button>
      </div>

      {instructionFields.length === 0 && (
        <div className="text-center p-4 border border-dashed rounded-md border-gray-300">
          <p className="text-gray-500">Još nema dodanih uputa. Kliknite Dodaj korak za početak.</p>
        </div>
      )}

      {instructionFields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Korak {index + 1}</h3>
            <Button variant="ghost" onClick={() => removeInstruction(index)} size={'icon'}>
              <X className="text-red-500" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`instructions.${index}.content`}>Uputa</Label>
            <Input  id={`instructions.${index}.content`} {...register(`instructions.${index}.content`)} 
              placeholder={`Opišite korak ${index + 1}`} 
            />
            {errors.instructions?.[index]?.content && (
              <p className="text-red-500 text-sm">{errors.instructions[index].content?.message}</p>
            )}
          </div>
        </div>
      ))}

      {errors.instructions && !Array.isArray(errors.instructions) && (
        <p className="text-red-500">{errors.instructions.message}</p>
      )}
    </div>
  )
}

export default InstructionsForm