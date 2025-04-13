"use client";

import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import UnderlineExtension from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	AlignCenter,
	AlignJustify,
	AlignLeft,
	AlignRight,
	Bold,
	Italic,
	List,
	ListOrdered,
	Type,
	Underline,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type TiptapEditorProps = {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	acceptHeading?: boolean;
};

export function TiptapEditor({ value, onChange, placeholder, acceptHeading = false }: TiptapEditorProps) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const editor = useEditor({
		extensions: [
			StarterKit.configure({ heading: false }),
			Heading.configure({ levels: acceptHeading ? [1, 2, 3] : [] }),
			Link.configure({ openOnClick: false }),
			UnderlineExtension,
			TextAlign.configure({
				types: acceptHeading ? ["heading", "paragraph"] : ["paragraph"],
				alignments: ["left", "center", "right", "justify"],
				defaultAlignment: "left",
			}),
			Placeholder.configure({ placeholder: placeholder || "Buraya yazın..." }),
		],
		immediatelyRender: false,
		content: value,
		onUpdate: ({ editor }) => {
			const html = editor.getHTML();
			if (html !== value) {
				onChange(html);
			}
		},
		editorProps: {
			attributes: {
				class:
					"min-h-[150px] min-w-full w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose dark:prose-invert prose-headings:text-foreground prose-p:text-foreground",
			},
		},
	});

	useEffect(() => {
		if (editor && value !== editor.getHTML()) {
			editor.commands.setContent(value, false);
		}
	}, [value, editor]);

	if (!isMounted || !editor) {
		return (
			<div className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
				Yükleniyor...
			</div>
		);
	}

	return (
		<div className="space-y-2 w-full">
			<div className="overflow-x-auto pb-1.5 no-scrollbar">
				<div className="flex items-center gap-1 border rounded-md p-1.5 bg-muted/50 min-w-max">
					<Select
						value={
							editor.isActive("paragraph")
								? "paragraph"
								: editor.isActive("heading", { level: 1 })
									? "h1"
									: editor.isActive("heading", { level: 2 })
										? "h2"
										: editor.isActive("heading", { level: 3 })
											? "h3"
											: "paragraph"
						}
						onValueChange={(value) => {
							if (value === "paragraph") {
								editor.chain().focus().setParagraph().run();
							} else {
								const level = Number.parseInt(value.replace("h", "")) as 1 | 2 | 3;
								editor.chain().focus().toggleHeading({ level }).run();
							}
						}}
					>
						<SelectTrigger
							className="w-[100px] sm:w-[140px] h-8 bg-background text-foreground text-xs sm:text-sm"
							type="button"
						>
							<Type className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
							<SelectValue placeholder="Stil seçin" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="paragraph">Normal</SelectItem>
							{acceptHeading && (
								<>
									<SelectItem value="h1">Başlık 1</SelectItem>
									<SelectItem value="h2">Başlık 2</SelectItem>
									<SelectItem value="h3">Başlık 3</SelectItem>
								</>
							)}
						</SelectContent>
					</Select>

					<div className="h-6 w-[1px] bg-border mx-1" />

					<div className="flex items-center gap-0.5 bg-background rounded-md">
						<Button
							variant="ghost"
							size="icon"
							type="button"
							className={cn("h-7 w-7 sm:h-8 sm:w-8", editor.isActive("bold") ? "bg-muted" : "")}
							onClick={() => editor.chain().focus().toggleBold().run()}
							data-active={editor.isActive("bold")}
						>
							<Bold className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							type="button"
							className={cn("h-7 w-7 sm:h-8 sm:w-8", editor.isActive("italic") ? "bg-muted" : "")}
							onClick={() => editor.chain().focus().toggleItalic().run()}
							data-active={editor.isActive("italic")}
						>
							<Italic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							type="button"
							className={cn("h-7 w-7 sm:h-8 sm:w-8", editor.isActive("underline") ? "bg-muted" : "")}
							onClick={() => editor.chain().focus().toggleUnderline().run()}
							data-active={editor.isActive("underline")}
						>
							<Underline className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						</Button>
					</div>

					<div className="h-6 w-[1px] bg-border mx-1" />

					<div className="flex items-center gap-0.5 bg-background rounded-md">
						<Button
							variant="ghost"
							size="icon"
							type="button"
							className={cn("h-7 w-7 sm:h-8 sm:w-8", editor.isActive("bulletList") ? "bg-muted" : "")}
							onClick={() => editor.chain().focus().toggleBulletList().run()}
							data-active={editor.isActive("bulletList")}
						>
							<List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							type="button"
							className={cn("h-7 w-7 sm:h-8 sm:w-8", editor.isActive("orderedList") ? "bg-muted" : "")}
							onClick={() => editor.chain().focus().toggleOrderedList().run()}
							data-active={editor.isActive("orderedList")}
						>
							<ListOrdered className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						</Button>
					</div>

					<div className="h-6 w-[1px] bg-border mx-1" />

					<div className="flex items-center gap-0.5 bg-background rounded-md">
						<Button
							variant="ghost"
							size="icon"
							type="button"
							className={cn("h-7 w-7 sm:h-8 sm:w-8", editor.isActive({ textAlign: "left" }) ? "bg-muted" : "")}
							onClick={() => editor.chain().focus().setTextAlign("left").run()}
							data-active={editor.isActive({ textAlign: "left" })}
						>
							<AlignLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							type="button"
							className={cn("h-7 w-7 sm:h-8 sm:w-8", editor.isActive({ textAlign: "center" }) ? "bg-muted" : "")}
							onClick={() => editor.chain().focus().setTextAlign("center").run()}
							data-active={editor.isActive({ textAlign: "center" })}
						>
							<AlignCenter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							type="button"
							className={cn("h-7 w-7 sm:h-8 sm:w-8", editor.isActive({ textAlign: "right" }) ? "bg-muted" : "")}
							onClick={() => editor.chain().focus().setTextAlign("right").run()}
							data-active={editor.isActive({ textAlign: "right" })}
						>
							<AlignRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							type="button"
							className={cn("h-7 w-7 sm:h-8 sm:w-8", editor.isActive({ textAlign: "justify" }) ? "bg-muted" : "")}
							onClick={() => editor.chain().focus().setTextAlign("justify").run()}
							data-active={editor.isActive({ textAlign: "justify" })}
						>
							<AlignJustify className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						</Button>
					</div>
				</div>
			</div>
			<EditorContent editor={editor} className="w-full" />
		</div>
	);
}
