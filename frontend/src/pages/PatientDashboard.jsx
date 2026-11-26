import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import { cloudcareService } from '../services/cloudcareService';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import SegmentedControl from '../components/common/SegmentedControl';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';
import {
  Calendar,
  Clock,
  PlusCircle,
  FileText,
  Download,
  Stethoscope,
  Pill,
  Sparkles,
  CheckCircle2,
  CalendarCheck,
  Search,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

const getTodayDateString = () => {
  try {
    return new Date().toISOString().split('T')[0];
  } catch {
    return '2026-11-26';
  }
};

const PatientDashboard = ({ view = 'overview' }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadError, setDownloadError] = useState('');

  // Booking Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [slot, setSlot] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [appts, docs, prescs, drs] = await Promise.all([
        cloudcareService.getAppointments(user),
        cloudcareService.getDocuments(user),
        cloudcareService.getPrescriptions(user),
        cloudcareService.getDoctors(),
      ]);
      setAppointments(appts);
      setDocuments(docs);
      setPrescriptions(prescs);
      setDoctors(drs);
      setSelectedDoctorId((prev) => prev || (drs.length > 0 ? drs[0].id.toString() : ''));
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    Promise.all([
      cloudcareService.getAppointments(user),
      cloudcareService.getDocuments(user),
      cloudcareService.getPrescriptions(user),
      cloudcareService.getDoctors(),
    ])
      .then(([appts, docs, prescs, drs]) => {
        if (!active) return;
        setAppointments(appts);
        setDocuments(docs);
        setPrescriptions(prescs);
        setDoctors(drs);
        setSelectedDoctorId((prev) => prev || (drs.length > 0 ? drs[0].id.toString() : ''));
      })
      .catch((err) => {
        if (active) console.error('Failed to load dashboard data', err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  const openBookModal = (doctorIdOverride = null) => {
    setBookingError('');
    setBookingSuccess('');
    if (doctorIdOverride) {
      setSelectedDoctorId(String(doctorIdOverride));
    } else if (!selectedDoctorId && doctors.length > 0) {
      setSelectedDoctorId(String(doctors[0].id));
    }
    setSlot('');
    setIsBookModalOpen(true);
  };

  // Derived metrics
  const upcomingCount = appointments.filter(
    (a) => a.status === 'CONFIRMED' || a.status === 'PENDING'
  ).length;
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;
  const documentsCount = documents.length;

  // Next upcoming appointment
  const nextAppointment = appointments
    .filter((a) => a.status === 'CONFIRMED' || a.status === 'PENDING')
    .sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate))[0];

  // Filtered appointments for Appointments view
  const filteredAppointments = appointments.filter((a) => {
    const matchesFilter = filter === 'ALL' || a.status === filter;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (a.doctorName || '').toLowerCase().includes(q) ||
      (a.specialization || '').toLowerCase().includes(q) ||
      (a.visitDate || '').includes(q);
    return matchesFilter && matchesSearch;
  });

  // Filtered records for Health Records view
  const q = searchTerm.trim().toLowerCase();
  const filteredPrescriptions = prescriptions.filter(
    (p) =>
      !q ||
      (p.doctorName || '').toLowerCase().includes(q) ||
      (p.notes || '').toLowerCase().includes(q) ||
      (p.medicines || '').toLowerCase().includes(q)
  );
  const filteredDocuments = documents.filter(
    (d) =>
      !q ||
      (d.filename || '').toLowerCase().includes(q) ||
      (d.uploadedBy || '').toLowerCase().includes(q)
  );

  // Handle booking
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');

    if (!selectedDoctorId || !visitDate || !slot) {
      setBookingError('Please select a specialist, date, and time slot.');
      return;
    }

    setBookingLoading(true);
    try {
      await cloudcareService.bookAppointment({
        doctorId: selectedDoctorId,
        visitDate,
        slot,
        notes: bookingNotes,
        user,
      });

      setBookingSuccess('Appointment booked successfully!');
      setTimeout(() => {
        setIsBookModalOpen(false);
        setBookingSuccess('');
        setVisitDate('');
        setSlot('');
        setBookingNotes('');
        loadData();
      }, 1000);
    } catch (err) {
      setBookingError(err.message || 'Could not complete booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDownload = async (docId, filename) => {
    setDownloadError('');
    setDownloadingId(docId);
    try {
      await cloudcareService.downloadDocument(docId, filename);
    } catch (err) {
      setDownloadError(err.message || 'Failed to download diagnostic report.');
    } finally {
      setDownloadingId(null);
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === Number(selectedDoctorId));

  const renderAppointmentCard = (appt) => (
    <Card key={appt.id} padding="p-4 sm:p-5" hoverable>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F3F1ED] flex items-center justify-center text-[#1C1917] shrink-0 border border-[#ECE9E2]">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-[#18181B]">
                {appt.doctorName}
              </h4>
              <StatusBadge status={appt.status} />
            </div>
            {appt.specialization && (
              <p className="text-xs text-[#6E6A63] mt-0.5">{appt.specialization}</p>
            )}
            <div className="flex items-center gap-3 text-xs text-[#6E6A63] mt-1.5 font-mono">
              <span className="flex items-center gap-1 font-medium text-[#18181B]">
                <Calendar className="w-3.5 h-3.5 text-[#9C968E]" />
                {appt.visitDate}
              </span>
              <span className="flex items-center gap-1 font-medium text-[#18181B]">
                <Clock className="w-3.5 h-3.5 text-[#9C968E]" />
                {appt.slot} IST
              </span>
            </div>
            {(appt.prescriptionNotes || appt.notes) && (
              <p className="text-xs text-[#6E6A63] mt-2 line-clamp-2 bg-[#F9F8F6] px-2.5 py-1.5 rounded-lg border border-[#ECE9E2]">
                {appt.prescriptionNotes || appt.notes}
              </p>
            )}
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="font-mono text-[11px] font-semibold text-[#9C968E]">
            #APPT-{appt.id}
          </span>
        </div>
      </div>
    </Card>
  );

  const renderPrescriptionCard = (p) => (
    <Card key={p.id} padding="p-4 sm:p-5" className="border-l-2 border-l-[#C85A32]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-bold text-[#C85A32] block">
            {p.doctorName || 'Attending Physician'}
          </span>
          {p.specialization && (
            <span className="text-[11px] text-[#9C968E]">{p.specialization}</span>
          )}
        </div>
        <span className="font-mono text-[11px] text-[#9C968E] font-medium">
          {p.visitDate || p.createdAt}
        </span>
      </div>
      <p className="text-xs text-[#18181B] font-medium leading-relaxed mb-3">
        {p.notes}
      </p>
      {p.medicines && (
        <div className="p-3 rounded-xl bg-[#F3F1ED] border border-[#ECE9E2] text-xs text-[#6E6A63]">
          <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#18181B] block mb-1">
            Prescribed Medications
          </span>
          <span className="text-[#18181B] font-medium">{p.medicines}</span>
        </div>
      )}
    </Card>
  );

  const renderDocumentCard = (doc) => (
    <Card key={doc.id} padding="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#FBF4EE] border border-[#F3DEC7] text-[#C85A32] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-[#18181B] truncate">
              {doc.filename}
            </h4>
            <p className="text-[11px] text-[#6E6A63] mt-0.5">
              {doc.uploadedAt ? `${doc.uploadedAt} • ` : ''}Uploaded by {doc.uploadedBy || 'Attending Doctor'}
            </p>
          </div>
        </div>

        <Button
          variant="tint"
          size="sm"
          icon={Download}
          loading={downloadingId === doc.id}
          onClick={() => handleDownload(doc.id, doc.filename)}
          className="shrink-0"
        >
          Download
        </Button>
      </div>
    </Card>
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
      {/* OVERVIEW VIEW (/patient) */}
      {view === 'overview' && (
        <>
          {/* Welcome Banner */}
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
                  <Sparkles className="w-3.5 h-3.5 text-[#C85A32]" />
                  <span>Patient Clinical Portal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-white">
                  Hello, {user?.name || 'Patient'}
                </h1>
                <p className="text-[#9C968E] text-xs sm:text-sm mt-1 max-w-xl font-normal leading-relaxed">
                  Manage clinical consultations, view attending specialist schedules, and securely download diagnostic records.
                </p>
              </div>

              <Button
                variant="secondary"
                icon={PlusCircle}
                size="md"
                onClick={() => openBookModal()}
                className="self-start md:self-center font-bold"
              >
                Book Appointment
              </Button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/patient/appointments" className="block">
              <StatCard
                title="Active Bookings"
                value={upcomingCount}
                subtitle="Pending and confirmed visits"
                icon={Calendar}
                onClick={() => {}}
              />
            </Link>
            <Link to="/patient/appointments" className="block">
              <StatCard
                title="Completed Visits"
                value={completedCount}
                subtitle="Past doctor consultations"
                icon={CalendarCheck}
                onClick={() => {}}
              />
            </Link>
            <Link to="/patient/records" className="block">
              <StatCard
                title="Diagnostic Reports"
                value={documentsCount}
                subtitle="Encrypted medical PDFs"
                icon={FileText}
                onClick={() => {}}
              />
            </Link>
          </div>

          {/* Next Appointment Spotlight Card */}
          {nextAppointment && (
            <Card className="bg-white border border-[rgba(28,25,23,0.08)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#1C1917] text-white flex items-center justify-center shrink-0 shadow-sm border border-[#C85A32]/30">
                    <Stethoscope className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#C85A32] font-semibold">
                      Next Scheduled Visit
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#18181B] mt-0.5 tracking-[-0.02em]">
                      {nextAppointment.doctorName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#6E6A63]">
                      <span className="flex items-center gap-1 font-medium text-[#18181B]">
                        <Calendar className="w-3.5 h-3.5 text-[#9C968E]" />
                        {nextAppointment.visitDate}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-[#18181B]">
                        <Clock className="w-3.5 h-3.5 text-[#9C968E]" />
                        {nextAppointment.slot} IST
                      </span>
                      <StatusBadge status={nextAppointment.status} />
                    </div>
                  </div>
                </div>

                <Link to="/patient/appointments">
                  <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                    Manage Schedule
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Overview Quick Previews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#18181B]">Recent Appointments</h2>
                <Link
                  to="/patient/appointments"
                  className="text-xs font-semibold text-[#C85A32] hover:underline flex items-center gap-1"
                >
                  View All ({appointments.length}) <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              {appointments.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No appointments yet"
                  description="Schedule a visit with one of our hospital specialists."
                  actionLabel="Book Appointment"
                  onAction={() => openBookModal()}
                />
              ) : (
                <div className="space-y-3">
                  {appointments.slice(0, 3).map(renderAppointmentCard)}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#18181B]">Latest Health Records</h2>
                <Link
                  to="/patient/records"
                  className="text-xs font-semibold text-[#C85A32] hover:underline flex items-center gap-1"
                >
                  Open Archive <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              {downloadError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{downloadError}</span>
                </div>
              )}
              {documents.length === 0 && prescriptions.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No clinical records yet"
                  description="Prescriptions and diagnostic PDF reports will appear here after your consultations."
                />
              ) : (
                <div className="space-y-3">
                  {documents.slice(0, 2).map(renderDocumentCard)}
                  {prescriptions.slice(0, 2).map(renderPrescriptionCard)}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* APPOINTMENTS VIEW (/patient/appointments) */}
      {view === 'appointments' && (
        <>
          <PageHeader
            title="Appointments & Scheduling"
            subtitle="Track consultation status updates or book a new specialist visit"
            badge={
              <span className="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F3F1ED] text-[#6E6A63] border border-[#ECE9E2]">
                {appointments.length} Total
              </span>
            }
            actions={
              <Button variant="primary" icon={PlusCircle} size="md" onClick={() => openBookModal()}>
                Book Appointment
              </Button>
            }
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="w-full md:w-72">
              <Input
                icon={Search}
                placeholder="Search doctor, specialty, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <SegmentedControl
              options={[
                { label: 'All', value: 'ALL', badge: appointments.length },
                {
                  label: 'Confirmed',
                  value: 'CONFIRMED',
                  badge: appointments.filter((a) => a.status === 'CONFIRMED').length,
                },
                {
                  label: 'Pending',
                  value: 'PENDING',
                  badge: appointments.filter((a) => a.status === 'PENDING').length,
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
              value={filter}
              onChange={setFilter}
            />
          </div>

          {filteredAppointments.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No matching appointments"
              description="Adjust your filter or book a consultation with one of our specialists."
              actionLabel="Book Appointment"
              onAction={() => openBookModal()}
            />
          ) : (
            <div className="space-y-3">{filteredAppointments.map(renderAppointmentCard)}</div>
          )}

          {/* Available Specialists Quick Book Section */}
          <div className="pt-4 space-y-3">
            <div>
              <h3 className="text-lg font-bold text-[#18181B]">Hospital Medical Specialists</h3>
              <p className="text-xs text-[#6E6A63]">
                Select any specialist below to directly schedule an available slot
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((dr) => (
                <Card key={dr.id} padding="p-5" className="flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1C1917] text-white flex items-center justify-center shrink-0">
                        <Stethoscope className="w-5 h-5 text-[#C85A32]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#18181B]">{dr.name}</h4>
                        <p className="text-xs text-[#6E6A63]">{dr.specialization}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(dr.availableSlots || ['09:00', '10:00', '11:00', '14:00', '16:00']).map((s) => (
                        <span
                          key={s}
                          className="font-mono text-[10px] bg-[#F3F1ED] text-[#18181B] border border-[#ECE9E2] px-2 py-0.5 rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    icon={Calendar}
                    onClick={() => openBookModal(dr.id)}
                  >
                    Book Consultation
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* HEALTH RECORDS VIEW (/patient/records) */}
      {view === 'records' && (
        <>
          <PageHeader
            title="Health Records & Prescriptions"
            subtitle="View physician prescriptions and securely download encrypted diagnostic PDFs"
            badge={
              <span className="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F3F1ED] text-[#6E6A63] border border-[#ECE9E2]">
                {prescriptions.length + documents.length} Records
              </span>
            }
          />

          <div className="w-full md:w-80">
            <Input
              icon={Search}
              placeholder="Search medicines, diagnosis, or report PDF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {downloadError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{downloadError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Prescriptions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#18181B]">Doctor Prescriptions</h3>
                <span className="font-mono text-xs font-semibold text-[#9C968E]">
                  {filteredPrescriptions.length} Records
                </span>
              </div>

              {filteredPrescriptions.length === 0 ? (
                <Card>
                  <EmptyState
                    icon={Pill}
                    title="No prescriptions found"
                    description="Prescriptions added by your attending physician after consultations will appear here."
                  />
                </Card>
              ) : (
                <div className="space-y-3">{filteredPrescriptions.map(renderPrescriptionCard)}</div>
              )}
            </div>

            {/* Diagnostic Reports */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#18181B]">Diagnostic Reports</h3>
                <span className="font-mono text-xs font-semibold text-[#9C968E]">
                  {filteredDocuments.length} Encrypted PDFs
                </span>
              </div>

              {filteredDocuments.length === 0 ? (
                <Card>
                  <EmptyState
                    icon={FileText}
                    title="No reports found"
                    description="Clinical lab reports and diagnostic PDFs uploaded by your doctor will appear here."
                  />
                </Card>
              ) : (
                <div className="space-y-3">{filteredDocuments.map(renderDocumentCard)}</div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Book Appointment Modal (Shared across views) */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Book Specialist Consultation"
        subtitle="Select a doctor, preferred date, and time slot"
      >
        {bookingSuccess ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#10B981] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-[#18181B]">{bookingSuccess}</h4>
            <p className="text-xs text-[#6E6A63] mt-1">
              Your consultation is awaiting doctor confirmation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBookSubmit} noValidate className="space-y-4">
            {bookingError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{bookingError}</span>
              </div>
            )}

            <Select
              label="Consulting Doctor & Specialization"
              value={selectedDoctorId}
              onChange={(e) => {
                setSelectedDoctorId(e.target.value);
                setSlot('');
              }}
              required
            >
              {doctors.map((dr) => (
                <option key={dr.id} value={dr.id}>
                  {dr.name} — {dr.specialization}
                </option>
              ))}
            </Select>

            <Input
              label="Visit Date"
              type="date"
              min={getTodayDateString()}
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              required
            />

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#6E6A63] mb-1.5 ml-0.5">
                Available Time Slots (IST) <span className="text-[#C85A32]">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(selectedDoctor?.availableSlots || ['09:00', '10:00', '11:00', '14:00', '16:00']).map(
                  (s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSlot(s)}
                      className={`
                        py-2 text-xs font-bold rounded-xl transition-all btn-press border font-mono
                        ${
                          slot === s
                            ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                            : 'bg-[#F3F1ED] text-[#18181B] border-[#ECE9E2] hover:bg-[#ECE9E2]'
                        }
                      `}
                    >
                      {s}
                    </button>
                  )
                )}
              </div>
            </div>

            <Input
              label="Consultation Symptoms / Reason (Optional)"
              placeholder="e.g. Routine checkup, follow-up"
              value={bookingNotes}
              onChange={(e) => setBookingNotes(e.target.value)}
            />

            <div className="pt-2 flex justify-end gap-2.5">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsBookModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={bookingLoading}
                disabled={!visitDate || !slot}
              >
                Confirm Booking
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default PatientDashboard;
