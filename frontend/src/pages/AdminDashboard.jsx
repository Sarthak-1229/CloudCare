import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import { cloudcareService } from '../services/cloudcareService';
import api from '../services/api';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import SegmentedControl from '../components/common/SegmentedControl';
import Input from '../components/common/Input';
import PageHeader from '../components/common/PageHeader';
import EmptyState from '../components/common/EmptyState';
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
  ShieldAlert,
  Search,
  ArrowRight,
  CheckCircle,
  XCircle,
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
    details: 'Cardiology & Vascular Medicine • Slots: 09:00 - 14:00',
  },
  {
    name: 'Dr. Priya Mehta',
    email: 'priya@cloudcare.test',
    password: 'Doctor@123',
    role: 'DOCTOR',
    specialty: 'Dermatology',
    portal: '/doctor',
    details: 'Dermatology & Clinical Cosmetology • Slots: 10:00 - 16:00',
  },
  {
    name: 'Dr. Arjun Reddy',
    email: 'arjun@cloudcare.test',
    password: 'Doctor@123',
    role: 'DOCTOR',
    specialty: 'Orthopedics',
    portal: '/doctor',
    details: 'Orthopedic & Joint Replacement • Slots: 09:30 - 17:00',
  },
  {
    name: 'Dr. Kavita Rao',
    email: 'kavita@cloudcare.test',
    password: 'Doctor@123',
    role: 'DOCTOR',
    specialty: 'Pediatrics',
    portal: '/doctor',
    details: 'Pediatrics & Child Wellness • Slots: 09:00 - 17:00',
  },
  {
    name: 'Dr. Sanjay Verma',
    email: 'sanjay@cloudcare.test',
    password: 'Doctor@123',
    role: 'DOCTOR',
    specialty: 'Neurology',
    portal: '/doctor',
    details: 'Neurology & Cognitive Health • Slots: 10:00 - 16:30',
  },
  {
    name: 'Aarav Patil',
    email: 'aarav@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Cardiology & Orthopedics',
  },
  {
    name: 'Sneha Joshi',
    email: 'sneha@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Dermatology & Pediatrics',
  },
  {
    name: 'Vikram Malhotra',
    email: 'vikram@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Orthopedics & Dermatology',
  },
  {
    name: 'Ananya Deshmukh',
    email: 'ananya@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Pediatric wellness',
  },
  {
    name: 'Rohan Kulkarni',
    email: 'rohan@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Neurology assessment',
  },
  {
    name: 'Neha Sharma',
    email: 'neha.sharma@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Vestibular migraine evaluation',
  },
  {
    name: 'Aditya Nair',
    email: 'aditya.nair@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Cardiology & Orthopedics',
  },
  {
    name: 'Pooja Iyer',
    email: 'pooja.iyer@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Dermatology & Neurology',
  },
  {
    name: 'Karan Singhania',
    email: 'karan.s@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Orthopedics & Cardiology',
  },
  {
    name: 'Meera Patel',
    email: 'meera.patel@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Pediatrics & Dermatology',
  },
  {
    name: 'Devendra Rao',
    email: 'devendra.rao@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Neurological rehabilitation',
  },
  {
    name: 'Ishaan Kapoor',
    email: 'ishaan.kapoor@cloudcare.test',
    password: 'Patient@123',
    role: 'PATIENT',
    portal: '/patient',
    details: 'Synthetic patient record • Executive cardiology checkup',
  },
];

