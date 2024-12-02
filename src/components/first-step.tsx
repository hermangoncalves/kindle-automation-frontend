import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Copy } from "lucide-react"
import { useToast } from "../hooks/use-toast"


export function FirstStep() {
    const emailAddress = "hgoncalves2019@gmail.com";
    const { toast } = useToast();
    const copyEmail = () => {
        navigator.clipboard.writeText(emailAddress)
        toast({
            title: "Email copied",
            description: "Past the email to Amazon settings!",
            variant: "success",
        });
    }
    return (
        <>
            <CardHeader>
                <CardTitle>Amazon Settings Instructions</CardTitle>
                <CardDescription>Follow these steps to authorize email sending</CardDescription>
            </CardHeader>
            <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-start">
                    <li>Access <Link className="underline" to="https://www.amazon.com/hz/mycd/myx#/home/settings/payment" target="_blank">Amazon settings</Link> to authorize email sending.</li>
                    <li>Log in to your account and go to the "Preferences" tab.</li>
                    <li>Scroll down to the "Personal Document Settings" section.</li>
                    <li>Click on "Add a new approved e-mail address" and add the following email:</li>
                </ol>
                <div className="mt-4 rounded flex justify-between items-center gap-2">
                    <Input type="email" placeholder="Email" value={emailAddress} readOnly />
                    <Button variant="outline" size="icon" onClick={copyEmail}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </>
    )
}
