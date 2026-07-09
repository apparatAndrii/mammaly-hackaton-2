export type TabId = "home" | "pets" | "activity" | "profile";

export type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  emoji: string;
  mood: "happy" | "sleepy" | "hungry";
};

export type ActivityItem = {
  id: string;
  title: string;
  time: string;
  icon: string;
  petName: string;
};
