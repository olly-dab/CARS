import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Phone, Mail, CreditCard, MapPin, Building2, Calendar, AlertCircle } from "lucide-react";

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const savedCustomers = JSON.parse(localStorage.getItem("cars_customers")) || [];
    const found = savedCustomers.find((item) => String(item.id) === String(id));
    setCustomer(found);
  }, [id]);

  if (!customer) {
    return (
      <DashboardLayout>
        <Card className="max-w-md mx-auto text-center p-8">
          <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <CardTitle>Customer Not Found</CardTitle>
          <CardDescription className="mt-1 mb-4">The customer profile does not exist.</CardDescription>
          <Button onClick={() => navigate("/customers")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Customers</span>
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{customer.fullName}</h1>
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground font-mono mt-0.5">ID: {customer.id}</p>
          </div>
          <Button variant="ghost" onClick={() => navigate("/customers")} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Customers</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-3 border-b">
              <User className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-sm">
              <div>
                <span className="text-xs text-muted-foreground block font-medium">Full Name</span>
                <p className="font-semibold text-foreground">{customer.fullName}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">Phone</span>
                  <p className="font-semibold text-foreground">{customer.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">Email</span>
                  <p className="font-semibold text-foreground">{customer.email || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">ID Number</span>
                  <p className="font-semibold text-foreground font-mono text-xs">{customer.idNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">Address</span>
                  <p className="font-semibold text-foreground">{customer.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-3 border-b">
                <Building2 className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Affiliation & Purpose</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">Organization</span>
                  <p className="font-semibold text-foreground">{customer.organization || "Independent"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">Purpose</span>
                  <p className="font-semibold text-foreground capitalize">{customer.purpose || "General"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">Emergency Contact</span>
                  <p className="font-semibold text-foreground">{customer.emergencyContact || "None"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-3 border-b">
                <Calendar className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">System Metadata</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm">
                <span className="text-xs text-muted-foreground block font-medium">Registered Date</span>
                <p className="font-semibold text-foreground">
                  {customer.registeredDate ? new Date(customer.registeredDate).toLocaleString() : "Recently"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}