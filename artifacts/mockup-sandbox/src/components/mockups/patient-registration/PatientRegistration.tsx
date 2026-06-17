import React, { useState } from "react";
import {
  Search, Plus, Save, RotateCcw,
  User, Building2, MapPin, Briefcase, FileText, UploadCloud, Stethoscope, AlertCircle, ChevronDown, Building, ShieldAlert, FileSearch, CheckCircle2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import "./_group.css";

function FormGroup({ label, required, children, error, hint }: { label: string, required?: boolean, children: React.ReactNode, error?: string, hint?: string }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label className={`text-xs font-semibold ${error ? 'text-destructive' : 'text-slate-700'}`}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <span className="text-[10px] text-destructive flex items-center mt-1"><AlertCircle className="w-3 h-3 mr-1 inline"/>{error}</span>}
      {hint && !error && <span className="text-[10px] text-slate-500">{hint}</span>}
    </div>
  );
}

export function PatientRegistration() {
  const [searchOpen, setSearchOpen] = useState(true);
  const [additionalOpen, setAdditionalOpen] = useState(true);

  return (
    <div className="patient-registration-theme min-h-screen bg-background text-foreground flex flex-col pb-24 font-sans selection:bg-primary/20">
      {/* Top App Bar */}
      <header className="h-12 bg-primary text-primary-foreground flex items-center px-4 shadow-sm z-10 sticky top-0">
        <div className="flex items-center space-x-2">
          <Stethoscope className="w-5 h-5" />
          <h1 className="font-bold text-sm tracking-wide">METROPOLITAN GENERAL HOSPITAL</h1>
          <div className="h-4 w-px bg-primary-foreground/30 mx-2"></div>
          <h2 className="font-medium text-sm text-primary-foreground/90">Patient Registration</h2>
        </div>
        <div className="ml-auto flex items-center space-x-4 text-xs font-medium">
          <div className="flex items-center space-x-1.5 bg-primary-foreground/10 px-2 py-1 rounded">
            <User className="w-3.5 h-3.5" />
            <span>Sarah Jenkins (Registrar)</span>
          </div>
          <span>Terminal: REG-04</span>
        </div>
      </header>

      {/* Sticky Action Bar */}
      <div className="bg-card border-b border-border shadow-sm px-6 py-3 flex items-center justify-between sticky top-12 z-10">
        <div className="flex items-center space-x-6">
          <RadioGroup defaultValue="existing" className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <RadioGroupItem value="new" id="new" className="text-primary border-slate-300" />
              <Label htmlFor="new" className="cursor-pointer text-sm font-medium">New Patient</Label>
            </div>
            <div className="flex items-center space-x-1.5">
              <RadioGroupItem value="existing" id="existing" className="text-primary border-slate-300" />
              <Label htmlFor="existing" className="cursor-pointer text-sm font-medium">Existing Patient</Label>
            </div>
            <div className="flex items-center space-x-1.5">
              <RadioGroupItem value="staff" id="staff" className="text-primary border-slate-300" />
              <Label htmlFor="staff" className="cursor-pointer text-sm font-medium">Staff</Label>
            </div>
            <div className="flex items-center space-x-1.5">
              <RadioGroupItem value="newborn" id="newborn" className="text-primary border-slate-300" />
              <Label htmlFor="newborn" className="cursor-pointer text-sm font-medium">Newborn</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8 border-slate-300 hover:bg-slate-100 text-slate-700">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset
          </Button>
          <Button variant="secondary" size="sm" className="h-8 bg-secondary text-secondary-foreground hover:bg-secondary/80" onClick={() => setSearchOpen(true)}>
            <Search className="w-3.5 h-3.5 mr-1.5" /> Search Patient
          </Button>
          <Button size="sm" className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-sm">
            <Save className="w-3.5 h-3.5 mr-1.5" /> Save Registration
          </Button>
        </div>
      </div>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Top Info Banner (Integration Ready) */}
        <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg p-3 px-4">
          <div className="flex items-center space-x-3 text-sm text-blue-800">
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
            <span>Editing existing patient record. Last updated: 2 days ago.</span>
          </div>
          <div className="flex items-center space-x-2">
            <Label className="text-xs font-semibold text-blue-800">Linked Appointment Ref:</Label>
            <Input defaultValue="APT-20231024-001" className="h-7 w-40 text-xs border-blue-200 bg-white" />
          </div>
        </div>

        {/* Personal Details */}
        <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3 px-5">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm uppercase tracking-wider text-slate-800 font-bold">Personal Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-5">
            <FormGroup label="Prefix" required>
              <Select defaultValue="Mr.">
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr.">Mr.</SelectItem>
                  <SelectItem value="Mrs.">Mrs.</SelectItem>
                  <SelectItem value="Ms.">Ms.</SelectItem>
                  <SelectItem value="Dr.">Dr.</SelectItem>
                  <SelectItem value="Master">Master</SelectItem>
                  <SelectItem value="Baby">Baby</SelectItem>
                </SelectContent>
              </Select>
            </FormGroup>

            <FormGroup label="First Name" required>
              <Input defaultValue="Ahmed" className="h-8 text-sm font-medium" />
            </FormGroup>

            <FormGroup label="Middle Name">
              <Input defaultValue="Hassan" className="h-8 text-sm" />
            </FormGroup>

            <FormGroup label="Last Name" required>
              <Input defaultValue="Al-Rashid" className="h-8 text-sm font-medium" />
            </FormGroup>

            <FormGroup label="Family Name">
              <Input defaultValue="Al-Rashid" className="h-8 text-sm" />
            </FormGroup>

            <FormGroup label="Gender" required>
              <Select defaultValue="Male">
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormGroup>

            <FormGroup label="Date of Birth" required>
              <Input type="date" defaultValue="1985-03-12" className="h-8 text-sm" />
            </FormGroup>

            <div className="col-span-2 md:col-span-2 lg:col-span-2">
              <Label className="text-xs font-semibold text-slate-700 block mb-1.5">Age (Auto-calculated)</Label>
              <div className="flex space-x-2">
                <div className="flex items-center border rounded-md px-2 bg-slate-50 h-8 flex-1">
                  <Input defaultValue="38" className="h-6 w-full border-0 bg-transparent text-right text-sm p-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-medium text-slate-900" readOnly />
                  <span className="text-xs text-slate-500 ml-1">Y</span>
                </div>
                <div className="flex items-center border rounded-md px-2 bg-slate-50 h-8 flex-1">
                  <Input defaultValue="7" className="h-6 w-full border-0 bg-transparent text-right text-sm p-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-medium text-slate-900" readOnly />
                  <span className="text-xs text-slate-500 ml-1">M</span>
                </div>
                <div className="flex items-center border rounded-md px-2 bg-slate-50 h-8 flex-1">
                  <Input defaultValue="12" className="h-6 w-full border-0 bg-transparent text-right text-sm p-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-medium text-slate-900" readOnly />
                  <span className="text-xs text-slate-500 ml-1">D</span>
                </div>
              </div>
            </div>

            <FormGroup label="Blood Group">
              <Select defaultValue="O+">
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                </SelectContent>
              </Select>
            </FormGroup>

            <FormGroup label="Mobile Number" required error="Mobile number must be exactly 10 digits">
              <div className="flex space-x-1 border rounded-md border-destructive overflow-hidden focus-within:ring-1 focus-within:ring-destructive">
                <Select defaultValue="+965">
                  <SelectTrigger className="h-8 text-xs border-0 w-[80px] bg-slate-50 rounded-none focus:ring-0 focus:ring-offset-0"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+965">+965 (KW)</SelectItem>
                    <SelectItem value="+91">+91 (IN)</SelectItem>
                    <SelectItem value="+1">+1 (US)</SelectItem>
                  </SelectContent>
                </Select>
                <Input defaultValue="987654321" className="h-8 text-sm border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-1" />
              </div>
            </FormGroup>

            <FormGroup label="Email ID" hint="Used for portal access">
              <Input defaultValue="ahmed.alrashid@example.com" type="email" className="h-8 text-sm" />
            </FormGroup>

            <FormGroup label="Marital Status">
              <Select defaultValue="Married">
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                  <SelectItem value="Widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </FormGroup>

            <FormGroup label="National ID / Civil ID" required>
              <Input defaultValue="284-12345678" className="h-8 text-sm font-medium" />
            </FormGroup>
          </CardContent>

          {/* Additional Details Collapsible */}
          <Collapsible open={additionalOpen} onOpenChange={setAdditionalOpen} className="border-t border-slate-100">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 px-5 bg-slate-50/30 hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-2">
                <FileSearch className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">Additional Details</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${additionalOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-5 pt-2 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-5 bg-slate-50/10">
              <FormGroup label="Nationality">
                <Select defaultValue="Kuwaiti">
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kuwaiti">Kuwaiti</SelectItem>
                    <SelectItem value="Indian">Indian</SelectItem>
                    <SelectItem value="Egyptian">Egyptian</SelectItem>
                    <SelectItem value="Filipino">Filipino</SelectItem>
                    <SelectItem value="British">British</SelectItem>
                    <SelectItem value="American">American</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>
              
              <FormGroup label="Religion">
                <Select defaultValue="Islam">
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Islam">Islam</SelectItem>
                    <SelectItem value="Christianity">Christianity</SelectItem>
                    <SelectItem value="Hinduism">Hinduism</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              <FormGroup label="Race/Ethnicity">
                <Select defaultValue="Arab">
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arab">Arab</SelectItem>
                    <SelectItem value="Asian">Asian</SelectItem>
                    <SelectItem value="Caucasian">Caucasian</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              <FormGroup label="Preferred Language">
                <Select defaultValue="Arabic">
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arabic">Arabic</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Tagalog">Tagalog</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              <FormGroup label="Warning/Alerts">
                <div className="relative">
                  <ShieldAlert className="w-4 h-4 absolute left-2.5 top-2 text-amber-500" />
                  <Input defaultValue="Allergic to Penicillin" className="h-8 text-sm pl-9 border-amber-200 bg-amber-50 focus-visible:ring-amber-500 font-medium text-amber-900" />
                </div>
              </FormGroup>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Residential Address */}
        <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3 px-5">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm uppercase tracking-wider text-slate-800 font-bold">Residential Address</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-5">
            <div className="md:col-span-12 lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormGroup label="Country Code">
                <Select defaultValue="965">
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="965">+965</SelectItem>
                    <SelectItem value="91">+91</SelectItem>
                    <SelectItem value="1">+1</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>
              <FormGroup label="STD Code">
                <Input defaultValue="02" className="h-8 text-sm" />
              </FormGroup>
              <FormGroup label="Phone Number">
                <Input defaultValue="24567890" className="h-8 text-sm" />
              </FormGroup>
              <div className="sm:col-span-3">
                <FormGroup label="Full Address">
                  <Textarea defaultValue="Block 4, Street 12, Building 45, Apartment 12" className="min-h-[72px] text-sm resize-none" />
                </FormGroup>
              </div>
            </div>

            <div className="md:col-span-12 lg:col-span-7 bg-slate-50/50 p-4 rounded-md border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 items-start">
              <FormGroup label="Country">
                <Select defaultValue="Kuwait">
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kuwait">Kuwait</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>
              
              <div className="flex items-center pt-6 justify-center text-slate-300 hidden sm:flex">
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </div>

              <FormGroup label="State / Governorate">
                <Select defaultValue="Hawalli">
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hawalli">Hawalli</SelectItem>
                    <SelectItem value="Capital">Capital</SelectItem>
                    <SelectItem value="Ahmadi">Ahmadi</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              <div className="flex items-center pt-6 justify-center text-slate-300 hidden sm:flex">
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </div>

              <FormGroup label="City">
                <Select defaultValue="Salmiya">
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salmiya">Salmiya</SelectItem>
                    <SelectItem value="Jabriya">Jabriya</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              <div className="flex items-center pt-6 justify-center text-slate-300 hidden sm:flex">
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </div>

              <FormGroup label="Area">
                <Select defaultValue="Block 4">
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Block 1">Block 1</SelectItem>
                    <SelectItem value="Block 4">Block 4</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              <div className="sm:col-span-1">
                 {/* Empty grid space for alignment */}
              </div>

              <div className="col-span-2 sm:col-span-4 mt-2">
                <FormGroup label="Pincode / Zipcode">
                  <Input defaultValue="32005" className="h-8 text-sm w-1/3" />
                </FormGroup>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Office / Professional Details */}
          <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3 px-5">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm uppercase tracking-wider text-slate-800 font-bold">Professional Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-2 gap-x-6 gap-y-5">
              <FormGroup label="Occupation">
                <Select defaultValue="Employed">
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Employed">Employed</SelectItem>
                    <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                    <SelectItem value="Unemployed">Unemployed</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              <FormGroup label="Income Category">
                <Select defaultValue="Middle">
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Middle">Middle</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </FormGroup>

              <div className="col-span-2">
                <FormGroup label="Company">
                  <Select defaultValue="KOC">
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KOC">Kuwait Oil Company (KOC)</SelectItem>
                      <SelectItem value="KPC">Kuwait Petroleum Corp</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormGroup>
              </div>

              <div className="col-span-2">
                <FormGroup label="Company Name (If Other)">
                  <Input disabled className="h-8 text-sm bg-slate-50" placeholder="Auto-filled from selection" />
                </FormGroup>
              </div>

              <div className="col-span-2">
                <FormGroup label="Profession">
                  <Select defaultValue="Engineer">
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineer">Engineer</SelectItem>
                      <SelectItem value="Doctor">Doctor</SelectItem>
                      <SelectItem value="Teacher">Teacher</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormGroup>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Insurance / Sponsor Placeholder */}
            <Card className="border-dashed border-2 border-slate-300 shadow-none bg-slate-50/50 rounded-lg h-[180px] flex flex-col items-center justify-center text-center p-6">
              <Building className="w-10 h-10 text-slate-300 mb-3" />
              <h3 className="text-sm font-bold text-slate-700 mb-1">Insurance / Sponsor Details</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Sponsor integration module is loading or pending configuration. Policy details will appear here once connected.
              </p>
              <Button variant="outline" size="sm" className="mt-4 h-8 bg-white" disabled>Configure Integration</Button>
            </Card>

            {/* Document Upload Placeholder */}
            <Card className="border-dashed border-2 border-primary/30 shadow-none bg-primary/5 rounded-lg h-[150px] flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:bg-primary/10 transition-colors">
              <UploadCloud className="w-8 h-8 text-primary mb-2" />
              <h3 className="text-sm font-bold text-slate-800 mb-1">Upload Patient Documents</h3>
              <p className="text-xs text-slate-500">
                Drag and drop files here or click to browse. Supported: ID copies, old records (PDF, JPG).
              </p>
            </Card>
          </div>
        </div>

      </main>

      {/* Patient Search Modal */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden gap-0 rounded-xl patient-registration-theme font-sans">
          <DialogHeader className="p-5 border-b border-border bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Search className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-lg text-slate-800">Global Patient Search</DialogTitle>
                  <DialogDescription className="text-sm text-slate-500 mt-0.5">Search enterprise records across all facilities</DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-5 border-b border-border bg-white">
            <div className="grid grid-cols-5 gap-4 items-end">
              <FormGroup label="MR Number">
                <Input placeholder="Enter MRN..." className="h-9 text-sm" />
              </FormGroup>
              <FormGroup label="First Name">
                <Input placeholder="e.g. Ahmed" className="h-9 text-sm" />
              </FormGroup>
              <FormGroup label="Last Name">
                <Input placeholder="e.g. Rashid" className="h-9 text-sm" />
              </FormGroup>
              <FormGroup label="Mobile Number">
                <Input placeholder="Search mobile..." className="h-9 text-sm" />
              </FormGroup>
              <FormGroup label="Civil ID / National ID">
                <div className="flex space-x-2">
                  <Input placeholder="Search ID..." className="h-9 text-sm flex-1" />
                  <Button className="h-9 px-4 bg-primary text-primary-foreground">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </FormGroup>
            </div>
          </div>

          <div className="bg-slate-50 p-5 pt-0">
            <div className="mt-5 border rounded-lg overflow-hidden bg-white shadow-sm">
              <Table>
                <TableHeader className="bg-slate-100/80">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold text-slate-700">MR Number</TableHead>
                    <TableHead className="font-semibold text-slate-700">Patient Name</TableHead>
                    <TableHead className="font-semibold text-slate-700">Gender</TableHead>
                    <TableHead className="font-semibold text-slate-700">DOB</TableHead>
                    <TableHead className="font-semibold text-slate-700">Mobile</TableHead>
                    <TableHead className="font-semibold text-slate-700">Civil ID</TableHead>
                    <TableHead className="text-right font-semibold text-slate-700">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-primary">MRN1001</TableCell>
                    <TableCell className="font-medium text-slate-900">Ahmed Al-Rashid</TableCell>
                    <TableCell>Male</TableCell>
                    <TableCell>1985-03-12</TableCell>
                    <TableCell>9876543210</TableCell>
                    <TableCell>284-12345678</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="secondary" className="h-7 text-xs bg-primary/10 text-primary hover:bg-primary/20" onClick={() => setSearchOpen(false)}>
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-primary">MRN1002</TableCell>
                    <TableCell className="font-medium text-slate-900">Fatima Hassan</TableCell>
                    <TableCell>Female</TableCell>
                    <TableCell>1992-07-25</TableCell>
                    <TableCell>9123456780</TableCell>
                    <TableCell>285-23456789</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="secondary" className="h-7 text-xs bg-primary/10 text-primary hover:bg-primary/20" onClick={() => setSearchOpen(false)}>
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-primary">MRN1003</TableCell>
                    <TableCell className="font-medium text-slate-900">John Mathew</TableCell>
                    <TableCell>Male</TableCell>
                    <TableCell>1978-11-02</TableCell>
                    <TableCell>9988776655</TableCell>
                    <TableCell>286-34567890</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="secondary" className="h-7 text-xs bg-primary/10 text-primary hover:bg-primary/20" onClick={() => setSearchOpen(false)}>
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-primary">MRN1004</TableCell>
                    <TableCell className="font-medium text-slate-900">Priya Nair</TableCell>
                    <TableCell>Female</TableCell>
                    <TableCell>2001-01-18</TableCell>
                    <TableCell>9012345678</TableCell>
                    <TableCell>287-45678901</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="secondary" className="h-7 text-xs bg-primary/10 text-primary hover:bg-primary/20" onClick={() => setSearchOpen(false)}>
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-primary">MRN1005</TableCell>
                    <TableCell className="font-medium text-slate-900">Baby Of Sara Khan</TableCell>
                    <TableCell>Female</TableCell>
                    <TableCell>2026-05-30</TableCell>
                    <TableCell>9090909090</TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="secondary" className="h-7 text-xs bg-primary/10 text-primary hover:bg-primary/20" onClick={() => setSearchOpen(false)}>
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between items-center mt-4 text-xs text-slate-500">
              <span>Showing 5 of 24 results</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="h-7 text-xs disabled:opacity-50">Previous</Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">Next</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
