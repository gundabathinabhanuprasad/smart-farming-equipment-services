import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { authFetch, buildUrl } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  LayoutDashboard, Users, CalendarCheck, Tractor,
  Car, Trash2, ShieldCheck, ShieldX, TrendingUp
} from "lucide-react";

const NAV = [
  { label: "Overview", tab: "overview", icon: LayoutDashboard },
  { label: "Users", tab: "users", icon: Users },
  { label: "Equipment", tab: "equipment", icon: Tractor },
  { label: "Drivers", tab: "drivers", icon: Car },
  { label: "Bookings", tab: "bookings", icon: CalendarCheck },
];

interface AdminStats {
  totalUsers: number; totalFarmers: number; totalOwners: number;
  totalDrivers: number; totalEquipment: number; totalBookings: number;
  equipmentBookings: number; driverBookings: number; registeredDrivers: number;
}

interface UserRow {
  id: number; name: string; phone: string; role: string;
  village: string | null; district: string | null; state: string | null;
  status: string; createdAt: string;
}

interface EquipRow {
  id: number; name: string; category: string; pricePerHour: number;
  available: boolean; village: string | null; ownerId: number | null; totalBookings: number;
}

interface DriverRow {
  id: number; userId: number; pricePerHour: number; available: boolean;
  village: string | null; rating: number; totalBookings: number;
  userName: string | null; userPhone: string | null; experience: number;
}

interface BookingRow {
  id: number; farmerName: string; farmerPhone: string; village: string;
  equipmentName: string | null; slotDate: string; status: string; totalAmount: number;
}

interface DriverBookingRow {
  id: number; farmerName: string; farmerPhone: string; village: string;
  taskType: string | null; slotDate: string; status: string; totalAmount: number;
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  rejected: "bg-red-100 text-red-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-purple-100 text-purple-800",
};

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800",
  owner: "bg-blue-100 text-blue-800",
  driver: "bg-green-100 text-green-800",
  farmer: "bg-amber-100 text-amber-800",
};

