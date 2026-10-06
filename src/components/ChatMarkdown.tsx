import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatMarkdownProps = {
  children: string;
};

export function ChatMarkdown({ children }: ChatMarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children: linkChildren }) => {
          const isExternal = /^https?:\/\//.test(href ?? "");
          return (
            <a
              href={href}
              className="font-medium underline underline-offset-2"
              {...(isExternal
                ? { target: "_blank", rel: "noreferrer" }
                : undefined)}
            >
              {linkChildren}
            </a>
          );
        },
        p: ({ children: pChildren }) => (
          <p className="mb-2 last:mb-0">{pChildren}</p>
        ),
        ul: ({ children: ulChildren }) => (
          <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">
            {ulChildren}
          </ul>
        ),
        ol: ({ children: olChildren }) => (
          <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">
            {olChildren}
          </ol>
        ),
        li: ({ children: liChildren }) => <li className="pl-0.5">{liChildren}</li>,
        strong: ({ children: strongChildren }) => (
          <strong className="font-semibold">{strongChildren}</strong>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
