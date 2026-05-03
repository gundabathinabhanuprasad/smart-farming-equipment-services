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
import {
  LayoutDashboard, Tractor, CalendarCheck, Plus, Pencil, Trash2,
  CheckCircle, XCircle, IndianRupee
} from "lucide-react";

const NAV = [
  { label: "Overview", tab: "overview", icon: LayoutDashboard },
  { label: "My Equipment", tab: "equipment", icon: Tractor },
  { label: "Booking Requests", tab: "bookings", icon: CalendarCheck },
  { label: "Earnings", tab: "earnings", icon: IndianRupee },
];

interface Equipment {
  id: number; name: string; category: string; description: string;
  pricePerHour: number; pricePerDay: number; available: boolean;
  village: string | null; district: string | null; totalBookings: number;
}

interface Booking {
  id: number; farmerName: string; farmerPhone: string; village: string;
  equipmentName: string | null; equipmentId: number; slotDate: string;
  slotTime: string; durationHours: number; status: string; totalAmount: number;
  notes: string | null; createdAt: string;
}

const CATEGORIES = ["tractor", "tillage", "seeder", "harvester", "sprayer", "irrigation", "other"];

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-green-100 text-green-800",
};

const emptyForm = {
  name: "", category: "tractor", description: "", pricePerHour: "", pricePerDay: "",
  village: "", district: "", state: "",
};

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState("overview");
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== "owner" && user.role !== "admin")) setLocation("/login");
  }, [user, setLocation]);

  const loadEquipment = () => authFetch<Equipment[]>(buildUrl("/api/owner/equipment")).then(setEquipment).catch(() => {});
  const loadBookings = () => authFetch<Booking[]>(buildUrl("/api/owner/bookings")).then(setBookings).catch(() => {});

  useEffect(() => {
    loadEquipment();
    loadBookings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        ...form,
        pricePerHour: Number(form.pricePerHour),
        pricePerDay: Number(form.pricePerDay),
      };
      if (editId) {
        const updated = await authFetch<Equipment>(buildUrl(`/api/owner/equipment/${editId}`), {
          method: "PUT", body: JSON.stringify(body),
        });
        setEquipment(eq => eq.map(e => e.id === editId ? updated : e));
        toast.success("Equipment updated!");
      } else {
        const created = await authFetch<Equipment>(buildUrl("/api/owner/equipment"), {
          method: "POST", body: JSON.stringify(body),
        });
        setEquipment(eq => [created, ...eq]);
        toast.success("Equipment added!");
      }
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (e: Equipment) => {
    setEditId(e.id);
    setForm({
      name: e.name, category: e.category, description: e.description,
      pricePerHour: String(e.pricePerHour), pricePerDay: String(e.pricePerDay),
      village: e.village ?? "", district: e.district ?? "", state: "",
    });
    setShowForm(true);
    setTab("equipment");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this equipment?")) return;
    try {
      await authFetch(buildUrl(`/api/owner/equipment/${id}`), { method: "DELETE" });
      setEquipment(eq => eq.filter(e => e.id !== id));
      toast.success("Equipment deleted");
    } catch { toast.error("Failed to delete"); }
  };

  const handleBookingStatus = async (id: number, status: string) => {
    try {
      const updated = await authFetch<Booking>(buildUrl(`/api/owner/bookings/${id}/status`), {
        method: "PATCH", body: JSON.stringify({ status }),
      });
      setBookings(bs => bs.map(b => b.id === id ? { ...b, status: updated.status } : b));
      toast.success(status === "confirmed" ? "Booking accepted!" : "Booking rejected");
    } catch { toast.error("Failed to update booking"); }
  };

  const pending = bookings.filter(b => b.status === "pending");
  const confirmed = bookings.filter(b => b.status === "confirmed");
  const totalEarned = bookings.filter(b => b.status === "completed").reduce((s, b) => s + b.totalAmount * 0.7, 0);
  const pendingEarnings = confirmed.reduce((s, b) => s + b.totalAmount * 0.7, 0);

  return (
    <DashboardLayout title="Owner Dashboard" role="owner" navItems={NAV} activeTab={tab} onTabChange={t => { setTab(t); setShowForm(false); }}>

      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "My Equipment", value: equipment.length, color: "bg-blue-100 text-blue-700", icon: Tractor },
              { label: "Pending Requests", value: pending.length, color: "bg-amber-100 text-amber-700", icon: CalendarCheck },
              { label: "Confirmed Jobs", value: confirmed.length, color: "bg-green-100 text-green-700", icon: CheckCircle },
              { label: "Total Bookings", value: bookings.length, color: "bg-primary/10 text-primary", icon: CalendarCheck },
            ].map(s => (
              <div key={s.label} className="bg-card border rounded-xl p-5">
                <div className={`inline-flex p-2.5 rounded-lg ${s.color} mb-3`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-bold mb-2">Earnings Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground text-sm">Completed earnings (70%)</span>
                  <span className="font-bold text-green-700">Rs. {totalEarned.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground text-sm">Upcoming (confirmed jobs)</span>
                  <span className="font-bold text-blue-700">Rs. {pendingEarnings.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                </div>
                <p className="text-xs text-muted-foreground">You receive 70% of each booking. Platform keeps 30% for insurance & support.</p>
              </div>
            </div>

            {pending.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="font-bold mb-3 text-amber-900">🔔 {pending.length} Pending Request{pending.length > 1 ? "s" : ""}</h3>
                {pending.slice(0, 3).map(b => (
                  <div key={b.id} className="flex justify-between items-center py-2 border-b border-amber-100 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{b.farmerName}</p>
                      <p className="text-xs text-muted-foreground">{b.equipmentName} · {b.slotDate} {b.slotTime}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="h-7 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleBookingStatus(b.id, "confirmed")}>
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-red-600 border-red-200" onClick={() => handleBookingStatus(b.id, "rejected")}>
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
                {pending.length > 3 && (
                  <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => setTab("bookings")}>
                    View all {pending.length} requests
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "equipment" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">My Equipment ({equipment.length})</h2>
            <Button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}>
              <Plus className="h-4 w-4 mr-2" /> Add Equipment
            </Button>
          </div>

          {showForm && (
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-bold mb-4">{editId ? "Edit Equipment" : "Add New Equipment"}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Equipment Name *</Label>
                    <Input placeholder="Mahindra 575 Tractor" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                      {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Input placeholder="Describe your equipment and its uses" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price per Hour (Rs.) *</Label>
                    <Input type="number" min="1" placeholder="350" value={form.pricePerHour} onChange={e => setForm(f => ({ ...f, pricePerHour: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Price per Day (Rs.) *</Label>
                    <Input type="number" min="1" placeholder="2400" value={form.pricePerDay} onChange={e => setForm(f => ({ ...f, pricePerDay: e.target.value }))} required />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Village</Label>
                    <Input placeholder="Palwal" value={form.village} onChange={e => setForm(f => ({ ...f, village: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>District</Label>
                    <Input placeholder="Palwal" value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input placeholder="Haryana" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={saving}>{saving ? "Saving..." : editId ? "Update Equipment" : "Add Equipment"}</Button>
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</Button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {equipment.map(e => (
              <div key={e.id} className="bg-card border rounded-xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-foreground">{e.name}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{e.category} · {e.village ?? "Location not set"}</p>
                  </div>
                  <Badge className={e.available ? "bg-green-100 text-green-800 text-xs" : "bg-red-100 text-red-800 text-xs"}>
                    {e.available ? "Available" : "Busy"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="font-bold text-primary text-lg">Rs. {e.pricePerHour}/hr</span>
                  <span className="text-muted-foreground">{e.totalBookings} bookings</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(e)}>
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive border-destructive/30" onClick={() => handleDelete(e.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            {equipment.length === 0 && !showForm && (
              <div className="col-span-2 text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                <Tractor className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">No equipment listed yet</p>
                <p className="text-sm">Click "Add Equipment" to get started</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "bookings" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Booking Requests ({bookings.length})</h2>
          {bookings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
              <CalendarCheck className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No booking requests yet</p>
            </div>
          )}
          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b.id} className="bg-card border rounded-xl p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{b.farmerName}</span>
                      <Badge className={`text-xs ${statusColors[b.status] ?? "bg-muted"}`}>{b.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{b.farmerPhone} · {b.village}</p>
                    <p className="text-sm mt-1 font-medium">{b.equipmentName} · {b.slotDate} {b.slotTime} · {b.durationHours}h</p>
                    {b.notes && <p className="text-xs text-muted-foreground mt-1 italic">"{b.notes}"</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="font-bold text-primary text-lg">Rs. {b.totalAmount.toLocaleString()}</span>
                    <span className="text-xs text-green-700">Your cut: Rs. {(b.totalAmount * 0.7).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                    {b.status === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleBookingStatus(b.id, "confirmed")}>
                          <CheckCircle className="h-3.5 w-3.5 mr-1" /> Accept
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 text-red-600 border-red-200" onClick={() => handleBookingStatus(b.id, "rejected")}>
                          <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                    {b.status === "confirmed" && (
                      <Button size="sm" className="h-8" onClick={() => handleBookingStatus(b.id, "completed")}>
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "earnings" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Earnings Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Completed Earnings (70%)", value: totalEarned, color: "text-green-700" },
              { label: "Pending Earnings (confirmed)", value: pendingEarnings, color: "text-blue-700" },
              { label: "Total Booking Value", value: bookings.reduce((s, b) => s + b.totalAmount, 0), color: "text-foreground" },
            ].map(s => (
              <div key={s.label} className="bg-card border rounded-xl p-6">
                <div className={`text-2xl font-bold ${s.color}`}>
                  Rs. {s.value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-muted/50 rounded-xl p-5 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">Payment Policy</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>You receive 70% of each booking amount</li>
              <li>30% goes to KhetBook for insurance, platform, and AI services</li>
              <li>Payments are settled within 24 hours of job completion</li>
            </ul>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
