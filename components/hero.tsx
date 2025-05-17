import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import Link from "next/link";

import { useTranslations } from "next-intl";
import ReportForm from "./report-form";

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
    <section className="my-4 min-h-screen ">
      <div className="container">
        <div className="lg:grid flex flex-col items-start justify-center w-full gap-8 lg:grid-cols-2  px-4 md:px-0">
          <div className="flex flex-col items-center justify-start text-center lg:items-start lg:text-left w-full lg:border-r h-full">
            {hero.badge && (
              <Badge variant="outline" className=" py-2  text-base">
                {hero.badge}
              </Badge>
            )}
            <h1 className="my-6 text-4xl font-bold text-pretty lg:text-6xl">
              {hero.heading}
            </h1>
            <div className="max-w-[500px]">
              <p className="mb-2 max-w-xl text-muted-foreground lg:text-xl">
                {hero.subHeading}
              </p>
              <p>
                <span className="text-red-500">{hero.description}</span>
              </p>
              <p className="mt-4 text-muted-foreground">{hero.subText}</p>
            </div>
            <div className="flex w-full flex-col justify-center items-center gap-2 sm:flex-row lg:justify-between ">
              {hero.buttons.primary && (
                <div className="w-full flex flex-row  items-center sm:w-auto">
                  <Link
                    href={hero.buttons.primary.url}
                    className="w-full sm:w-auto font-bold  text-black hover:underline focus:ring-blue-300s rounded-lg text-md  py-2.5 text-center"
                  >
                    {hero.buttons.primary.text}
                  </Link>
                  <ArrowUpRight className="ml-2 size-4" />
                </div>
              )}
            </div>
          </div>
          <div className=" h-full  w-full min-h-screen ">
            <ReportForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
