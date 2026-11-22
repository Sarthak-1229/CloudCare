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
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ patients: 24, doctors: 3, appointments: 5 });
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [healthStatus, setHealthStatus] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Admin Hero Header */}
      <div
        className="relative overflow-hidden rounded-[28px] text-white p-6 sm:p-8"
        style={{
          background: 'linear-gradient(135deg, #231F20 0%, #38322C 50%, #524B43 100%)',
          boxShadow: '0 12px 32px -8px rgba(35, 31, 32, 0.35)',
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-2">
              <Shield className="w-3.5 h-3.5 text-[#E06D53]" />
              <span>Administrative Operations Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Hospital Operations Overview
            </h1>
            <p className="text-[#F3ECE1] text-xs sm:text-sm mt-1 max-w-xl">
              CloudCare Simplified TY CCF v3.0 • Monitor appointments, clinical staff allocations, and AWS infrastructure health.
            </p>
          </div>

          <Button
            variant="primary"
            icon={RefreshCw}
            size="md"
            loading={healthLoading}
            onClick={() => {
              loadData();
              checkHealth();
            }}
            className="self-start md:self-center bg-[#E06D53] hover:bg-[#C85A40] text-white shadow-sm font-bold border-none"
          >
            Refresh System
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
          tint="terracotta"
        />
        <StatCard
          title="Medical Specialists"
          value={doctors.length || summary.doctors || 5}
          subtitle="Seeded active doctors"
          icon={Stethoscope}
          tint="sage"
        />
        <StatCard
          title="Total Consultations"
          value={appointments.length || summary.appointments || 12}
          subtitle="All-time bookings"
          icon={Calendar}
          tint="amber"
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
          tint={healthStatus?.status === 'ok' ? 'sage' : 'amber'}
          badgeText={healthStatus?.status === 'ok' ? 'HTTP 200' : 'Offline'}
        />
      </div>

      {/* AWS Architecture & CCF Mini-Project Foundation */}
      <Card className="border border-[#E8E0D5] bg-white/85">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D5] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[14px] bg-[#FDF2F0] text-[#E06D53] flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#231F20]">
                AWS Architecture & Security Baseline
              </h3>
              <p className="text-xs text-[#7A7267]">
                Verified Simplified TY CCF v3.0 Deployment Specifications
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#EDF4F0] text-[#5B8A72] border border-[#C4DDD0]">
            Phase 1 Foundation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* EC2 & VPC Box */}
          <div className="p-3.5 rounded-2xl bg-[#F5F0E6] border border-[#E8E0D5] shadow-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#231F20]">
              <Server className="w-4 h-4 text-[#E06D53]" />
              <span>Public EC2 & Custom VPC</span>
            </div>
            <p className="text-[#7A7267] leading-relaxed text-[11px]">
              • Amazon Linux 2023 (t3.micro)<br />
              • React build served on Port 3000<br />
              • Custom VPC: <code className="bg-white/90 px-1 py-0.5 rounded border border-[#E8E0D5]">10.20.0.0/16</code><br />
              • Public Subnet: <code className="bg-white/90 px-1 py-0.5 rounded border border-[#E8E0D5]">10.20.1.0/24</code> (AZ A)
            </p>
          </div>

          {/* RDS Box */}
          <div className="p-3.5 rounded-2xl bg-[#F5F0E6] border border-[#E8E0D5] shadow-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#231F20]">
              <Database className="w-4 h-4 text-[#5B8A72]" />
              <span>Private MySQL RDS</span>
            </div>
            <p className="text-ios-gray-600 leading-relaxed text-[11px]">
              • 2 Subnets: <code className="bg-gray-100 px-1 rounded">10.20.11.0/24</code> & <code className="bg-gray-100 px-1 rounded">10.20.12.0/24</code><br />
              • Public Access: <span className="font-bold text-ios-red">NO</span> (Strict isolation)<br />
              • DB Security Group: Inbound 3306 permitted only from App SG source ID
            </p>
          </div>

          {/* S3 Box */}
          <div className="p-3.5 rounded-[16px] bg-white border border-gray-100 shadow-sm space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-ios-gray-900">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Private S3 & IAM Role</span>
            </div>
            <p className="text-ios-gray-600 leading-relaxed text-[11px]">
              • Block All Public Access: <span className="font-bold text-ios-green">ON</span><br />
              • SSE-S3 default encryption<br />
              • EC2 IAM Role: Least-privilege <code className="bg-gray-100 px-1 rounded">s3:GetObject</code> & <code className="bg-gray-100 px-1 rounded">s3:PutObject</code><br />
              • Zero long-term access keys committed
            </p>
          </div>
        </div>
      </Card>

      {/* Seeded Doctors Directory Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-ios-gray-900">
            Hospital Medical Staff Directory
          </h3>
          <span className="text-xs font-semibold text-ios-gray-400">
            {doctors.length} Doctors Seeded
          </span>
        </div>

        <div className="bg-white rounded-[20px] shadow-ios border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ios-gray-50 border-b border-gray-100 text-ios-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Doctor Name</th>
                  <th className="py-3 px-4">Department / Specialty</th>
                  <th className="py-3 px-4">Available Slots (IST)</th>
                  <th className="py-3 px-4">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {doctors.map((dr) => (
                  <tr key={dr.id} className="hover:bg-ios-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-ios-gray-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#FDF2F0] text-[#E06D53] border border-[#FAD8D2] flex items-center justify-center font-bold text-xs">
                        {dr.name[4] || 'D'}
                      </div>
                      <span>{dr.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-ios-gray-700">
                      {dr.specialization}
                    </td>
                    <td className="py-3.5 px-4 text-ios-gray-600">
                      <div className="flex flex-wrap gap-1">
                        {(dr.availableSlots || []).map((s) => (
                          <span
                            key={s}
                            className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ios-green bg-ios-green-tint px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
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
          <h3 className="text-lg font-bold text-ios-gray-900">
            Appointments Audit Log
          </h3>
          <span className="text-xs font-semibold text-ios-gray-400">
            Total {appointments.length} Consultations
          </span>
        </div>

        <div className="bg-white rounded-[20px] shadow-ios border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ios-gray-50 border-b border-gray-100 text-ios-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Appt ID</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Attending Doctor</th>
                  <th className="py-3 px-4">Date & Slot</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-ios-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-ios-gray-500">
                      #{appt.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-ios-gray-900">
                      {appt.patientName}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-ios-gray-700">
                      {appt.doctorName}
                    </td>
                    <td className="py-3.5 px-4 text-ios-gray-600">
                      <span className="font-medium text-ios-gray-900">{appt.visitDate}</span> at {appt.slot}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="py-3.5 px-4 text-ios-gray-500 max-w-xs truncate">
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
