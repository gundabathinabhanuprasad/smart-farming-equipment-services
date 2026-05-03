import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { buildUrl } from "@/lib/auth";

const formSchema = z.object({
  farmerName: z.string().min(2, "Name must be at least 2 characters"),
  farmerPhone: z.string().min(10, "Valid phone number required"),
  village: z.string().min(2, "Village name is required"),
  driverId: z.number().optional(),
  slotDate: z.date({ required_error: "Please select a date" }),
  slotTime: z.string().min(1, "Please select a time slot"),
  durationHours: z.coerce.number().min(1).max(12),
  taskType: z.string().optional(),
  notes: z.string().optional(),
});

interface Driver {
  id: number;
  userName: string | null;
  village: string | null;
  district: string | null;
  pricePerHour: number;
  experience: number;
  rating: number;
}

interface DriverBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDriver?: Driver;
  drivers?: Driver[];
}

export function DriverBookingDialog({ open, onOpenChange, defaultDriver, drivers = [] }: DriverBookingDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      farmerName: "", farmerPhone: "", village: "",
      driverId: defaultDriver?.id,
      slotTime: "", durationHours: 1, taskType: "", notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        farmerName: "", farmerPhone: "", village: "",
        driverId: defaultDriver?.id,
        slotTime: "", durationHours: 1, taskType: "", notes: "",
      });
    }
  }, [open, defaultDriver, form]);

  const [submitting, setSubmitting] = [form.formState.isSubmitting, () => {}];
  void submitting; void setSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const body = {
        ...values,
        slotDate: format(values.slotDate, "yyyy-MM-dd"),
        driverId: values.driverId ?? undefined,
      };
      const res = await fetch(buildUrl("/api/driver-bookings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Booking failed");
      const data = await res.json() as { id: number };
      toast.success("Driver Booking Request Sent!", {
        description: `Request #${data.id} broadcast to drivers in your area. You'll be contacted soon.`,
      });
      onOpenChange(false);
    } catch {
      toast.error("Failed to submit request. Please try again.");
    }
  };

  const selectedDriver = drivers.find(d => d.id === form.watch("driverId")) ?? defaultDriver;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book a Driver</DialogTitle>
          <DialogDescription>
            Your request will be broadcast to available drivers in your area. First to accept gets the job.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {drivers.length > 0 && (
              <FormField control={form.control} name="driverId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Driver (Optional)</FormLabel>
                  <Select onValueChange={v => field.onChange(v ? Number(v) : undefined)} value={field.value?.toString() ?? ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Broadcast to all nearby drivers" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Broadcast to all nearby drivers</SelectItem>
                      {drivers.map(d => (
                        <SelectItem key={d.id} value={d.id.toString()}>
                          {d.userName} — Rs.{d.pricePerHour}/hr · {d.experience}y exp
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            {selectedDriver && (
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="font-medium">{selectedDriver.userName}</p>
                <p className="text-muted-foreground">
                  {selectedDriver.village} · Rs.{selectedDriver.pricePerHour}/hr · {selectedDriver.experience}y exp · ⭐ {selectedDriver.rating.toFixed(1)}
                </p>
              </div>
            )}

            <FormField control={form.control} name="taskType" render={({ field }) => (
              <FormItem>
                <FormLabel>Task Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="What work needs doing?" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["Tractor Driving", "Combine Harvesting", "Land Preparation", "Seed Sowing", "Crop Transport", "General Farming", "Other"].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="slotDate" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange}
                        disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="slotTime" render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Slot</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="morning">Morning (6AM–12PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM–6PM)</SelectItem>
                      <SelectItem value="evening">Evening (6PM–9PM)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="durationHours" render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Hours)</FormLabel>
                <FormControl><Input type="number" min={1} max={12} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="farmerName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl><Input placeholder="Ram Singh" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="farmerPhone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl><Input placeholder="9876543210" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="village" render={({ field }) => (
              <FormItem>
                <FormLabel>Your Village</FormLabel>
                <FormControl><Input placeholder="Palwal" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes (Optional)</FormLabel>
                <FormControl><Textarea placeholder="Any specific requirements..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Sending Request..." : "Send Booking Request"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
