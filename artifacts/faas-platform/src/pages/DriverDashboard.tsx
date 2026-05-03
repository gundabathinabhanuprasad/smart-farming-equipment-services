import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { authFetch, buildUrl } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LayoutDashboard, Car, CalendarCheck, User, IndianRupee, CheckCircle, XCircle, Radio } from "lucide-react";

const NAV = [
  { label: "Overview", tab: "overview", icon: LayoutDashboard },
  { label: "My Profile", tab: "profile", icon: User },
  { label: "Booking Requests", tab: "bookings", icon: CalendarCheck },
  { label: "Earnings", tab: "earnings", icon: IndianRupee },
];

interface DriverProfile {
  id: number; userId: number; experience: number; pricePerHour: number;
  available: boolean; village: string | null; district: string | null;
  state: string | null; bio: string | null; rating: number; totalBookings: number;
}

interface DriverBooking {
  id: number; farmerName: string; farmerPhone: string; village: string;
  taskType: string | null; slotDate: string; slotTime: string;
  durationHours: number; status: string; totalAmount: number; notes: string | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-green-100 text-green-800",
};

export default function DriverDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState("overview");
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [assigned, setAssigned] = useState<DriverBooking[]>([]);
  const [broadcast, setBroadcast] = useState<DriverBooking[]>([]);
  const [profileForm, setProfileForm] = useState({
    experience: "", pricePerHour: "", village: "", district: "", state: "", bio: "",
  });
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== "driver" && user.role !== "admin")) setLocation("/login");
  }, [user, setLocation]);

  const loadProfile = () =>
    authFetch<DriverProfile>(buildUrl("/api/driver/profile"))
      .then(p => {
        setProfile(p);
        setProfileForm({
          experience: String(p.experience),
          pricePerHour: String(p.pricePerHour),
          village: p.village ?? "",
          district: p.district ?? "",
          state: p.state ?? "",
          bio: p.bio ?? "",
        });
      }).catch(() => {});

  const loadBookings = () =>
    authFetch<{ assigned: DriverBooking[]; broadcast: DriverBooking[] }>(buildUrl("/api/driver/bookings"))
      .then(d => { setAssigned(d.assigned); setBroadcast(d.broadcast); }).catch(() => {});

  useEffect(() => {
    loadProfile();
    loadBookings();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await authFetch<DriverProfile>(buildUrl("/api/driver/profile"), {
        method: "POST",
        body: JSON.stringify({
          experience: Number(profileForm.experience),
          pricePerHour: Number(profileForm.pricePerHour),
          village: profileForm.village || undefined,
          district: profileForm.district || undefined,
          state: profileForm.state || undefined,
          bio: profileForm.bio || undefined,
        }),
      });
      setProfile(data);
      toast.success("Profile saved!");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async () => {
    if (!profile) return;
    setToggling(true);
    try {
      const updated = await authFetch<DriverProfile>(buildUrl("/api/driver/availability"), {
        method: "PATCH",
        body: JSON.stringify({ available: !profile.available }),
      });
      setProfile(updated);
      toast.success(updated.available ? "You are now Online" : "You are now Offline");
    } catch { toast.error("Failed to update"); } finally { setToggling(false); }
  };

  const handleBookingAction = async (id: number, status: string) => {
    try {
      await authFetch(buildUrl(`/api/driver/bookings/${id}/status`), {
        method: "PATCH", body: JSON.stringify({ status }),
      });
      loadBookings();
      toast.success(status === "confirmed" ? "Booking accepted!" : "Booking declined");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const totalEarned = assigned.filter(b => b.status === "completed").reduce((s, b) => s + b.totalAmount * 0.7, 0);
  const pendingCount = broadcast.length;
  const assignedCount = assigned.filter(b => b.status === "confirmed").length;

  const BookingCard = ({ b, showAccept }: { b: DriverBooking; showAccept?: boolean }) => (
    <div className="bg-card border rounded-xl p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold">{b.farmerName}</span>
            <Badge className={`text-xs ${statusColors[b.status] ?? "bg-muted"}`}>{b.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{b.farmerPhone} · {b.village}</p>
          {b.taskType && <p className="text-sm mt-1">Task: <span className="font-medium">{b.taskType}</span></p>}
          <p className="text-sm text-muted-foreground">{b.slotDate} · {b.slotTime} · {b.durationHours}h</p>
          {b.notes && <p className="text-xs text-muted-foreground mt-1 italic">"{b.notes}"</p>}
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          {b.totalAmount > 0 && (
            <>
              <span className="font-bold text-primary text-lg">Rs. {b.totalAmount.toLocaleString()}</span>
              <span className="text-xs text-green-700">Your cut: Rs. {(b.totalAmount * 0.7).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
            </>
          )}
          {showAccept && b.status === "pending" && (
            <div className="flex gap-2">
              <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleBookingAction(b.id, "confirmed")}>
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Accept
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-red-600 border-red-200" onClick={() => handleBookingAction(b.id, "rejected")}>
                <XCircle className="h-3.5 w-3.5 mr-1" /> Decline
              </Button>
            </div>
          )}
          {b.status === "confirmed" && (
            <Button size="sm" className="h-8" onClick={() => handleBookingAction(b.id, "completed")}>
              Mark Completed
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout title="Driver Dashboard" role="driver" navItems={NAV} activeTab={tab} onTabChange={setTab}>

      {tab === "overview" && (
        <div className="space-y-6">
          {profile && (
            <div className={`rounded-xl p-5 border-2 flex items-center justify-between ${
              profile.available ? "border-green-300 bg-green-50" : "border-border bg-muted/30"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-full ${profile.available ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                  <Radio className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">{profile.available ? "You are Online" : "You are Offline"}</p>
                  <p className="text-sm text-muted-foreground">{profile.available ? "Farmers can see and book you" : "You won't receive new requests"}</p>
                </div>
              </div>
              <Button variant={profile.available ? "destructive" : "default"} onClick={toggleAvailability} disabled={toggling}>
                {toggling ? "Updating..." : profile.available ? "Go Offline" : "Go Online"}
              </Button>
            </div>
          )}

          {!profile && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="font-bold text-amber-900 mb-1">Profile not set up yet</p>
              <p className="text-sm text-amber-800 mb-3">Set up your driver profile to start receiving booking requests.</p>
              <Button size="sm" onClick={() => setTab("profile")}>Set Up Profile</Button>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Broadcast Requests", value: pendingCount, color: "bg-amber-100 text-amber-700", icon: Radio },
              { label: "Confirmed Jobs", value: assignedCount, color: "bg-blue-100 text-blue-700", icon: CheckCircle },
              { label: "Total Bookings", value: profile?.totalBookings ?? 0, color: "bg-green-100 text-green-700", icon: CalendarCheck },
              { label: "Rating", value: profile?.rating ?? 0, color: "bg-primary/10 text-primary", icon: Car },
            ].map(s => (
              <div key={s.label} className="bg-card border rounded-xl p-5">
                <div className={`inline-flex p-2.5 rounded-lg ${s.color} mb-3`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold">{typeof s.value === "number" && !Number.isInteger(s.value) ? s.value.toFixed(1) : s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {pendingCount > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-amber-800">🔔 New Requests Near You</h3>
              {broadcast.slice(0, 2).map(b => <BookingCard key={b.id} b={b} showAccept />)}
              {broadcast.length > 2 && (
                <Button variant="ghost" className="w-full" onClick={() => setTab("bookings")}>
                  View all {broadcast.length} requests
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {tab === "profile" && (
        <div className="max-w-xl space-y-6">
          <h2 className="text-xl font-bold">My Driver Profile</h2>
          <div className="bg-card border rounded-xl p-6">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Years of Experience *</Label>
                  <Input type="number" min="0" placeholder="5" value={profileForm.experience}
                    onChange={e => setProfileForm(f => ({ ...f, experience: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Rate per Hour (Rs.) *</Label>
                  <Input type="number" min="1" placeholder="300" value={profileForm.pricePerHour}
                    onChange={e => setProfileForm(f => ({ ...f, pricePerHour: e.target.value }))} required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Village</Label>
                  <Input placeholder="Palwal" value={profileForm.village} onChange={e => setProfileForm(f => ({ ...f, village: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>District</Label>
                  <Input placeholder="Palwal" value={profileForm.district} onChange={e => setProfileForm(f => ({ ...f, district: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input placeholder="Haryana" value={profileForm.state} onChange={e => setProfileForm(f => ({ ...f, state: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio (Optional)</Label>
                <Input placeholder="I have 5+ years of tractor experience in wheat and paddy" value={profileForm.bio}
                  onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))} />
              </div>
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? "Saving..." : profile ? "Update Profile" : "Create Profile"}
              </Button>
            </form>
          </div>

          {profile && (
            <div className={`rounded-xl p-5 border-2 flex items-center justify-between ${
              profile.available ? "border-green-300 bg-green-50" : "border-border bg-muted/30"
            }`}>
              <div>
                <p className="font-bold">Availability</p>
                <p className="text-sm text-muted-foreground">{profile.available ? "Online — accepting requests" : "Offline — not receiving requests"}</p>
              </div>
              <Button variant={profile.available ? "destructive" : "default"} size="sm" onClick={toggleAvailability} disabled={toggling}>
                {toggling ? "..." : profile.available ? "Go Offline" : "Go Online"}
              </Button>
            </div>
          )}
        </div>
      )}

      {tab === "bookings" && (
        <div className="space-y-6">
          {broadcast.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">📡 Broadcast Requests ({broadcast.length})</h2>
              <p className="text-sm text-muted-foreground mb-4">These are farmer requests near your area. Be the first to accept!</p>
              <div className="space-y-3">
                {broadcast.map(b => <BookingCard key={b.id} b={b} showAccept />)}
              </div>
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold mb-4">My Assignments ({assigned.length})</h2>
            <div className="space-y-3">
              {assigned.map(b => <BookingCard key={b.id} b={b} />)}
              {assigned.length === 0 && (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                  <CalendarCheck className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No assignments yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "earnings" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Earnings Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border rounded-xl p-6">
              <div className="text-2xl font-bold text-green-700">
                Rs. {totalEarned.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Total Earned (70% of completed)</div>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <div className="text-2xl font-bold text-foreground">{profile?.totalBookings ?? 0}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Jobs Completed</div>
            </div>
          </div>
          <div className="bg-muted/50 rounded-xl p-5 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">Payment Policy</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>You receive 70% of each driver booking amount</li>
              <li>30% goes to KhetBook for insurance and platform services</li>
              <li>Payments are settled within 24 hours of completion</li>
            </ul>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
