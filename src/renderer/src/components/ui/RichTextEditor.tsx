import { Mark, mergeAttributes } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { Placeholder } from "@tiptap/extensions";

import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  Palette,
  Plus,
  Minus,
} from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "../provider/ThemeProvider";

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
  const [showColorMenu, setShowColorMenu] = useState(false);
  const paletteButtonRef = useRef<HTMLButtonElement | null>(null);
  const [panelPosition, setPanelPosition] = useState({ left: 0 });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const FontSize = Mark.create({
    name: "fontSize",

    addAttributes() {
      return {
        fontSize: {
          default: null,
          parseHTML: (element) => element.style.fontSize || null,
          renderHTML: (attributes) => {
            if (!attributes.fontSize) return {};
            return { style: `font-size: ${attributes.fontSize}` };
          },
        },
      };
    },

    parseHTML() {
      return [{ tag: "span[style]" }];
    },

    renderHTML({ HTMLAttributes }) {
      return [
        "span",
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        0,
      ];
    },

    addCommands() {
      return {
        setFontSize:
          (size) =>
          ({ chain }) => {
            return chain().setMark("fontSize", { fontSize: size }).run();
          },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      BulletList,
      OrderedList,
      ListItem,
      FontSize,
      Placeholder.configure({
        placeholder: placeholder || "Start typing...", // <-- USE YOUR PLACEHOLDER
        emptyEditorClass:
          "text-gray-400 dark:text-gray-500 pointer-events-none",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[180px] w-full rounded-md border border-gray-300 dark:border-gray-700 p-3 text-sm focus:outline-none bg-white dark:bg-neutral-900 text-left",
        spellcheck: "false",
      },
    },
  });

  // Find palette icon X position → place panel below it
  useEffect(() => {
    if (paletteButtonRef.current) {
      const rect = paletteButtonRef.current.getBoundingClientRect();
      setPanelPosition({ left: rect.left - 80 }); // adjust left shift
    }
  }, [showColorMenu]);

  if (!editor) return null;

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const changeFontSize = (increase: boolean) => {
    const currentSize = parseInt(
      editor.getAttributes("fontSize").fontSize || "14",
    );

    const newSize = increase ? currentSize + 1 : Math.max(10, currentSize - 1);

    editor.chain().focus().setFontSize(`${newSize}px`).run();
  };

  return (
    <div className="border rounded-lg dark:border-neutral-700 relative">
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

        {/* Font size */}
        <div className="flex items-center gap-1 ml-3">
          <button
            onClick={() => changeFontSize(false)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-700"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => changeFontSize(true)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-700"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Palette Toggle */}
        <button
          ref={paletteButtonRef}
          onClick={() => setShowColorMenu((x) => !x)}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-700"
        >
          <Palette className="h-4 w-4" />
        </button>
        {/* COLOR PANEL (blue box) */}
        {showColorMenu && (
          <div
            className="rounded-md bg-gray-50 dark:bg-neutral-800 border-4dark:border-neutral-700 shadow-md"
            style={{ left: panelPosition.left }}
          >
            <RadioGroup
              className="flex gap-2"
              onValueChange={(value) => {
                if (value === "default") {
                  editor.chain().focus().unsetColor().run();
                } else {
                  setColor(value);
                }
              }}
            >
              {/* Default Text Color Swatch */}
              <RadioGroupItem
                value="default"
                aria-label="Default text color"
                className={`
          size-6 rounded-full shadow-none border border-gray-400 
          ${isDark ? "bg-white" : "bg-black"}
        `}
              />

              {/* Predefined Colors */}
              {[
                { name: "red", border: "border-red-500", bg: "bg-red-500" },
                {
                  name: "orange",
                  border: "border-orange-500",
                  bg: "bg-orange-500",
                },
                {
                  name: "amber",
                  border: "border-amber-500",
                  bg: "bg-amber-500",
                },
                {
                  name: "green",
                  border: "border-green-500",
                  bg: "bg-green-500",
                },
                { name: "blue", border: "border-blue-500", bg: "bg-blue-500" },
              ].map((clr) => (
                <RadioGroupItem
                  key={clr.name}
                  value={clr.name}
                  aria-label={clr.name}
                  className={`size-6 rounded-full shadow-none ${clr.bg} ${clr.border}`}
                />
              ))}

              {/* Custom Color Selector */}
              <label className="size-6 rounded-full border border-gray-400 shadow-inner cursor-pointer overflow-hidden relative">
                <input
                  type="color"
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </RadioGroup>
          </div>
        )}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
}
