import { activities, pets } from "@/lib/mock-data";

const moodLabels = {
  happy: "Весёлый",
  sleepy: "Сонный",
  hungry: "Голодный",
} as const;

export function HomeScreen() {
  const nextActivity = activities[0];

  return (
    <div className="flex flex-col gap-5 px-4 pb-4">
      <section>
        <p className="text-sm text-zinc-400">Добро пожаловать 👋</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Mammaly</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Уход за питомцами в одном месте
        </p>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-4 shadow-lg shadow-violet-900/30">
        <p className="text-xs font-medium uppercase tracking-wide text-white/70">
          Следующее событие
        </p>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-3xl">{nextActivity.icon}</span>
          <div>
            <p className="font-semibold text-white">{nextActivity.title}</p>
            <p className="text-sm text-white/80">
              {nextActivity.petName} · {nextActivity.time}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Ваши питомцы</h2>
          <span className="text-xs text-violet-400">{pets.length} всего</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {pets.map((pet) => (
            <article
              key={pet.id}
              className="min-w-[140px] shrink-0 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
            >
              <span className="text-4xl">{pet.emoji}</span>
              <p className="mt-2 font-semibold text-white">{pet.name}</p>
              <p className="text-xs text-zinc-400">{pet.breed}</p>
              <span className="mt-2 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-zinc-300">
                {moodLabels[pet.mood]}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {[
          { label: "Кормление", emoji: "🍽️", count: "2 сегодня" },
          { label: "Прогулки", emoji: "🦮", count: "1 сегодня" },
          { label: "Здоровье", emoji: "💊", count: "Всё ок" },
          { label: "Напоминания", emoji: "🔔", count: "3 активных" },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            className="rounded-2xl bg-white/5 p-4 text-left ring-1 ring-white/10 transition active:scale-[0.98]"
          >
            <span className="text-2xl">{item.emoji}</span>
            <p className="mt-2 text-sm font-medium text-white">{item.label}</p>
            <p className="text-xs text-zinc-400">{item.count}</p>
          </button>
        ))}
      </section>
    </div>
  );
}
