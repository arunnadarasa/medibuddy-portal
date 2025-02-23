
import { InfoCard } from "@/components/InfoCard";

// Fake data (normally this would come from your backend)
const patientData = {
  name: "Sarah Johnson",
  dateOfBirth: "15/03/1985",
  nhsNumber: "123 456 7890",
  address: "42 Cherry Lane, London, SW1A 1AA",
};

const gpSurgeryData = {
  name: "Riverside Medical Practice",
  address: "15 River Road, London, SW1A 2BB",
  phone: "020 7123 4567",
  registeredGP: "Dr. Michael Smith",
};

const pharmacyData = {
  name: "HealthCare Pharmacy",
  address: "22 High Street, London, SW1A 3CC",
  phone: "020 7234 5678",
  openingHours: "Mon-Fri: 9am-6pm, Sat: 9am-1pm",
};

const prescriptionData = [
  {
    medication: "Amoxicillin",
    dosage: "500mg",
    frequency: "Three times daily",
    status: "Active",
  },
  {
    medication: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    status: "Active",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">
            Medical Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {patientData.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoCard
            title="Patient Details"
            subtitle="Personal Information"
            content={
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {patientData.name}</p>
                <p><span className="font-medium">DOB:</span> {patientData.dateOfBirth}</p>
                <p><span className="font-medium">NHS Number:</span> {patientData.nhsNumber}</p>
                <p><span className="font-medium">Address:</span> {patientData.address}</p>
              </div>
            }
          />

          <InfoCard
            title="GP Surgery"
            subtitle="Healthcare Provider"
            content={
              <div className="space-y-2">
                <p><span className="font-medium">Practice:</span> {gpSurgeryData.name}</p>
                <p><span className="font-medium">Address:</span> {gpSurgeryData.address}</p>
                <p><span className="font-medium">Phone:</span> {gpSurgeryData.phone}</p>
                <p><span className="font-medium">GP:</span> {gpSurgeryData.registeredGP}</p>
              </div>
            }
          />

          <InfoCard
            title="Pharmacy"
            subtitle="Local Pharmacy"
            content={
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {pharmacyData.name}</p>
                <p><span className="font-medium">Address:</span> {pharmacyData.address}</p>
                <p><span className="font-medium">Phone:</span> {pharmacyData.phone}</p>
                <p><span className="font-medium">Hours:</span> {pharmacyData.openingHours}</p>
              </div>
            }
          />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Current Prescriptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prescriptionData.map((prescription, index) => (
              <InfoCard
                key={index}
                title={prescription.medication}
                subtitle="Active Prescription"
                content={
                  <div className="space-y-2">
                    <p><span className="font-medium">Dosage:</span> {prescription.dosage}</p>
                    <p><span className="font-medium">Frequency:</span> {prescription.frequency}</p>
                    <p><span className="font-medium">Status:</span> {prescription.status}</p>
                  </div>
                }
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
