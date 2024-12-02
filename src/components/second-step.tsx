import { KindleEmailForm } from "./kindle-email-form";
import { RegisterEmailForm } from "./register-email";
import { CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function SecondStep() {
    return (
        <>
            <CardHeader>
                <CardTitle>Amazon Settings Instructions</CardTitle>
                <CardDescription>Follow these steps to authorize email sending</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="kindle" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="kindle">Kindle</TabsTrigger>
                        <TabsTrigger value="app">App</TabsTrigger>
                    </TabsList>
                    <TabsContent value="kindle">                        
                        {/* <KindleEmailForm /> */}
                        <RegisterEmailForm device="kindle" />
                    </TabsContent>
                    <TabsContent value="app">
                        <RegisterEmailForm device="app" />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </>
    )
}
