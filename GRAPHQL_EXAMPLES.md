# 📝 Ejemplos de Queries y Mutations GraphQL

Este archivo contiene ejemplos prácticos de todas las operaciones GraphQL disponibles en el API Gateway.

## 🔐 Autenticación

### 1. Registrar Usuario

```graphql
mutation RegisterUser {
  register(
    registerInput: {
      name: "Juan Pérez"
      email: "juan@example.com"
      password: "password123"
      role: "PATIENT"
    }
  ) {
    accessToken
    refreshToken
    user {
      id
      name
      email
      role
      isActive
      createdAt
    }
  }
}
```

### 2. Iniciar Sesión

```graphql
mutation Login {
  login(loginInput: { email: "juan@example.com", password: "password123" }) {
    accessToken
    refreshToken
    user {
      id
      name
      email
      role
      isActive
    }
  }
}
```

**Respuesta:**
```json
{
  "data": {
    "login": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "123",
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "role": "PATIENT",
        "isActive": true
      }
    }
  }
}
```

### 3. Refrescar Token

```graphql
mutation RefreshToken {
  refreshToken(
    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  ) {
    accessToken
    refreshToken
    user {
      id
      name
      email
    }
  }
}
```

### 4. Obtener Usuario Actual

**Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

```graphql
query Me {
  me {
    id
    name
    email
    role
    isActive
    createdAt
  }
}
```

---

## 🏥 Pacientes (Patients)

> **Nota:** Todas estas queries requieren autenticación (JWT token en headers)

### 5. Obtener un Paciente por ID

```graphql
query GetPatient {
  patient(id: "123") {
    id
    name
    email
    age
    phone
    address
    isActive
    createdAt
    updatedAt
  }
}
```

**Respuesta:**
```json
{
  "data": {
    "patient": {
      "id": "123",
      "name": "María García",
      "email": "maria@example.com",
      "age": 30,
      "phone": "+591 70123456",
      "address": "Av. Banzer 123, Santa Cruz",
      "isActive": true,
      "createdAt": "2025-11-01T10:30:00Z",
      "updatedAt": "2025-11-04T15:20:00Z"
    }
  }
}
```

### 6. Listar Pacientes (con paginación)

```graphql
query GetPatients {
  patients(limit: 10, offset: 0) {
    id
    name
    email
    age
    phone
    createdAt
  }
}
```

### 7. Buscar Pacientes

```graphql
query SearchPatients {
  searchPatients(query: "juan") {
    id
    name
    email
    age
    phone
  }
}
```

### 8. Crear Paciente

```graphql
mutation CreatePatient {
  createPatient(
    input: {
      name: "Carlos Rodríguez"
      email: "carlos@example.com"
      age: 45
      phone: "+591 70987654"
      address: "Calle Libertad 456"
    }
  ) {
    id
    name
    email
    age
    phone
    address
    isActive
    createdAt
  }
}
```

### 9. Actualizar Paciente

```graphql
mutation UpdatePatient {
  updatePatient(
    id: "123"
    input: { name: "María García Actualizado", phone: "+591 70111111" }
  ) {
    id
    name
    phone
    updatedAt
  }
}
```

### 10. Eliminar Paciente

```graphql
mutation DeletePatient {
  deletePatient(id: "123")
}
```

**Respuesta:**
```json
{
  "data": {
    "deletePatient": true
  }
}
```

---

## 🔬 Análisis de Laboratorio (Lab Tests)

### 11. Obtener Análisis por ID

```graphql
query GetLabTest {
  labTest(id: "456") {
    id
    patientId
    type
    status
    description
    createdAt
    completedAt
    results {
      parameter
      value
      normalRange
      unit
      status
    }
  }
}
```

**Respuesta:**
```json
{
  "data": {
    "labTest": {
      "id": "456",
      "patientId": "123",
      "type": "Hemograma Completo",
      "status": "COMPLETED",
      "description": "Análisis de sangre completo",
      "createdAt": "2025-11-03T08:00:00Z",
      "completedAt": "2025-11-03T10:30:00Z",
      "results": [
        {
          "parameter": "Hemoglobina",
          "value": "14.5",
          "normalRange": "13-17",
          "unit": "g/dL",
          "status": "NORMAL"
        },
        {
          "parameter": "Leucocitos",
          "value": "7500",
          "normalRange": "4000-11000",
          "unit": "/μL",
          "status": "NORMAL"
        }
      ]
    }
  }
}
```

### 12. Obtener Análisis de un Paciente

```graphql
query GetLabTestsByPatient {
  labTestsByPatient(patientId: "123") {
    id
    type
    status
    createdAt
    results {
      parameter
      value
      normalRange
    }
  }
}
```

---

## 🔥 Queries Complejas (El poder de GraphQL)

### 13. Paciente con sus Análisis (1 sola petición)

```graphql
query GetPatientWithLabTests {
  patient(id: "123") {
    id
    name
    email
    age
    phone
    
    # ← Aquí GraphQL llama automáticamente al microservicio de Lab Tests
    labTests {
      id
      type
      status
      createdAt
      completedAt
      results {
        parameter
        value
        normalRange
        unit
        status
      }
    }
  }
}
```

**Respuesta:**
```json
{
  "data": {
    "patient": {
      "id": "123",
      "name": "María García",
      "email": "maria@example.com",
      "age": 30,
      "phone": "+591 70123456",
      "labTests": [
        {
          "id": "456",
          "type": "Hemograma Completo",
          "status": "COMPLETED",
          "createdAt": "2025-11-03T08:00:00Z",
          "completedAt": "2025-11-03T10:30:00Z",
          "results": [
            {
              "parameter": "Hemoglobina",
              "value": "14.5",
              "normalRange": "13-17",
              "unit": "g/dL",
              "status": "NORMAL"
            }
          ]
        },
        {
          "id": "789",
          "type": "Perfil Lipídico",
          "status": "PENDING",
          "createdAt": "2025-11-04T09:00:00Z",
          "completedAt": null,
          "results": null
        }
      ]
    }
  }
}
```

