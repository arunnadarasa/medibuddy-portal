import { InfoCard } from "@/components/InfoCard";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface Profile {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  nhs_number: string;
  address: string;
}

interface GPSurgery {
  name: string;
  address: string;
  phone: string;
}

interface Pharmacy {
  name: string;
  address: string;
  phone: string;
  opening_hours: string;
}

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  status: string;
}

interface RefillRequest {
  id: string;
  prescription_id: string;
  status: "pending" | "approved" | "denied";
  request_date: string;
}

const Index = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [gpSurgery, setGPSurgery] = useState<GPSurgery | null>(null);
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [refillRequests, setRefillRequests] = useState<
    Record<string, RefillRequest>
  >({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          console.error("No user logged in");
          return;
        }

        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileData) setProfile(profileData);

        // For demo purposes, fetch first GP surgery and pharmacy
        const { data: gpData } = await supabase
          .from("gp_surgeries")
          .select("*")
          .limit(1)
          .single();

        if (gpData) setGPSurgery(gpData);

        const { data: pharmacyData } = await supabase
          .from("pharmacies")
          .select("*")
          .limit(1)
          .single();

        if (pharmacyData) setPharmacy(pharmacyData);

        // Fetch prescriptions
        const { data: prescriptionsData } = await supabase
          .from("prescriptions")
          .select("*")
          .eq("patient_id", user.id);

        if (prescriptionsData) setPrescriptions(prescriptionsData);

        // Fetch refill requests
        const { data: refillRequestsData } = await supabase
          .from("refill_requests")
          .select("*")
          .eq("patient_id", user.id);

        if (refillRequestsData) {
          const refillRequestsMap = refillRequestsData.reduce(
            (acc, request) => ({
              ...acc,
              [request.prescription_id]: request,
            }),
            {}
          );
          setRefillRequests(refillRequestsMap);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again",
      });
    }
  };

  const handleRefillRequest = async (prescriptionId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to request a refill",
        });
        return;
      }

      const { data, error } = await supabase
        .from("refill_requests")
        .insert({
          prescription_id: prescriptionId,
          patient_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setRefillRequests((prev) => ({
          ...prev,
          [prescriptionId]: data,
        }));

        toast({
          title: "Refill Requested",
          description: "Your prescription refill request has been submitted.",
        });
      }
    } catch (error) {
      console.error("Error requesting refill:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to request refill. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">
            Medical Dashboard
          </h1>
          {profile && (
            <p className="text-gray-600">
              Welcome back, {profile.first_name} {profile.last_name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile && (
            <InfoCard
              title="Patient Details"
              subtitle="Personal Information"
              content={
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {profile.first_name} {profile.last_name}
                  </p>
                  <p>
                    <span className="font-medium">DOB:</span>{" "}
                    {profile.date_of_birth}
                  </p>
                  <p>
                    <span className="font-medium">NHS Number:</span>{" "}
                    {profile.nhs_number}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {profile.address}
                  </p>
                </div>
              }
            />
          )}

          {gpSurgery && (
            <InfoCard
              title="GP Surgery"
              subtitle="Healthcare Provider"
              content={
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Practice:</span>{" "}
                    {gpSurgery.name}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {gpSurgery.address}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {gpSurgery.phone}
                  </p>
                </div>
              }
            />
          )}

          {pharmacy && (
            <InfoCard
              title="Pharmacy"
              subtitle="Local Pharmacy"
              content={
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span> {pharmacy.name}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {pharmacy.address}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {pharmacy.phone}
                  </p>
                  <p>
                    <span className="font-medium">Hours:</span>{" "}
                    {pharmacy.opening_hours}
                  </p>
                </div>
              }
            />
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Current Prescriptions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prescriptions.map((prescription, index) => (
              <InfoCard
                key={index}
                title={prescription.medication}
                subtitle="Active Prescription"
                content={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Dosage:</span>{" "}
                        {prescription.dosage}
                      </p>
                      <p>
                        <span className="font-medium">Frequency:</span>{" "}
                        {prescription.frequency}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        {prescription.status}
                      </p>
                    </div>
                    {prescription.status === "active" && (
                      <div>
                        {refillRequests[prescription.id] ? (
                          <div className="mt-2 text-sm">
                            <p className="font-medium text-gray-700">
                              Refill Request Status:
                              <span
                                className={`ml-1 ${
                                  refillRequests[prescription.id].status ===
                                  "pending"
                                    ? "text-yellow-600"
                                    : refillRequests[prescription.id].status ===
                                      "approved"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {refillRequests[prescription.id].status}
                              </span>
                            </p>
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleRefillRequest(prescription.id)}
                            className="w-full"
                          >
                            Request Refill
                          </Button>
                        )}
                      </div>
                    )}
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
