export const FORM_STEPS = [
  {
    id: 1,
    title: "Osnovne informacije",
    fields: [
      "title",
      "description",
      "servings",
      "preparationTime",
      "image",
    ] as const,
  },
  {
    id: 2,
    title: "Upute",
    fields: ["instructions"] as const,
  },
  {
    id: 3,
    title: "Sastojci",
    fields: ["ingredients"] as const,
  },
  {
    id: 4,
    title: "Kategorije i alergeni",
    fields: ["categories", "allergies"] as const,
  },
] as const
