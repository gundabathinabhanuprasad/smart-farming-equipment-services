import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useCreateBooking, useListEquipment } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const formSchema = z.object({
  equipmentId: z.coerce.number().min(1, { message: "Please select equipment" }),
  farmerName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  farmerPhone: z.string().min(10, { message: "Valid phone number required" }),
  village: z.string().min(2, { message: "Village name is required" }),
  slotDate: z.date({ required_error: "Please select a date" }),
  slotTime: z.string().min(1, { message: "Please select a time slot" }),
  durationHours: z.coerce.number().min(1, { message: "Minimum 1 hour" }).max(12, { message: "Maximum 12 hours" }),
  notes: z.string().optional(),
});

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEquipmentId?: number;
}

export function BookingDialog({ open, onOpenChange, defaultEquipmentId }: BookingDialogProps) {
  const { data: equipmentList = [], isLoading: isLoadingEquipment } = useListEquipment();
  const createBooking = useCreateBooking();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipmentId: 0,
      farmerName: "",
      farmerPhone: "",
      village: "",
      slotTime: "",
      durationHours: 1,
      notes: "",
    },
  });

  // Reset form and sync selected equipment every time the dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        equipmentId: defaultEquipmentId ?? 0,
        farmerName: "",
        farmerPhone: "",
        village: "",
        slotTime: "",
        durationHours: 1,
        notes: "",
      });
    }
  }, [open, defaultEquipmentId, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createBooking.mutate(
      {
        data: {
          ...values,
          slotDate: format(values.slotDate, "yyyy-MM-dd"),
        },
      },
      {
        onSuccess: (data) => {
          toast.success("Booking Confirmed!", {
            description: `Booking #${data.id} confirmed. Total: Rs. ${data.totalAmount.toLocaleString("en-IN")}`,
          });
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Booking failed. Please try again.");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Farm Equipment</DialogTitle>
          <DialogDescription>
            Fill in the details below to request equipment. An operator will confirm shortly.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="equipmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Equipment</FormLabel>
                  <Select
                    disabled={isLoadingEquipment}
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value ? field.value.toString() : ""}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-equipment">
                        <SelectValue placeholder="Choose equipment..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {equipmentList.map((eq) => (
                        <SelectItem key={eq.id} value={eq.id.toString()}>
                          {eq.name} — Rs.{eq.pricePerHour}/hr
                          {!eq.available && " (Unavailable)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="slotDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            data-testid="button-date"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slotTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Slot</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-time">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                        <SelectItem value="evening">Evening (6PM - 9PM)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="durationHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (Hours)</FormLabel>
                  <FormControl>
                    <Input data-testid="input-duration" type="number" min={1} max={12} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="farmerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input data-testid="input-name" placeholder="Ram Singh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="farmerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input data-testid="input-phone" placeholder="9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="village"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Village</FormLabel>
                  <FormControl>
                    <Input data-testid="input-village" placeholder="Palwal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea data-testid="input-notes" placeholder="Any specific requirements..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              data-testid="button-submit"
              type="submit"
              className="w-full"
              disabled={createBooking.isPending}
            >
              {createBooking.isPending ? "Submitting..." : "Confirm Booking Request"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
