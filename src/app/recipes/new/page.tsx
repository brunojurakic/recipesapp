"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CreateRecipeFormData } from '@/lib/validations/recipe-zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { recipeZodSchema } from '@/lib/validations/recipe-zod'

const NewRecipePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateRecipeFormData>({
    resolver: zodResolver(recipeZodSchema)
  })

  const onSubmit = (data: CreateRecipeFormData) => {
    console.log(data);
  }

  return (
    <div className='max-w-4xl mx-auto p-6 pt-25'>
      <h1 className='text-2xl font-bold mb-6'>Create New Recipe</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>

        <div className='space-y-4'>
          <div>
            <label className='block mb-1'>Title</label>
            <input {...register('title')} type="text" placeholder='Recipe title' 
            className='w-full p-2 border rounded-md focus:outline-1'/>
            {errors.title && <p className='text-red-500'>{errors.title.message}</p>}
          </div>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='block mb-1'>Description</label>
            <textarea {...register('description')} placeholder='Recipe title' 
            className='w-full p-2 border rounded-md focus:outline-1'/>
            {errors.description && <p className='text-red-500'>{errors.description.message}</p>}
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block mb-1'>Servings (people)</label>
            <input {...register('servings', {valueAsNumber: true})} type="number" defaultValue={1} 
            className='border rounded-md p-2 w-full focus:outline-1'/>
            {errors.servings && <p className='text-red-500'>{errors.servings.message}</p>}
          </div>

          <div>
            <label className='block mb-1'>Preparation time (minutes)</label>
            <input {...register('preparationTime', {valueAsNumber: true})} type="number" defaultValue={1} 
            className='border rounded-md p-2 w-full focus:outline-1'/>
            {errors.preparationTime && <p className='text-red-500'>{errors.preparationTime.message}</p>}
          </div>
        </div>

        <div>
          <label className='block mb-1'>Image</label>
          <input {...register('image')} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
          className='border rounded-md p-2 w-full focus:outline-1'/>
          {errors.image && <p className='text-red-500'>{errors.image.message}</p>}
        </div>

        <button type='submit'>Create</button>
      </form>
    </div>
  )
}

export default NewRecipePage