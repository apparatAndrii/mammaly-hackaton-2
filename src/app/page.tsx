import { MobileApp } from "@/components/mobile/MobileApp";
import { DogProfileProvider } from "@/context/DogProfileContext";

export default function Home() {
  return (
    <DogProfileProvider>
      <MobileApp />
    </DogProfileProvider>
  );
}
