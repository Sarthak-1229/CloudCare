# CloudCare — Demonstration Users, Credentials & Clinical Appointments Directory

> **Live Website:** http://43.205.194.94:3000/  
> **Classification:** 100% Synthetic Healthcare Demonstration Dataset  
> **Note:** Credentials are intentionally hidden from the public login page and accessible only to administrators inside the portal.

---

## 1. Standardized Login Passwords by Role

| Role | Password | Portal Path |
| :--- | :--- | :--- |
| System Administrator | Admin@123 | /admin |
| Medical Specialists (All Doctors) | Doctor@123 | /doctor |
| Synthetic Patients (All Patients) | Patient@123 | /patient |

---

## 2. Master User Directory

### 2.1 System Administrator

| User ID | Full Name | Login Email | Password | Permissions |
| :---: | :--- | :--- | :--- | :--- |
| 1 | System Administrator | admin@cloudcare.test | Admin@123 | Global appointments audit log, medical staff directory, live RDS/API telemetry, cloud deployment specs, identity directory |

---

### 2.2 Medical Specialists & Physicians (5 Clinical Specialties)

Password for all doctors: Doctor@123

| User ID | Doc ID | Physician Name | Login Email | Specialty & Department | Consultation Hours (IST) |
| :---: | :---: | :--- | :--- | :--- | :--- |
| 2 | 1 | Dr. Rahul Sharma | rahul@cloudcare.test | Cardiology & Vascular Medicine | 09:00, 10:00, 11:00, 12:00, 14:00 |
| 3 | 2 | Dr. Priya Mehta | priya@cloudcare.test | Dermatology & Clinical Cosmetology | 10:00, 11:30, 13:00, 15:00, 16:00 |
| 4 | 3 | Dr. Arjun Reddy | arjun@cloudcare.test | Orthopedic & Joint Replacement | 09:30, 11:00, 14:30, 16:00, 17:00 |
| 5 | 4 | Dr. Kavita Rao | kavita@cloudcare.test | Pediatrics & Child Wellness | 09:00, 10:30, 12:00, 15:30, 17:00 |
| 6 | 5 | Dr. Sanjay Verma | sanjay@cloudcare.test | Neurology & Cognitive Health | 10:00, 11:00, 14:00, 15:30, 16:30 |

---

### 2.3 Synthetic Patient Personas (12 Clinical Profiles)

Password for all patients: Patient@123

| User ID | Pt ID | Patient Name | Login Email | Age & Gender | Primary Clinical Profile |
| :---: | :---: | :--- | :--- | :---: | :--- |
| 7 | 1 | Aarav Patil | aarav@cloudcare.test | 38 M | Essential hypertension monitoring; post-work lumbar spine strain |
| 8 | 2 | Sneha Joshi | sneha@cloudcare.test | 32 F | Seasonal contact dermatitis on left forearm; family pediatric consultation |
| 9 | 3 | Vikram Malhotra | vikram@cloudcare.test | 45 M | Post-arthroscopic knee ACL reconstruction recovery; keloid care |
| 10 | 4 | Ananya Deshmukh | ananya@cloudcare.test | 7 F | Pediatric booster vaccination; mild seasonal allergic rhinitis |
| 11 | 5 | Rohan Kulkarni | rohan@cloudcare.test | 41 M | Chronic tension-type cephalalgia; sleep hygiene & ergonomic review |
| 12 | 6 | Neha Sharma | neha.sharma@cloudcare.test | 29 F | Vestibular migraine workup with episodic vertigo and audiometry |
| 13 | 7 | Aditya Nair | aditya.nair@cloudcare.test | 36 M | Pre-marathon cardiovascular stress test; acute Achilles tendon strain |
| 14 | 8 | Pooja Iyer | pooja.iyer@cloudcare.test | 34 F | Adult acne vulgaris follow-up; trigeminal facial sensory review |
| 15 | 9 | Karan Singhania | karan.s@cloudcare.test | 55 M | Grade II bilateral knee osteoarthritis; hyperlipidemia management |
| 16 | 10 | Meera Patel | meera.patel@cloudcare.test | 5 F | Pediatric atopic eczema and dietary allergen reintroduction |
| 17 | 11 | Devendra Rao | devendra.rao@cloudcare.test | 62 M | Post-stroke motor rehabilitation follow-up and physiotherapy review |
| 18 | 12 | Ishaan Kapoor | ishaan.kapoor@cloudcare.test | 48 M | Executive preventative cardiovascular screening and ambulatory BP check |

---

## 3. Master Clinical Appointments Catalog (20 Demonstrative Visits)

