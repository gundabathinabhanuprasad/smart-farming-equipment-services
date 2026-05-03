import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tractor, MapPin, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const ROLES = [
  { value: "farmer", label: "Farmer", desc: "Book equipment and drivers" },
  { value: "owner", label: "Equipment Owner", desc: "List and rent your machinery" },
  { value: "driver", label: "Driver", desc: "Offer your driving services" },
];

export default function Signup() {
  const [form, setForm] = useState({
    name: "", phone: "", password: "", role: "farmer",
    village: "", district: "", state: "Haryana",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const { signup } = useAuth();
  const [, setLocation] = useLocation();

  const detectLocation = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        toast.success("Location detected!");
      },
      () => { toast.error("Could not detect location"); setLocating(false); }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await signup({
        ...form,
        locationLat: coords?.lat,
        locationLng: coords?.lng,
      });
      toast.success("Account created! Welcome to KhetBook.");
      if (form.role === "owner") setLocation("/owner");
      else if (form.role === "driver") setLocation("/driver");
      else setLocation("/");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-primary p-3 rounded-xl mb-4">
            <Tractor className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Join KhetBook</h1>
          <p className="text-muted-foreground mt-1">Create your account to get started</p>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>I am a...</Label>
              <div className="grid grid-cols-3 gap-3">
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, role: r.value }))}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      form.role === r.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="font-bold text-sm text-foreground">{r.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Ram Singh" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="9876543210" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required className="pr-10" />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="village">Village</Label>
                <Input id="village" placeholder="Palwal" value={form.village}
                  onChange={e => setForm(f => ({ ...f, village: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input id="district" placeholder="Palwal" value={form.district}
                  onChange={e => setForm(f => ({ ...f, district: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" placeholder="Haryana" value={form.state}
                  onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full" onClick={detectLocation} disabled={locating}>
              <MapPin className="h-4 w-4 mr-2" />
              {locating ? "Detecting..." : coords ? `Location set (${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)})` : "Auto-detect My Location (Optional)"}
            </Button>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-primary font-medium hover:underline">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
