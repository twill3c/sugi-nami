import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/**
 * MDX の見た目。
 *
 * お知らせの本文は content/news/*.mdx が持ち、書式はここで一度だけ決める。
 * 記事ごとに class を書かせない —— 書かせると記事が増えるほど揃わなくなる。
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => (
      <h2
        className="mt-10 font-mincho text-xl tracking-[0.1em] text-kinari"
        {...props}
      />
    ),
    h3: (props) => (
      <h3 className="mt-8 font-mincho text-lg text-andon" {...props} />
    ),
    p: (props) => (
      <p className="mt-5 text-sm leading-loose text-kinari/85" {...props} />
    ),
    ul: (props) => (
      <ul
        className="mt-5 list-disc space-y-2 pl-5 text-sm leading-loose text-kinari/85 marker:text-sobacha"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="mt-5 list-decimal space-y-2 pl-5 text-sm leading-loose text-kinari/85 marker:text-sobacha"
        {...props}
      />
    ),
    blockquote: (props) => (
      <blockquote
        className="mt-6 border-l-2 border-hari pl-5 text-sm leading-loose text-usuzumi"
        {...props}
      />
    ),
    strong: (props) => <strong className="text-andon" {...props} />,
    em: (props) => <em className="not-italic text-sobacha" {...props} />,
    hr: () => <hr className="my-10 border-hari" />,
    a: ({ href, ...props }) => {
      const internal = href?.startsWith("/");
      return internal ? (
        <Link
          href={href}
          className="text-andon underline decoration-hari underline-offset-4 hover:decoration-andon"
          {...props}
        />
      ) : (
        <a
          href={href}
          className="text-andon underline decoration-hari underline-offset-4 hover:decoration-andon"
          {...props}
        />
      );
    },
    ...components,
  };
}