| Appt # | Patient Name | Attending Specialist | Department | Visit Date | Slot | Status |
| :---: | :--- | :--- | :--- | :---: | :---: | :--- |
| 1 | Aarav Patil | Dr. Rahul Sharma | Cardiology | 2027-01-15 | 10:00 | COMPLETED |
| 2 | Sneha Joshi | Dr. Priya Mehta | Dermatology | 2027-01-16 | 11:00 | COMPLETED |
| 3 | Vikram Malhotra | Dr. Arjun Reddy | Orthopedics | 2027-02-10 | 09:30 | COMPLETED |
| 4 | Ananya Deshmukh | Dr. Kavita Rao | Pediatrics | 2027-02-15 | 14:00 | COMPLETED |
| 5 | Rohan Kulkarni | Dr. Sanjay Verma | Neurology | 2027-02-18 | 11:00 | COMPLETED |
| 6 | Neha Sharma | Dr. Sanjay Verma | Neurology | 2027-03-01 | 14:00 | CONFIRMED |
| 7 | Aditya Nair | Dr. Rahul Sharma | Cardiology | 2027-03-05 | 09:00 | CONFIRMED |
| 8 | Pooja Iyer | Dr. Priya Mehta | Dermatology | 2027-03-10 | 13:00 | CONFIRMED |
| 9 | Karan Singhania | Dr. Arjun Reddy | Orthopedics | 2027-03-15 | 11:00 | CONFIRMED |
| 10 | Meera Patel | Dr. Kavita Rao | Pediatrics | 2027-03-20 | 10:30 | CONFIRMED |
| 11 | Devendra Rao | Dr. Sanjay Verma | Neurology | 2027-03-25 | 15:30 | PENDING |
| 12 | Ishaan Kapoor | Dr. Rahul Sharma | Cardiology | 2027-03-28 | 11:00 | PENDING |
| 13 | Aarav Patil | Dr. Arjun Reddy | Orthopedics | 2027-04-02 | 14:30 | PENDING |
| 14 | Sneha Joshi | Dr. Kavita Rao | Pediatrics | 2027-04-05 | 09:00 | PENDING |
| 15 | Vikram Malhotra | Dr. Priya Mehta | Dermatology | 2027-04-08 | 15:00 | PENDING |
| 16 | Neha Sharma | Dr. Rahul Sharma | Cardiology | 2027-04-12 | 12:00 | CANCELLED |
| 17 | Aditya Nair | Dr. Arjun Reddy | Orthopedics | 2027-04-15 | 16:00 | CONFIRMED |
| 18 | Pooja Iyer | Dr. Sanjay Verma | Neurology | 2027-04-18 | 10:00 | PENDING |
| 19 | Karan Singhania | Dr. Rahul Sharma | Cardiology | 2027-04-22 | 14:00 | CONFIRMED |
| 20 | Meera Patel | Dr. Priya Mehta | Dermatology | 2027-04-25 | 11:30 | PENDING |

---

## 4. Seeded Prescriptions & Encrypted S3 Diagnostic Reports

### Prescriptions
- **#1 (Aarav Patil / Dr. Rahul Sharma):** Resting ECG normal. Recommended low-sodium diet and 30-minute daily cardio. Rx: Atorvastatin 10mg OD (Night), Aspirin 75mg OD (Post Lunch).
- **#2 (Sneha Joshi / Dr. Priya Mehta):** Mild seasonal eczema on left forearm. Avoid perfumed soaps and hot water. Rx: Hydrocortisone cream 1% topical, Cetirizine 10mg OD as needed.
- **#3 (Vikram Malhotra / Dr. Arjun Reddy):** Post-arthroscopy knee ligament recovery review. Range of motion improved by 25%. Rx: Calcium Citrate + Vitamin D3 OD, Paracetamol 650mg SOS.
- **#4 (Ananya Deshmukh / Dr. Kavita Rao):** Routine pediatric booster vaccination administered. Growth percentiles healthy. Rx: Multivitamin pediatric syrup 5ml OD, Montelukast chewable 4mg OD (Night).
- **#5 (Rohan Kulkarni / Dr. Sanjay Verma):** Tension cephalalgia. Cranial nerves intact. Advised ergonomic posture and sleep schedule. Rx: Magnesium glycinate 400mg OD, Naproxen 250mg SOS.

### Diagnostic Reports (Private AWS S3 Bucket)
- **Doc #1 (Aarav Patil):** Cardiology_ECG_Report_AaravPatil.pdf (Uploaded by Dr. Rahul Sharma)
- **Doc #2 (Neha Sharma):** Audiometry_Vestibular_Report_NehaSharma.pdf (Uploaded by Dr. Sanjay Verma)
- **Doc #3 (Aditya Nair):** Echocardiogram_Treadmill_AdityaNair.pdf (Uploaded by Dr. Rahul Sharma)
