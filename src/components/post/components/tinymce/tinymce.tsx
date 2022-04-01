import "./core";
import { Editor } from "@tinymce/tinymce-react";
import { memo, useEffect, useRef, useState } from "react";
import { usePostContext } from "../../context";
import { basePath } from "@/constants";
import { textPatterns } from "../textPatterns";
import { socket } from "./socket";
import { useUpdatePost } from "@/hooks/useUpdatePost";

interface Props {
  text: string;
  postId?: number;
}

const LpEditor: React.FC<Props> = ({ text, postId }) => {
  const { setHelpers, onMediaBrowse } = usePostContext();
  const { debounceUpdatePost } = useUpdatePost();
  const editorRef = useRef<Editor["editor"]>(null);
  const isDark = document.body.classList.contains("dark");
  const [html, setHtml] = useState(text);

  useEffect(() => {
    if (editorRef.current) {
      socket.setEditor(editorRef.current);
      socket.connectSocketAndAddListeners();
      socket.setChangeHandler(() => {
        const html = editorRef.current?.getBody().innerHTML;
        if (html) {
          editorRef.current?.setContent(html);
          socket.applyTooltip();
          if (postId) debounceUpdatePost({ id: postId, html });
        }
      });
    }
    return () => {
      socket.disconnect();
    };
  }, [editorRef.current]);

  useEffect(() => {
    if (typeof html == "undefined") {
      setHtml(text);
    }
  }, [text]);

  return (
    <>
      <Editor
        onInit={async (_evt, editor) => {
          if (editor) {
            //@ts-ignore
            editorRef.current = editor;
            const className = isDark ? "dark" : "light";
            const body = editor.getDoc().body;
            body.classList.remove("dark", "light");
            body.classList.add(className);
            setHelpers && setHelpers(editor);

            const domBody = editor.getDoc();
            await insertScript("/admin/tippy/popper.min.js", domBody.head);
            await insertScript("/admin/tippy/tippy.min.js", domBody.head);
            await insertScript(
              "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js",
              domBody.head,
            );
            socket.applyTooltip();
          }
        }}
        initialValue={html}
        onEditorChange={(html) => {
          const htmlWithBody = `<html><body>${html}</body></html>`;
          if (htmlWithBody === text) return;
          if (postId) debounceUpdatePost({ id: postId, html: htmlWithBody });
        }}
        init={{
          menubar: false,
          toolbar: false,
          browser_spellcheck: true,
          contextmenu: false,
          socket,
          branding: false,
          plugins: "lists link quickbars autoresize  code codesample",
          skin: window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "oxide-dark"
            : "",
          content_css: basePath + "/css/editor.css",
          height: "100%",
          quickbars_selection_toolbar:
            "h1 h2 bold italic underline quicklink nlpcheck nlpremove",
          quickbars_insert_toolbar:
            "bullist numlist blockquote hr codesample customImage",
          statusbar: false,
          text_patterns: textPatterns,
          setup: function (editor) {
            editor.ui.registry.addButton("customImage", {
              icon: "image",
              onAction: function (_) {
                onMediaBrowse && onMediaBrowse();
              },
            });
            editor.on("keydown", function (e) {
              // move cursor to next element when hitting enter on figcaption
              if (e.key == "Enter") {
                const tag = editorRef.current?.selection.getNode().tagName;
                if (tag === "FIGCAPTION") {
                  const range = new Range();
                  const nextEle =
                    editorRef.current?.selection.getNode().parentElement
                      ?.parentElement?.nextElementSibling;
                  if (nextEle) {
                    range.setStart(nextEle, 0);
                    range.setEnd(nextEle, 0);
                    editorRef.current?.selection.setRng(range, true);
                  }
                  e.preventDefault();
                }
              }
            });
          },
          entity_encoding: "raw",
        }}
      />

      <style jsx global>{`
        .dark iframe {
          margin-bottom: 50px;
          background-color: transparent;
        }
        .tox .tox-edit-area__iframe {
          background-color: transparent !important;
          line-height: 24 !important;
        }
        .tox {
          border: none !important;
        }
        .tox-editor-header {
          display: none !important;
        }
      `}</style>
    </>
  );
};

export default memo(LpEditor);

const insertScript = (src: string, head: HTMLHeadElement) => {
  return new Promise((resolve, reject) => {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    script.onabort = resolve;
    head.appendChild(script);
  });
};
