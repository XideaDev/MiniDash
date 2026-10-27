import { useState } from "react"
import {
  ArrowUpCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  Database,
  Palette,
  Radio,
  Server,
  Settings,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { Node } from "@/lib/api"

export const NAV_ITEMS = [
  { path: "/admin/nodes", label: "节点管理", icon: Server },
  { path: "/admin/ping", label: "网络延迟", icon: Radio },
  { path: "/admin/notify", label: "告警通知", icon: Bell },
  { path: "/admin/data", label: "数据管理", icon: Database },
  { path: "/admin/themes", label: "主题外观", icon: Palette },
  { path: "/admin/security", label: "安全认证", icon: Shield },
  { path: "/admin/settings", label: "系统设置", icon: Settings },
  { path: "/admin/update", label: "版本更新", icon: ArrowUpCircle },
] as const

export function AppSidebar({
  path,
  go,
  nodes = [],
  updates = false,
  siteName = "Minidash",
}: {
  path: string
  go: (to: string) => void
  nodes?: Node[]
  updates?: boolean
  siteName?: string
}) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("minidash_sidebar_collapsed") === "true"
    } catch {
      return false
    }
  })

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    try {
      localStorage.setItem("minidash_sidebar_collapsed", String(next))
    } catch {}
  }

  const onlineCount = nodes.filter((n) => n.online).length
  const totalCount = nodes.length

  return (
    <aside
      className={`relative hidden md:flex flex-col border-r border-border/80 bg-card/60 backdrop-blur-xs transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* 顶部品牌 */}
      <div className="flex h-13 items-center border-b border-border/60 px-3.5">
        <a
          href="/"
          className={`flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-opacity hover:opacity-80 ${
            collapsed ? "justify-center w-full" : ""
          }`}
          title="点击返回公开状态页"
        >
          <img src="/favicon.svg" alt="Logo" className="size-5 shrink-0" />
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="truncate text-sm font-semibold">{siteName}</span>
              <span className="text-[10px] text-muted-foreground font-mono">Control Center</span>
            </div>
          )}
        </a>
      </div>

      {/* 核心功能导航列表 */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {NAV_ITEMS.map(({ path: to, label, icon: Icon }) => {
          const active = path === to
          const isUpdate = to === "/admin/update" && updates

          const item = (
            <button
              key={to}
              onClick={() => go(to)}
              aria-current={active ? "page" : undefined}
              className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-secondary text-foreground font-medium shadow-xs"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              } ${collapsed ? "justify-center px-0" : ""}`}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
              {isUpdate && (
                <span
                  className={`size-1.5 shrink-0 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400/80 ${
                    collapsed ? "absolute top-1 right-1" : "ml-auto"
                  }`}
                  title="有新版本可升级"
                />
              )}
            </button>
          )

          if (collapsed) {
            return (
              <Tooltip key={to}>
                <TooltipTrigger asChild>{item}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={12}>
                  {label}
                  {isUpdate && " (新版本)"}
                </TooltipContent>
              </Tooltip>
            )
          }

          return item
        })}
      </nav>

      {/* 底部集群状态指标卡片 */}
      <div className="border-t border-border/60 p-2.5">
        {!collapsed ? (
          <div className="rounded-lg border border-border/80 bg-muted/40 p-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">节点集群</span>
              <span className="flex items-center gap-1 font-mono font-medium">
                <span className="size-1.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50 pulse-online" />
                {onlineCount} / {totalCount}
              </span>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${totalCount ? (onlineCount / totalCount) * 100 : 0}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex size-8 items-center justify-center rounded-md border border-border/70 bg-muted/30 font-mono text-xs">
                  {onlineCount}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                在线节点：{onlineCount} / {totalCount}
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* 侧边栏折叠按钮 */}
        <div className="mt-2 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="size-6 text-muted-foreground hover:text-foreground"
            title={collapsed ? "展开侧边栏" : "折叠侧边栏"}
          >
            {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
          </Button>
        </div>
      </div>
    </aside>
  )
}
