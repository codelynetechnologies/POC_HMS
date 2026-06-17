/** Gender enum — values match the backend domain enum. */
export enum Gender {
  Unknown = 0,
  Male = 1,
  Female = 2,
  Other = 3,
}

/** Patient type enum — values match the backend domain enum. */
export enum PatientType {
  NewPatient = 1,
  ExistingPatient = 2,
  Staff = 3,
  Newborn = 4,
}

export interface DropdownItem {
  code: string;
  name: string;
  parentCode?: string | null;
}

export interface AddressDto {
  phoneCountryCode?: string | null;
  stdCode?: string | null;
  phoneNumber?: string | null;
  addressLine?: string | null;
  countryCode?: string | null;
  countryName?: string | null;
  stateCode?: string | null;
  stateName?: string | null;
  cityCode?: string | null;
  cityName?: string | null;
  areaCode?: string | null;
  areaName?: string | null;
  pincode?: string | null;
}

export interface ProfessionalDetailsDto {
  occupationCode?: string | null;
  occupationName?: string | null;
  companyCode?: string | null;
  companyName?: string | null;
  professionCode?: string | null;
  professionName?: string | null;
  incomeCategoryCode?: string | null;
  incomeCategoryName?: string | null;
}

export interface AdditionalDetailsDto {
  nationalityCode?: string | null;
  nationalityName?: string | null;
  warningAlerts?: string | null;
  raceCode?: string | null;
  raceName?: string | null;
  religionCode?: string | null;
  religionName?: string | null;
  preferredLanguageCode?: string | null;
  preferredLanguageName?: string | null;
}

export interface PatientRegistrationRequest {
  id?: number | null;
  mrNumber?: string | null;
  patientType: PatientType;
  prefixCode?: string | null;
  prefixName?: string | null;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  gender: Gender;
  dateOfBirth?: string | null;
  ageYears?: number | null;
  ageMonths?: number | null;
  ageDays?: number | null;
  mobileCountryCode?: string | null;
  mobileNumber: string;
  email?: string | null;
  maritalStatusCode?: string | null;
  maritalStatusName?: string | null;
  bloodGroupCode?: string | null;
  bloodGroupName?: string | null;
  civilId?: string | null;
  familyName?: string | null;
  appointmentReference?: string | null;
  address: AddressDto;
  professionalDetails: ProfessionalDetailsDto;
  additionalDetails: AdditionalDetailsDto;
}

export interface PatientRegistrationResponse extends PatientRegistrationRequest {
  id: number;
  createdOn: string;
  modifiedOn?: string | null;
}

export interface PatientSearchRequest {
  mrNumber?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  mobileNumber?: string | null;
  civilId?: string | null;
}

export interface PatientSearchResult {
  id: number;
  mrNumber?: string | null;
  patientName: string;
  gender: Gender;
  genderText: string;
  dateOfBirth?: string | null;
  mobileNumber?: string | null;
  civilId?: string | null;
}
