# 🏗️ Arquitectura: GraphQL API Gateway con Spring Boot y FastAPI

## 📐 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTES                                 │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ React    │  │ Angular  │  │  Mobile  │  │Postman/  │      │
│  │   Web    │  │   Web    │  │   App    │  │  cURL    │      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│       │             │              │             │             │
│       └─────────────┴──────────────┴─────────────┘             │
│                          │                                      │
│                  GraphQL Queries/Mutations                      │
│                     (1 HTTP Request)                            │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   API GATEWAY (NestJS)                          │
│                  Port: 3000                                     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  GraphQL Endpoint: /graphql                               │ │
│  │  Playground: http://localhost:3000/graphql                │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Auth Module   │  │ Patients Module │  │ LabTests Module │  │
│  │               │  │                 │  │                 │  │
│  │ • Login       │  │ • Resolvers     │  │ • Resolvers     │  │
│  │ • Register    │  │ • Services      │  │ • Services      │  │
│  │ • JWT         │  │ • HTTP Client   │  │ • HTTP Client   │  │
│  │ • Guards      │  │                 │  │                 │  │
│  └───────────────┘  └─────────────────┘  └─────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Middleware & Guards:                                     │ │
│  │  • JWT Authentication                                     │ │
│  │  • Role-Based Access Control (RBAC)                      │ │
│  │  • Rate Limiting (Throttle)                               │ │
│  │  • CORS                                                   │ │
│  │  • Global Validation                                      │ │
│  │  • Error Handling                                         │ │
│  └───────────────────────────────────────────────────────────┘ │
└──────┬────────────────────┬────────────────────┬───────────────┘
       │                    │                    │
       │ REST/HTTP          │ REST/HTTP          │ REST/HTTP
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   MICROSERVICIO  │ │   MICROSERVICIO  │ │   MICROSERVICIO  │
│    PACIENTES     │ │   LAB TESTS      │ │  NOTIFICACIONES  │
│                  │ │                  │ │                  │
│  Spring Boot     │ │     FastAPI      │ │     NestJS       │
│  Port: 8080      │ │   Port: 8000     │ │   Port: 3001     │
│                  │ │                  │ │                  │
│  REST API:       │ │  REST API:       │ │  REST API:       │
│  /api/patients   │ │  /api/lab-tests  │ │  /api/notify     │
│                  │ │                  │ │                  │
│  ┌────────────┐  │ │  ┌────────────┐  │ │  ┌────────────┐  │
│  │ Controller │  │ │  │  Routers   │  │ │  │ Controller │  │
│  │  Service   │  │ │  │  Services  │  │ │  │  Service   │  │
│  │ Repository │  │ │  │   Models   │  │ │  │ Repository │  │
│  └─────┬──────┘  │ │  └─────┬──────┘  │ │  └─────┬──────┘  │
└────────┼─────────┘ └────────┼─────────┘ └────────┼─────────┘
         │                    │                    │
         ▼                    ▼                    ▼
   ┌──────────┐         ┌──────────┐         ┌──────────┐
   │ MySQL/   │         │PostgreSQL│         │ MongoDB  │
   │PostgreSQL│         │          │         │          │
   └──────────┘         └──────────┘         └──────────┘
```

---

## 🔄 Flujo de una Petición Completa

### Escenario: Cliente pide un paciente con sus análisis

```
1️⃣ CLIENTE (React/Angular/Mobile)
   ↓
   Envía GraphQL Query:
   
   query {
     patient(id: "123") {
       name
       email
       labTests {
         type
         status
       }
     }
   }
   
   Headers:
   Authorization: Bearer eyJhbG...
   
2️⃣ API GATEWAY - JWT Guard
   ↓
   • Valida el token JWT
   • Extrae user.id, user.role del token
   • Si es inválido → 401 Unauthorized
   • Si es válido → continúa
   
