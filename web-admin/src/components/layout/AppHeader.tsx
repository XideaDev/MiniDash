import { useState } from "react"
import { ExternalLink, LogOut, Menu, Moon, Search, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NAV_ITEMS } from "./AppSidebar"

export function AppHeader({
  path,
  go,
  dark,
  onToggleTheme,
  onSignOut,
  onOpenCommand,
  siteName = "Minidash",
}: {
  path: string
  go: (to: string) => void
  dark: boolean
  onToggleTheme: () => void
  onSignOut: () => void
  onOpenCommand: () => void
  siteName?: string
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const current = NAV_ITEMS.find((item) => item.path === path) || NAV_ITEMS[0]

  return (
    <header className="sticky top-0 z-20 flex h-13 items-center justify-between border-b border-border/80 bg-background/85 px-4 backdrop-blur-md transition-colors sm:px-6">
      {/* 左侧：移动端汉堡菜单 + 页面面包屑与标题 */}
      <div className="flex items-center gap-3">
        {/* 移动端抽屉导航 */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Menu className="size-4" />
                <span className="sr-only">打开导航</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-13 items-center border-b border-border/60 px-4 gap-2.5">
                <img src="/favicon.svg" alt="Logo" className="size-5 shrink-0" />
                <span className="font-semibold text-sm">{siteName}</span>
              </div>
              <nav className="space-y-1 p-2">
                {NAV_ITEMS.map(({ path: to, label, icon: Icon }) => {
                  const active = path === to
                  return (
                    <button
                      key={to}
                      onClick={() => {
                        go(to)
                        setMobileOpen(false)
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-[2px] px-3 py-2 text-xs font-medium transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-4" />
                      <span>{label}</span>
                    </button>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* 当前页面标题与微型指示 */}
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md border border-border/70 bg-muted/40 text-foreground md:hidden">
            <current.icon className="size-3.5" />
          </div>
          <h1 className="text-sm font-semibold tracking-tight text-foreground">{current.label}</h1>
        </div>
      </div>

      {/* 右侧：全局搜索框 (⌘+K) + 主题切换 + 外部跳转 + 退出登录 */}
      <div className="flex items-center gap-2">
        {/* ⌘+K 搜索按钮 */}
        <button
          onClick={onOpenCommand}
          className="flex h-8 items-center gap-2 rounded-md border border-border/80 bg-muted/40 px-2.5 text-xs text-muted-foreground transition-all hover:border-border hover:bg-muted/70 hover:text-foreground"
          title="全局快捷搜索 (⌘K / Ctrl+K)"
        >
          <Search className="size-3.5 opacity-60" />
          <span className="hidden sm:inline">搜索节点或指令...</span>
          <kbd className="hidden rounded-xs border border-border/80 bg-background/80 px-1.5 py-0.5 font-mono text-[10px] sm:inline-block">
            ⌘K
          </kbd>
        </button>

        {/* 访问公开页 */}
        <Button variant="ghost" size="sm" asChild className="hidden h-8 gap-1.5 text-xs sm:flex">
          <a href="/" target="_blank" rel="noreferrer">
            <ExternalLink className="size-3.5" />
            <span>状态面板</span>
          </a>
        </Button>

        {/* 深浅色模式切换 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleTheme}
          title="切换深浅色模式"
          className="size-8 text-muted-foreground hover:text-foreground"
        >
          {dark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4" />}
        </Button>

        {/* 退出登录 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onSignOut}
          title="退出登录"
          className="size-8 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  )
}
