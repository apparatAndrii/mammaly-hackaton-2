import { Bell, ChevronRight, HelpCircle, LogOut, Shield } from "lucide-react";

const menuItems = [
  { icon: Bell, label: "Уведомления", badge: "3" },
  { icon: Shield, label: "Приватность" },
  { icon: HelpCircle, label: "Помощь" },
  { icon: LogOut, label: "Выйти", danger: true },
];

export function ProfileScreen() {
  return (
    <div className="flex flex-col gap-5 px-4 pb-4">
      <section className="flex flex-col items-center pt-2 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-3xl font-bold text-white shadow-lg shadow-violet-900/40">
          А
        </div>
        <h1 className="mt-3 text-xl font-bold text-white">Андрей</h1>
        <p className="text-sm text-zinc-400">andrey@example.com</p>
        <div className="mt-3 flex gap-6">
          <div>
            <p className="text-lg font-bold text-white">3</p>
            <p className="text-xs text-zinc-400">Питомца</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">12</p>
            <p className="text-xs text-zinc-400">Записей</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">7</p>
            <p className="text-xs text-zinc-400">Дней</p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
        {menuItems.map(({ icon: Icon, label, badge, danger }, index) => (
          <button
            key={label}
            type="button"
            className={`flex w-full items-center gap-3 px-4 py-4 text-left transition active:bg-white/5 ${
              index !== menuItems.length - 1 ? "border-b border-white/5" : ""
            }`}
          >
            <Icon
              className={`h-5 w-5 ${danger ? "text-red-400" : "text-zinc-400"}`}
            />
            <span
              className={`flex-1 text-sm font-medium ${
                danger ? "text-red-400" : "text-white"
              }`}
            >
              {label}
            </span>
            {badge && (
              <span className="rounded-full bg-violet-500 px-2 py-0.5 text-[10px] font-bold text-white">
                {badge}
              </span>
            )}
            {!danger && <ChevronRight className="h-4 w-4 text-zinc-500" />}
          </button>
        ))}
      </section>

      <p className="text-center text-xs text-zinc-500">Mammaly v0.1.0 · Web Preview</p>
    </div>
  );
}
