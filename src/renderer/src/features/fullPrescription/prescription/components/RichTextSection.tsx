import { RichTextEditor } from "@/components/ui/RichTextEditor";

export function RichTextSection({ label, value, onChange, placeholder }) {
  return (
    <div className="mt-6 text-left">
      <label className="block mb-1 font-medium">{label}</label>
      <RichTextEditor value={value} onChange={onChange} placeholder={placeholder}/>
    </div>
  );
}
