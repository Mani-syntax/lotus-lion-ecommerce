'use client';

import { useEffect, useState } from 'react';
import { Edit2, Plus, Save, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import AdminHeader from '@/components/admin/AdminHeader';
import Modal from '@/components/admin/Modal';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

const blankBlog = { title: '', slug: '', excerpt: '', body: '', category: 'Journal', status: 'draft', isFeatured: false, seo: { title: '', description: '' } };

export default function BlogStudioPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await api.get('/admin/blogs');
    setBlogs(data);
  };

  useEffect(() => {
    load().catch(() => toast.error('Could not load blogs'));
  }, []);

  const save = async () => {
    const request = editing._id ? api.put(`/admin/blogs/${editing._id}`, editing) : api.post('/admin/blogs', editing);
    await request;
    toast.success('Blog saved');
    setEditing(null);
    load();
  };

  const remove = async () => {
    if (!deleteId) return;
    await api.delete(`/admin/blogs/${deleteId}`);
    toast.success('Blog deleted');
    setDeleteId(null);
    load();
  };

  return (
    <div className="space-y-8 pb-24">
      <AdminHeader title="Blog Studio" subtitle="Create fashion editorials, schedule publishing, feature posts, and manage SEO." />
      <div className="flex justify-end">
        <button onClick={() => setEditing(blankBlog)} className="inline-flex items-center gap-2 bg-[#c8a45d] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-black">
          <Plus size={16} /> New Blog
        </button>
      </div>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {blogs.map((blog) => (
          <article key={blog._id} className="border border-white/10 bg-[#111] p-6">
            <div className="mb-6 flex items-start justify-between">
              <span className="border border-[#c8a45d]/30 px-3 py-1 text-[9px] uppercase tracking-[0.18em] text-[#c8a45d]">{blog.status}</span>
              <div className="flex gap-2">
                <button onClick={() => setEditing(blog)} className="p-2 text-[#c8a45d] hover:bg-white/10"><Edit2 size={15} /></button>
                <button onClick={() => setDeleteId(blog._id)} className="p-2 text-red-400 hover:bg-red-500/10"><Trash2 size={15} /></button>
              </div>
            </div>
            <h2 className="brand-heading text-2xl uppercase text-white">{blog.title || 'Untitled'}</h2>
            <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#aaa]">{blog.excerpt || 'No excerpt yet.'}</p>
            <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-[#777]">/{blog.slug}</p>
          </article>
        ))}
      </section>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Blog Editor" size="xl">
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <input value={editing?.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Title" className="border p-3 text-sm outline-none" />
            <input value={editing?.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="slug" className="border p-3 text-sm outline-none" />
            <input value={editing?.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="Category" className="border p-3 text-sm outline-none" />
            <select value={editing?.status || 'draft'} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="border p-3 text-sm outline-none">
              <option value="draft">draft</option>
              <option value="scheduled">scheduled</option>
              <option value="published">published</option>
            </select>
          </div>
          <textarea value={editing?.excerpt || ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} placeholder="Excerpt" className="min-h-20 w-full border p-3 text-sm outline-none" />
          <RichTextEditor content={editing?.body || ''} onChange={(html) => setEditing({ ...editing, body: html })} />
          <div className="grid gap-4 md:grid-cols-2">
            <input value={editing?.seo?.title || ''} onChange={(e) => setEditing({ ...editing, seo: { ...(editing?.seo || {}), title: e.target.value } })} placeholder="SEO title" className="border p-3 text-sm outline-none" />
            <input value={editing?.seo?.description || ''} onChange={(e) => setEditing({ ...editing, seo: { ...(editing?.seo || {}), description: e.target.value } })} placeholder="SEO description" className="border p-3 text-sm outline-none" />
          </div>
          <button onClick={save} className="inline-flex items-center gap-2 bg-[#c8a45d] px-7 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-black"><Save size={16} /> Save Blog</button>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={remove} title="Delete blog?" message="This removes the blog from the CMS and storefront." confirmText="Delete" />
    </div>
  );
}
