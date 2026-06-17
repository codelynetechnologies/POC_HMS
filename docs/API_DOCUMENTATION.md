# API Documentation

Base URL (on Replit): `/api`
Interactive docs (Swagger UI): `/api/swagger`
Health check: `GET /api/healthz`

All endpoints — legacy and modern — return the same **response envelope**.

---

## Response envelope

Every response is wrapped in `ApiResponse<T>`:

```jsonc
{
  "success": true,            // false when the request failed
  "message": "Patient saved successfully.",  // human-readable summary, may be null
  "data": { /* T */ },        // the payload, or null on failure
  "errors": ["..."]           // list of error/validation messages, empty on success
}
```

Errors (validation failures, not-found, unhandled exceptions) all come back through this
same shape with `success: false`, `data: null`, and one or more `errors`. Global exception
middleware guarantees this even for unexpected errors.

---

## Reference data

### Enums

| Enum          | Values                                                      |
| ------------- | ---------------------------------------------------------- |
| `gender`      | `1` = Male, `2` = Female, `3` = Other                      |
| `patientType` | `1` = New, `2` = Existing, `3` = Staff, `4` = Newborn      |

### Coded fields send both code and name

For every coded field (prefix, marital status, blood group, nationality, race, religion,
language, occupation, profession, income category, country, state, city, area) the client
sends **both** the `*Code` and the `*Name`. The server stores both and does not re-derive
names. The Angular client resolves names from the loaded dropdowns at submit time.

---

## Modern REST API

### Create or update a patient

`POST /api/patients`

Creates a patient when `id` is null/absent, or updates an existing patient when `id` is
supplied. Returns the saved patient (including generated `id`, `mrNumber`, and
server-computed age).

Request body (abridged — see full shape below):

```jsonc
{
  "id": null,
  "patientType": 1,
  "prefixCode": "MR", "prefixName": "Mr.",
  "firstName": "Jane", "middleName": null, "lastName": "Doe",
  "gender": 2,
  "dateOfBirth": "1990-05-10",
  "ageYears": null, "ageMonths": null, "ageDays": null,
  "mobileCountryCode": "+91", "mobileNumber": "9991234567",
  "email": "jane@example.com",
  "maritalStatusCode": "S", "maritalStatusName": "Single",
  "bloodGroupCode": "O+", "bloodGroupName": "O+",
  "civilId": null, "familyName": null,
  "appointmentReference": "APT-1001",
  "address": {
    "phoneCountryCode": null, "stdCode": null, "phoneNumber": null,
    "addressLine": "12 Main St",
    "countryCode": "IN", "countryName": "India",
    "stateCode": "MH", "stateName": "Maharashtra",
    "cityCode": "MUM", "cityName": "Mumbai",
    "areaCode": "AND", "areaName": "Andheri",
    "pincode": "400001"
  },
  "professionalDetails": {
    "occupationCode": null, "occupationName": null,
    "companyCode": null, "companyName": null,
    "professionCode": null, "professionName": null,
    "incomeCategoryCode": null, "incomeCategoryName": null
  },
  "additionalDetails": {
    "nationalityCode": "IN", "nationalityName": "Indian",
    "warningAlerts": null,
    "raceCode": null, "raceName": null,
    "religionCode": null, "religionName": null,
    "preferredLanguageCode": null, "preferredLanguageName": null
  }
}
```

Response: `ApiResponse<PatientRegistrationResponse>` — same shape plus `id`, `mrNumber`,
and computed `ageYears`/`ageMonths`/`ageDays`.

**Validation rules:**

- `firstName`, `lastName` — required, max length 100
- `mobileNumber` — required, 7–15 digits
- `email` — optional, must be a valid email when present
- `address.pincode` — optional, 3–10 digits when present
- `dateOfBirth` — must not be in the future
- Either `dateOfBirth` **or** an age (years/months/days) must be provided

### Get a patient by id

`GET /api/patients/{id}`

Returns `ApiResponse<PatientRegistrationResponse>`. `data` is null with `success: false`
when the patient does not exist.

### Search patients

`POST /api/patients/search`

Body — any subset of criteria (at least one is required):

```jsonc
{
  "mrNumber": "MR0001",
  "firstName": "Jane",
  "lastName": "Doe",
  "mobileNumber": "9991234567",
  "civilId": "..."
}
```

Response: `ApiResponse<PatientSearchResult[]>` where each result contains
`id`, `mrNumber`, `patientName`, `genderText`, `mobileNumber`, `civilId`.

### Dropdowns

`GET /api/dropdowns/{type}`
`GET /api/dropdowns/{type}?parentCode={code}` (for cascading lists)

Returns `ApiResponse<DropdownItem[]>` where each item is
`{ "code": "...", "name": "...", "parentCode": "..." | null }`.

Supported `type` values:

| Type             | Cascading? | Parent           |
| ---------------- | ---------- | ---------------- |
| `Prefix`         | no         | —                |
| `Gender`         | no         | —                |
| `MaritalStatus`  | no         | —                |
| `BloodGroup`     | no         | —                |
| `PatientType`    | no         | —                |
| `Nationality`    | no         | —                |
| `Race`           | no         | —                |
| `Religion`       | no         | —                |
| `Language`       | no         | —                |
| `Occupation`     | no         | —                |
| `Profession`     | no         | —                |
| `IncomeCategory` | no         | —                |
| `Country`        | no         | —                |
| `State`          | yes        | `Country` code   |
| `City`           | yes        | `State` code     |
| `Area`           | yes        | `City` code      |

Example: `GET /api/dropdowns/State?parentCode=IN` → states of India.

---

## Legacy API

These endpoints exist for backward compatibility during migration. They call the **same**
Application services as the modern API and return the same `ApiResponse` envelope.

### Patient registration (insert / update / delete + fetch)

`POST /api/patientregistration/IUD`

A combined Insert/Update/Delete operation in the legacy style. The body carries the patient
payload (and an operation/flag indicating the action). Returns the saved/affected record in
the standard envelope.

`POST /api/patientregistration/Fetch`

Fetch a list of patients (legacy list/search style).

`POST /api/patientregistration/FetchPatientData`

Fetch a single patient's full data (legacy detail style).

### Common dropdowns

`POST /api/CommonDropdown/Fetch`

Legacy dropdown lookup. The body specifies the dropdown type (and parent code for cascading
lists). Returns `ApiResponse<DropdownItem[]>`, identical in shape to the modern dropdown
endpoint.

---

## Health

`GET /api/healthz` → `ApiResponse<string>` with `data: "healthy"`. Used by the platform's
startup health check.
