import { pets } from "@/lib/mock-data";

const moodEmoji = {
  happy: "😊",
  sleepy: "😴",
  hungry: "🍖",
} as const;

export function PetsScreen() {
  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <section>
        <h1 className="text-xl font-bold text-white">Питомцы</h1>
        <p className="text-sm text-zinc-400">Управляйте профилями животных</p>
      </section>

      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-violet-500/40 bg-violet-500/10 py-4 text-sm font-medium text-violet-300 transition active:scale-[0.98]"
      >
        <span className="text-lg">+</span>
        Добавить питомца
      </button>

      <div className="flex flex-col gap-3">
        {pets.map((pet) => (
          <article
            key={pet.id}
            className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl">
              {pet.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-white">{pet.name}</h2>
                <span className="text-sm">{moodEmoji[pet.mood]}</span>
              </div>
              <p className="text-sm text-zinc-400">
                {pet.species} · {pet.breed}
              </p>
              <p className="text-xs text-zinc-500">{pet.age}</p>
            </div>
            <button
              type="button"
              className="rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-zinc-300"
            >
              Открыть
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
