import type { NewsBodyBlock } from '@/lib/news/types';

type NewsBodyBlocksProps = {
  blocks: NewsBodyBlock[];
};

export function NewsBodyBlocks({ blocks }: NewsBodyBlocksProps) {
  return (
    <div className="news-blocks">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        switch (block.type) {
          case 'paragraph':
            return (
              <p key={key} className="body-copy news-block-paragraph">
                {block.text}
              </p>
            );
          case 'heading': {
            if (block.level === 3) {
              return (
                <h3 key={key} className="news-block-heading">
                  {block.text}
                </h3>
              );
            }

            if (block.level === 4) {
              return (
                <h4 key={key} className="news-block-heading minor">
                  {block.text}
                </h4>
              );
            }

            return (
              <h2 key={key} className="news-block-heading">
                {block.text}
              </h2>
            );
          }
          case 'list':
            return (
              <ul key={key} className="business-bullets news-block-list">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case 'quote':
            return (
              <blockquote key={key} className="news-block-quote">
                <p>{block.text}</p>
                {block.attribution ? <cite>{block.attribution}</cite> : null}
              </blockquote>
            );
        }
      })}
    </div>
  );
}
