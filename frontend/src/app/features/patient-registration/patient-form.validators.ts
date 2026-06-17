import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DropdownItem } from '../../core/models/patient.models';

/** Resolves the display name for a coded value from a dropdown list. */
export function nameOf(list: DropdownItem[], code: string | null | undefined): string | null {
  if (!code) {
    return null;
  }
  return list.find((i) => i.code === code)?.name ?? null;
}

/** Validator: a date control value may not be in the future. */
export function dateNotInFuture(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  const value = new Date(control.value);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return value > today ? { future: true } : null;
}

/** Group validator: either date of birth or any age component must be provided. */
export function ageOrDateOfBirthRequired(group: AbstractControl): ValidationErrors | null {
  const dob = group.get('dateOfBirth')?.value;
  const years = group.get('ageYears')?.value;
  const months = group.get('ageMonths')?.value;
  const days = group.get('ageDays')?.value;
  const hasAge = years != null || months != null || days != null;
  return dob || hasAge ? null : { ageOrDobRequired: true };
}

/** Computes whole years/months/days between a date of birth and today. */
export function computeAge(dob: Date): { years: number; months: number; days: number } | null {
  if (isNaN(dob.getTime())) {
    return null;
  }
  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years < 0) {
    return null;
  }
  return { years, months, days };
}
