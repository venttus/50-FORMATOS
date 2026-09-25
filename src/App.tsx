import { FormEvent, useEffect, useState } from 'react'
import { ArrowUpRight, Check, Code2, Github, Loader2, Mail, Terminal } from 'lucide-react'
import { supabase } from './lib/supabase'

type LinkConfiguravel = {
  id: string
  nome: string
  url: string
  ordem: number
  ativo: boolean
}

type SecaoMembro = {
  id: string
  titulo: string
  conteudo: string | null
  ordem: number
  ativo: boolean
}

const fallbackLinks: LinkConfiguravel[] = [
  { id: 'docs', nome: 'Documentação', url: '#documentacao', ordem: 1, ativo: true },
  { id: 'github', nome: 'GitHub', url: '#github', ordem: 2, ativo: true },
]

const fallbackSections: SecaoMembro[] = [
  {
    id: 'intro',
    titulo: 'Construa sem perder o foco.',
    conteudo: 'Um espaço simples para transformar boas ideias em código claro, rápido e pronto para evoluir.',
    ordem: 1,
    ativo: true,
  },
]

function App() {
  const [links, setLinks] = useState<LinkConfiguravel[]>(fallbackLinks)
  const [sections, setSections] = useState<SecaoMembro[]>(fallbackSections)
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return

    const loadContent = async () => {
      const [linksResult, sectionsResult] = await Promise.all([
        supabase.from('links_configuraveis').select('id, nome, url, ordem, ativo').eq('ativo', true).order('ordem'),
        supabase.from('secoes_membros').select('id, titulo, conteudo, ordem, ativo').eq('ativo', true).order('ordem'),
      ])

      if (linksResult.data?.length) setLinks(linksResult.data)
      if (sectionsResult.data?.length) setSections(sectionsResult.data)
    }

    void loadContent()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSent(false)

    if (!email.trim()) {
      setError('Digite um email válido para continuar.')
      return
    }

    if (!supabase) {
      setError('A conexão com o banco ainda não está disponível.')
      return
    }

    setSending(true)
    const { error: insertError } = await supabase.from('leads').insert({ email: email.trim() })
    setSending(false)

    if (insertError) {
      setError('Não foi possível registrar seu email agora.')
      return
    }

    setEmail('')
    setSent(true)
  }

  const primarySection = sections[0] ?? fallbackSections[0]

  return (
    <main className="grid-background min-h-screen overflow-hidden bg-ink text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between border-b border-zinc-800/80 py-6">
          <a href="#inicio" className="flex items-center gap-3 text-sm font-semibold tracking-tight text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-ink shadow-glow">
              <Code2 size={19} strokeWidth={2.5} />
            </span>
            shark<span className="text-accent">.git</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-zinc-400 md:flex">
            {links.map((link) => (
              <a key={link.id} href={link.url} className="transition-colors hover:text-accent">
                {link.nome}
              </a>
            ))}
          </nav>
          <a href="#entrar" className="rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:border-accent hover:text-accent">
            Entrar
          </a>
        </header>

        <section id="inicio" className="relative flex flex-1 flex-col justify-center py-20 lg:py-28">
          <div className="pointer-events-none absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-1.5 text-xs text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_#a3e635]" />
              Modo Código ativado
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl">
              {primarySection.titulo}
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">
              {primarySection.conteudo}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#entrar" className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-ink transition hover:bg-lime-300">
                Começar agora <ArrowUpRight size={17} />
              </a>
              <a href="#documentacao" className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900">
                <Terminal size={16} /> Ver documentação
              </a>
            </div>
          </div>

          <div className="relative mt-20 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ['01', 'Ideias claras'],
              ['02', 'Código limpo'],
              ['03', 'Entrega contínua'],
            ].map(([number, label]) => (
              <div key={number} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
                <div className="mb-8 text-xs text-accent">{number}</div>
                <div className="text-sm font-medium text-zinc-200">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="entrar" className="mb-12 flex flex-col gap-8 rounded-2xl border border-zinc-800 bg-surface/80 p-7 shadow-2xl sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-accent"><Mail size={17} /><span className="text-xs font-bold uppercase tracking-[0.2em]">Fique por dentro</span></div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">Receba novidades do projeto.</h2>
            <p className="mt-2 text-sm text-zinc-400">Uma mensagem quando houver algo novo para explorar.</p>
          </div>
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="flex gap-2 rounded-lg border border-zinc-700 bg-zinc-950 p-1.5 focus-within:border-accent">
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="seu@email.com" className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-zinc-600" aria-label="Email" />
              <button disabled={sending} type="submit" className="flex shrink-0 items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60">
                {sending ? <Loader2 size={16} className="animate-spin" /> : sent ? <Check size={16} /> : 'Inscrever'}
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
            {sent && <p className="mt-2 text-xs text-accent">Email registrado com sucesso.</p>}
          </form>
        </section>

        <footer className="flex flex-col gap-4 border-t border-zinc-800/80 py-7 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2025 shark.git</span>
          <a id="github" href="#github" className="inline-flex items-center gap-2 transition hover:text-white"><Github size={14} /> Código aberto para boas ideias</a>
        </footer>
      </div>
    </main>
  )
}

export default App