export default function AdminDashboard() {
  const { user, authReady } = useAuth();
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [equipment, setEquipment] = useState<EquipRow[]>([]);
  const [drivers, setDrivers] = useState<DriverRow[]>([]);
  const [bookings, setBookings] = useState<{ equipment: BookingRow[]; driver: DriverBookingRow[] }>({ equipment: [], driver: [] });

  useEffect(() => {
    if (!authReady) return;
    if (!user || user.role !== "admin") { setLocation("/login"); }
  }, [authReady, user, setLocation]);

  useEffect(() => {
    authFetch<AdminStats>(buildUrl("/api/admin/stats")).then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === "users") authFetch<UserRow[]>(buildUrl("/api/admin/users")).then(setUsers).catch(() => {});
    if (tab === "equipment") authFetch<EquipRow[]>(buildUrl("/api/admin/equipment")).then(setEquipment).catch(() => {});
    if (tab === "drivers") authFetch<DriverRow[]>(buildUrl("/api/admin/drivers")).then(setDrivers).catch(() => {});
    if (tab === "bookings") authFetch<{ equipment: BookingRow[]; driver: DriverBookingRow[] }>(buildUrl("/api/admin/bookings")).then(setBookings).catch(() => {});
  }, [tab]);

  const updateUserStatus = async (id: number, status: string) => {
    try {
      await authFetch(buildUrl(`/api/admin/users/${id}`), { method: "PATCH", body: JSON.stringify({ status }) });
      setUsers(u => u.map(x => x.id === id ? { ...x, status } : x));
      toast.success("User status updated");
    } catch { toast.error("Failed to update user"); }
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    try {
      await authFetch(buildUrl(`/api/admin/users/${id}`), { method: "DELETE" });
      setUsers(u => u.filter(x => x.id !== id));
      toast.success("User deleted");
    } catch { toast.error("Failed to delete user"); }
  };

  const deleteEquipment = async (id: number) => {
    if (!confirm("Delete this equipment?")) return;
    try {
      await authFetch(buildUrl(`/api/admin/equipment/${id}`), { method: "DELETE" });
      setEquipment(e => e.filter(x => x.id !== id));
      toast.success("Equipment deleted");
    } catch { toast.error("Failed to delete equipment"); }
  };

  const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ComponentType<{ className?: string }>; color: string }) => (
    <div className="bg-card border rounded-xl p-5">
      <div className={`inline-flex p-2.5 rounded-lg ${color} mb-3`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-2xl font-bold text-foreground">{value.toLocaleString()}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );

  return (
    <DashboardLayout title="Admin Dashboard" role="admin" navItems={NAV} activeTab={tab} onTabChange={setTab}>

      {tab === "overview" && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-100 text-blue-700" />
            <StatCard label="Farmers" value={stats.totalFarmers} icon={Users} color="bg-amber-100 text-amber-700" />
            <StatCard label="Equipment Owners" value={stats.totalOwners} icon={Tractor} color="bg-green-100 text-green-700" />
            <StatCard label="Registered Drivers" value={stats.registeredDrivers} icon={Car} color="bg-purple-100 text-purple-700" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Listed Equipment" value={stats.totalEquipment} icon={Tractor} color="bg-primary/10 text-primary" />
            <StatCard label="Equipment Bookings" value={stats.equipmentBookings} icon={CalendarCheck} color="bg-indigo-100 text-indigo-700" />
            <StatCard label="Driver Bookings" value={stats.driverBookings} icon={Car} color="bg-pink-100 text-pink-700" />
          </div>
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Revenue Split Overview
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold text-primary">70%</div>
                <div className="text-sm text-muted-foreground">Goes to Equipment Owners & Drivers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">30%</div>
                <div className="text-sm text-muted-foreground">Platform Fee (Insurance, AI, Support)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">All Users ({users.length})</h2>
          </div>
          <div className="bg-card border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    {["Name", "Phone", "Role", "Location", "Status", "Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.phone}</td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${roleColors[u.role] ?? "bg-muted"}`}>{u.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{[u.village, u.district, u.state].filter(Boolean).join(", ") || "—"}</td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${statusColors[u.status] ?? "bg-muted"}`}>{u.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {u.status !== "active" && (
                            <Button size="sm" variant="ghost" className="h-7 text-green-700" onClick={() => updateUserStatus(u.id, "active")}>
                              <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Activate
                            </Button>
                          )}
                          {u.status === "active" && (
                            <Button size="sm" variant="ghost" className="h-7 text-amber-700" onClick={() => updateUserStatus(u.id, "suspended")}>
                              <ShieldX className="h-3.5 w-3.5 mr-1" /> Suspend
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-7 text-destructive" onClick={() => deleteUser(u.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No users yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "equipment" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">All Equipment ({equipment.length})</h2>
          <div className="bg-card border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    {["Name", "Category", "Price/hr", "Location", "Status", "Bookings", "Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {equipment.map(e => (
                    <tr key={e.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{e.name}</td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">{e.category}</td>
                      <td className="px-4 py-3 font-semibold text-primary">Rs. {e.pricePerHour}/hr</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{e.village ?? "—"}</td>
                      <td className="px-4 py-3">
                        <Badge className={e.available ? "bg-green-100 text-green-800 text-xs" : "bg-red-100 text-red-800 text-xs"}>
                          {e.available ? "Available" : "Busy"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{e.totalBookings}</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="ghost" className="h-7 text-destructive" onClick={() => deleteEquipment(e.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {equipment.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No equipment listed yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "drivers" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Registered Drivers ({drivers.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drivers.map(d => (
              <div key={d.id} className="bg-card border rounded-xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-foreground">{d.userName}</p>
                    <p className="text-sm text-muted-foreground">{d.userPhone}</p>
                  </div>
                  <Badge className={d.available ? "bg-green-100 text-green-800 text-xs" : "bg-muted text-muted-foreground text-xs"}>
                    {d.available ? "Online" : "Offline"}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs border rounded-lg overflow-hidden">
                  <div className="p-2 bg-muted/30">
                    <div className="font-bold text-foreground">Rs.{d.pricePerHour}</div>
                    <div className="text-muted-foreground">per hour</div>
                  </div>
                  <div className="p-2 bg-muted/30 border-x">
                    <div className="font-bold text-foreground">{d.experience}y</div>
                    <div className="text-muted-foreground">exp</div>
                  </div>
                  <div className="p-2 bg-muted/30">
                    <div className="font-bold text-foreground">{d.rating.toFixed(1)}</div>
                    <div className="text-muted-foreground">rating</div>
                  </div>
                </div>
                {d.village && <p className="text-xs text-muted-foreground mt-2">{d.village}</p>}
              </div>
            ))}
            {drivers.length === 0 && (
              <div className="col-span-3 text-center py-8 text-muted-foreground">No drivers registered yet</div>
            )}
          </div>
        </div>
      )}

      {tab === "bookings" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Equipment Bookings ({bookings.equipment.length})</h2>
            <div className="bg-card border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      {["#", "Farmer", "Equipment", "Date", "Status", "Amount"].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {bookings.equipment.map(b => (
                      <tr key={b.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 text-muted-foreground">#{b.id}</td>
                        <td className="px-4 py-3 font-medium">{b.farmerName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{b.equipmentName ?? "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{b.slotDate}</td>
                        <td className="px-4 py-3">
                          <Badge className={`text-xs ${statusColors[b.status] ?? "bg-muted"}`}>{b.status}</Badge>
                        </td>
                        <td className="px-4 py-3 font-semibold text-primary">Rs. {b.totalAmount.toLocaleString()}</td>
                      </tr>
                    ))}
                    {bookings.equipment.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No equipment bookings yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Driver Bookings ({bookings.driver.length})</h2>
            <div className="bg-card border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      {["#", "Farmer", "Village", "Task", "Date", "Status", "Amount"].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {bookings.driver.map(b => (
                      <tr key={b.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 text-muted-foreground">#{b.id}</td>
                        <td className="px-4 py-3 font-medium">{b.farmerName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{b.village}</td>
                        <td className="px-4 py-3 text-muted-foreground">{b.taskType ?? "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{b.slotDate}</td>
                        <td className="px-4 py-3">
                          <Badge className={`text-xs ${statusColors[b.status] ?? "bg-muted"}`}>{b.status}</Badge>
                        </td>
                        <td className="px-4 py-3 font-semibold text-primary">Rs. {b.totalAmount.toLocaleString()}</td>
                      </tr>
                    ))}
                    {bookings.driver.length === 0 && (
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No driver bookings yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
