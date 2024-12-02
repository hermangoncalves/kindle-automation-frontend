import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { KINDLE_EMAIL_KEY } from "../constants";

type RegisterEmailFormProps = {
    device: string;
}

const FormSchema = z.object({
    email: z.string().email({ message: "Email invalid" }).trim()
})

export function RegisterEmailForm({ device }: RegisterEmailFormProps) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
        },
    })

    function handleRegisterSubmit(data: z.infer<typeof FormSchema>) {
        const storedEmail = localStorage.getItem(KINDLE_EMAIL_KEY)
        if (storedEmail) {
            localStorage.removeItem(KINDLE_EMAIL_KEY)
        }
        localStorage.setItem(KINDLE_EMAIL_KEY, data?.email)
        console.log(data?.email)
        toast({
            description: "Email registered successfuly.",
            variant: "success",
        });
    }

    const handleRemoveRegister = () => {
        const storedEmail = localStorage.getItem(KINDLE_EMAIL_KEY)
        if (storedEmail) {
            localStorage.removeItem(KINDLE_EMAIL_KEY)
            toast({
                description: "Email removed successfuly.",
                variant: "success",
            });
        } else {
            toast({
                description: "No Email registered.",
                variant: "destructive",
            });
        }

    }

    return (
        <div className="flex flex-col gap-6 my-4">
            {device === "kindle" ? (
                <p className="text-justify">On your Kindle device, go to "All Settings." Open the "Your Account" tab and provide the "Send-to-Kindle Email" below:</p>
            ) : (
                <p>In your "Amazon Kindle" app, go to "Settings" and provide the "Send-to-Kindle Email Address" in the field below:</p>
            )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleRegisterSubmit)} className="flex flex-col gap-2 w-full">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="kindle email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-start text-red-500" />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-2 items-center justify-center mt-2 w-full">
                        <Button variant="secondary">Register</Button>
                        <Button type="button" onClick={handleRemoveRegister} variant="destructive">Remove</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