3️⃣ API GATEWAY - Roles Guard
   ↓
   • Verifica si el usuario tiene rol permitido
   • Roles permitidos: ADMIN, DOCTOR, RECEPTIONIST
   • Si no tiene permiso → 403 Forbidden
   • Si tiene permiso → continúa
   
4️⃣ API GATEWAY - UsuariosResolver.getPatient()
   ↓
   • Recibe id: "123"
   • Llama a UsuariosService.findById("123")
   
5️⃣ API GATEWAY - UsuariosService
   ↓
   HTTP Request:
   GET http://patient-service:8080/api/patients/123
   
6️⃣ MICROSERVICIO PACIENTES (Spring Boot)
   ↓
   • PatientController recibe GET /api/patients/123
   • PatientService busca en base de datos
   • Devuelve JSON:
   
   {
     "id": "123",
     "name": "Juan Pérez",
     "email": "juan@example.com",
     "age": 30
   }
   
7️⃣ API GATEWAY recibe respuesta
   ↓
   • UsuariosService devuelve Patient object
   • GraphQL detecta que se pidió campo 'labTests'
   • Ejecuta UsuariosResolver.labTests(patient)
   
8️⃣ API GATEWAY - UsuariosResolver.labTests()
   ↓
   • Recibe patient.id = "123"
   • Llama a LabTestsService.findByPatientId("123")
   
9️⃣ API GATEWAY - LabTestsService
   ↓
   HTTP Request:
   GET http://labtest-service:8000/api/lab-tests?patientId=123
   
🔟 MICROSERVICIO LAB TESTS (FastAPI)
   ↓
   • Router recibe GET /api/lab-tests?patientId=123
   • Service busca en base de datos
   • Devuelve JSON:
   
   [
     {
       "id": "456",
       "patientId": "123",
       "type": "Hemograma",
       "status": "COMPLETED"
     }
   ]
   
1️⃣1️⃣ API GATEWAY combina respuestas
   ↓
   • GraphQL automáticamente une:
     - Datos de Patient (de Spring Boot)
     - Datos de LabTests (de FastAPI)
   
   Respuesta final:
   {
     "data": {
       "patient": {
         "name": "Juan Pérez",
         "email": "juan@example.com",
         "labTests": [
           {
             "type": "Hemograma",
             "status": "COMPLETED"
           }
         ]
       }
     }
   }
   
1️⃣2️⃣ CLIENTE recibe respuesta
   ↓
   • 1 sola petición HTTP
   • Datos de 2 microservios diferentes
   • Exactamente los campos solicitados
```

---

## 💻 Implementación en Spring Boot (Microservicio Pacientes)

### 1. PatientEntity.java
```java
@Entity
@Table(name = "patients")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private Integer age;
    
    private String phone;
    private String address;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Getters y Setters
}
```

### 2. PatientRepository.java
```java
@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {
    Optional<Patient> findByEmail(String email);
    List<Patient> findByNameContainingOrEmailContaining(String name, String email);
}
```

### 3. PatientService.java
```java
@Service
public class PatientService {
    
    @Autowired
    private PatientRepository patientRepository;
    
    public PatientDTO findById(String id) {
        Patient patient = patientRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Paciente no encontrado"));
        return mapToDTO(patient);
    }
    
