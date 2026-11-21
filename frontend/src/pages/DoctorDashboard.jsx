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
import EmptyState from '../components/common/EmptyState';
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
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('ALL');

  // Prescription Modal State
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [activeApptForPrescription, setActiveApptForPrescription] = useState(null);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [medicines, setMedicines] = useState('');
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [prescriptionSuccess, setPrescriptionSuccess] = useState('');

  // Report Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeApptForUpload, setActiveApptForUpload] = useState(null);
  const [reportFileName, setReportFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  const loadAppointments = useCallback(async () => {
    try {
      const data = await cloudcareService.getAppointments(user);
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load doctor appointments', err);
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        const data = await cloudcareService.getAppointments(user);
        if (active) setAppointments(data);
      } catch (err) {
        console.error('Failed to load doctor appointments', err);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [user]);

  // Derived metrics
  const pendingCount = appointments.filter((a) => a.status === 'PENDING').length;
  const confirmedCount = appointments.filter((a) => a.status === 'CONFIRMED').length;
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;
  const totalCount = appointments.length;

  const filteredAppointments = appointments.filter((a) => {
    if (filter === 'ALL') return true;
    return a.status === filter;
  });

  // Handle status update
  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await cloudcareService.updateAppointmentStatus(appointmentId, newStatus);
      await loadAppointments();
    } catch (err) {
      alert('Failed to update appointment status: ' + err.message);
    }
  };

  // Open Prescription Modal
  const openPrescriptionModal = (appt) => {
    setActiveApptForPrescription(appt);
    setClinicalNotes('');
    setMedicines('');
    setPrescriptionSuccess('');
    setIsPrescriptionModalOpen(true);
  };

  // Submit Prescription
  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    setPrescriptionLoading(true);
    try {
      await cloudcareService.addPrescription({
        appointmentId: activeApptForPrescription.id,
        patientId: activeApptForPrescription.patientId,
        notes: clinicalNotes,
        medicines: medicines,
        doctorName: user?.name,
      });

      // Optionally transition appointment to COMPLETED if confirmed
      if (activeApptForPrescription.status === 'CONFIRMED') {
        await cloudcareService.updateAppointmentStatus(activeApptForPrescription.id, 'COMPLETED');
      }

      setPrescriptionSuccess('Prescription and clinical notes recorded successfully.');
      setTimeout(() => {
        setIsPrescriptionModalOpen(false);
        loadAppointments();
      }, 1200);
    } catch (err) {
      alert('Error adding prescription: ' + err.message);
    } finally {
      setPrescriptionLoading(false);
    }
  };

  // Open Upload Modal
  const openUploadModal = (appt) => {
    setActiveApptForUpload(appt);
    setReportFileName(`Diagnostic_Report_${appt.patientName.replace(/\s+/g, '_')}.pdf`);
    setSelectedFile(null);
    setUploadSuccess('');
    setIsUploadModalOpen(true);
  };

  // Submit Upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
    try {
      await cloudcareService.uploadDocument({
        appointmentId: activeApptForUpload.id,
        patientId: activeApptForUpload.patientId,
        filename: reportFileName,
        file: selectedFile,
        doctorName: user?.name,
      });

      setUploadSuccess('Report uploaded to private S3 bucket successfully.');
      setTimeout(() => {
        setIsUploadModalOpen(false);
      }, 1200);
    } catch (err) {
      alert('Error uploading document: ' + err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-6 sm:p-8 shadow-ios-md">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-2">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Attending Physician Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {user?.name || 'Dr. Aakash Sharma'}
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
              Specialization:{' '}
              <span className="font-semibold text-white">
                {user?.specialization || 'Cardiology & Internal Medicine'}
              </span>{' '}
              • Review your scheduled patient consultations and provide clinical diagnosis.
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-[18px] text-center border border-white/20 shrink-0">
            <span className="text-[11px] font-semibold text-emerald-100 uppercase tracking-wider block">
              Today's Queue
            </span>
            <span className="text-2xl font-black">{pendingCount + confirmedCount} Visits</span>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Pending Approval"
          value={pendingCount}
          subtitle="Awaiting doctor review"
          icon={Clock}
          tint="orange"
        />
        <StatCard
          title="Confirmed"
          value={confirmedCount}
          subtitle="Scheduled visits"
          icon={CheckCircle}
          tint="blue"
        />
        <StatCard
          title="Completed"
          value={completedCount}
          subtitle="Discharged consultations"
          icon={Check}
          tint="green"
        />
        <StatCard
          title="Total Assigned"
          value={totalCount}
          subtitle="All patient encounters"
          icon={Calendar}
          tint="purple"
        />
      </div>

      {/* Patient Appointments Queue */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ios-gray-900">
              Clinical Appointment Queue
            </h2>
            <p className="text-xs text-ios-gray-500">
              Review patient symptoms, accept slots, write prescriptions, and upload diagnostic PDFs
            </p>
          </div>

          <SegmentedControl
            options={[
              { label: 'All', value: 'ALL', badge: appointments.length },
              { label: 'Pending', value: 'PENDING', badge: pendingCount },
              { label: 'Confirmed', value: 'CONFIRMED', badge: confirmedCount },
              { label: 'Completed', value: 'COMPLETED', badge: completedCount },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </div>

        {filteredAppointments.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No appointments in this view"
            description="Patients who select you as their specialist will appear here."
          />
        ) : (
          <div className="space-y-3">
            {filteredAppointments.map((appt) => (
              <Card key={appt.id} padding="p-5" hoverable>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Patient Info */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-ios-gray-100 flex items-center justify-center text-ios-gray-700 shrink-0 border border-gray-200">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-base font-bold text-ios-gray-900">
                          {appt.patientName}
                        </h4>
                        <StatusBadge status={appt.status} />
                        <span className="text-[11px] font-semibold text-ios-gray-400">
                          #APPT-{appt.id}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-ios-gray-500 mt-1">
                        <span className="flex items-center gap-1 font-medium text-ios-gray-700">
                          <Calendar className="w-3.5 h-3.5 text-ios-gray-400" />
                          {appt.visitDate}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-ios-gray-700">
                          <Clock className="w-3.5 h-3.5 text-ios-gray-400" />
                          {appt.slot} IST
                        </span>
                        <span>Patient ID: #{appt.patientId}</span>
                      </div>

                      {appt.notes && (
                        <div className="mt-2 text-xs text-ios-gray-700 bg-ios-gray-50 p-2 rounded-[10px] border border-gray-100 max-w-xl">
                          <span className="font-semibold text-ios-gray-900">Chief Complaint: </span>
                          {appt.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions according to Phase 1/2 API contract */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
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
                          Upload S3 PDF
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
                          View / Edit Rx
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Upload}
                          onClick={() => openUploadModal(appt)}
                        >
                          Add Additional PDF
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Prescription Modal */}
      <Modal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        title="Clinical Notes & Prescription"
        subtitle={`Patient: ${activeApptForPrescription?.patientName} (Appointment #${activeApptForPrescription?.id})`}
      >
        {prescriptionSuccess ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-ios-green-tint text-ios-green flex items-center justify-center mx-auto mb-3">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-ios-gray-900">{prescriptionSuccess}</h4>
          </div>
        ) : (
          <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ios-gray-600 mb-1.5 ml-1">
                Clinical Diagnosis / Clinical Notes <span className="text-ios-red">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Patient presents with Stage 1 hypertension. Normal heart sounds. Advised low salt diet."
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="w-full rounded-[14px] bg-ios-gray-50/80 border border-ios-gray-200/90 text-sm p-3 focus:bg-white focus:outline-none focus:ring-4 focus:ring-ios-blue/15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ios-gray-600 mb-1.5 ml-1">
                Medications & Dosages (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Tab Amlodipine 5mg - 1 tab daily morning after breakfast (30 days)"
                value={medicines}
                onChange={(e) => setMedicines(e.target.value)}
                className="w-full rounded-[14px] bg-ios-gray-50/80 border border-ios-gray-200/90 text-sm p-3 focus:bg-white focus:outline-none focus:ring-4 focus:ring-ios-blue/15"
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

      {/* S3 Report Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Diagnostic Report to S3"
        subtitle={`Patient: ${activeApptForUpload?.patientName} • Private bucket storage`}
      >
        {uploadSuccess ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-ios-green-tint text-ios-green flex items-center justify-center mx-auto mb-3">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-ios-gray-900">{uploadSuccess}</h4>
          </div>
        ) : (
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <Input
              label="Document Name"
              placeholder="e.g. Electrocardiogram_Report.pdf"
              value={reportFileName}
              onChange={(e) => setReportFileName(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ios-gray-600 mb-1.5 ml-1">
                Synthetic PDF File
              </label>
              <div className="border-2 border-dashed border-ios-gray-300 rounded-[16px] p-6 text-center hover:bg-ios-gray-50 transition-colors">
                <FileText className="w-8 h-8 text-ios-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="text-xs text-ios-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-ios-blue-tint file:text-ios-blue hover:file:bg-blue-100 cursor-pointer"
                />
                <p className="text-[11px] text-ios-gray-400 mt-2">
                  Synthetic test PDF only (max 5 MiB). Stored in private S3 bucket via EC2 IAM role.
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
