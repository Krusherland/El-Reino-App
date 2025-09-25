import React, { useState } from 'react'

export const useForm = (initialValues = {}) => {
  const [formValues, setFormValues] = useState(initialValues)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues({ 
      ...formValues,
      [name]: value
    })
  }

  const resetForm = () => {
    setFormValues(initialValues)
  }

  return {
    formValues,
    handleChange,
    resetForm
  }
}
