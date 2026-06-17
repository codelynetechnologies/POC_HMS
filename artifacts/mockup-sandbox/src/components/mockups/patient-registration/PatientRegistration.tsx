import React, { useState, useEffect } from "react";
import {
  Search, Save, RotateCcw, User, MapPin, Briefcase, UploadCloud, Stethoscope,
  AlertCircle, ChevronDown, Building, ShieldAlert, FileSearch, Clock,
  Activity, ChevronRight
} from "lucide-react";
import { Toaster, toast } from "sonner";

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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import "./_group.css";

function FormGroup({ label, required, children, error, hint }: { label: string, required?: boolean, children: React.ReactNode, error?: string, hint?: string }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label className={`text-[11px] font-semibold uppercase tracking-wide ${error ? 'text-destructive' : 'text-slate-600'}`}>
        {label} {required && <><span className="text-destructive" aria-hidden>*</span><span className="sr-only">(required)</span></>}
      </Label>
      {children}
      {error && <span className="text-[10px] text-destructive flex items-center mt-0.5"><AlertCircle className="w-3 h-3 mr-1 inline shrink-0" />{error}</span>}
      {hint && !error && <span className="text-[10px] text-slate-400">{hint}</span>}
    </div>
  );
}

function SectionHeader({ index, icon: Icon, title, description, right }: { index: string, icon: React.ElementType, title: string, description?: string, right?: React.ReactNode }) {
  return (
    <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 py-3.5 px-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary shrink-0">
            <Icon className="w-[18px] h-[18px]" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-[13px] uppercase tracking-wider text-slate-800 font-bold leading-tight flex items-center gap-2">
              <span className="text-primary/40 font-mono text-xs">{index}</span>
              <span className="truncate">{title}</span>
            </CardTitle>
            {description && <p className="text-[11px] text-slate-400 mt-0.5 truncate">{description}</p>}
          </div>
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </CardHeader>
  );
}

const SEED_PATIENTS = [
  { mrn: "MRN1001", name: "Ahmed Al-Rashid", gender: "Male", dob: "1985-03-12", mobile: "9876543210", civilId: "284-12345678" },
  { mrn: "MRN1002", name: "Fatima Hassan", gender: "Female", dob: "1992-07-25", mobile: "9123456780", civilId: "285-23456789" },
  { mrn: "MRN1003", name: "John Mathew", gender: "Male", dob: "1978-11-02", mobile: "9988776655", civilId: "286-34567890" },
  { mrn: "MRN1004", name: "Priya Nair", gender: "Female", dob: "2001-01-18", mobile: "9012345678", civilId: "287-45678901" },
  { mrn: "MRN1005", name: "Baby Of Sara Khan", gender: "Female", dob: "2026-05-30", mobile: "9090909090", civilId: "Pending" },
];

const PATIENT_TYPE_LABELS: Record<string, string> = {
  new: "New Patient", existing: "Existing Patient", staff: "Staff", newborn: "Newborn",
};

