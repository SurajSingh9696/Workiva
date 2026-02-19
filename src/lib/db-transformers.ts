/**
 * Database transformation utilities
 * Handles conversion between UI-friendly capitalized values and database lowercase values
 */

// Transform UI value to database value (capitalize to lowercase with separators)
export function toDbValue(value: string | undefined | null): string | undefined | null {
  if (!value) return value;
  
  // Handle special cases
  const specialCases: Record<string, string> = {
    "On-site": "on-site",
    "Full-time": "full-time",
    "Part-time": "part-time",
    "Entry Level": "entry level",
    "Mid Level": "mid level", 
    "Senior Level": "senior level",
    "High School": "high school",
  };
  
  if (specialCases[value]) {
    return specialCases[value];
  }
  
  // Default: just lowercase
  return value.toLowerCase();
}

// Transform database value to UI value (lowercase to capitalized)
export function fromDbValue(value: string | undefined | null): string | undefined | null {
  if (!value) return value;
  
  // Handle special cases
  const specialCases: Record<string, string> = {
    "on-site": "On-site",
    "full-time": "Full-time",
    "part-time": "Part-time",
    "entry level": "Entry Level",
    "mid level": "Mid Level",
    "senior level": "Senior Level",
    "high school": "High School",
  };
  
  if (specialCases[value]) {
    return specialCases[value];
  }
  
  // Default: capitalize first letter
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// Transform object with multiple enum fields for database storage
export function transformForDb<T extends Record<string, any>>(data: T): T {
  const transformed: any = { ...data };
  
  const fieldsToTransform = [
    'jobType', 'workType', 'jobLevel', 'minEducation', 
    'salaryPeriod', 'role', 'organizationType', 'education',
    'gender', 'maritalStatus'
  ];
  
  fieldsToTransform.forEach(field => {
    if (field in transformed && typeof transformed[field] === 'string') {
      transformed[field] = toDbValue(transformed[field]);
    }
  });
  
  return transformed as T;
}

// Transform object from database for UI display
export function transformFromDb<T extends Record<string, any>>(data: T): T {
  const transformed: any = { ...data };
  
  const fieldsToTransform = [
    'jobType', 'workType', 'jobLevel', 'minEducation',
    'salaryPeriod', 'role', 'organizationType', 'education',
    'gender', 'maritalStatus'
  ];
  
  fieldsToTransform.forEach(field => {
    if (field in transformed && typeof transformed[field] === 'string') {
      transformed[field] = fromDbValue(transformed[field]);
    }
  });
  
  return transformed as T;
}
