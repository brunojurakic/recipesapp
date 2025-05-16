export const FORM_STEPS = [
  {
    id: 1,
    title: 'Basic Information',
    fields: ['title', 'description', 'servings', 'preparationTime', 'image'] as const
  },
  {
    id: 2,
    title: 'Instructions',
    fields: ['instructions'] as const
  },
  {
    id: 3,
    title: 'Ingredients',
    fields: ['ingredients'] as const
  },
  {
    id: 4,
    title: 'Categories and allergies',
    fields: ['categories, allergies'] as const
  }
] as const;