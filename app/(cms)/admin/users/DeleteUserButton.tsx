'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteSiteUserAction } from '../actions'

export default function DeleteUserButton({ id, name }: { id: string | number; name: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Excluir o usuário "${name}"?\n\nOs comentários dele serão mantidos (sem vínculo). Esta ação não pode ser desfeita.`)) return
    startTransition(async () => {
      const res = await deleteSiteUserAction(id)
      if (res?.error) {
        alert(res.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="font-mono text-[9px] text-red-400 hover:text-red-300 uppercase tracking-widest transition-colors disabled:opacity-50 flex-none"
    >
      {pending ? '...' : '🗑 Excluir'}
    </button>
  )
}
