import { activities } from "@/lib/mock-data";

export function ActivityScreen() {
  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <section>
        <h1 className="text-xl font-bold text-white">Activity</h1>
        <p className="text-sm text-zinc-400">Today&apos;s schedule</p>
      </section>

      <div className="flex gap-2">
        {["Today", "Week", "Month"].map((filter, index) => (
          <button
            key={filter}
            type="button"
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${
              index === 0
                ? "bg-violet-500 text-white"
                : "bg-white/5 text-zinc-400"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="relative flex flex-col gap-0">
        <div className="absolute bottom-4 left-[19px] top-4 w-0.5 bg-white/10" />
        {activities.map((item, index) => (
          <article key={item.id} className="relative flex gap-4 py-3">
            <div
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                index === 0
                  ? "bg-violet-500 ring-4 ring-violet-500/20"
                  : "bg-white/10"
              }`}
            >
              {item.icon}
            </div>
            <div className="min-w-0 flex-1 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-sm text-zinc-400">{item.petName}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-violet-400">
                  {item.time}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
