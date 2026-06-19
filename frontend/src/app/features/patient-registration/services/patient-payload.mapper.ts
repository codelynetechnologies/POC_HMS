import {
  DropdownItem,
  Gender,
  PatientRegistrationRequest,
  PatientRegistrationResponse,
  PatientType,
} from '../../../core/models/patient.models';
import { nameOf } from '../patient-form.validators';

export interface PatientMasterData {
  prefixes: DropdownItem[];
  genders: DropdownItem[];
  maritalStatuses: DropdownItem[];
  bloodGroups: DropdownItem[];
  patientTypes: DropdownItem[];
  nationalities: DropdownItem[];
  races: DropdownItem[];
  religions: DropdownItem[];
  languages: DropdownItem[];
  occupations: DropdownItem[];
  professions: DropdownItem[];
  incomeCategories: DropdownItem[];
  countries: DropdownItem[];
  states: DropdownItem[];
  cities: DropdownItem[];
  areas: DropdownItem[];
}

/** Maps form values and master data to API request payloads. */
export class PatientPayloadMapper {
  static toRequest(
    raw: Record<string, any>,
    editingId: number | null,
    editingMrNumber: string | null,
    master: PatientMasterData,
  ): PatientRegistrationRequest {
    const addr = raw['address'];
    const prof = raw['professionalDetails'];
    const add = raw['additionalDetails'];

    return {
      id: editingId,
      mrNumber: editingMrNumber,
      patientType: Number(raw['patientType']) as PatientType,
      prefixCode: raw['prefixCode'] || null,
      prefixName: nameOf(master.prefixes, raw['prefixCode']),
      firstName: raw['firstName'],
      middleName: raw['middleName'] || null,
      lastName: raw['lastName'],
      gender: Number(raw['gender']) as Gender,
      dateOfBirth: raw['dateOfBirth'] || null,
      ageYears: raw['ageYears'] ?? null,
      ageMonths: raw['ageMonths'] ?? null,
      ageDays: raw['ageDays'] ?? null,
      mobileCountryCode: raw['mobileCountryCode'] || null,
      mobileNumber: raw['mobileNumber'],
      email: raw['email'] || null,
      maritalStatusCode: raw['maritalStatusCode'] || null,
      maritalStatusName: nameOf(master.maritalStatuses, raw['maritalStatusCode']),
      bloodGroupCode: raw['bloodGroupCode'] || null,
      bloodGroupName: nameOf(master.bloodGroups, raw['bloodGroupCode']),
      civilId: raw['civilId'] || null,
      familyName: raw['familyName'] || null,
      appointmentReference: raw['appointmentReference'] || null,
      address: {
        phoneCountryCode: addr.phoneCountryCode || null,
        stdCode: addr.stdCode || null,
        phoneNumber: addr.phoneNumber || null,
        addressLine: addr.addressLine || null,
        countryCode: addr.countryCode || null,
        countryName: nameOf(master.countries, addr.countryCode),
        stateCode: addr.stateCode || null,
        stateName: nameOf(master.states, addr.stateCode),
        cityCode: addr.cityCode || null,
        cityName: nameOf(master.cities, addr.cityCode),
        areaCode: addr.areaCode || null,
        areaName: nameOf(master.areas, addr.areaCode),
        pincode: addr.pincode || null,
      },
      professionalDetails: {
        occupationCode: prof.occupationCode || null,
        occupationName: nameOf(master.occupations, prof.occupationCode),
        companyCode: null,
        companyName: prof.companyName || null,
        professionCode: prof.professionCode || null,
        professionName: nameOf(master.professions, prof.professionCode),
        incomeCategoryCode: prof.incomeCategoryCode || null,
        incomeCategoryName: nameOf(master.incomeCategories, prof.incomeCategoryCode),
      },
      additionalDetails: {
        nationalityCode: add.nationalityCode || null,
        nationalityName: nameOf(master.nationalities, add.nationalityCode),
        warningAlerts: add.warningAlerts || null,
        raceCode: add.raceCode || null,
        raceName: nameOf(master.races, add.raceCode),
        religionCode: add.religionCode || null,
        religionName: nameOf(master.religions, add.religionCode),
        preferredLanguageCode: add.preferredLanguageCode || null,
        preferredLanguageName: nameOf(master.languages, add.preferredLanguageCode),
      },
    };
  }

  static toFormPatch(patient: PatientRegistrationResponse): Record<string, unknown> {
    const addr = patient.address ?? {};
    return {
      patientType: String(patient.patientType ?? PatientType.NewPatient),
      prefixCode: patient.prefixCode ?? '',
      appointmentReference: patient.appointmentReference ?? '',
      firstName: patient.firstName,
      middleName: patient.middleName ?? '',
      lastName: patient.lastName,
      gender: String(patient.gender ?? Gender.Unknown),
      dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.slice(0, 10) : '',
      ageYears: patient.ageYears ?? null,
      ageMonths: patient.ageMonths ?? null,
      ageDays: patient.ageDays ?? null,
      mobileCountryCode: patient.mobileCountryCode ?? '',
      mobileNumber: patient.mobileNumber,
      email: patient.email ?? '',
      maritalStatusCode: patient.maritalStatusCode ?? '',
      bloodGroupCode: patient.bloodGroupCode ?? '',
      civilId: patient.civilId ?? '',
      familyName: patient.familyName ?? '',
      address: {
        phoneCountryCode: addr.phoneCountryCode ?? '',
        stdCode: addr.stdCode ?? '',
        phoneNumber: addr.phoneNumber ?? '',
        addressLine: addr.addressLine ?? '',
        countryCode: addr.countryCode ?? '',
        stateCode: addr.stateCode ?? '',
        cityCode: addr.cityCode ?? '',
        areaCode: addr.areaCode ?? '',
        pincode: addr.pincode ?? '',
      },
      professionalDetails: {
        occupationCode: patient.professionalDetails?.occupationCode ?? '',
        professionCode: patient.professionalDetails?.professionCode ?? '',
        incomeCategoryCode: patient.professionalDetails?.incomeCategoryCode ?? '',
        companyName: patient.professionalDetails?.companyName ?? '',
      },
      additionalDetails: {
        nationalityCode: patient.additionalDetails?.nationalityCode ?? '',
        raceCode: patient.additionalDetails?.raceCode ?? '',
        religionCode: patient.additionalDetails?.religionCode ?? '',
        preferredLanguageCode: patient.additionalDetails?.preferredLanguageCode ?? '',
        warningAlerts: patient.additionalDetails?.warningAlerts ?? '',
      },
    };
  }
}
