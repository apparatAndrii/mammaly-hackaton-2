import type { ActivityItem, Pet } from "./types";

export const pets: Pet[] = [
  {
    id: "1",
    name: "Барсик",
    species: "Кот",
    breed: "Британский",
    age: "3 года",
    emoji: "🐱",
    mood: "happy",
  },
  {
    id: "2",
    name: "Рекс",
    species: "Собака",
    breed: "Корги",
    age: "5 лет",
    emoji: "🐶",
    mood: "hungry",
  },
  {
    id: "3",
    name: "Кеша",
    species: "Попугай",
    breed: "Волнистый",
    age: "2 года",
    emoji: "🦜",
    mood: "sleepy",
  },
];

export const activities: ActivityItem[] = [
  {
    id: "1",
    title: "Кормление",
    time: "08:30",
    icon: "🍽️",
    petName: "Барсик",
  },
  {
    id: "2",
    title: "Прогулка",
    time: "10:00",
    icon: "🦮",
    petName: "Рекс",
  },
  {
    id: "3",
    title: "Визит к ветеринару",
    time: "14:00",
    icon: "🏥",
    petName: "Рекс",
  },
  {
    id: "4",
    title: "Игра",
    time: "18:45",
    icon: "🎾",
    petName: "Барсик",
  },
];
