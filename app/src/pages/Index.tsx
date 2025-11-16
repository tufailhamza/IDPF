import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/DasboardHeader";
import ProgramReporting from "@/components/ProgramRepoorting";
import AnnualReport from "@/components/AnnualReport";
import BoardReporting from "@/components/BoardReporting";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="rising" className="space-y-[50px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rising">SASL/Rising Schools</TabsTrigger>
            <TabsTrigger value="ongonza">Premier Credit/Ongoza</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rising" className="space-y-[50px]">
            <ProgramReporting />
          </TabsContent>
          
          <TabsContent value="ongonza" className="space-y-[50px]">
            <AnnualReport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
