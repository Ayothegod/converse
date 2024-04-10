// import { toast } from "sonner"

// import { Button } from "../ui/button"

// export function ShowSonner() {
//   return (
//     <Button
//       variant="outline"
//       onClick={() =>
//         toast("Event has been created", {
//           description: "Sunday, December 03, 2023 at 9:00 AM",
//           action: {
//             label: "Undo",
//             onClick: () => console.log("Undo"),
//           },
//         })
//       }
//     >
//       Show Toast
//     </Button>
//   )
// }

"use client";

import { Button } from "../ui/button";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";

export function ShowSonner() {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          title: "Scheduled: Catch up ",
          description: "Friday, February 10, 2023 at 5:57 PM",
          action: (
            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
          ),
        });
      }}
    >
      Add to calendar
    </Button>
  );
}
