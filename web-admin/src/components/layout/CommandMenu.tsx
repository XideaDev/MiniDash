import { useEffect } from "react"
import {
  ArrowUpCircle,
  Bell,
  Database,
  ExternalLink,
  LogOut,
  Moon,
  Palette,
  Radio,
  Server,
  Settings,
  Shield,
  Sun,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import type { Node } from "@/lib/api"

export function CommandMenu({
  open,
  onOpenChange,
  go,
  nodes,
  onToggleTheme,
  onSignOut,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  go: (to: string) => void
  nodes?: Node[]
  onToggleTheme?: () => void
  onSignOut?: () => void
}) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  const select = (action: () => void) => {
    onOpenChange(false)
    action()
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="输入指令或搜索节点..." />
      <CommandList>
        <CommandEmpty>未找到相关指令或节点</CommandEmpty>

        {nodes && nodes.length > 0 && (
          <CommandGroup heading="监控节点">
            {nodes.slice(0, 8).map((node) => (
              <CommandItem
                key={node.id}
                onSelect={() => select(() => go("/admin/nodes"))}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`size-2 rounded-full ${
                      node.online ? "bg-emerald-500 shadow-xs shadow-emerald-500/50" : "bg-muted-foreground/40"
                    }`}
                  />
                  <span>{node.name}</span>
                  {node.group && (
                    <span className="rounded-sm border border-border/80 bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {node.group}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {node.os ? `${node.os} · ` : ""}
                  {node.online ? "在线" : "离线"}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandGroup heading="管理导航">
          <CommandItem onSelect={() => select(() => go("/admin/nodes"))}>
            <Server className="mr-2 size-4" />
            <span>节点管理</span>
            <CommandShortcut>G N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => select(() => go("/admin/ping"))}>
            <Radio className="mr-2 size-4" />
            <span>网络延迟</span>
            <CommandShortcut>G P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => select(() => go("/admin/notify"))}>
            <Bell className="mr-2 size-4" />
            <span>告警通知</span>
            <CommandShortcut>G A</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => select(() => go("/admin/data"))}>
            <Database className="mr-2 size-4" />
            <span>数据管理</span>
            <CommandShortcut>G D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => select(() => go("/admin/themes"))}>
            <Palette className="mr-2 size-4" />
            <span>主题外观</span>
            <CommandShortcut>G T</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => select(() => go("/admin/security"))}>
            <Shield className="mr-2 size-4" />
            <span>安全认证</span>
            <CommandShortcut>G S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => select(() => go("/admin/settings"))}>
            <Settings className="mr-2 size-4" />
            <span>系统设置</span>
            <CommandShortcut>G C</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => select(() => go("/admin/update"))}>
            <ArrowUpCircle className="mr-2 size-4" />
            <span>版本更新</span>
            <CommandShortcut>G U</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="快速动作">
          <CommandItem onSelect={() => select(() => window.open("/", "_blank"))}>
            <ExternalLink className="mr-2 size-4" />
            <span>打开公开状态页</span>
          </CommandItem>
          {onToggleTheme && (
            <CommandItem onSelect={() => select(onToggleTheme)}>
              <Sun className="mr-2 size-4 dark:hidden" />
              <Moon className="mr-2 size-4 hidden dark:inline" />
              <span>切换深浅色主题</span>
            </CommandItem>
          )}
          {onSignOut && (
            <CommandItem onSelect={() => select(onSignOut)} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 size-4" />
              <span>退出登录</span>
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
