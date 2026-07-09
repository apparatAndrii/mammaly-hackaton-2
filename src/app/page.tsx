import { MobileApp } from "@/components/mobile/MobileApp";
import { DailyCheckInProvider } from "@/context/DailyCheckInContext";
import { DogProfileProvider } from "@/context/DogProfileContext";

export default function Home() {
  return (
    <DogProfileProvider>
      <DailyCheckInProvider>
        <MobileApp />
      </DailyCheckInProvider>
    </DogProfileProvider>
  );
}
