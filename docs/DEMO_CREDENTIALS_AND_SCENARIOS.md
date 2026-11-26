# CloudCare — Demonstration Users, Credentials & Clinical Appointments Directory

> **System Endpoint (Live AWS EC2):** [http://43.205.194.94:3000/](http://43.205.194.94:3000/)  
> **Environment:** Production (Public AWS EC2 `t3.micro` → Private RDS MySQL Multi-AZ → Private AWS S3)  
> **Classification:** 100% Synthetic Healthcare Demonstration Dataset (Academic Mini Project)  
> **Security Architecture:** Stateless JSON Web Token (JWT) + Bcrypt Password Hashing (`rounds=10`) + Role-Based Access Control (RBAC)

---

## 1. Quick Authentication Reference

For rapid demonstration and viva evaluation, all synthetic accounts adhere to a standardized password convention:

| User Role | Standardized Password | Destination Portal | Target Dashboard Route |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `Admin@123` | Administrator Enclave | `/admin` |
| **Medical Specialists (All Doctors)** | `Doctor@123` | Physician Console | `/doctor` |
| **Synthetic Patients (All Patients)** | `Patient@123` | Patient Health Portal | `/patient` |

> [!NOTE]
> All credentials and passwords have been removed from the public website login screens to ensure zero information leakage. Only authenticated administrators can view this directory within the live application at `/admin`.

---

## 2. Master User Directory

### 2.1 System Administrator

| ID | Full Name | Login Email | Password | Role | Key Capabilities |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **1** | System Administrator | `admin@cloudcare.test` | `Admin@123` | `ADMIN` | Global appointments audit log, medical staff directory, live RDS/API telemetry, full AWS deployment specifications, identity directory. |

---

### 2.2 Medical Specialists & Physicians (5 Clinical Specialties)

All doctor accounts use password: `Doctor@123`

| User ID | Doc ID | Physician Name | Login Email | Specialty & Department | Consultation Hours | Room / Enclave |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: |
| **2** | `1` | Dr. Rahul Sharma | `rahul@cloudcare.test` | Cardiology & Vascular Medicine | 09:00, 10:00, 11:00, 12:00, 14:00 | Suite 101 |
| **3** | `2` | Dr. Priya Mehta | `priya@cloudcare.test` | Dermatology & Clinical Cosmetology | 10:00, 11:30, 13:00, 15:00, 16:00 | Suite 204 |
| **4** | `3` | Dr. Arjun Reddy | `arjun@cloudcare.test` | Orthopedic & Joint Replacement | 09:30, 11:00, 14:30, 16:00, 17:00 | Suite 302 |
| **5** | `4` | Dr. Kavita Rao | `kavita@cloudcare.test` | Pediatrics & Child Wellness | 09:00, 10:30, 12:00, 15:30, 17:00 | Suite 108 |
| **6** | `5` | Dr. Sanjay Verma | `sanjay@cloudcare.test` | Neurology & Cognitive Health | 10:00, 11:00, 14:00, 15:30, 16:30 | Suite 405 |

*Physician Features:* View real-time patient queue, update visit status (`CONFIRMED` ➡️ `COMPLETED`), record clinical visit notes, generate prescriptions, upload synthetic diagnostic PDF lab reports to private encrypted AWS S3 storage.

---

### 2.3 Synthetic Patient Personas (12 Clinical Profiles)

All patient accounts use password: `Patient@123`

| User ID | Pt ID | Patient Name | Login Email | Age & Gender | Primary Clinical Profile & Chief Complaint |
| :---: | :---: | :--- | :--- | :---: | :--- |
| **7** | `1` | Aarav Patil | `aarav@cloudcare.test` | 38 M | Essential hypertension monitoring; post-work lumbar spine postural strain. |
| **8** | `2` | Sneha Joshi | `sneha@cloudcare.test` | 32 F | Seasonal contact dermatitis on left forearm; family pediatric consultation. |
| **9** | `3` | Vikram Malhotra | `vikram@cloudcare.test` | 45 M | Post-arthroscopic knee ACL reconstruction recovery; post-surgical keloid care. |
| **10** | `4` | Ananya Deshmukh | `ananya@cloudcare.test` | 7 F | Pediatric booster vaccination; mild seasonal allergic rhinitis. |
| **11** | `5` | Rohan Kulkarni | `rohan@cloudcare.test` | 41 M | Chronic tension-type cephalalgia; sleep apnea and ergonomic review. |
| **12** | `6` | Neha Sharma | `neha.sharma@cloudcare.test` | 29 F | Vestibular migraine workup with episodic vertigo and audiometry correlation. |
| **13** | `7` | Aditya Nair | `aditya.nair@cloudcare.test` | 36 M | Pre-marathon cardiovascular endurance test; acute Achilles tendon strain. |
| **14** | `8` | Pooja Iyer | `pooja.iyer@cloudcare.test` | 34 F | Adult acne vulgaris follow-up; trigeminal facial sensory review. |
| **15** | `9` | Karan Singhania | `karan.s@cloudcare.test` | 55 M | Grade II bilateral knee osteoarthritis; hyperlipidemia management. |
| **16** | `10` | Meera Patel | `meera.patel@cloudcare.test` | 5 F | Pediatric atopic eczema and dietary egg-white allergen reintroduction. |
| **17** | `11` | Devendra Rao | `devendra.rao@cloudcare.test` | 62 M | Post-stroke motor rehabilitation follow-up and physical therapy progress. |
| **18** | `12` | Ishaan Kapoor | `ishaan.kapoor@cloudcare.test` | 48 M | Executive preventative health checkup and ambulatory blood pressure monitoring. |

*Patient Features:* Instant self-service booking with live slot conflict detection across 5 specialties, consultation timeline tracking, access to physician prescriptions, direct secure download of private S3 diagnostic PDF reports.

---

## 3. Master Clinical Appointments Catalog (20 Demonstrative Visits)

This dataset illustrates realistic healthcare consultation lifecycles across diverse departments, statuses, and clinical presentations:

| Appt # | Patient Name | Attending Specialist | Department | Visit Date | Slot Time | Status | Clinical Summary & Chief Complaint |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **1** | Aarav Patil | Dr. Rahul Sharma | Cardiology | 2027-01-15 | 10:00 | `COMPLETED` | Routine cardiovascular checkup; resting ECG review; low-sodium diet counselled. |
| **2** | Sneha Joshi | Dr. Priya Mehta | Dermatology | 2027-01-16 | 11:00 | `COMPLETED` | Seasonal eczema on left forearm; topical corticosteroid therapy initiated. |
| **3** | Vikram Malhotra | Dr. Arjun Reddy | Orthopedics | 2027-02-10 | 09:30 | `COMPLETED` | Post-arthroscopy knee recovery; joint range of motion improved by 25%. |
| **4** | Ananya Deshmukh | Dr. Kavita Rao | Pediatrics | 2027-02-15 | 14:00 | `COMPLETED` | Pediatric booster vaccination administered; normal developmental percentiles. |
| **5** | Rohan Kulkarni | Dr. Sanjay Verma | Neurology | 2027-02-18 | 11:00 | `COMPLETED` | Tension headache assessment; cranial nerves intact; sleep hygiene review. |
| **6** | Neha Sharma | Dr. Sanjay Verma | Neurology | 2027-03-01 | 14:00 | `CONFIRMED` | Vestibular migraine diagnostic evaluation; audiometry correlation. |
| **7** | Aditya Nair | Dr. Rahul Sharma | Cardiology | 2027-03-05 | 09:00 | `CONFIRMED` | Pre-marathon Bruce protocol treadmill stress test & echocardiogram. |
| **8** | Pooja Iyer | Dr. Priya Mehta | Dermatology | 2027-03-10 | 13:00 | `CONFIRMED` | Clinical cosmetology consultation for topical retinoic acid therapy. |
| **9** | Karan Singhania | Dr. Arjun Reddy | Orthopedics | 2027-03-15 | 11:00 | `CONFIRMED` | Bilateral knee osteoarthritis evaluation; viscosupplementation counseling. |
| **10** | Meera Patel | Dr. Kavita Rao | Pediatrics | 2027-03-20 | 10:30 | `CONFIRMED` | Pediatric allergy profile follow-up and dietary egg-white reintroduction. |
| **11** | Devendra Rao | Dr. Sanjay Verma | Neurology | 2027-03-25 | 15:30 | `PENDING` | Post-stroke motor function assessment and physiotherapy evaluation. |
| **12** | Ishaan Kapoor | Dr. Rahul Sharma | Cardiology | 2027-03-28 | 11:00 | `PENDING` | Executive preventative health checkup and lipid risk factor screening. |
| **13** | Aarav Patil | Dr. Arjun Reddy | Orthopedics | 2027-04-02 | 14:30 | `PENDING` | Lumbar spine posture review and ergonomics evaluation for desk work. |
| **14** | Sneha Joshi | Dr. Kavita Rao | Pediatrics | 2027-04-05 | 09:00 | `PENDING` | Family consultation for sibling immunization booster schedule. |
| **15** | Vikram Malhotra | Dr. Priya Mehta | Dermatology | 2027-04-08 | 15:00 | `PENDING` | Post-surgical keloid scar evaluation and silicone scar gel protocol. |
| **16** | Neha Sharma | Dr. Rahul Sharma | Cardiology | 2027-04-12 | 12:00 | `CANCELLED` | Patient cancelled and rescheduled due to out-of-station corporate travel. |
| **17** | Aditya Nair | Dr. Arjun Reddy | Orthopedics | 2027-04-15 | 16:00 | `CONFIRMED` | Achilles tendon strain follow-up and eccentric loading protocol. |
| **18** | Pooja Iyer | Dr. Sanjay Verma | Neurology | 2027-04-18 | 10:00 | `PENDING` | Facial sensory review and trigeminal differential assessment. |
| **19** | Karan Singhania | Dr. Rahul Sharma | Cardiology | 2027-04-22 | 14:00 | `CONFIRMED` | Lipid panel review, coronary calcium scoring, and statin titration. |
| **20** | Meera Patel | Dr. Priya Mehta | Dermatology | 2027-04-25 | 11:30 | `PENDING` | Pediatric xerosis management and epidermal barrier repair optimization. |

---

## 4. Prescriptions & Clinical Records Catalog

### 4.1 Seeded Clinical Prescriptions

| Prescription ID | Appt ID | Patient | Attending Physician | Clinical Notes | Formulated Medications |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **#1** | #1 | Aarav Patil | Dr. Rahul Sharma | Resting ECG within normal limits. Advised low-sodium Mediterranean diet, daily 30-min brisk walk. | • Atorvastatin 10mg OD (Night)<br/>• Aspirin 75mg OD (Post-Lunch) |
| **#2** | #2 | Sneha Joshi | Dr. Priya Mehta | Mild seasonal eczema on left forearm. Avoid harsh soaps, hot water, and synthetic fabrics. | • Hydrocortisone cream 1% topical BD (5 days)<br/>• Cetirizine 10mg OD (PRN itching) |
| **#3** | #3 | Vikram Malhotra | Dr. Arjun Reddy | Post-arthroscopic ACL reconstruction recovery. Range of motion improved by 25%. Quad tone good. | • Calcium Citrate + Vitamin D3 OD<br/>• Paracetamol 650mg SOS for exertion pain |
| **#4** | #4 | Ananya Deshmukh | Dr. Kavita Rao | Routine pediatric booster vaccination administered. Growth percentiles healthy (75th percentile). | • Multivitamin pediatric syrup 5ml OD (30 days)<br/>• Montelukast chewable 4mg OD (Night) |
| **#5** | #5 | Rohan Kulkarni | Dr. Sanjay Verma | Tension-type cephalalgia; cranial nerves intact. Advised ergonomic monitor height and regular sleep. | • Magnesium glycinate 400mg OD (Night)<br/>• Naproxen 250mg SOS (With meals) |

---

### 4.2 Diagnostic Lab Reports (Encrypted AWS S3 Archive)

| Doc ID | Patient Name | Filename | Uploading Physician | S3 Bucket Key | Storage Tier |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **#1** | Aarav Patil | `Cardiology_ECG_Report_AaravPatil.pdf` | Dr. Rahul Sharma | `reports/Cardiology_ECG_Report_AaravPatil.pdf` | Private S3 (SSE-S3 AES-256) |
| **#2** | Neha Sharma | `Audiometry_Vestibular_Report_NehaSharma.pdf` | Dr. Sanjay Verma | `reports/Audiometry_Vestibular_Report_NehaSharma.pdf` | Private S3 (SSE-S3 AES-256) |
| **#3** | Aditya Nair | `Echocardiogram_Treadmill_AdityaNair.pdf` | Dr. Rahul Sharma | `reports/Echocardiogram_Treadmill_AdityaNair.pdf` | Private S3 (SSE-S3 AES-256) |

---

## 5. Recommended Evaluation Walkthrough Scenarios

### Scenario A: Executive & Cloud Infrastructure Audit (Admin Role)
1. Navigate to: `http://43.205.194.94:3000/login`
2. Select the **Admin** tab.
3. Sign in with:
   - **Email:** `admin@cloudcare.test`
   - **Password:** `Admin@123`
4. **Observe:**
   - Real-time KPI summary (Total Patients: 12, Specialists: 5, Total Consultations: 20).
   - Live backend health status pill (`200 OK | RDS LIVE`).
   - The **Authorized Identity Directory & Demonstration Passes** table with interactive "Show Passwords" and "Copy Pass" functionality.
   - The **AWS Cloud Deployment Specifications** detailing the custom VPC (`10.20.0.0/16`), Public EC2 Host (`43.205.194.94:3000`), Private Multi-AZ RDS MySQL endpoint, and Private S3 Bucket configuration.

---

### Scenario B: Patient Consultation Booking (Patient Role)
1. Navigate to: `http://43.205.194.94:3000/login`
2. Select the **Patient** tab.
3. Sign in with:
   - **Email:** `neha.sharma@cloudcare.test` (or `aarav@cloudcare.test`)
   - **Password:** `Patient@123`
4. **Observe:**
   - Personalized patient dashboard showing upcoming visits and clinical records.
   - Click **"Book Appointment"**: select a specialist (e.g. *Dr. Sanjay Verma - Neurology*) and an available slot.
   - The system validates slot availability and prevents double-booking.
   - Under **Diagnostic Reports**, download verified synthetic medical records streamed securely from the private S3 bucket.

---

### Scenario C: Physician Consultation & Report Upload (Doctor Role)
1. Navigate to: `http://43.205.194.94:3000/login`
2. Select the **Doctor** tab.
3. Sign in with:
   - **Email:** `rahul@cloudcare.test` (or `sanjay@cloudcare.test`)
   - **Password:** `Doctor@123`
4. **Observe:**
   - Active consultation queue for the specialist's department.
   - Click **"Add Prescription"** to enter diagnosis notes and pharmaceutical dosage.
   - Click **"Upload Report"** to upload a synthetic diagnostic PDF lab report (streamed directly to private S3 via EC2 IAM credentials).
   - Click **"Complete Visit"** to mark the appointment as `COMPLETED`.

---

### Scenario D: Security & Data Isolation Verification
1. Log in as Patient *Sneha Joshi* (`sneha@cloudcare.test`).
2. Notice that Sneha can **only** access her own appointments and diagnostic documents.
3. Attempting to directly download an appointment or report belonging to *Aarav Patil* or *Neha Sharma* returns an automated `403 Forbidden` response from the Express REST API.
4. Non-admin users cannot access `/admin` or view database topology details.

---

*Generated by the CloudCare Engineering Team for Academic Evaluation & Viva Demonstration.*