**🎯 Lo que sucede internamente:**
1. GraphQL Gateway recibe la query
2. Ejecuta `PatientsResolver.getPatient("123")`
3. PatientsService hace HTTP GET a `http://patient-service:8080/api/patients/123`
4. Como el cliente pidió `labTests`, ejecuta `PatientsResolver.labTests(patient)`
5. LabTestsService hace HTTP GET a `http://labtest-service:8000/api/lab-tests?patientId=123`
6. GraphQL combina ambas respuestas automáticamente
7. Devuelve 1 sola respuesta unificada al cliente

### 14. Múltiples Pacientes con Análisis

```graphql
query GetMultiplePatientsWithLabTests {
  patients(limit: 5) {
    id
    name
    email
    labTests {
      id
      type
      status
    }
  }
}
```

### 15. Query con Fragmentos (Reutilización)

```graphql
fragment PatientBasicInfo on Patient {
  id
  name
  email
  age
}

fragment LabTestBasicInfo on LabTest {
  id
  type
  status
  createdAt
}

query DashboardData {
  # Paciente actual
  me {
    ...PatientBasicInfo
  }
  
  # Todos los pacientes
  patients(limit: 10) {
    ...PatientBasicInfo
    phone
    labTests {
      ...LabTestBasicInfo
    }
  }
}
```

### 16. Variables en Queries

```graphql
query GetPatientWithTests($patientId: ID!) {
  patient(id: $patientId) {
    id
    name
    email
    labTests {
      id
      type
      status
      results {
        parameter
        value
      }
    }
  }
}
```

**Variables:**
```json
{
  "patientId": "123"
}
```

### 17. Alias (Múltiples queries del mismo tipo)

```graphql
query ComparePatients {
  patient1: patient(id: "123") {
    id
    name
    age
  }
  
  patient2: patient(id: "456") {
    id
    name
    age
  }
}
```

**Respuesta:**
```json
{
  "data": {
    "patient1": {
      "id": "123",
      "name": "María García",
      "age": 30
    },
    "patient2": {
      "id": "456",
      "name": "Juan Pérez",
      "age": 45
    }
  }
}
```

---

## 🔄 Queries en Paralelo (Batching)

### 18. Dashboard Completo en 1 Petición

```graphql
query DoctorDashboard {
  # Mi información
  me {
    id
    name
    email
    role
  }
  
  # Pacientes recientes
  recentPatients: patients(limit: 5, offset: 0) {
    id
    name
    email
    age
    labTests {
      id
      type
      status
    }
  }
  
  # Paciente específico con detalles
  currentPatient: patient(id: "123") {
    id
    name
    email
    age
    phone
    address
    labTests {
      id
      type
      status
      createdAt
      results {
        parameter
        value
        normalRange
        status
      }
    }
  }
}
```

**🎯 Ventaja:** En REST necesitarías 4+ requests. Con GraphQL: solo 1.

---

## 🎨 Uso desde Frontend (Ejemplo React)

### Usando Apollo Client

```typescript
import { gql, useQuery } from '@apollo/client';

const GET_PATIENT_WITH_TESTS = gql`
  query GetPatientWithTests($id: ID!) {
    patient(id: $id) {
      id
      name
      email
      age
      labTests {
        id
        type
        status
        results {
          parameter
          value
          normalRange
        }
      }
    }
  }
`;

function PatientProfile({ patientId }) {
  const { loading, error, data } = useQuery(GET_PATIENT_WITH_TESTS, {
    variables: { id: patientId },
  });

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>{data.patient.name}</h1>
      <p>{data.patient.email}</p>
      <p>Edad: {data.patient.age}</p>
      
      <h2>Análisis de Laboratorio</h2>
      {data.patient.labTests.map(test => (
        <div key={test.id}>
          <h3>{test.type} - {test.status}</h3>
          {test.results?.map(result => (
            <p key={result.parameter}>
              {result.parameter}: {result.value} ({result.normalRange})
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
```

---

## 📊 Introspección del Schema

### 19. Obtener todo el Schema

```graphql
query IntrospectionQuery {
  __schema {
    types {
      name
      kind
      description
      fields {
        name
        type {
          name
        }
      }
    }
  }
}
```

### 20. Obtener información de un Type específico

```graphql
query GetPatientType {
  __type(name: "Patient") {
    name
    kind
    fields {
      name
      type {
        name
        kind
      }
    }
  }
}
```

---

## 🚀 Tips y Best Practices

### ✅ DO (Buenas Prácticas)

1. **Usa fragmentos** para reutilizar campos comunes
2. **Usa variables** en lugar de hardcodear valores
3. **Pide solo los campos que necesitas**
4. **Usa alias** cuando necesites múltiples queries del mismo tipo
5. **Agrupa queries relacionadas** en una sola petición

### ❌ DON'T (Evita)

1. **No pidas todos los campos** si no los necesitas
2. **No hagas queries muy profundas** (max 5-6 niveles)
3. **No hagas queries en loops** (usa batching)
4. **No ignores los errores** de GraphQL

---

## 🔗 Testing con cURL

### Login
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(loginInput: { email: \"juan@example.com\", password: \"password123\" }) { accessToken user { id name } } }"
  }'
```

### Get Patient (con JWT)
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query { patient(id: \"123\") { id name email } }"
  }'
```

---

**Acceso al Playground:**
- URL: `http://localhost:3000/graphql`
- Aquí puedes probar todas estas queries de forma interactiva