function initials(name: string) {
  const parts = name.replace(/^Baby Of\s+/i, "").split(" ").filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

export function PatientRegistration() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [additionalOpen, setAdditionalOpen] = useState(true);
  const [patientType, setPatientType] = useState("existing");
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 850);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    setSearchLoading(true);
    const t = setTimeout(() => setSearchLoading(false), 900);
    return () => clearTimeout(t);
  }, [searchOpen]);

  const handleSave = () => {
    if (saving) return;
    setSaving(true);
    toast.loading("Validating and saving registration...", { id: "save" });
    setTimeout(() => {
      setSaving(false);
      toast.success("Patient registration saved", {
        id: "save",
        description: "Record MRN1001 updated successfully at " + new Date().toLocaleTimeString(),
      });
    }, 1500);
  };

  const handleReset = () => {
    toast.info("Form reset", { description: "All unsaved changes have been cleared." });
  };

  const handleSelectPatient = (name: string, mrn: string) => {
    setSearchOpen(false);
    toast.success("Patient record loaded", { description: `${name} (${mrn}) is ready for editing.` });
  };

  const runSearch = () => {
    setSearchLoading(true);
    setTimeout(() => {
      setSearchLoading(false);
      toast.info("Search complete", { description: "Showing 5 matching records." });
    }, 900);
  };

  return (
    <div className="patient-registration-theme min-h-screen bg-background text-foreground flex flex-col pb-28 font-sans selection:bg-primary/20">
      <Toaster richColors position="top-right" theme="light" closeButton offset={64} />

      {/* Top App Bar */}
      <header className="h-14 bg-primary text-primary-foreground flex items-center px-4 sm:px-6 shadow-md z-20 sticky top-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary-foreground/10 shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="font-extrabold text-sm tracking-wide leading-none truncate">METROPOLITAN GENERAL HOSPITAL</h1>
            <p className="text-[11px] text-primary-foreground/70 mt-1 leading-none">Patient Registration · Front Office</p>
          </div>
        </div>
        <div className="ml-auto hidden md:flex items-center gap-3 text-xs font-medium">
          <div className="flex items-center gap-1.5 bg-primary-foreground/10 px-2.5 py-1.5 rounded-md">
            <User className="w-3.5 h-3.5" />
            <span>Sarah Jenkins</span>
            <span className="text-primary-foreground/60">· Registrar</span>
          </div>
          <div className="flex items-center gap-1.5 text-primary-foreground/80">
            <Activity className="w-3.5 h-3.5" />
            <span>Terminal REG-04</span>
          </div>
        </div>
      </header>

      {/* Sticky Toolbar */}
      <div className="bg-card/95 backdrop-blur border-b border-border shadow-sm px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sticky top-14 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 shrink-0">Registration Type</span>
          <RadioGroup value={patientType} onValueChange={setPatientType} className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {(["new", "existing", "staff", "newborn"] as const).map((v) => (
              <div key={v} className="flex items-center space-x-1.5">
                <RadioGroupItem value={v} id={v} className="text-primary border-slate-300" />
                <Label htmlFor={v} className="cursor-pointer text-sm font-medium capitalize">{PATIENT_TYPE_LABELS[v]}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-400 mr-1">
            <span className="text-destructive font-semibold">*</span> Required field
          </span>
          <Button variant="outline" size="sm" className="h-9 border-slate-300 hover:bg-slate-100 text-slate-700" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset
          </Button>
          <Button variant="secondary" size="sm" className="h-9 bg-secondary text-secondary-foreground hover:bg-secondary/80" onClick={() => setSearchOpen(true)}>
            <Search className="w-3.5 h-3.5 mr-1.5" /> Search Patient
          </Button>
          <Button size="sm" disabled={saving} className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 shadow-sm min-w-[170px]" onClick={handleSave}>
            {saving ? (
              <><svg className="w-3.5 h-3.5 mr-1.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg> Saving...</>
            ) : (
              <><Save className="w-3.5 h-3.5 mr-1.5" /> Save Registration</>
            )}
          </Button>
        </div>
      </div>

      {/* Indeterminate progress while saving */}
      {saving && (
        <div className="h-0.5 w-full bg-primary/15 overflow-hidden sticky top-[6.5rem] z-10">
          <div className="h-full w-1/3 bg-primary animate-[progress_1.1s_ease-in-out_infinite]" style={{ animationName: "pr-progress" }} />
          <style>{`@keyframes pr-progress{0%{transform:translateX(-100%)}100%{transform:translateX(400%)}}`}</style>
        </div>
      )}

      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-5">

        {pageLoading ? (
          <FormSkeleton />
        ) : (
          <>
            {/* Patient Context / Summary Bar */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-base shrink-0 ring-2 ring-primary/15">
                  {initials("Ahmed Al-Rashid")}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-slate-900 leading-none">Ahmed Al-Rashid</h2>
                    <Badge variant="outline" className="font-mono text-[10px] text-primary border-primary/30">MRN1001</Badge>
                    <Badge variant="secondary" className="text-[10px]">{PATIENT_TYPE_LABELS[patientType]}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-x-3 gap-y-1 flex-wrap">
                    <span>Male</span><span className="text-slate-300">·</span>
                    <span>38Y 7M</span><span className="text-slate-300">·</span>
                    <span className="font-semibold text-slate-600">O+</span><span className="text-slate-300">·</span>
                    <span>Kuwaiti</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 xl:gap-4">
                <div className="flex items-center gap-2 rounded-md bg-amber-50 border border-amber-200 px-2.5 py-1.5 text-amber-800">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-semibold">Allergy: Penicillin</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" /> Updated 2 days ago
                </div>
                <Separator orientation="vertical" className="hidden sm:block h-8" />
                <div className="flex items-center gap-2">
                  <Label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">Appointment Ref</Label>
                  <Input defaultValue="APT-20231024-001" className="h-8 w-44 text-xs font-mono" />
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <Card className="border-slate-200/80 shadow-sm rounded-lg overflow-hidden">
              <SectionHeader index="01" icon={User} title="Personal Details" description="Core demographic and contact information" />
              <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-5">
                <FormGroup label="Prefix" required>
                  <Select defaultValue="Mr.">
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
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
                  <Input defaultValue="Ahmed" className="h-9 text-sm font-medium" />
                </FormGroup>

                <FormGroup label="Middle Name">
                  <Input defaultValue="Hassan" className="h-9 text-sm" />
                </FormGroup>

                <FormGroup label="Last Name" required>
                  <Input defaultValue="Al-Rashid" className="h-9 text-sm font-medium" />
                </FormGroup>

                <FormGroup label="Family Name">
                  <Input defaultValue="Al-Rashid" className="h-9 text-sm" />
                </FormGroup>

                <FormGroup label="Gender" required>
                  <Select defaultValue="Male">
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormGroup>

                <FormGroup label="Date of Birth" required>
                  <Input type="date" defaultValue="1985-03-12" className="h-9 text-sm" />
                </FormGroup>

                <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                  <Label className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 block mb-1.5">Age (Auto-calculated)</Label>
                  <div className="flex space-x-2">
                    {[["38", "Y"], ["7", "M"], ["12", "D"]].map(([val, unit]) => (
                      <div key={unit} className="flex items-center border rounded-md px-2 bg-slate-50 h-9 flex-1">
                        <Input defaultValue={val} className="h-7 w-full border-0 bg-transparent text-right text-sm p-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-semibold text-slate-900" readOnly />
                        <span className="text-xs text-slate-400 ml-1">{unit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <FormGroup label="Blood Group">
                  <Select defaultValue="O+">
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormGroup>

                <FormGroup label="Mobile Number" required error="Mobile number must be exactly 10 digits">
                  <div className="flex space-x-1 border rounded-md border-destructive overflow-hidden focus-within:ring-1 focus-within:ring-destructive">
                    <Select defaultValue="+965">
                      <SelectTrigger className="h-9 text-xs border-0 w-[82px] bg-slate-50 rounded-none focus:ring-0 focus:ring-offset-0"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+965">+965 (KW)</SelectItem>
                        <SelectItem value="+91">+91 (IN)</SelectItem>
                        <SelectItem value="+1">+1 (US)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input defaultValue="987654321" className="h-9 text-sm border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-1" />
                  </div>
                </FormGroup>

                <FormGroup label="Email ID" hint="Used for patient portal access">
                  <Input defaultValue="ahmed.alrashid@example.com" type="email" className="h-9 text-sm" />
                </FormGroup>

                <FormGroup label="Marital Status">
                  <Select defaultValue="Married">
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormGroup>

                <FormGroup label="National ID / Civil ID" required>
                  <Input defaultValue="284-12345678" className="h-9 text-sm font-medium" />
                </FormGroup>
              </CardContent>

              {/* Additional Details Collapsible */}
              <Collapsible open={additionalOpen} onOpenChange={setAdditionalOpen} className="border-t border-slate-100">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 px-5 bg-slate-50/40 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-2">
                    <FileSearch className="w-4 h-4 text-slate-400" />
                    <span className="text-[13px] font-semibold text-slate-600">Additional Details</span>
                    <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-200">Optional</Badge>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${additionalOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-5 pt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-5 bg-slate-50/20">
                  <FormGroup label="Nationality">
                    <Select defaultValue="Kuwaiti">
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Kuwaiti", "Indian", "Egyptian", "Filipino", "British", "American"].map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormGroup>

                  <FormGroup label="Religion">
                    <Select defaultValue="Islam">
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Islam", "Christianity", "Hinduism", "Other"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormGroup>

                  <FormGroup label="Race/Ethnicity">
                    <Select defaultValue="Arab">
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Arab", "Asian", "Caucasian", "Other"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormGroup>

                  <FormGroup label="Preferred Language">
                    <Select defaultValue="Arabic">
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Arabic", "English", "Hindi", "Tagalog"].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormGroup>

                  <FormGroup label="Warning / Alerts">
                    <div className="relative">
                      <ShieldAlert className="w-4 h-4 absolute left-2.5 top-2.5 text-amber-500" />
                      <Input defaultValue="Allergic to Penicillin" className="h-9 text-sm pl-9 border-amber-200 bg-amber-50 focus-visible:ring-amber-500 font-medium text-amber-900" />
                    </div>
                  </FormGroup>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Residential Address */}
            <Card className="border-slate-200/80 shadow-sm rounded-lg overflow-hidden">
              <SectionHeader index="02" icon={MapPin} title="Residential Address" description="Contact location and cascading region selection" />
              <CardContent className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-5">
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormGroup label="Country Code">
                    <Select defaultValue="965">
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="965">+965</SelectItem>
                        <SelectItem value="91">+91</SelectItem>
                        <SelectItem value="1">+1</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormGroup>
                  <FormGroup label="STD Code">
                    <Input defaultValue="02" className="h-9 text-sm" />
                  </FormGroup>
                  <FormGroup label="Phone Number">
                    <Input defaultValue="24567890" className="h-9 text-sm" />
                  </FormGroup>
                  <div className="sm:col-span-3">
                    <FormGroup label="Full Address">
                      <Textarea defaultValue="Block 4, Street 12, Building 45, Apartment 12" className="min-h-[88px] text-sm resize-none" />
                    </FormGroup>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-slate-50/60 p-4 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <ChevronRight className="w-3.5 h-3.5 text-primary" /> Cascading Region
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <FormGroup label="Country">
                      <Select defaultValue="Kuwait">
                        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kuwait">Kuwait</SelectItem>
                          <SelectItem value="India">India</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormGroup>
                    <FormGroup label="State / Governorate">
                      <Select defaultValue="Hawalli">
                        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hawalli">Hawalli</SelectItem>
                          <SelectItem value="Capital">Capital</SelectItem>
                          <SelectItem value="Ahmadi">Ahmadi</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormGroup>
                    <FormGroup label="City">
                      <Select defaultValue="Salmiya">
                        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Salmiya">Salmiya</SelectItem>
                          <SelectItem value="Jabriya">Jabriya</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormGroup>
                    <FormGroup label="Area">
                      <Select defaultValue="Block 4">
                        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Block 1">Block 1</SelectItem>
                          <SelectItem value="Block 4">Block 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormGroup>
                  </div>
                  <div className="mt-4">
                    <FormGroup label="Pincode / Zipcode">
                      <Input defaultValue="32005" className="h-9 text-sm w-full sm:w-1/3" />
                    </FormGroup>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Professional Details */}
              <Card className="border-slate-200/80 shadow-sm rounded-lg overflow-hidden">
                <SectionHeader index="03" icon={Briefcase} title="Professional Details" description="Employment and occupation" />
                <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <FormGroup label="Occupation">
                    <Select defaultValue="Employed">
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Employed", "Self-Employed", "Unemployed", "Retired", "Student"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormGroup>

                  <FormGroup label="Income Category">
                    <Select defaultValue="Middle">
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["High", "Middle", "Low"].map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormGroup>

                  <div className="sm:col-span-2">
                    <FormGroup label="Company">
                      <Select defaultValue="KOC">
                        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KOC">Kuwait Oil Company (KOC)</SelectItem>
                          <SelectItem value="KPC">Kuwait Petroleum Corp</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormGroup>
                  </div>

                  <div className="sm:col-span-2">
                    <FormGroup label="Company Name (If Other)">
                      <Input disabled className="h-9 text-sm bg-slate-50" placeholder="Auto-filled from selection" />
                    </FormGroup>
                  </div>

                  <div className="sm:col-span-2">
                    <FormGroup label="Profession">
                      <Select defaultValue="Engineer">
                        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["Engineer", "Doctor", "Teacher", "Manager", "Other"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormGroup>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-5">
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
          </>
        )}
      </main>

      {/* Patient Search Modal */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden gap-0 rounded-xl patient-registration-theme font-sans">
          <DialogHeader className="p-5 border-b border-border bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
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
                  <Button className="h-9 px-4 bg-primary text-primary-foreground" onClick={runSearch} disabled={searchLoading}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </FormGroup>
            </div>
          </div>

          <div className="bg-slate-50 p-5 pt-4">
            <div className="border rounded-lg overflow-x-auto bg-white shadow-sm">
              <Table className="min-w-[720px]">
                <TableHeader className="bg-slate-100/80">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold text-slate-600 text-xs uppercase tracking-wide">MR Number</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-xs uppercase tracking-wide">Patient Name</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-xs uppercase tracking-wide">Gender</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-xs uppercase tracking-wide">DOB</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-xs uppercase tracking-wide">Mobile</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-xs uppercase tracking-wide">Civil ID</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600 text-xs uppercase tracking-wide">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i} className="hover:bg-transparent">
                        {Array.from({ length: 7 }).map((__, j) => (
                          <TableCell key={j} className={j === 6 ? "text-right" : ""}>
                            <Skeleton className={`h-4 ${j === 6 ? "w-16 ml-auto" : j === 1 ? "w-32" : "w-20"}`} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    SEED_PATIENTS.map((p) => (
                      <TableRow key={p.mrn} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="font-mono font-medium text-primary text-sm">{p.mrn}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center justify-center shrink-0">
                              {initials(p.name)}
                            </div>
                            <span className="font-medium text-slate-900">{p.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">{p.gender}</TableCell>
                        <TableCell className="text-slate-600">{p.dob}</TableCell>
                        <TableCell className="text-slate-600 font-mono text-sm">{p.mobile}</TableCell>
                        <TableCell>
                          {p.civilId === "Pending"
                            ? <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300 bg-amber-50">Pending</Badge>
                            : <span className="text-slate-600 font-mono text-sm">{p.civilId}</span>}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="secondary" className="h-7 text-xs bg-primary/10 text-primary hover:bg-primary/20" onClick={() => handleSelectPatient(p.name, p.mrn)}>
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between items-center mt-4 text-xs text-slate-500">
              <span>{searchLoading ? "Searching records..." : "Showing 5 of 24 results"}</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="h-7 text-xs disabled:opacity-50" disabled>Previous</Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">Next</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-8 w-40 ml-auto" />
      </div>
      {[0, 1].map((c) => (
        <Card key={c} className="border-slate-200/80 shadow-sm rounded-lg overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-3.5 px-5">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-md" />
              <Skeleton className="h-4 w-40" />
            </div>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-5">
            {Array.from({ length: c === 0 ? 10 : 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
