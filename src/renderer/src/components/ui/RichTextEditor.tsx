import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  Palette,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[180px] w-full rounded-md border border-gray-300 dark:border-gray-700 p-3 text-sm focus:outline-none bg-white dark:bg-neutral-900 text-left",
      },
    },
  });

  if (!editor) return null;

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <div className="border rounded-lg dark:border-neutral-700">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 border-b dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-700",
            editor.isActive("bold") && "bg-gray-300 dark:bg-neutral-700",
          )}
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-700",
            editor.isActive("italic") && "bg-gray-300 dark:bg-neutral-700",
          )}
        >
          <Italic className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            "p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-700",
            editor.isActive("underline") && "bg-gray-300 dark:bg-neutral-700",
          )}
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-700",
            editor.isActive("bulletList") && "bg-gray-300 dark:bg-neutral-700",
          )}
        >
          <List className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-700",
            editor.isActive("orderedList") && "bg-gray-300 dark:bg-neutral-700",
          )}
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-700"
        >
          <Palette className="h-4 w-4" />
        </button>

        {showColorPicker && (
          <input
            type="color"
            onChange={(e) => setColor(e.target.value)}
            className="ml-2 border-none w-8 h-6 bg-transparent cursor-pointer"
          />
        )}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
}
