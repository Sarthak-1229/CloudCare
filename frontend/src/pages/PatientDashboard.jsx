import React, { useState, useEffect, useCallback } from 'react';
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
} from 'lucide-react';

const getTodayDateString = () => {
  try {
    return new Date().toISOString().split('T')[0];
  } catch {
    return '2026-11-21';
  }
};

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState('ALL');

  // Booking Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [slot, setSlot] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  // Fetch initial data
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
      if (drs.length > 0) setSelectedDoctorId(drs[0].id.toString());
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        const [appts, docs, prescs, drs] = await Promise.all([
          cloudcareService.getAppointments(user),
          cloudcareService.getDocuments(user),
          cloudcareService.getPrescriptions(user),
          cloudcareService.getDoctors(),
        ]);
        if (active) {
          setAppointments(appts);
          setDocuments(docs);
          setPrescriptions(prescs);
          setDoctors(drs);
          if (drs.length > 0) setSelectedDoctorId(drs[0].id.toString());
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [user]);

  // Derived metrics
  const upcomingCount = appointments.filter(
    (a) => a.status === 'CONFIRMED' || a.status === 'PENDING'
  ).length;
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;
  const documentsCount = documents.length;

  // Next upcoming confirmed appointment
  const nextAppointment = appointments
    .filter((a) => a.status === 'CONFIRMED' || a.status === 'PENDING')
    .sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate))[0];

  // Filtered appointments list
  const filteredAppointments = appointments.filter((a) => {
    if (filter === 'ALL') return true;
    return a.status === filter;
  });

  // Handle new appointment booking
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');
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
      }, 1200);
    } catch (err) {
      setBookingError(err.message || 'Could not complete booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDownload = async (docId, filename) => {
    try {
      await cloudcareService.downloadDocument(docId, filename);
    } catch (err) {
      alert('Failed to download document: ' + err.message);
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === Number(selectedDoctorId));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-ios-blue via-blue-600 to-indigo-600 text-white p-6 sm:p-8 shadow-ios-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Patient Health Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {user?.name || 'Rahul Sharma'}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
              Manage your clinical consultations, view assigned specialist schedules, and securely download diagnostic records from AWS S3.
            </p>
          </div>

          <Button
            variant="secondary"
            icon={PlusCircle}
            size="md"
            onClick={() => setIsBookModalOpen(true)}
            className="self-start md:self-center bg-white text-ios-blue hover:bg-blue-50 shadow-sm"
          >
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Bookings"
          value={upcomingCount}
          subtitle="Pending and confirmed visits"
          icon={Calendar}
          tint="blue"
        />
        <StatCard
          title="Consultations"
          value={completedCount}
          subtitle="Past doctor consultations"
          icon={CalendarCheck}
          tint="green"
        />
        <StatCard
          title="S3 Documents"
          value={documentsCount}
          subtitle="Encrypted medical PDFs"
          icon={FileText}
          tint="purple"
        />
      </div>

      {/* Next Appointment Spotlight Card */}
      {nextAppointment && (
        <Card className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 border-blue-100/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[16px] bg-ios-blue text-white flex items-center justify-center shrink-0 shadow-sm">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-ios-blue">
                  Next Scheduled Visit
                </span>
                <h3 className="text-lg font-bold text-ios-gray-900 mt-0.5">
                  {nextAppointment.doctorName}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-ios-gray-600">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-ios-gray-400" />
                    {nextAppointment.visitDate}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-ios-gray-400" />
                    {nextAppointment.slot} IST
                  </span>
                  <StatusBadge status={nextAppointment.status} />
                </div>
              </div>
            </div>

            <div className="text-xs text-ios-gray-500 max-w-xs italic sm:text-right">
              "{nextAppointment.notes || 'Routine health review'}"
            </div>
          </div>
        </Card>
      )}

      {/* Appointments List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ios-gray-900">
              My Appointments
            </h2>
            <p className="text-xs text-ios-gray-500">
              Track status updates directly from your attending doctors
            </p>
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
            ]}
            value={filter}
            onChange={setFilter}
          />
        </div>

        {filteredAppointments.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No appointments in this category"
            description="Book your next consultation with one of our specialized doctors."
            actionLabel="Book Appointment"
            onAction={() => setIsBookModalOpen(true)}
          />
        ) : (
          <div className="space-y-3">
            {filteredAppointments.map((appt) => (
              <Card key={appt.id} padding="p-4 sm:p-5" hoverable>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-ios-gray-100 flex items-center justify-center text-ios-blue shrink-0">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-ios-gray-900">
                          {appt.doctorName}
                        </h4>
                        <StatusBadge status={appt.status} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-ios-gray-500 mt-1">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {appt.visitDate}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {appt.slot} IST
                        </span>
                      </div>
                      {appt.notes && (
                        <p className="text-xs text-ios-gray-600 mt-1.5 line-clamp-1">
                          Note: {appt.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-semibold text-ios-gray-400">
                      ID #{appt.id}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Medical Records & Prescriptions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Prescriptions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-ios-gray-900">
              Doctor Prescriptions
            </h3>
            <span className="text-xs font-semibold text-ios-gray-400">
              {prescriptions.length} Records
            </span>
          </div>

          {prescriptions.length === 0 ? (
            <Card>
              <EmptyState
                icon={Pill}
                title="No prescriptions yet"
                description="Prescriptions added by your attending physician after consultations will show here."
              />
            </Card>
          ) : (
            <div className="space-y-3">
              {prescriptions.map((p) => (
                <Card key={p.id} padding="p-4" className="border-l-4 border-l-ios-blue">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-ios-blue">
                      {p.doctorName || 'Attending Physician'}
                    </span>
                    <span className="text-[11px] text-ios-gray-400 font-medium">
                      {p.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-ios-gray-800 font-medium leading-relaxed mb-2">
                    {p.notes}
                  </p>
                  {p.medicines && (
                    <div className="p-2.5 rounded-[12px] bg-ios-gray-50 border border-gray-100 text-xs text-ios-gray-700">
                      <span className="font-bold text-ios-gray-900 block mb-0.5">
                        Medications:
                      </span>
                      {p.medicines}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Private S3 Documents */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-ios-gray-900">
              S3 Diagnostic Reports
            </h3>
            <span className="text-xs font-semibold text-ios-gray-400">
              Private Bucket
            </span>
          </div>

          {documents.length === 0 ? (
            <Card>
              <EmptyState
                icon={FileText}
                title="No reports available"
                description="Clinical lab reports and diagnostic PDFs uploaded by doctors will appear here."
              />
            </Card>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <Card key={doc.id} padding="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-[12px] bg-red-50 text-ios-red flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-ios-gray-900 truncate">
                          {doc.filename}
                        </h4>
                        <p className="text-[11px] text-ios-gray-500">
                          {doc.size || '1.2 MB'} • Uploaded by {doc.uploadedBy || 'Doctor'}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="tint"
                      size="sm"
                      icon={Download}
                      onClick={() => handleDownload(doc.id, doc.filename)}
                      className="shrink-0"
                    >
                      Download
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Book Specialist Consultation"
        subtitle="Select a doctor, preferred date, and time slot"
      >
        {bookingSuccess ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-ios-green-tint text-ios-green flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-ios-gray-900">{bookingSuccess}</h4>
            <p className="text-xs text-ios-gray-500 mt-1">
              Your consultation is awaiting doctor confirmation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBookSubmit} className="space-y-4">
            {bookingError && (
              <div className="p-3 rounded-[12px] bg-ios-red-tint text-ios-red text-xs font-semibold">
                {bookingError}
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-ios-gray-600 mb-1.5 ml-1">
                Available Time Slots (IST) <span className="text-ios-red">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(selectedDoctor?.availableSlots || ['09:00', '10:00', '11:00', '14:00', '16:00']).map(
                  (s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSlot(s)}
                      className={`
                        py-2 text-xs font-bold rounded-[12px] transition-all ios-press-action border
                        ${
                          slot === s
                            ? 'bg-ios-blue text-white border-ios-blue shadow-sm'
                            : 'bg-ios-gray-50 text-ios-gray-700 border-gray-200 hover:bg-gray-100'
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
              placeholder="e.g. Mild chest discomfort, routine checkup"
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
