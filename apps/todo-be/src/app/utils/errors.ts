export interface FieldError {
  field: string;
  value: string;
}

export interface ValidationError {
  fields: FieldError[];
}

export const createValidationError = (errors: { field: string; value: unknown }[]): ValidationError => {
  return {
    fields: errors.map(err => ({
      field: err.field,
      value: String(err.value ?? '')
    }))
  };
};
