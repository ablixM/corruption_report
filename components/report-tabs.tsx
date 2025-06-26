import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ReportForm from "./report-form";
import { ComplaintForm } from "./complaint-form";

export default function ReportTabs() {
  const t = useTranslations();
  return (
    <Tabs defaultValue="report" className="w-full">
      <TabsList defaultValue="report" className="w-full">
        <TabsTrigger value="report">{t("tabs.report")}</TabsTrigger>
        <TabsTrigger value="complaint">{t("tabs.complaint")}</TabsTrigger>
      </TabsList>
      <TabsContent value="report">
        <ReportForm />
      </TabsContent>
      <TabsContent value="complaint">
        <ComplaintForm />
      </TabsContent>
    </Tabs>
  );
}
