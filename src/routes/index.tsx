import { createFileRoute } from "@tanstack/react-router";
import { CustomerMenu } from "@/components/menu/CustomerMenu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GRUZIN — Georgian Restaurant Menu" },
      {
        name: "description",
        content:
          "Меню грузинского ресторана GRUZIN — хачапури, хинкали, мангал и блюда грузинской кухни.",
      },
      { property: "og:title", content: "GRUZIN — Georgian Restaurant Menu" },
      { property: "og:description", content: "Меню грузинского ресторана GRUZIN." },
    ],
  }),
  component: CustomerMenu,
});
