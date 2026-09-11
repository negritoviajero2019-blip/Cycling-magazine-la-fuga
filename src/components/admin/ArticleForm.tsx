'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ARTICLE_STATUS } from '@/lib/content/enums'

interface Option {
  id: number
  name: string
}

interface InitialArticle {
  id?: number
  title: string
  slug: string
  subtitle?: string | null
  excerpt: string
  content: string
  categoryId: number
  authorId: number
  status: string
  breakingNews: boolean
  featured: boolean
  seoTitle?: string | null
  seoDescription?: string | null
  tagIds: number[]
}

export function ArticleForm({
  categories,
  authors,
  tags,
  initial,
}: {
  categories: Option[]
  authors: Option[]
  tags: Option[]
  initial?: InitialArticle
}) {
  const router = useRouter()
  const [form, setForm] = useState<InitialArticle>(
    initial || {
      title: '',
      slug: '',
      subtitle: '',
      excerpt: '',
      content: '',
      categoryId: categories[0]?.id ?? 0,
      authorId: authors[0]?.id ?? 0,
      status: 'draft',
      breakingNews: false,
      featured: false,
      seoTitle: '',
      seoDescription: '',
      tagIds: [],
    },
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const url = form.id ? `/api/admin/articles/${form.id}` : '/api/admin/articles'
    const method = form.id ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setSaving(false)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error ? JSON.stringify(body.error) : 'Error al guardar')
      return
    }
    router.push('/admin/articles')
    router.refresh()
  }

  function toggleTag(id: number) {
    setForm((f) => ({
      ...f,
      tagIds: f.tagIds.includes(id) ? f.tagIds.filter((t) => t !== id) : [...f.tagIds, id],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">Título</label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full rounded border border-border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Slug</label>
        <input
          required
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="w-full rounded border border-border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Subtítulo</label>
        <input
          value={form.subtitle || ''}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          className="w-full rounded border border-border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Extracto</label>
        <textarea
          required
          rows={2}
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="w-full rounded border border-border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Contenido (HTML)</label>
        <textarea
          required
          rows={12}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full rounded border border-border px-3 py-2 font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Categoría</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
            className="w-full rounded border border-border px-3 py-2 text-sm"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Autor</label>
          <select
            value={form.authorId}
            onChange={(e) => setForm({ ...form, authorId: Number(e.target.value) })}
            className="w-full rounded border border-border px-3 py-2 text-sm"
          >
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Estado</label>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="w-full rounded border border-border px-3 py-2 text-sm"
        >
          {ARTICLE_STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.breakingNews}
            onChange={(e) => setForm({ ...form, breakingNews: e.target.checked })}
          />
          Última hora
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Destacado en portada
        </label>
      </div>

      {tags.length > 0 && (
        <div>
          <label className="mb-1 block text-sm font-medium">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                type="button"
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  form.tagIds.includes(tag.id) ? 'border-accent bg-accent text-white' : 'border-border'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">SEO title</label>
          <input
            value={form.seoTitle || ''}
            onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
            className="w-full rounded border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Meta description</label>
          <input
            value={form.seoDescription || ''}
            onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
            className="w-full rounded border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>

      {error && <p className="text-sm text-breaking">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-primary px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
