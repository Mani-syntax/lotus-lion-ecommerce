'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, Italic, List, ListOrdered, Quote, 
  Heading1, Heading2, Undo, Redo 
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-white/5 bg-white/5">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('bold') ? 'text-primary bg-primary/10' : 'text-gray-400'}`}
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('italic') ? 'text-primary bg-primary/10' : 'text-gray-400'}`}
      >
        <Italic size={16} />
      </button>
      <div className="w-[1px] h-4 bg-white/10 self-center mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'text-primary bg-primary/10' : 'text-gray-400'}`}
      >
        <Heading1 size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'text-primary bg-primary/10' : 'text-gray-400'}`}
      >
        <Heading2 size={16} />
      </button>
      <div className="w-[1px] h-4 bg-white/10 self-center mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('bulletList') ? 'text-primary bg-primary/10' : 'text-gray-400'}`}
      >
        <List size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('orderedList') ? 'text-primary bg-primary/10' : 'text-gray-400'}`}
      >
        <ListOrdered size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('blockquote') ? 'text-primary bg-primary/10' : 'text-gray-400'}`}
      >
        <Quote size={16} />
      </button>
      <div className="flex-grow" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 text-gray-400 hover:text-white"
      >
        <Undo size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 text-gray-400 hover:text-white"
      >
        <Redo size={16} />
      </button>
    </div>
  );
};

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] p-6 text-sm',
      },
    },
  });

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5 focus-within:border-primary/30 transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
