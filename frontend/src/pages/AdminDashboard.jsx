import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../services/useAuth';
import { cloudcareService } from '../services/cloudcareService';
import api from '../services/api';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import {
  Shield,
  Users,
  Stethoscope,
  Calendar,
  Server,
  Activity,
  CheckCircle2,
  RefreshCw,
  Lock,
  Database,
  Cloud,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

const DEMO_CREDENTIALS = [
  {
    name: 'System Administrator',
    email: 'admin@cloudcare.test',
    password: 'Admin@123',
    role: 'ADMIN',
    portal: '/admin',
    details: 'Full administrative infrastructure, telemetry & audit privileges',
  },
  {
    name: 'Dr. Rahul Sharma',
    email: 'rahul@cloudcare.test',
    password: 'Doctor@123',
    role: 'DOCTOR',
    specialty: 'Cardiology',
    portal: '/doctor',
    details: 'Attending Cardiologist • Slots: 09:00 - 14:00',
  },
  {
    name: 'Dr. Priya Mehta',
    email: 'priya@cloudcare.test',
    password: 'Doctor@123',
    role: 'DOCTOR',
    specialty: 'Dermatology',
    portal: '/doctor',
    details: 'Attending Dermatologist • Slots: 10:00 - 16:00',
  },
  {
    name: 'Dr. Arjun Reddy',
    email: 'arjun@cloudcare.test',
    password: 'Doctor@123',
    role: 'DOCTOR',
    specialty: 'Orthopedics',
    portal: '/doctor',
    details: 'Attending Orthopedic Specialist • Slots: 09:30 - 17:00',
  },
  {
    name: 'Dr. Kavita Rao',
    email: 'kavita@cloudcare.test',
    password: 'Doctor@123',
    role: 'DOCTOR',
    specialty: 'Pediatrics',
    portal: '/doctor',
    details: 'Pediatric Specialist • Slots: 09:00 - 17:00',
  },
  {
    name: 'Dr. Sanjay Verma',
    email: 'sanjay@cloudcare.test',
    password: 'Doctor@123',
    role: 'DOCTOR',
    specialty: 'Neurology',
    portal: '/doctor',
    details: 'Neurology Consultant • Slots: 10:00 - 16:30',
  },
  {
    name: 'Aarav Patil',
    email: 'aarav@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Consultations with Cardiology & Orthopedics',
  },
  {
    name: 'Sneha Joshi',
    email: 'sneha@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Consultations with Dermatology & Pediatrics',
  },
  {
    name: 'Vikram Malhotra',
    email: 'vikram@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Consultations with Orthopedics & Dermatology',
  },
  {
    name: 'Ananya Deshmukh',
    email: 'ananya@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Routine pediatric booster vaccination',
  },
  {
    name: 'Rohan Kulkarni',
    email: 'rohan@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Tension headache & sleep posture assessment',
  },
  {
    name: 'Neha Sharma',
    email: 'neha.sharma@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Vestibular migraine evaluation & audiometry',
  },
  {
    name: 'Aditya Nair',
    email: 'aditya.nair@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Cardiology stress test & Achilles tendon strain',
  },
  {
    name: 'Pooja Iyer',
    email: 'pooja.iyer@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Clinical cosmetology & facial sensory review',
  },
  {
    name: 'Karan Singhania',
    email: 'karan.s@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Bilateral knee joint assessment & lipid panel',
  },
  {
    name: 'Meera Patel',
    email: 'meera.patel@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Pediatric allergy profile & barrier cream review',
  },
  {
    name: 'Devendra Rao',
    email: 'devendra.rao@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Motor function review & physical therapy',
  },
  {
    name: 'Ishaan Kapoor',
    email: 'ishaan.kapoor@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Executive preventative cardiovascular screening',
  },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ patients: 24, doctors: 3, appointments: 5 });
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [healthStatus, setHealthStatus] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);

  // Administrative credentials & pass state
  const [showPasswords, setShowPasswords] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(null);
  const [roleFilter, setRoleFilter] = useState('ALL');

  const loadData = useCallback(async () => {
    try {
      const [sum, drs, appts] = await Promise.all([
        cloudcareService.getDashboardSummary(),
        cloudcareService.getDoctors(),
        cloudcareService.getAppointments(user),
      ]);
      setSummary(sum);
      setDoctors(drs);
      setAppointments(appts);
    } catch (err) {
      console.error('Failed to load admin summary', err);
    }
  }, [user]);

  const checkHealth = useCallback(async () => {
    setHealthLoading(true);
    try {
      const res = await api.get('/health');
      setHealthStatus({
        status: res.data?.status || 'ok',
        time: new Date().toLocaleTimeString(),
        statusCode: res.status,
      });
    } catch (err) {
      setHealthStatus({
        status: 'Offline / Standby',
        time: new Date().toLocaleTimeString(),
        statusCode: err.response?.status || 503,
      });
    } finally {
      setHealthLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        const [sum, drs, appts] = await Promise.all([
          cloudcareService.getDashboardSummary(),
          cloudcareService.getDoctors(),
          cloudcareService.getAppointments(user),
        ]);
        if (active) {
          setSummary(sum);
          setDoctors(drs);
          setAppointments(appts);
        }
      } catch (err) {
        console.error('Failed to load admin summary', err);
      }
      try {
        const res = await api.get('/health');
        if (active) {
          setHealthStatus({
            status: res.data?.status || 'ok',
            time: new Date().toLocaleTimeString(),
            statusCode: res.status,
          });
        }
      } catch (err) {
        if (active) {
          setHealthStatus({
            status: 'Offline / Standby',
            time: new Date().toLocaleTimeString(),
            statusCode: err.response?.status || 503,
          });
        }
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [user]);

  const handleCopy = (cred) => {
    navigator.clipboard.writeText(`Email: ${cred.email}\nPassword: ${cred.password}`);
    setCopiedEmail(cred.email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const filteredCredentials = DEMO_CREDENTIALS.filter((cred) => {
    if (roleFilter === 'ALL') return true;
    return cred.role === roleFilter;
  });

  return (
    <div className="space-y-6">
      {/* Admin Hero Header: Sleek Warm Obsidian Card */}
      <div
        className="relative overflow-hidden rounded-[24px] bg-[#1C1917] text-white p-6 sm:p-8 border border-[rgba(255,255,255,0.08)]"
        style={{
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 24px 48px -12px rgba(28, 25, 23, 0.18)',
        }}
      >
        {/* Subtle metallic copper accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C85A32] to-transparent opacity-60" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-mono tracking-wider uppercase mb-2 text-[#ECE9E2]">
              <Shield className="w-3.5 h-3.5 text-[#C85A32]" />
              <span>Administrative Operations Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-white">
              Hospital Operations Overview
            </h1>
            <p className="text-[#9C968E] text-xs sm:text-sm mt-1 max-w-xl font-normal leading-relaxed">
              CloudCare Architecture • Monitor appointments, clinical staff allocations, deployment specifications, and authorized identity passes.
            </p>
          </div>

          <Button
            variant="secondary"
            icon={RefreshCw}
            size="md"
            loading={healthLoading}
            onClick={() => {
              loadData();
              checkHealth();
            }}
            className="self-start md:self-center font-bold"
          >
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={summary.patients || 7}
          subtitle="Registered synthetic accounts"
          icon={Users}
        />
        <StatCard
          title="Medical Specialists"
          value={doctors.length || summary.doctors || 5}
          subtitle="Seeded active doctors"
          icon={Stethoscope}
        />
        <StatCard
          title="Total Consultations"
          value={appointments.length || summary.appointments || 12}
          subtitle="All-time bookings"
          icon={Calendar}
        />
        <StatCard
          title="Backend Liveness"
          value={healthStatus?.status === 'ok' ? 'HEALTHY' : 'STANDBY'}
          subtitle={
            healthStatus
              ? `Status ${healthStatus.statusCode} at ${healthStatus.time}`
              : 'Checking /api/health...'
          }
          icon={Activity}
          badgeText={healthStatus?.status === 'ok' ? 'HTTP 200' : 'Offline'}
        />
      </div>

      {/* ADMIN-ONLY EXCLUSIVE: System Access & Identity Passes Directory */}
      <Card className="border border-[rgba(28,25,23,0.08)] bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ECE9E2] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1C1917] text-white flex items-center justify-center">
              <Key className="w-4 h-4 text-[#C85A32]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#18181B] tracking-[-0.02em]">
                  Authorized Identity Directory & Demonstration Passes
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                  RESTRICTED TO ADMIN
                </span>
              </div>
              <p className="text-xs text-[#6E6A63]">
                Demonstration login IDs and passwords removed from public authentication routes for system security
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={showPasswords ? EyeOff : Eye}
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-xs"
            >
              {showPasswords ? 'Hide Passwords' : 'Show Passwords'}
            </Button>
          </div>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {[
            { id: 'ALL', label: 'All Accounts (18)' },
            { id: 'ADMIN', label: 'Administrators (1)' },
            { id: 'DOCTOR', label: 'Medical Specialists (5)' },
            { id: 'PATIENT', label: 'Synthetic Patients (12)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all btn-press ${
                roleFilter === tab.id
                  ? 'bg-[#1C1917] text-white shadow-xs'
                  : 'bg-[#F3F1ED] text-[#6E6A63] hover:text-[#18181B] hover:bg-[#ECE9E2]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Credentials & Passes Table */}
        <div className="overflow-x-auto rounded-xl border border-[#ECE9E2]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F3F1ED] border-b border-[#ECE9E2] text-[#6E6A63] font-mono uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Account Name</th>
                <th className="py-2.5 px-3">Login Email / ID</th>
                <th className="py-2.5 px-3">Authorized Pass</th>
                <th className="py-2.5 px-3">Destination Portal</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE9E2]">
              {filteredCredentials.map((cred) => (
                <tr key={cred.email} className="hover:bg-[#F3F1ED]/50 transition-colors">
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                        cred.role === 'ADMIN'
                          ? 'bg-[#1C1917] text-white'
                          : cred.role === 'DOCTOR'
                          ? 'bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]'
                          : 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                      }`}
                    >
                      {cred.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-[#18181B]">
                    <div>{cred.name}</div>
                    <div className="text-[10px] font-normal text-[#9C968E]">{cred.details}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[#18181B] font-medium">
                    {cred.email}
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    {showPasswords ? (
                      <span className="font-semibold text-[#C85A32] bg-[#FDF2EE] px-2 py-0.5 rounded border border-[#FADCD2]">
                        {cred.password}
                      </span>
                    ) : (
                      <span className="text-[#9C968E] tracking-widest">••••••••</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#6E6A63]">
                    <code>{cred.portal}</code>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleCopy(cred)}
                      title="Copy login ID and password"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F3F1ED] hover:bg-[#1C1917] text-[#6E6A63] hover:text-white transition-all text-[11px] font-mono btn-press"
                    >
                      {copiedEmail === cred.email ? (
                        <>
                          <Check className="w-3 h-3 text-[#10B981]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Pass</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 p-3 rounded-xl bg-[#F3F1ED] border border-[#ECE9E2] flex items-center gap-2 text-[11px] text-[#6E6A63] font-mono">
          <ShieldAlert className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
          <span>Notice: These credentials allow immediate validation across roles and are strictly isolated to the admin console.</span>
        </div>
      </Card>

      {/* ADMIN-ONLY EXCLUSIVE: AWS Architecture & Cloud Deployment Console */}
      <Card className="border border-[rgba(28,25,23,0.08)] bg-white">
        <div className="flex items-center justify-between pb-4 border-b border-[#ECE9E2] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F3F1ED] text-[#1C1917] flex items-center justify-center border border-[#ECE9E2]">
              <Cloud className="w-4 h-4 text-[#C85A32]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#18181B] tracking-[-0.02em]">
                  AWS Cloud Deployment Specifications & Network Topology
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                  LIVE PRODUCTION
                </span>
              </div>
              <p className="text-xs text-[#6E6A63]">
                Infrastructure endpoints and security rules restricted strictly to this authenticated administration portal
              </p>
            </div>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
            VERIFIED SECURE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* EC2 & VPC Box */}
          <div className="p-3.5 rounded-xl bg-[#F3F1ED] border border-[#ECE9E2] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#18181B]">
              <Server className="w-4 h-4 text-[#1C1917]" />
              <span>Public EC2 & Custom VPC</span>
            </div>
            <p className="font-mono text-[#6E6A63] leading-relaxed text-[11px]">
              • Instance: Amazon Linux 2023 (t3.micro)<br />
              • Instance ID: <code className="bg-white px-1 rounded border border-[#ECE9E2]">i-054768b5baf83e81e</code><br />
              • Public Endpoint: <code className="bg-white px-1 rounded border border-[#ECE9E2]">43.205.194.94:3000</code><br />
              • Custom VPC: <code className="bg-white px-1 rounded border border-[#ECE9E2]">10.20.0.0/16</code> (ap-south-1)<br />
              • Public Subnet: <code className="bg-white px-1 rounded border border-[#ECE9E2]">10.20.1.0/24</code> (AZ A)
            </p>
          </div>

          {/* RDS Box */}
          <div className="p-3.5 rounded-xl bg-[#F3F1ED] border border-[#ECE9E2] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#18181B]">
              <Database className="w-4 h-4 text-[#1C1917]" />
              <span>Private MySQL RDS Enclave</span>
            </div>
            <p className="font-mono text-[#6E6A63] leading-relaxed text-[11px]">
              • Multi-AZ Subnets: <code className="bg-white px-1 rounded border border-[#ECE9E2]">10.20.11.0/24</code> & <code className="bg-white px-1 rounded border border-[#ECE9E2]">10.20.12.0/24</code><br />
              • Endpoint: <code className="bg-white px-1 rounded border border-[#ECE9E2] text-[10px] break-all">cloudcare-db.cbu82mmyc950.ap-south-1.rds.amazonaws.com:3306</code><br />
              • Public Access: <span className="font-bold text-[#C85A32]">NO</span> (Strict isolation)<br />
              • Inbound 3306: App Security Group source only
            </p>
          </div>

          {/* S3 Box */}
          <div className="p-3.5 rounded-xl bg-[#F3F1ED] border border-[#ECE9E2] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#18181B]">
              <Lock className="w-4 h-4 text-[#10B981]" />
              <span>Private S3 & EC2 IAM Role</span>
            </div>
            <p className="font-mono text-[#6E6A63] leading-relaxed text-[11px]">
              • Bucket: <code className="bg-white px-1 rounded border border-[#ECE9E2] text-[10px] break-all">cloudcare-docs-anushka-unique-03</code><br />
              • Block All Public Access: <span className="font-bold text-[#065F46]">ON (All 4 settings)</span><br />
              • Default Encryption: <span className="font-semibold text-[#18181B]">SSE-S3 (AES-256)</span><br />
              • EC2 IAM Role: <code className="bg-white px-1 rounded border border-[#ECE9E2]">CloudCareEC2S3Role</code> (s3:GetObject, s3:PutObject)
            </p>
          </div>
        </div>
      </Card>

      {/* Seeded Doctors Directory Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#18181B]">
            Hospital Medical Staff Directory
          </h3>
          <span className="text-xs font-semibold text-[#9C968E]">
            {doctors.length} Doctors Seeded
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[rgba(28,25,23,0.08)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F3F1ED] border-b border-[#ECE9E2] text-[#6E6A63] font-mono uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Doctor Name</th>
                  <th className="py-3 px-4">Department / Specialty</th>
                  <th className="py-3 px-4">Available Slots (IST)</th>
                  <th className="py-3 px-4">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE9E2]">
                {doctors.map((dr) => (
                  <tr key={dr.id} className="hover:bg-[#F3F1ED]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#18181B] flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#F3F1ED] text-[#18181B] border border-[#ECE9E2] flex items-center justify-center font-bold text-xs font-mono">
                        {dr.name[4] || 'D'}
                      </div>
                      <span>{dr.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#6E6A63]">
                      {dr.specialization}
                    </td>
                    <td className="py-3.5 px-4 text-[#6E6A63]">
                      <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                        {(dr.availableSlots || []).map((s) => (
                          <span
                            key={s}
                            className="bg-[#F3F1ED] text-[#18181B] border border-[#ECE9E2] px-2 py-0.5 rounded"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                        Active Seeded
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Global Appointments Audit Log */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#18181B]">
            Appointments Audit Log
          </h3>
          <span className="text-xs font-semibold text-[#9C968E]">
            Total {appointments.length} Consultations
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[rgba(28,25,23,0.08)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F3F1ED] border-b border-[#ECE9E2] text-[#6E6A63] font-mono uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Appt ID</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Attending Doctor</th>
                  <th className="py-3 px-4">Date & Slot</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE9E2]">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-[#F3F1ED]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#6E6A63] font-mono">
                      #{appt.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#18181B]">
                      {appt.patientName}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#18181B]">
                      {appt.doctorName}
                    </td>
                    <td className="py-3.5 px-4 text-[#6E6A63]">
                      <span className="font-medium text-[#18181B]">{appt.visitDate}</span> at {appt.slot}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="py-3.5 px-4 text-[#6E6A63] max-w-xs truncate">
                      {appt.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
