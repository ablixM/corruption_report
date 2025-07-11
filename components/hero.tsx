import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import ReportTabs from "./report-tabs";

const Hero = () => {
  const t = useTranslations();
  const hero = {
    badge: t("hero.badge"),
    heading: t("hero.heading"),
    subHeading: t("hero.subHeading"),
    description: t("hero.description"),
    subText: t("hero.subText"),
    buttons: {
      primary: {
        text: t("hero.buttons.primary.text"),
        url: t("hero.buttons.primary.url"),
      },
    },
    image: {
      src: "https://www.shadcnblocks.com/images/block/placeholder-1.svg",
      alt: "Hero section demo image showing interface components",
    },
  };
  return (
    <section className="my-4 min-h-screen w-full bg-background">
      <div className="lg:grid flex flex-col items-start justify-center w-full lg:gap-8 gap-4 lg:grid-cols-2 mt-12  px-4 ">
        <div className="flex flex-col  justify-start lg:pl-16  md:items-start text-start items-start lg:text-left w-full lg:border-r border-b lg:border-b-0 h-full  border-accent rounded-2xl">
          {hero.badge && (
            <Badge variant="outline" className=" hidden lg:block py-2  text-sm">
              {hero.badge}
            </Badge>
          )}
          <h1 className="lg:my-6 my:2 text-2xl md:text-4xl font-bold text-pretty lg:text-6xl my-2 bg-gradient-to-r from-blue-700 to-yellow-400 bg-clip-text text-transparent">
            {hero.heading}
          </h1>
          <div>
            <Alert
              variant={"destructive"}
              className="w-full bg-blue-300/50 dark:bg-blue-300/20"
            >
              <AlertTitle className="line-clamp-2">
                {hero.subHeading}
              </AlertTitle>
              <AlertDescription>{hero.description}</AlertDescription>
            </Alert>

            <p className="mt-4 text-muted-foreground text-xs lg:text-sm">
              {hero.subText}
            </p>
          </div>
          <div className="flex w-full max-w-[300px] flex-col justify-center items-center gap-2 sm:flex-row lg:justify-between ">
            {hero.buttons.primary && (
              <div className="w-full flex flex-row  items-center ">
                <Link
                  href={hero.buttons.primary.url}
                  className=" sm:w-auto font-bold   hover:underline focus:ring-blue-300s rounded-lg text-md  py-2.5 text-center"
                >
                  {hero.buttons.primary.text}
                </Link>
                <ArrowUpRight className="ml-2 size-4" />
              </div>
            )}
          </div>
        </div>
        <div className=" w-full ">
          <ReportTabs />
        </div>
      </div>
    </section>
  );
};

export { Hero };
