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
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  FileText,
  Upload,
  Pill,
  Stethoscope,
  Check,
  Search,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

const DoctorDashboard = ({ view = 'queue' }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionError, setActionError] = useState('');

  // Prescription Modal State
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [activeApptForPrescription, setActiveApptForPrescription] = useState(null);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [medicines, setMedicines] = useState('');
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState('');
  const [prescriptionSuccess, setPrescriptionSuccess] = useState('');

  // Report Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeApptForUpload, setActiveApptForUpload] = useState(null);
  const [reportFileName, setReportFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [appts, prescs] = await Promise.all([
        cloudcareService.getAppointments(user),
        cloudcareService.getPrescriptions(user),
      ]);
      setAppointments(appts);
      setPrescriptions(prescs);
    } catch (err) {
      console.error('Failed to load doctor data', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    Promise.all([
      cloudcareService.getAppointments(user),
      cloudcareService.getPrescriptions(user),
    ])
      .then(([appts, prescs]) => {
        if (!active) return;
        setAppointments(appts);
        setPrescriptions(prescs);
      })
      .catch((err) => {
        if (active) console.error('Failed to load doctor data', err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  // Derived metrics
  const pendingCount = appointments.filter((a) => a.status === 'PENDING').length;
  const confirmedCount = appointments.filter((a) => a.status === 'CONFIRMED').length;
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;
  const totalCount = appointments.length;

  const activeQueueAppointments = appointments.filter(
    (a) => a.status === 'PENDING' || a.status === 'CONFIRMED'
  );

  const q = searchTerm.trim().toLowerCase();
  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus = filter === 'ALL' || a.status === filter;
    const matchesSearch =
      !q ||
      (a.patientName || '').toLowerCase().includes(q) ||
      (a.visitDate || '').includes(q);
    return matchesStatus && matchesSearch;
  });

  const filteredPrescriptions = prescriptions.filter(
    (p) =>
      !q ||
      (p.patientName || '').toLowerCase().includes(q) ||
      (p.notes || '').toLowerCase().includes(q) ||
      (p.medicines || '').toLowerCase().includes(q)
  );

  // Handle status update
  const handleStatusChange = async (appointmentId, newStatus) => {
    setActionError('');
    try {
      await cloudcareService.updateAppointmentStatus(appointmentId, newStatus);
      await loadData();
    } catch (err) {
      setActionError(err.message || 'Failed to update appointment status.');
    }
  };

  // Open Prescription Modal (pre-fills existing notes if already saved)
  const openPrescriptionModal = (appt) => {
    setActiveApptForPrescription(appt);
    setClinicalNotes(appt.prescriptionNotes || '');
    setMedicines(appt.prescriptionMedicines || '');
    setPrescriptionError('');
    setPrescriptionSuccess('');
    setIsPrescriptionModalOpen(true);
  };

  // Submit Prescription
  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    setPrescriptionError('');
    setPrescriptionLoading(true);
    try {
      await cloudcareService.addPrescription({
        appointmentId: activeApptForPrescription.id,
        patientId: activeApptForPrescription.patientId,
        notes: clinicalNotes.trim(),
        medicines: medicines.trim(),
        doctorName: user?.name,
      });

      if (activeApptForPrescription.status === 'CONFIRMED') {
        await cloudcareService.updateAppointmentStatus(activeApptForPrescription.id, 'COMPLETED');
      }

      setPrescriptionSuccess('Prescription and clinical notes recorded successfully.');
      setTimeout(() => {
        setIsPrescriptionModalOpen(false);
        loadData();
      }, 1000);
    } catch (err) {
      setPrescriptionError(err.message || 'Error saving prescription.');
    } finally {
      setPrescriptionLoading(false);
    }
  };

  // Open Upload Modal
  const openUploadModal = (appt) => {
    setActiveApptForUpload(appt);
    setReportFileName(
      `Diagnostic_Report_${(appt.patientName || 'Patient').replace(/\s+/g, '_')}.pdf`
    );
    setSelectedFile(null);
    setUploadError('');
    setUploadSuccess('');
    setIsUploadModalOpen(true);
  };

  // Submit Upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploadError('');

    if (!selectedFile) {
      setUploadError('Please select a synthetic PDF file to upload.');
      return;
    }

    setUploadLoading(true);
    try {
      await cloudcareService.uploadDocument({
        appointmentId: activeApptForUpload.id,
        patientId: activeApptForUpload.patientId,
        filename: reportFileName.trim() || selectedFile.name,
        file: selectedFile,
        doctorName: user?.name,
      });

      setUploadSuccess('Diagnostic report uploaded successfully.');
      setTimeout(() => {
        setIsUploadModalOpen(false);
        loadData();
      }, 1000);
    } catch (err) {
      setUploadError(err.message || 'Error uploading diagnostic document.');
    } finally {
      setUploadLoading(false);
    }
  };

  const renderAppointmentCard = (appt) => (
    <Card key={appt.id} padding="p-5" hoverable>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-full bg-[#F3F1ED] flex items-center justify-center text-[#18181B] shrink-0 border border-[#ECE9E2]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h4 className="text-base font-bold text-[#18181B]">
                {appt.patientName}
              </h4>
              <StatusBadge status={appt.status} />
              <span className="font-mono text-[11px] font-semibold text-[#9C968E]">
                #APPT-{appt.id}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#6E6A63] mt-1 font-mono">
              <span className="flex items-center gap-1 font-medium text-[#18181B]">
                <Calendar className="w-3.5 h-3.5 text-[#9C968E]" />
                {appt.visitDate}
              </span>
              <span className="flex items-center gap-1 font-medium text-[#18181B]">
                <Clock className="w-3.5 h-3.5 text-[#9C968E]" />
                {appt.slot} IST
              </span>
              <span className="text-[#9C968E]">Patient #{appt.patientId}</span>
            </div>

            {(appt.prescriptionNotes || appt.notes) && (
              <div className="mt-2 text-xs text-[#6E6A63] bg-[#F3F1ED] p-2.5 rounded-xl border border-[#ECE9E2] max-w-xl">
                <span className="font-semibold text-[#18181B]">Clinical Note: </span>
                {appt.prescriptionNotes || appt.notes}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#ECE9E2]">
          {appt.status === 'PENDING' && (
            <>
              <Button
                variant="primary"
                size="sm"
                icon={CheckCircle}
                onClick={() => handleStatusChange(appt.id, 'CONFIRMED')}
              >
                Confirm
              </Button>
              <Button
                variant="destructiveTint"
                size="sm"
                icon={XCircle}
                onClick={() => handleStatusChange(appt.id, 'CANCELLED')}
              >
                Cancel
              </Button>
            </>
          )}

          {appt.status === 'CONFIRMED' && (
            <>
              <Button
                variant="tint"
                size="sm"
                icon={Pill}
                onClick={() => openPrescriptionModal(appt)}
              >
                Add Prescription
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={Upload}
                onClick={() => openUploadModal(appt)}
              >
                Upload Report
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Check}
                onClick={() => handleStatusChange(appt.id, 'COMPLETED')}
              >
                Complete Visit
              </Button>
            </>
          )}

          {appt.status === 'COMPLETED' && (
            <>
              <Button
                variant="tint"
                size="sm"
                icon={FileText}
                onClick={() => openPrescriptionModal(appt)}
              >
                {appt.hasPrescription ? 'View / Edit Rx' : 'Add Rx'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={Upload}
                onClick={() => openUploadModal(appt)}
              >
                Upload Report
              </Button>
            </>
          )}
        </div>
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
      {actionError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* PATIENT QUEUE VIEW (/doctor) */}
      {view === 'queue' && (
        <>
          <div
            className="relative overflow-hidden rounded-[24px] bg-[#1C1917] text-white p-6 sm:p-8 border border-[rgba(255,255,255,0.08)]"
            style={{
              boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 24px 48px -12px rgba(28, 25, 23, 0.18)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C85A32] to-transparent opacity-60" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-mono tracking-wider uppercase mb-2 text-[#ECE9E2]">
                  <Stethoscope className="w-3.5 h-3.5 text-[#C85A32]" />
                  <span>Specialist Physician Workspace</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-white">
                  {user?.name || 'Attending Specialist'}
                </h1>
                <p className="text-[#9C968E] text-xs sm:text-sm mt-1 max-w-xl font-normal leading-relaxed">
                  Specialization:{' '}
                  <span className="font-semibold text-white">
                    {user?.specialization || 'Clinical Medicine'}
                  </span>{' '}
                  • Review pending approvals, confirm consultations, and document patient care.
                </p>
              </div>

              <div className="bg-white/10 px-4 py-2.5 rounded-xl text-center border border-white/10 shrink-0">
                <span className="font-mono text-[10px] font-semibold text-[#9C968E] uppercase tracking-wider block">
                  Active Queue
                </span>
                <span className="text-2xl font-extrabold text-white tracking-[-0.02em] tabular-nums">
                  {pendingCount + confirmedCount} Visits
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              title="Pending Approval"
              value={pendingCount}
              subtitle="Awaiting doctor review"
              icon={Clock}
            />
            <StatCard
              title="Confirmed"
              value={confirmedCount}
              subtitle="Scheduled visits"
              icon={CheckCircle}
            />
            <StatCard
              title="Completed"
              value={completedCount}
              subtitle="Discharged consultations"
              icon={Check}
            />
            <StatCard
              title="Total Assigned"
              value={totalCount}
              subtitle="All patient encounters"
              icon={Calendar}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-[#18181B]">
                  Active Patient Queue
                </h2>
                <p className="text-xs text-[#6E6A63]">
                  Pending approvals and confirmed consultations requiring clinical action
                </p>
              </div>
              <Link
                to="/doctor/appointments"
                className="text-xs font-semibold text-[#C85A32] hover:underline flex items-center gap-1"
              >
                Full Schedule ({appointments.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activeQueueAppointments.length === 0 ? (
              <EmptyState
                icon={CheckCircle}
                title="Active queue is clear"
                description="All pending and confirmed consultations have been completed."
              />
            ) : (
              <div className="space-y-3">
                {activeQueueAppointments.map(renderAppointmentCard)}
              </div>
            )}
          </div>
        </>
      )}

      {/* FULL CONSULTATIONS VIEW (/doctor/appointments) */}
      {view === 'appointments' && (
        <>
          <PageHeader
            title="Consultations & Schedule"
            subtitle={`Complete encounter schedule for ${user?.name || 'Attending Specialist'}`}
            badge={
              <span className="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F3F1ED] text-[#6E6A63] border border-[#ECE9E2]">
                {appointments.length} Encounters
              </span>
            }
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="w-full md:w-72">
              <Input
                icon={Search}
                placeholder="Search patient name or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <SegmentedControl
              options={[
                { label: 'All', value: 'ALL', badge: appointments.length },
                { label: 'Pending', value: 'PENDING', badge: pendingCount },
                { label: 'Confirmed', value: 'CONFIRMED', badge: confirmedCount },
                { label: 'Completed', value: 'COMPLETED', badge: completedCount },
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
              title="No consultations match filter"
              description="Try clearing the search query or choosing another status filter."
            />
          ) : (
            <div className="space-y-3">{filteredAppointments.map(renderAppointmentCard)}</div>
          )}
        </>
      )}

      {/* PRESCRIPTIONS & REPORTS VIEW (/doctor/reports) */}
      {view === 'reports' && (
        <>
          <PageHeader
            title="Prescriptions & Diagnostic Reports"
            subtitle="Review issued clinical notes, update medications, and upload encrypted diagnostic PDFs"
            badge={
              <span className="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F3F1ED] text-[#6E6A63] border border-[#ECE9E2]">
                {prescriptions.length} Prescriptions
              </span>
            }
          />

          <div className="w-full md:w-80">
            <Input
              icon={Search}
              placeholder="Search patient, clinical note, or medicine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Issued Prescriptions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#18181B]">Issued Prescriptions</h3>
                <span className="font-mono text-xs text-[#9C968E]">
                  {filteredPrescriptions.length} Records
                </span>
              </div>

              {filteredPrescriptions.length === 0 ? (
                <Card>
                  <EmptyState
                    icon={Pill}
                    title="No prescriptions recorded yet"
                    description="Add prescriptions during confirmed consultations to document patient care."
                  />
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredPrescriptions.map((p) => (
                    <Card key={p.id} padding="p-4 sm:p-5" className="border-l-2 border-l-[#C85A32]">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-sm font-bold text-[#18181B]">
                            {p.patientName || `Patient #${p.patientId}`}
                          </span>
                          <span className="font-mono text-[11px] text-[#9C968E] ml-2">
                            #APPT-{p.appointmentId}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-[#9C968E]">
                          {p.visitDate || p.createdAt}
                        </span>
                      </div>
                      <p className="text-xs text-[#6E6A63] leading-relaxed mb-3">{p.notes}</p>
                      {p.medicines && (
                        <div className="p-2.5 rounded-xl bg-[#F3F1ED] border border-[#ECE9E2] text-xs text-[#18181B] font-medium">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-[#6E6A63] block mb-0.5">
                            Medications
                          </span>
                          {p.medicines}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Eligible Encounters for Report Upload */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#18181B]">Upload Diagnostic Lab Reports</h3>
                <span className="font-mono text-xs text-[#9C968E]">PDF (Max 5 MiB)</span>
              </div>

              {appointments.filter((a) => a.status === 'CONFIRMED' || a.status === 'COMPLETED')
                .length === 0 ? (
                <Card>
                  <EmptyState
                    icon={Upload}
                    title="No confirmed encounters available"
                    description="Confirm a patient consultation before uploading diagnostic lab reports."
                  />
                </Card>
              ) : (
                <div className="space-y-3">
                  {appointments
                    .filter((a) => a.status === 'CONFIRMED' || a.status === 'COMPLETED')
                    .map((appt) => (
                      <Card key={appt.id} padding="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-[#18181B]">
                                {appt.patientName}
                              </h4>
                              <StatusBadge status={appt.status} />
                            </div>
                            <p className="font-mono text-[11px] text-[#6E6A63] mt-1">
                              #APPT-{appt.id} • {appt.visitDate} at {appt.slot}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="tint"
                              size="sm"
                              icon={Pill}
                              onClick={() => openPrescriptionModal(appt)}
                            >
                              Rx
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              icon={Upload}
                              onClick={() => openUploadModal(appt)}
                            >
                              Upload PDF
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Prescription Modal */}
      <Modal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        title="Clinical Notes & Prescription"
        subtitle={`Patient: ${activeApptForPrescription?.patientName} (Appointment #${activeApptForPrescription?.id})`}
      >
        {prescriptionSuccess ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#10B981] flex items-center justify-center mx-auto mb-3">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-[#18181B]">{prescriptionSuccess}</h4>
          </div>
        ) : (
          <form onSubmit={handlePrescriptionSubmit} noValidate className="space-y-4">
            {prescriptionError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{prescriptionError}</span>
              </div>
            )}

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#6E6A63] mb-1.5 ml-0.5">
                Clinical Diagnosis / Notes <span className="text-[#C85A32]">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Resting ECG normal. Recommended low-sodium diet."
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="w-full rounded-xl bg-[#F3F1ED] border border-[#ECE9E2] text-sm p-3.5 text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C85A32]/20 focus:border-[#C85A32] transition-all"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#6E6A63] mb-1.5 ml-0.5">
                Medications & Dosages (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Tab Amlodipine 5mg - 1 tab daily morning after breakfast (30 days)"
                value={medicines}
                onChange={(e) => setMedicines(e.target.value)}
                className="w-full rounded-xl bg-[#F3F1ED] border border-[#ECE9E2] text-sm p-3.5 text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C85A32]/20 focus:border-[#C85A32] transition-all"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsPrescriptionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={prescriptionLoading}
                disabled={!clinicalNotes.trim()}
              >
                Save Prescription
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Diagnostic Report Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Diagnostic Report"
        subtitle={`Patient: ${activeApptForUpload?.patientName} • Encrypted Clinical Archive`}
      >
        {uploadSuccess ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#10B981] flex items-center justify-center mx-auto mb-3">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-[#18181B]">{uploadSuccess}</h4>
          </div>
        ) : (
          <form onSubmit={handleUploadSubmit} noValidate className="space-y-4">
            {uploadError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <Input
              label="Document Name"
              placeholder="e.g. Electrocardiogram_Report.pdf"
              value={reportFileName}
              onChange={(e) => setReportFileName(e.target.value)}
              required
            />

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#6E6A63] mb-1.5 ml-0.5">
                Synthetic PDF File <span className="text-[#C85A32]">*</span>
              </label>
              <div className="border-2 border-dashed border-[#DCD7CE] rounded-2xl p-6 text-center hover:bg-[#F3F1ED]/60 transition-colors">
                <FileText className="w-8 h-8 text-[#C85A32] mx-auto mb-2" />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="text-xs text-[#6E6A63] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#FBF4EE] file:text-[#C85A32] hover:file:bg-[#F3DEC7] cursor-pointer"
                />
                <p className="text-[11px] text-[#6E6A63] mt-2">
                  Synthetic test PDF only (max 5 MiB). Encrypted medical document storage.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsUploadModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Upload}
                loading={uploadLoading}
              >
                Upload Document
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default DoctorDashboard;