    public List<PatientDTO> findAll(int limit, int offset) {
        Pageable pageable = PageRequest.of(offset / limit, limit);
        Page<Patient> page = patientRepository.findAll(pageable);
        return page.getContent().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    public List<PatientDTO> search(String query) {
        List<Patient> patients = patientRepository
            .findByNameContainingOrEmailContaining(query, query);
        return patients.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    public PatientDTO create(CreatePatientDTO dto) {
        if (patientRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new ConflictException("Email ya registrado");
        }
        
        Patient patient = new Patient();
        patient.setName(dto.getName());
        patient.setEmail(dto.getEmail());
        patient.setAge(dto.getAge());
        patient.setPhone(dto.getPhone());
        patient.setAddress(dto.getAddress());
        
        Patient saved = patientRepository.save(patient);
        return mapToDTO(saved);
    }
    
    public PatientDTO update(String id, UpdatePatientDTO dto) {
        Patient patient = patientRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Paciente no encontrado"));
        
        if (dto.getName() != null) patient.setName(dto.getName());
        if (dto.getEmail() != null) patient.setEmail(dto.getEmail());
        if (dto.getAge() != null) patient.setAge(dto.getAge());
        if (dto.getPhone() != null) patient.setPhone(dto.getPhone());
        if (dto.getAddress() != null) patient.setAddress(dto.getAddress());
        if (dto.getIsActive() != null) patient.setIsActive(dto.getIsActive());
        
        Patient updated = patientRepository.save(patient);
        return mapToDTO(updated);
    }
    
    public void delete(String id) {
        Patient patient = patientRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Paciente no encontrado"));
        patient.setIsActive(false);
        patientRepository.save(patient);
    }
    
    private PatientDTO mapToDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setName(patient.getName());
        dto.setEmail(patient.getEmail());
        dto.setAge(patient.getAge());
        dto.setPhone(patient.getPhone());
        dto.setAddress(patient.getAddress());
        dto.setIsActive(patient.getIsActive());
        dto.setCreatedAt(patient.getCreatedAt());
        dto.setUpdatedAt(patient.getUpdatedAt());
        return dto;
    }
}
```

### 4. PatientController.java
```java
@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {
    
    @Autowired
    private PatientService patientService;
    
    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> getPatient(@PathVariable String id) {
        PatientDTO patient = patientService.findById(id);
        return ResponseEntity.ok(patient);
    }
    
    @GetMapping
    public ResponseEntity<List<PatientDTO>> getAllPatients(
        @RequestParam(defaultValue = "10") int limit,
        @RequestParam(defaultValue = "0") int offset
    ) {
        List<PatientDTO> patients = patientService.findAll(limit, offset);
        return ResponseEntity.ok(patients);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<PatientDTO>> searchPatients(
        @RequestParam String query
    ) {
        List<PatientDTO> patients = patientService.search(query);
        return ResponseEntity.ok(patients);
    }
    
    @PostMapping
    public ResponseEntity<PatientDTO> createPatient(
        @Valid @RequestBody CreatePatientDTO dto
    ) {
        PatientDTO patient = patientService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(patient);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PatientDTO> updatePatient(
        @PathVariable String id,
        @Valid @RequestBody UpdatePatientDTO dto
    ) {
        PatientDTO patient = patientService.update(id, dto);
        return ResponseEntity.ok(patient);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable String id) {
        patientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### 5. application.yml
```yaml
server:
  port: 8080

spring:
  application:
    name: patient-service
  datasource:
    url: jdbc:mysql://localhost:3306/patients_db
    username: root
    password: password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

---

## 🐍 Implementación en FastAPI (Microservicio Lab Tests)

### 1. models.py
```python
from sqlalchemy import Column, String, DateTime, JSON, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class LabTest(Base):
    __tablename__ = "lab_tests"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String(36), nullable=False, index=True)
    type = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False, default="PENDING")
    description = Column(String(500))
    results = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
```

### 2. schemas.py
```python
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TestResult(BaseModel):
    parameter: str
    value: str
    normal_range: str
    unit: str
    status: Optional[str] = None

class LabTestBase(BaseModel):
    patient_id: str
    type: str
    description: Optional[str] = None
    results: Optional[List[TestResult]] = None

class LabTestCreate(LabTestBase):
    pass

class LabTestUpdate(BaseModel):
    type: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None
    results: Optional[List[TestResult]] = None
    completed_at: Optional[datetime] = None

class LabTestResponse(LabTestBase):
    id: str
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True
```

### 3. crud.py
```python
from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional

def get_lab_test(db: Session, test_id: str) -> Optional[models.LabTest]:
    return db.query(models.LabTest)\
        .filter(models.LabTest.id == test_id)\
        .filter(models.LabTest.is_active == True)\
        .first()

def get_lab_tests_by_patient(db: Session, patient_id: str) -> List[models.LabTest]:
    return db.query(models.LabTest)\
        .filter(models.LabTest.patient_id == patient_id)\
        .filter(models.LabTest.is_active == True)\
        .all()

def create_lab_test(db: Session, test: schemas.LabTestCreate) -> models.LabTest:
    db_test = models.LabTest(**test.dict())
    db.add(db_test)
    db.commit()
    db.refresh(db_test)
    return db_test

def update_lab_test(
    db: Session, 
    test_id: str, 
    test: schemas.LabTestUpdate
) -> Optional[models.LabTest]:
    db_test = get_lab_test(db, test_id)
    if db_test is None:
        return None
    
    update_data = test.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_test, field, value)
    
    db.commit()
    db.refresh(db_test)
    return db_test

def delete_lab_test(db: Session, test_id: str) -> bool:
    db_test = get_lab_test(db, test_id)
    if db_test is None:
        return False
    
    db_test.is_active = False
    db.commit()
    return True
```

### 4. main.py
```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lab Tests Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/lab-tests/{test_id}", response_model=schemas.LabTestResponse)
def get_lab_test(test_id: str, db: Session = Depends(get_db)):
    test = crud.get_lab_test(db, test_id)
    if test is None:
        raise HTTPException(status_code=404, detail="Test not found")
    return test

@app.get("/api/lab-tests", response_model=List[schemas.LabTestResponse])
def get_lab_tests_by_patient(patient_id: str, db: Session = Depends(get_db)):
    """
    Este endpoint es llamado por el API Gateway
    cuando se resuelve el campo 'labTests' de un Patient
    """
    tests = crud.get_lab_tests_by_patient(db, patient_id)
    return tests

@app.post("/api/lab-tests", response_model=schemas.LabTestResponse, status_code=201)
def create_lab_test(test: schemas.LabTestCreate, db: Session = Depends(get_db)):
    return crud.create_lab_test(db, test)

@app.put("/api/lab-tests/{test_id}", response_model=schemas.LabTestResponse)
def update_lab_test(
    test_id: str, 
    test: schemas.LabTestUpdate, 
    db: Session = Depends(get_db)
):
    updated_test = crud.update_lab_test(db, test_id, test)
    if updated_test is None:
        raise HTTPException(status_code=404, detail="Test not found")
    return updated_test

@app.delete("/api/lab-tests/{test_id}", status_code=204)
def delete_lab_test(test_id: str, db: Session = Depends(get_db)):
    if not crud.delete_lab_test(db, test_id):
        raise HTTPException(status_code=404, detail="Test not found")
    return None
```

---

## 🔥 Ventajas de esta Arquitectura

### 1. **Separación de Responsabilidades**
- Cada microservicio se encarga de su dominio
- API Gateway solo orquesta las peticiones
- Frontend solo conoce GraphQL

### 2. **Tecnologías Heterogéneas**
- Pacientes: Spring Boot + MySQL
- Lab Tests: FastAPI + PostgreSQL
- Notificaciones: NestJS + MongoDB
- ¡Todos funcionan juntos!

### 3. **Escalabilidad Independiente**
- Escala cada microservicio según su carga
- API Gateway puede usar cache para reducir llamadas

### 4. **Desarrollo en Paralelo**
- Equipo A: Microservicio Pacientes (Java)
- Equipo B: Microservicio Lab Tests (Python)
- Equipo C: API Gateway (TypeScript)
- Equipo D: Frontend (React)

### 5. **Evolución sin Breaking Changes**
- Agregar campos nuevos no rompe clientes existentes
- Deprecar campos gradualmente
- Versionar solo cuando sea necesario

---

## 📚 Recursos Adicionales

- [NestJS GraphQL](https://docs.nestjs.com/graphql/quick-start)
- [Spring Boot REST](https://spring.io/guides/tutorials/rest/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
