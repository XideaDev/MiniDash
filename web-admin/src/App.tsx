import { useCallback, useEffect, useState, useSyncExternalStore } from "react"
import { Toaster } from "sonner"

import { Admin, useVersions } from "@/components/Admin"
import { Login } from "@/components/Login"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { AppHeader } from "@/components/layout/AppHeader"
import { CommandMenu } from "@/components/layout/CommandMenu"
import { Skeleton } from "@/components/ui/skeleton"
import { TooltipProvider } from "@/components/ui/tooltip"
import { api, behind, outdatedAgents, provisionRefusal, useNodes } from "@/lib/api"

type Me = { authed: boolean; github: boolean; site_name: string; public_page: boolean; site: string }

// `/admin` alone is not a page; it is normalised to the first section so that a
// bookmark and the OAuth redirect both resolve to a real route.
function normalise(p: string) {
  return p === "/admin" || p === "/admin/" ? "/admin/nodes" : p.replace(/\/$/, "") || "/admin/nodes"
}

function usePath() {
  const [path, setPath] = useState(() => {
    const start = normalise(location.pathname)
    if (start !== location.pathname) history.replaceState({}, "", start + location.search)
    return start
  })
  useEffect(() => {
    const sync = () => setPath(normalise(location.pathname))
    addEventListener("popstate", sync)
    return () => removeEventListener("popstate", sync)
  }, [])
  return [
    path,
    useCallback((next: string) => {
      const to = normalise(next)
      history.pushState({}, "", to)
      setPath(to)
    }, []),
  ] as const
}

const DARK_MEDIA = matchMedia("(prefers-color-scheme: dark)")

function useTheme() {
  const [saved, setSaved] = useState(() => {
    try {
      return localStorage.getItem("theme")
    } catch {
      return null
    }
  })
  const system = useSyncExternalStore(
    (notify) => {
      DARK_MEDIA.addEventListener("change", notify)
      return () => DARK_MEDIA.removeEventListener("change", notify)
    },
    () => DARK_MEDIA.matches,
  )
  const dark = saved ? saved === "dark" : system

  useEffect(() => {
    const hold = document.createElement("style")
    hold.textContent = "*,*::before,*::after{transition:none!important}"
    document.head.append(hold)
    document.documentElement.classList.toggle("dark", dark)
    void document.body.offsetWidth
    hold.remove()
  }, [dark])

  return [
    dark,
    useCallback(() => {
      const next = !dark
      try {
        localStorage.setItem("theme", next ? "dark" : "light")
      } catch {}
      setSaved(next ? "dark" : "light")
    }, [dark]),
  ] as const
}

export default function App() {
  const [dark, toggleTheme] = useTheme()
  const [path, go] = usePath()
  const [me, setMe] = useState<Me | null>(null)
  const [meLoaded, setMeLoaded] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const { nodes, error, refresh } = useNodes()
  const { versions } = useVersions()

  const loadMe = useCallback(() => {
    api<Me>("/me")
      .then((m) => {
        setMe(m)
        setMeLoaded(true)
      })
      .catch(() => setMeLoaded(true))
  }, [])

  useEffect(() => {
    loadMe()
  }, [loadMe])

  if (!meLoaded) {
    return (
      <div className="grid min-h-svh place-items-center bg-background">
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
          <span className="size-2 rounded-full bg-primary animate-pulse" />
          <span>INITIALIZING MINIDASH...</span>
        </div>
      </div>
    )
  }

  if (!me?.authed) {
    return (
      <>
        <Login github={!!me?.github} onDone={() => { loadMe(); refresh(); go("/admin/nodes") }} />
        <Toaster position="top-center" theme={dark ? "dark" : "light"} />
      </>
    )
  }

  async function signOut() {
    await api("/auth/logout", { method: "POST" }).catch(() => {})
    location.href = "/"
  }

  const updates =
    !!versions?.notice &&
    (behind(versions.hub, versions.hub_latest) || outdatedAgents(nodes || [], versions.agent_latest).length > 0)

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-svh bg-background text-foreground">
        {/* 左侧可折叠现代侧边栏 */}
        <AppSidebar
          path={path}
          go={go}
          nodes={nodes || []}
          updates={updates}
          siteName={me.site_name || "Minidash"}
        />

        {/* 右侧主视口 */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* 顶部现代化毛玻璃顶栏 */}
          <AppHeader
            path={path}
            go={go}
            dark={dark}
            onToggleTheme={toggleTheme}
            onSignOut={signOut}
            onOpenCommand={() => setCommandOpen(true)}
            siteName={me.site_name || "Minidash"}
          />

          {/* 内容展示区 */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
            {error && (
              <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive">
                {error}
              </div>
            )}
            {!nodes ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-48 rounded-md" />
                <Skeleton className="h-64 w-full rounded-md" />
              </div>
            ) : (
              <Admin
                path={path}
                go={go}
                nodes={nodes}
                refresh={refresh}
                site={me.site || location.origin}
                refusal={provisionRefusal(location.origin, me.site)}
                reloadMe={loadMe}
              />
            )}
          </main>
        </div>

        {/* ⌘+K 全局指令搜索弹窗 */}
        <CommandMenu
          open={commandOpen}
          onOpenChange={setCommandOpen}
          go={go}
          nodes={nodes || []}
          onToggleTheme={toggleTheme}
          onSignOut={signOut}
        />

        <Toaster position="top-center" theme={dark ? "dark" : "light"} />
      </div>
    </TooltipProvider>
  )
}