const AdminDashboard = ({ view = 'overview' }) => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ patients: 12, doctors: 5, appointments: 20 });
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [healthStatus, setHealthStatus] = useState(null);
  const [readyStatus, setReadyStatus] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filters & search
  const [apptFilter, setApptFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Admin credentials directory state
  const [showPasswords, setShowPasswords] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(null);
  const [roleFilter, setRoleFilter] = useState('ALL');

  const checkHealth = useCallback(async () => {
    setHealthLoading(true);
    try {
      const [hRes, rRes] = await Promise.allSettled([api.get('/health'), api.get('/ready')]);
      const now = new Date().toLocaleTimeString();

      if (hRes.status === 'fulfilled') {
        setHealthStatus({
          status: hRes.value.data?.status || 'ok',
          time: now,
          statusCode: hRes.value.status,
        });
      } else {
        setHealthStatus({
          status: 'Offline',
          time: now,
          statusCode: hRes.reason?.response?.status || 503,
        });
      }

      if (rRes.status === 'fulfilled') {
        setReadyStatus({
          status: rRes.value.data?.status || 'ready',
          statusCode: rRes.value.status,
        });
      } else {
        setReadyStatus({
          status: 'Unavailable',
          statusCode: rRes.reason?.response?.status || 503,
        });
      }
    } finally {
      setHealthLoading(false);
    }
  }, []);

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
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    Promise.all([
      cloudcareService.getDashboardSummary(),
      cloudcareService.getDoctors(),
      cloudcareService.getAppointments(user),
    ])
      .then(([sum, drs, appts]) => {
        if (!active) return;
        setSummary(sum);
        setDoctors(drs);
        setAppointments(appts);
      })
      .catch((err) => {
        if (active) console.error('Failed to load admin summary', err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    Promise.allSettled([api.get('/health'), api.get('/ready')]).then(([hRes, rRes]) => {
      if (!active) return;
      const now = new Date().toLocaleTimeString();
      setHealthStatus(
        hRes.status === 'fulfilled'
          ? { status: hRes.value.data?.status || 'ok', time: now, statusCode: hRes.value.status }
          : { status: 'Offline', time: now, statusCode: hRes.reason?.response?.status || 503 }
      );
      setReadyStatus(
        rRes.status === 'fulfilled'
          ? { status: rRes.value.data?.status || 'ready', statusCode: rRes.value.status }
          : { status: 'Unavailable', statusCode: rRes.reason?.response?.status || 503 }
      );
    });

    return () => {
      active = false;
    };
  }, [user]);

  const handleStatusUpdate = async (appointmentId, targetStatus) => {
    try {
      await cloudcareService.updateAppointmentStatus(appointmentId, targetStatus);
      await loadData();
    } catch (err) {
      console.error('Status update failed', err);
    }
  };

  const handleCopy = (cred) => {
    navigator.clipboard.writeText(`Email: ${cred.email}\nPassword: ${cred.password}`);
    setCopiedEmail(cred.email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const filteredCredentials = DEMO_CREDENTIALS.filter((cred) => {
    if (roleFilter === 'ALL') return true;
    return cred.role === roleFilter;
  });

  const q = searchTerm.trim().toLowerCase();
  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus = apptFilter === 'ALL' || a.status === apptFilter;
    const matchesSearch =
      !q ||
      (a.patientName || '').toLowerCase().includes(q) ||
      (a.doctorName || '').toLowerCase().includes(q) ||
      (a.visitDate || '').includes(q);
    return matchesStatus && matchesSearch;
  });

  const filteredDoctors = doctors.filter(
    (d) =>
      !q ||
      (d.name || '').toLowerCase().includes(q) ||
      (d.specialization || '').toLowerCase().includes(q)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-7 h-7 border-2 border-[#1C1917] border-t-[#C85A32] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* OVERVIEW VIEW (/admin) */}
      {view === 'overview' && (
        <>
          <div
            className="relative overflow-hidden rounded-[24px] bg-[#1C1917] text-white p-6 sm:p-8 border border-[rgba(255,255,255,0.08)]"
            style={{
              boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 24px 48px -12px rgba(28, 25, 23, 0.18)',
            }}
          >
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
                  Monitor patient registrations, medical specialist capacity, appointments audit logs, and cloud infrastructure telemetry.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Patients"
              value={summary.patients}
              subtitle="Registered patient profiles"
              icon={Users}
            />
            <Link to="/admin/doctors" className="block">
              <StatCard
                title="Medical Specialists"
                value={doctors.length || summary.doctors}
                subtitle="Active hospital departments"
                icon={Stethoscope}
                onClick={() => {}}
              />
            </Link>
            <Link to="/admin/appointments" className="block">
              <StatCard
                title="Total Consultations"
                value={summary.appointments ?? appointments.length}
                subtitle="All-time bookings"
                icon={Calendar}
                onClick={() => {}}
              />
            </Link>
            <Link to="/admin/infra" className="block">
              <StatCard
                title="Backend & RDS"
                value={healthStatus?.status === 'ok' ? 'HEALTHY' : 'STANDBY'}
                subtitle={
                  healthStatus
                    ? `API ${healthStatus.statusCode} • RDS ${readyStatus?.status || 'checking'}`
                    : 'Checking liveness...'
                }
                icon={Activity}
                badgeText={readyStatus?.status === 'ready' ? 'RDS READY' : 'HTTP 200'}
                onClick={() => {}}
              />
            </Link>
          </div>

          {/* Quick Operations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Consultation Breakdown */}
            <Card>
              <h3 className="text-base font-bold text-[#18181B] mb-1">Consultation Status Mix</h3>
              <p className="text-xs text-[#6E6A63] mb-4">Real-time distribution across states</p>
              <div className="space-y-3">
                {[
                  { label: 'Confirmed', status: 'CONFIRMED', color: 'bg-[#10B981]' },
                  { label: 'Pending Review', status: 'PENDING', color: 'bg-[#D97706]' },
                  { label: 'Completed', status: 'COMPLETED', color: 'bg-[#1C1917]' },
                  { label: 'Cancelled', status: 'CANCELLED', color: 'bg-[#9C968E]' },
                ].map((item) => {
                  const count = appointments.filter((a) => a.status === item.status).length;
                  const pct = appointments.length ? Math.round((count / appointments.length) * 100) : 0;
                  return (
                    <div key={item.status} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-[#18181B]">{item.label}</span>
                        <span className="font-mono text-[#6E6A63]">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#F3F1ED] overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 pt-4 border-t border-[#ECE9E2]">
                <Link
                  to="/admin/infra"
                  className="text-xs font-semibold text-[#C85A32] hover:underline flex items-center justify-between"
                >
                  <span>Cloud Deployment & Credentials Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>

            {/* Recent Appointments Snapshot */}
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#18181B]">Recent Consultations</h3>
                  <p className="text-xs text-[#6E6A63]">Latest activity across all departments</p>
                </div>
                <Link
                  to="/admin/appointments"
                  className="text-xs font-semibold text-[#C85A32] hover:underline flex items-center gap-1"
                >
                  Full Audit Log <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F3F1ED] text-[#6E6A63] font-mono uppercase text-[10px]">
                    <tr>
                      <th className="py-2 px-3 rounded-l-lg">ID</th>
                      <th className="py-2 px-3">Patient</th>
                      <th className="py-2 px-3">Specialist</th>
                      <th className="py-2 px-3">Schedule</th>
                      <th className="py-2 px-3 rounded-r-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECE9E2]">
                    {appointments.slice(0, 6).map((appt) => (
                      <tr key={appt.id} className="hover:bg-[#F3F1ED]/40">
                        <td className="py-2.5 px-3 font-mono text-[#6E6A63]">#{appt.id}</td>
                        <td className="py-2.5 px-3 font-bold text-[#18181B]">{appt.patientName}</td>
                        <td className="py-2.5 px-3 text-[#6E6A63]">{appt.doctorName}</td>
                        <td className="py-2.5 px-3 font-mono text-[#6E6A63]">
                          {appt.visitDate} • {appt.slot}
                        </td>
                        <td className="py-2.5 px-3">
                          <StatusBadge status={appt.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* DOCTORS & STAFF VIEW (/admin/doctors) */}
      {view === 'doctors' && (
        <>
          <PageHeader
            title="Medical Staff Directory"
            subtitle="Active specialists, clinical departments, consultation hours, and encounter volume"
            badge={
              <span className="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F3F1ED] text-[#6E6A63] border border-[#ECE9E2]">
                {doctors.length} Specialists
              </span>
            }
          />

          <div className="w-full md:w-80">
            <Input
              icon={Search}
              placeholder="Search doctor name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-2xl border border-[rgba(28,25,23,0.08)] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F3F1ED] border-b border-[#ECE9E2] text-[#6E6A63] font-mono uppercase tracking-wider font-semibold text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Doctor Name</th>
                    <th className="py-3 px-4">Department / Specialty</th>
                    <th className="py-3 px-4">Available Slots (IST)</th>
                    <th className="py-3 px-4">Assigned Encounters</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE9E2]">
                  {filteredDoctors.map((dr) => {
                    const drAppts = appointments.filter((a) => a.doctorId === dr.id);
                    return (
                      <tr key={dr.id} className="hover:bg-[#F3F1ED]/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#18181B] flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#1C1917] text-white flex items-center justify-center font-bold text-xs font-mono shrink-0">
                            {dr.name?.replace('Dr. ', '')?.[0] || 'D'}
                          </div>
                          <span>{dr.name}</span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#6E6A63]">
                          {dr.specialization}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                            {(dr.availableSlots || ['09:00', '10:00', '11:00', '14:00']).map((s) => (
                              <span
                                key={s}
                                className="bg-[#F3F1ED] text-[#18181B] border border-[#ECE9E2] px-2 py-0.5 rounded"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#18181B] font-semibold">
                          {drAppts.length} Visits
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                            Active Seeded
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* APPOINTMENTS AUDIT VIEW (/admin/appointments) */}
      {view === 'appointments' && (
        <>
          <PageHeader
            title="Appointments Audit Log"
            subtitle="Complete cross-department clinical consultation history and administrative override controls"
            badge={
              <span className="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F3F1ED] text-[#6E6A63] border border-[#ECE9E2]">
                {appointments.length} Total
              </span>
            }
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="w-full md:w-72">
              <Input
                icon={Search}
                placeholder="Search patient, doctor, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <SegmentedControl
              options={[
                { label: 'All', value: 'ALL', badge: appointments.length },
                {
                  label: 'Pending',
                  value: 'PENDING',
                  badge: appointments.filter((a) => a.status === 'PENDING').length,
                },
                {
                  label: 'Confirmed',
                  value: 'CONFIRMED',
                  badge: appointments.filter((a) => a.status === 'CONFIRMED').length,
                },
                {
                  label: 'Completed',
                  value: 'COMPLETED',
                  badge: appointments.filter((a) => a.status === 'COMPLETED').length,
                },
                {
                  label: 'Cancelled',
                  value: 'CANCELLED',
                  badge: appointments.filter((a) => a.status === 'CANCELLED').length,
                },
              ]}
              value={apptFilter}
              onChange={setApptFilter}
            />
          </div>

          {filteredAppointments.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No matching appointments"
              description="Try another filter or clear your search term."
            />
          ) : (
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
                      <th className="py-3 px-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECE9E2]">
                    {filteredAppointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-[#F3F1ED]/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#6E6A63] font-mono">
                          #{appt.id}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#18181B]">
                          {appt.patientName}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#18181B]">
                          <div>{appt.doctorName}</div>
                          {appt.specialization && (
                            <div className="text-[10px] font-normal text-[#9C968E]">
                              {appt.specialization}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#6E6A63] font-mono">
                          <span className="font-medium text-[#18181B]">{appt.visitDate}</span> at{' '}
                          {appt.slot}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={appt.status} />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {appt.status === 'PENDING' ? (
                            <div className="inline-flex items-center gap-1.5">
                              <Button
                                variant="primary"
                                size="sm"
                                icon={CheckCircle}
                                onClick={() => handleStatusUpdate(appt.id, 'CONFIRMED')}
                              >
                                Confirm
                              </Button>
                              <Button
                                variant="destructiveTint"
                                size="sm"
                                icon={XCircle}
                                onClick={() => handleStatusUpdate(appt.id, 'CANCELLED')}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : appt.status === 'CONFIRMED' ? (
                            <Button
                              variant="destructiveTint"
                              size="sm"
                              icon={XCircle}
                              onClick={() => handleStatusUpdate(appt.id, 'CANCELLED')}
                            >
                              Cancel
                            </Button>
                          ) : (
                            <span className="font-mono text-[10px] text-[#9C968E]">LOCKED</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* CLOUD INFRASTRUCTURE & CREDENTIALS VIEW (/admin/infra) */}
      {view === 'infra' && (
        <>
          <PageHeader
            title="Cloud Infrastructure & Security Enclave"
            subtitle="Restricted administrative deployment specifications, live probes, and authorized identity passes"
            actions={
              <Button
                variant="secondary"
                icon={RefreshCw}
                size="md"
                loading={healthLoading}
                onClick={checkHealth}
              >
                Probe Infrastructure
              </Button>
            }
          />

          {/* Live Health & Readiness Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              title="Express API Liveness (/api/health)"
              value={healthStatus?.status === 'ok' ? 'HTTP 200 OK' : 'OFFLINE'}
              subtitle={`Last checked at ${healthStatus?.time || '—'}`}
              icon={Server}
              badgeText="LIVE"
            />
            <StatCard
              title="RDS MySQL Readiness (/api/ready)"
              value={readyStatus?.status === 'ready' ? 'CONNECTED' : 'UNAVAILABLE'}
              subtitle={`Endpoint probe status ${readyStatus?.statusCode || '—'}`}
              icon={Database}
              badgeText={readyStatus?.status === 'ready' ? 'TLS SECURE' : 'CHECK'}
            />
          </div>

          {/* AWS Cloud Deployment Specifications */}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
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

          {/* Authorized Identity Directory & Passes */}
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
                      ADMIN ONLY
                    </span>
                  </div>
                  <p className="text-xs text-[#6E6A63]">
                    Synthetic user IDs and passwords isolated exclusively to this admin enclave
                  </p>
                </div>
              </div>

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

            <div className="overflow-x-auto rounded-xl border border-[#ECE9E2]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F3F1ED] border-b border-[#ECE9E2] text-[#6E6A63] font-mono uppercase tracking-wider font-semibold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Account Name</th>
                    <th className="py-2.5 px-3">Login Email / ID</th>
                    <th className="py-2.5 px-3">Authorized Pass</th>
                    <th className="py-2.5 px-3">Portal</th>
                    <th className="py-2.5 px-3 text-right">Copy</th>
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
              <span>Strictly isolated to authenticated administrators. Hidden from all public and non-admin interfaces.</span>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
