import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import CardApplications from "../components/CardApplications";
import AccountApplications from "../components/AccountApplications";
import CreditApplications from "../components/CreditApplications";

export default function RequestManagement() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Request Management</h1>
        <p className="text-muted-foreground">Manage and process user requests for cards, accounts, and credits.</p>
      </div>

      <Tabs defaultValue="cards">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cards">Card Requests</TabsTrigger>
          <TabsTrigger value="accounts">Account Requests</TabsTrigger>
          <TabsTrigger value="credits">Credit Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-4">
          <CardApplications />
        </TabsContent>
        <TabsContent value="accounts" className="mt-4">
          <AccountApplications />
        </TabsContent>
        <TabsContent value="credits" className="mt-4">
          <CreditApplications />
        </TabsContent>
      </Tabs>
    </div>
  );
}