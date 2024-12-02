import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { KINDLE_EMAIL_KEY } from "../constants";
import { useToast } from "../hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const registerEmailSchema = z.object({
    email: z.string().email({ message: "Email invalid" }).trim()
})

type RegisterEmailSchema = z.infer<typeof registerEmailSchema>


export function KindleEmailForm() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [kindleEmail, setKindleEmail] = useState<string>("");
    const { toast } = useToast()

    const currentStep = parseInt(searchParams.get("step") || "0", 10);
    let nextStep = currentStep;



    const { register, handleSubmit } = useForm<RegisterEmailSchema>({
        resolver: zodResolver(registerEmailSchema)
    })

    useEffect(() => {
        const storedEmail = localStorage.getItem(KINDLE_EMAIL_KEY);
        if (storedEmail) {
            setKindleEmail(storedEmail);
        }
    });

    const handleRemoveRegister = () => {
        if (kindleEmail) {
            const storedEmail = localStorage.getItem(KINDLE_EMAIL_KEY)
            if (storedEmail) {
                localStorage.removeItem(KINDLE_EMAIL_KEY)
            }
            toast({
                description: "Email removed successfuly.",
                variant: "success",
            });
            setKindleEmail("")
        } else {
            toast({
                description: "Email invalid.",
                variant: "destructive",
            });
        }
    }

    const handleRegisterSubmit = (data: any) => {
        const kindleEmail = localStorage.getItem(KINDLE_EMAIL_KEY)
        if (kindleEmail) {
            localStorage.removeItem(KINDLE_EMAIL_KEY)
        }

        localStorage.setItem(KINDLE_EMAIL_KEY, data.email)
    }

    return (
        <form onSubmit={handleSubmit(handleRegisterSubmit)} className="mt-4 p-2 rounded flex flex-col items-center gap-2">
            <Input
                {...register("email")}
                value={kindleEmail}
                onChange={(e) => setKindleEmail(e.target.value)}
                type="email"
                placeholder="Your kindle email"
            />

            <div className="flex gap-2 items-center mt-2">
                <Button variant="secondary">Register</Button>
                <Button type="button" onClick={handleRemoveRegister} variant="destructive">Remove</Button>
            </div>
        </form>
    )
}